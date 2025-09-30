const express = require('express');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all published courses with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { 'settings.isPublished': true };
    
    // Apply filters
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    if (req.query.level) {
      query.level = req.query.level;
    }
    
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Build sort
    let sort = {};
    switch (req.query.sortBy) {
      case 'popular':
        sort = { 'stats.enrolledStudents': -1, 'stats.averageRating': -1 };
        break;
      case 'rating':
        sort = { 'stats.averageRating': -1, 'stats.totalReviews': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'alphabetical':
        sort = { title: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
    
    // Execute query
    const courses = await Course.find(query)
      .populate('instructor', 'name profile.avatar')
      .select('-lessons.content') // Exclude lesson content for performance
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Course.countDocuments(query);
    
    // Get categories and levels for filters
    const categories = await Course.distinct('category', { 'settings.isPublished': true });
    const levels = await Course.distinct('level', { 'settings.isPublished': true });
    
    res.status(200).json({
      status: 'success',
      data: {
        courses,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        filters: {
          categories: categories.sort(),
          levels: levels.sort()
        }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get popular courses
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const courses = await Course.getPopularCourses(limit);
    
    res.status(200).json({
      status: 'success',
      data: { courses }
    });
  } catch (error) {
    console.error('Get popular courses error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get course by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by ID first, then by slug
    let course;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(identifier);
    } else {
      course = await Course.findOne({ slug: identifier });
    }
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Check if course is published (unless user is instructor or admin)
    if (!course.settings.isPublished && (!req.user || 
        (req.user.id !== course.instructor.toString() && req.user.role !== 'admin'))) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Populate instructor information
    await course.populate('instructor', 'name profile email');
    
    // Increment view count
    course.stats.totalViews += 1;
    await course.save();
    
    // If user is logged in, check enrollment status
    let userProgress = null;
    if (req.user) {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);
      const enrollment = user.enrolledCourses.find(
        e => e.courseId.toString() === course._id.toString()
      );
      if (enrollment) {
        userProgress = {
          progress: enrollment.progress,
          enrollmentDate: enrollment.enrollmentDate,
          completedLessons: enrollment.completedLessons,
          isCompleted: enrollment.isCompleted,
          grade: enrollment.grade
        };
      }
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        course,
        userProgress
      }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Search courses
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { category, level } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (category) filters.category = category;
    if (level) filters.level = level;
    
    const courses = await Course.searchCourses(query, filters)
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      status: 'success',
      data: { courses }
    });
  } catch (error) {
    console.error('Search courses error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get course lessons (for enrolled users)
router.get('/:courseId/lessons', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const User = require('../models/User');
    
    // Check if user is enrolled
    const user = await User.findById(req.user.id);
    const enrollment = user.enrolledCourses.find(
      e => e.courseId.toString() === courseId
    );
    
    if (!enrollment) {
      return res.status(403).json({
        status: 'error',
        message: 'Not enrolled in this course'
      });
    }
    
    const course = await Course.findById(courseId)
      .select('lessons title')
      .populate('instructor', 'name');
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Filter published lessons only
    const publishedLessons = course.lessons.filter(lesson => lesson.isPublished);
    
    res.status(200).json({
      status: 'success',
      data: {
        courseTitle: course.title,
        instructor: course.instructor,
        lessons: publishedLessons,
        userProgress: enrollment.progress,
        completedLessons: enrollment.completedLessons
      }
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create new course (instructor/admin only)
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.id
    };
    
    const course = await Course.create(courseData);
    
    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update course (instructor/admin only)
router.put('/:courseId', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Find course and check ownership
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Check if user is instructor of this course or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this course'
      });
    }
    
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'name profile');
    
    res.status(200).json({
      status: 'success',
      message: 'Course updated successfully',
      data: { course: updatedCourse }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete course (instructor/admin only)
router.delete('/:courseId', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this course'
      });
    }
    
    await Course.findByIdAndDelete(courseId);
    
    res.status(200).json({
      status: 'success',
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
