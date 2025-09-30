const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Course = require('../models/Course');
const Resource = require('../models/Resource');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('📡 Connected to MongoDB');
    
    // Clear existing data (optional - comment out in production)
    console.log('🧹 Clearing existing demo data...');
    await Course.deleteMany({ title: { $regex: '^Demo|Sample' } });
    await Resource.deleteMany({ title: { $regex: '^Demo|Sample' } });
    
    // Create demo instructor
    let instructor = await User.findOne({ email: 'instructor@ctechsolutions.com' });
    
    if (!instructor) {
      instructor = await User.create({
        name: 'Ustadh Ahmad Hassan',
        email: 'instructor@ctechsolutions.com',
        password: 'instructor123',
        role: 'instructor',
        isEmailVerified: true,
        country: 'India',
        city: 'Delhi',
        profile: {
          bio: 'Experienced Islamic studies instructor with over 10 years of teaching experience.',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        }
      });
      console.log('👨‍🏫 Demo instructor created');
    }
    
    // Create demo student
    let student = await User.findOne({ email: 'te25bca002@techethica.in' });
    
    if (!student) {
      student = await User.create({
        name: 'Mohammed Sinan C',
        email: 'te25bca002@techethica.in',
        password: 'password',
        role: 'student',
        isEmailVerified: true,
        country: 'India',
        city: 'Bengaluru',
        stats: {
          totalHours: 245,
          completedCourses: 3,
          certificates: 3,
          loginCount: 127,
          firstAccess: new Date('2025-08-05T09:49:00'),
          lastLogin: new Date(),
          learningStreak: 23
        }
      });
      console.log('👨‍🎓 Demo student created');
    }
    
    // Create demo courses
    const courses = [
      {
        title: 'ZANJAAN Complete Course',
        description: 'Comprehensive study of ZANJAAN curriculum with detailed explanations and practice exercises.',
        shortDescription: 'Master ZANJAAN fundamentals with expert guidance',
        instructor: instructor._id,
        category: 'Quran Studies',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
        duration: { hours: 40, minutes: 0 },
        price: 0,
        learningOutcomes: [
          'Understand fundamental ZANJAAN principles',
          'Apply concepts in practical scenarios',
          'Complete chapter-wise assessments',
          'Prepare for advanced studies'
        ],
        requirements: ['Basic Arabic reading skills', 'Commitment to regular study'],
        settings: {
          isPublished: true,
          isEnrollmentOpen: true,
          certificateEnabled: true
        },
        lessons: [
          {
            title: 'Introduction to ZANJAAN',
            description: 'Overview of ZANJAAN principles and methodology',
            duration: 45,
            order: 1,
            isPublished: true
          },
          {
            title: 'Chapter 1: Fundamentals',
            description: 'Core concepts and definitions',
            duration: 60,
            order: 2,
            isPublished: true
          }
        ]
      },
      {
        title: 'Madkhal and Manthiq Mastery',
        description: 'Essential resources for understanding logic and methodology in Islamic studies.',
        shortDescription: 'Master Islamic logic and reasoning',
        instructor: instructor._id,
        category: 'Fiqh Studies',
        level: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
        duration: { hours: 35, minutes: 0 },
        price: 0,
        learningOutcomes: [
          'Understand principles of Islamic logic',
          'Apply reasoning methodologies',
          'Analyze classical texts',
          'Develop critical thinking skills'
        ],
        settings: {
          isPublished: true,
          isEnrollmentOpen: true,
          certificateEnabled: true
        }
      },
      {
        title: 'Fathul Mueen - Islamic Jurisprudence',
        description: 'Comprehensive guide to Islamic jurisprudence with practical examples and case studies.',
        shortDescription: 'Complete Fiqh reference guide',
        instructor: instructor._id,
        category: 'Fiqh Studies',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        duration: { hours: 50, minutes: 0 },
        price: 0,
        settings: {
          isPublished: true,
          isEnrollmentOpen: true,
          certificateEnabled: true
        }
      }
    ];
    
    console.log('📚 Creating demo courses...');
    const createdCourses = await Course.insertMany(courses);
    console.log(`  ✓ ${createdCourses.length} courses created`);
    
    // Enroll student in courses
    student.enrolledCourses = [
      {
        courseId: createdCourses[0]._id,
        enrollmentDate: new Date('2025-08-05'),
        progress: 95,
        isCompleted: true,
        grade: 'A+'
      },
      {
        courseId: createdCourses[1]._id,
        enrollmentDate: new Date('2025-08-10'),
        progress: 87,
        isCompleted: true,
        grade: 'A'
      },
      {
        courseId: createdCourses[2]._id,
        enrollmentDate: new Date('2025-08-15'),
        progress: 92,
        isCompleted: true,
        grade: 'A+'
      }
    ];
    await student.save();
    
    // Update course stats
    for (const course of createdCourses) {
      course.stats.enrolledStudents = Math.floor(Math.random() * 50) + 20;
      course.stats.completedStudents = Math.floor(course.stats.enrolledStudents * 0.7);
      course.stats.averageRating = (Math.random() * 1.5 + 3.5).toFixed(1);
      course.stats.totalReviews = Math.floor(course.stats.enrolledStudents * 0.6);
      await course.save();
    }
    
    // Create demo resources
    const resources = [
      {
        title: 'ZANJAAN Study Guide',
        description: 'Comprehensive study materials for ZANJAAN course with detailed explanations and practice exercises.',
        detailedDescription: 'This comprehensive guide covers all aspects of the ZANJAAN curriculum including fundamental principles, chapter-wise explanations, practice exercises, and audio recordings.',
        category: 'faith',
        type: 'pdf',
        author: 'C-Tech Solutions Academic Team',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
        files: [{
          filename: 'zanjaan-study-guide.pdf',
          originalName: 'ZANJAAN Study Guide.pdf',
          mimetype: 'application/pdf',
          size: 2048576,
          url: '/uploads/zanjaan-study-guide.pdf'
        }],
        faithContent: {
          subject: 'ZANJAAN',
          syllabus: [
            'Fundamental principles and concepts',
            'Chapter-wise detailed explanations',
            'Practice exercises and solutions',
            'Previous year questions and answers'
          ]
        },
        tags: ['zanjaan', 'islamic-studies', 'curriculum'],
        stats: {
          views: 1250,
          downloads: 340,
          likes: 89,
          averageRating: 4.7,
          totalRatings: 156
        }
      },
      {
        title: 'Madkhal and Manthiq Reference',
        description: 'Essential resources for understanding logic and methodology in Islamic studies.',
        category: 'faith',
        type: 'document',
        author: 'Islamic Logic Institute',
        level: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
        faithContent: {
          subject: 'Madkhal and Manthiq'
        },
        tags: ['logic', 'methodology', 'advanced'],
        stats: {
          views: 890,
          downloads: 234,
          likes: 67
        }
      },
      {
        title: 'Fathul Mueen Handbook',
        description: 'Comprehensive guide to Islamic jurisprudence with practical examples and case studies.',
        category: 'faith',
        type: 'ebook',
        author: 'Fiqh Academy',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        faithContent: {
          subject: 'Fathul Mueen'
        },
        tags: ['fiqh', 'jurisprudence', 'islamic-law'],
        stats: {
          views: 1456,
          downloads: 567,
          likes: 123
        }
      },
      {
        title: 'IIT Statistics Cheatsheet',
        description: 'Essential statistical concepts and formulas for competitive exams and research.',
        category: 'other',
        type: 'pdf',
        author: 'Statistical Research Team',
        level: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
        tags: ['statistics', 'mathematics', 'iit', 'competitive-exams'],
        stats: {
          views: 2340,
          downloads: 890,
          likes: 234
        }
      }
    ];
    
    console.log('📄 Creating demo resources...');
    const createdResources = await Resource.insertMany(resources);
    console.log(`  ✓ ${createdResources.length} resources created`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  • ${await User.countDocuments()} users`);
    console.log(`  • ${await Course.countDocuments()} courses`);
    console.log(`  • ${await Resource.countDocuments()} resources`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('  Admin: admin@ctechsolutions.com / admin123456');
    console.log('  Instructor: instructor@ctechsolutions.com / instructor123');
    console.log('  Student: te25bca002@techethica.in / password');
    
  } catch (error) {
    console.error('❌ Database seeding error:', error);
  } finally {
    mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
