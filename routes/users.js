const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses.courseId', 'title description thumbnail instructor')
      .populate('enrolledCourses.courseId.instructor', 'name');

    res.status(200).json({
      status: 'success',
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'country', 'city', 'timezone', 'profile'];
    const updateData = {};
    
    // Filter allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get user dashboard data
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses.courseId', 'title thumbnail');

    // Calculate dashboard statistics
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        memberSince: user.stats.firstAccess,
        lastLogin: user.stats.lastLogin
      },
      stats: {
        enrolledCourses: user.enrolledCourses.length,
        completedCourses: user.stats.completedCourses,
        totalHours: user.stats.totalHours,
        certificates: user.stats.certificates,
        learningStreak: user.stats.learningStreak
      },
      recentCourses: user.enrolledCourses
        .sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate))
        .slice(0, 5),
      progress: {
        inProgress: user.enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length,
        completed: user.enrolledCourses.filter(c => c.progress === 100).length,
        notStarted: user.enrolledCourses.filter(c => c.progress === 0).length
      }
    };

    res.status(200).json({
      status: 'success',
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Enroll in a course
router.post('/enroll/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user.id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    if (!course.settings.isPublished || !course.settings.isEnrollmentOpen) {
      return res.status(400).json({
        status: 'error',
        message: 'Course enrollment is not available'
      });
    }

    // Check if already enrolled
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (isEnrolled) {
      return res.status(400).json({
        status: 'error',
        message: 'Already enrolled in this course'
      });
    }

    // Check enrollment limit
    if (course.settings.maxStudents && course.stats.enrolledStudents >= course.settings.maxStudents) {
      return res.status(400).json({
        status: 'error',
        message: 'Course is full'
      });
    }

    // Enroll user
    user.enrolledCourses.push({
      courseId: courseId,
      enrollmentDate: new Date(),
      progress: 0
    });
    await user.save();

    // Update course statistics
    course.stats.enrolledStudents += 1;
    await course.save();

    res.status(200).json({
      status: 'success',
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update course progress
router.put('/progress/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress, lessonId } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'Progress must be between 0 and 100'
      });
    }

    const user = await User.findById(req.user.id);
    await user.updateCourseProgress(courseId, progress, lessonId);

    res.status(200).json({
      status: 'success',
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get user's enrolled courses
router.get('/courses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses.courseId',
        populate: {
          path: 'instructor',
          select: 'name profile.avatar'
        }
      });

    const courses = user.enrolledCourses.map(enrollment => ({
      ...enrollment.courseId.toObject(),
      enrollment: {
        enrollmentDate: enrollment.enrollmentDate,
        progress: enrollment.progress,
        grade: enrollment.grade,
        isCompleted: enrollment.isCompleted,
        completedLessons: enrollment.completedLessons
      }
    }));

    res.status(200).json({
      status: 'success',
      courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get learning analytics
router.get('/analytics', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses.courseId', 'title category');

    // Calculate learning analytics
    const categoryProgress = {};
    const monthlyProgress = {};
    
    user.enrolledCourses.forEach(enrollment => {
      const category = enrollment.courseId.category;
      if (!categoryProgress[category]) {
        categoryProgress[category] = { total: 0, progress: 0 };
      }
      categoryProgress[category].total += 1;
      categoryProgress[category].progress += enrollment.progress;
      
      // Monthly progress (simplified)
      const month = new Date().toISOString().slice(0, 7);
      if (!monthlyProgress[month]) {
        monthlyProgress[month] = 0;
      }
      monthlyProgress[month] += enrollment.progress;
    });

    // Calculate averages
    Object.keys(categoryProgress).forEach(category => {
      const data = categoryProgress[category];
      data.average = data.progress / data.total;
    });

    res.status(200).json({
      status: 'success',
      analytics: {
        categoryProgress,
        monthlyProgress,
        overallStats: {
          totalCourses: user.enrolledCourses.length,
          completedCourses: user.stats.completedCourses,
          averageProgress: user.enrolledCourses.length > 0 
            ? user.enrolledCourses.reduce((sum, e) => sum + e.progress, 0) / user.enrolledCourses.length
            : 0,
          totalHours: user.stats.totalHours,
          learningStreak: user.stats.learningStreak
        }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Admin only: Get all users
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
