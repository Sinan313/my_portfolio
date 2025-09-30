const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true,
    default: 'India'
  },
  city: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  enrolledCourses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedLessons: [{
      lessonId: String,
      completedAt: Date
    }],
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'F', null],
      default: null
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  profile: {
    avatar: String,
    bio: String,
    learningGoals: [String],
    interests: [String],
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String
    }
  },
  stats: {
    totalHours: {
      type: Number,
      default: 0
    },
    completedCourses: {
      type: Number,
      default: 0
    },
    certificates: {
      type: Number,
      default: 0
    },
    loginCount: {
      type: Number,
      default: 0
    },
    lastLogin: Date,
    firstAccess: Date,
    learningStreak: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      browser: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Virtual for full name formatting
userSchema.virtual('initials').get(function() {
  return this.name.split(' ').map(n => n[0]).join('').toUpperCase();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
  next();
});

// Set first access date
userSchema.pre('save', function(next) {
  if (this.isNew && !this.stats.firstAccess) {
    this.stats.firstAccess = new Date();
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update login stats
userSchema.methods.updateLoginStats = function() {
  this.stats.loginCount += 1;
  this.stats.lastLogin = new Date();
  return this.save();
};

// Get enrolled course progress
userSchema.methods.getCourseProgress = function(courseId) {
  const enrollment = this.enrolledCourses.find(
    course => course.courseId.toString() === courseId.toString()
  );
  return enrollment ? enrollment.progress : 0;
};

// Update course progress
userSchema.methods.updateCourseProgress = function(courseId, progress, lessonId = null) {
  const enrollment = this.enrolledCourses.find(
    course => course.courseId.toString() === courseId.toString()
  );
  
  if (enrollment) {
    enrollment.progress = Math.min(progress, 100);
    
    if (lessonId && !enrollment.completedLessons.find(l => l.lessonId === lessonId)) {
      enrollment.completedLessons.push({
        lessonId,
        completedAt: new Date()
      });
    }
    
    if (progress === 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      this.stats.completedCourses += 1;
      this.stats.certificates += 1;
    }
  }
  
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
