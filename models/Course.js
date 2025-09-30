const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  content: String,
  videoUrl: String,
  duration: Number, // in minutes
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'audio', 'link', 'document']
    }
  }],
  order: {
    type: Number,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Course title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: [
      'Quran Studies', 'Hadith Studies', 'Arabic Language', 'Fiqh Studies',
      'Islamic History', 'Statistics', 'English', 'Computer Science',
      'Mathematics', 'Programming', 'Other'
    ]
  },
  subcategory: String,
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  language: {
    type: String,
    default: 'English'
  },
  thumbnail: String,
  images: [String],
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  duration: {
    hours: Number,
    minutes: Number
  },
  lessons: [lessonSchema],
  requirements: [String],
  learningOutcomes: [String],
  targetAudience: [String],
  tags: [String],
  
  // Course statistics
  stats: {
    enrolledStudents: {
      type: Number,
      default: 0
    },
    completedStudents: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    }
  },
  
  // Course settings
  settings: {
    isPublished: {
      type: Boolean,
      default: false
    },
    isEnrollmentOpen: {
      type: Boolean,
      default: true
    },
    maxStudents: {
      type: Number,
      default: null
    },
    startDate: Date,
    endDate: Date,
    certificateEnabled: {
      type: Boolean,
      default: true
    },
    forumEnabled: {
      type: Boolean,
      default: true
    }
  },
  
  // SEO and metadata
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ 'settings.isPublished': 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ slug: 1 });

// Virtual for total lessons count
courseSchema.virtual('totalLessons').get(function() {
  return this.lessons.length;
});

// Virtual for total duration in minutes
courseSchema.virtual('totalDurationMinutes').get(function() {
  return this.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
});

// Virtual for formatted duration
courseSchema.virtual('formattedDuration').get(function() {
  const totalMinutes = this.totalDurationMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
});

// Generate slug before saving
courseSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Update lesson order
courseSchema.methods.reorderLessons = function() {
  this.lessons.forEach((lesson, index) => {
    lesson.order = index + 1;
  });
  return this.save();
};

// Add lesson
courseSchema.methods.addLesson = function(lessonData) {
  const order = this.lessons.length + 1;
  this.lessons.push({ ...lessonData, order });
  return this.save();
};

// Remove lesson
courseSchema.methods.removeLesson = function(lessonId) {
  this.lessons.id(lessonId).remove();
  return this.reorderLessons();
};

// Get course progress for a user
courseSchema.methods.getProgressForUser = function(userId) {
  // This would typically be calculated based on user's completed lessons
  // For now, return a placeholder
  return 0;
};

// Static method to get popular courses
courseSchema.statics.getPopularCourses = function(limit = 10) {
  return this.find({ 'settings.isPublished': true })
    .sort({ 'stats.enrolledStudents': -1, 'stats.averageRating': -1 })
    .limit(limit)
    .populate('instructor', 'name profile.avatar');
};

// Static method to search courses
courseSchema.statics.searchCourses = function(query, filters = {}) {
  const searchQuery = {
    'settings.isPublished': true,
    ...filters
  };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  return this.find(searchQuery)
    .populate('instructor', 'name profile.avatar')
    .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 });
};

module.exports = mongoose.model('Course', courseSchema);
