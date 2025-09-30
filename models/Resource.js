const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Resource description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  detailedDescription: {
    type: String,
    maxlength: [2000, 'Detailed description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Resource category is required'],
    enum: ['faith', 'other', 'academic', 'technical', 'general'],
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Resource type is required'],
    enum: ['pdf', 'video', 'audio', 'document', 'link', 'course-material', 'ebook'],
    index: true
  },
  author: {
    type: String,
    trim: true
  },
  contributors: [String],
  
  // File information
  files: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String,
    downloadCount: {
      type: Number,
      default: 0
    }
  }],
  
  // External links
  externalLinks: [{
    title: String,
    url: {
      type: String,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Please enter a valid URL'
      }
    },
    description: String
  }],
  
  // Media
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop'
  },
  images: [String],
  
  // Content structure
  chapters: [{
    title: String,
    description: String,
    order: Number,
    content: String,
    resources: [String]
  }],
  
  // Educational metadata
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'All Levels'
  },
  language: {
    type: String,
    default: 'English'
  },
  prerequisites: [String],
  learningOutcomes: [String],
  estimatedReadTime: Number, // in minutes
  
  // Access control
  accessLevel: {
    type: String,
    enum: ['public', 'registered', 'premium', 'restricted'],
    default: 'public',
    index: true
  },
  allowedRoles: [{
    type: String,
    enum: ['student', 'instructor', 'admin']
  }],
  
  // Statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  
  // User interactions
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Publication info
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // SEO
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  keywords: [String],
  
  // Related content
  relatedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  relatedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  
  // Content details for faith resources
  faithContent: {
    subject: {
      type: String,
      enum: ['ZANJAAN', 'Madkhal and Manthiq', 'Fathul Mueen', 'Qatr-u-Nida', 
             'Urdu Language & Literature', 'Modern Arabic', 'Thajweed', 
             'Islamic History', 'Other']
    },
    syllabus: [String],
    examInfo: {
      hasExam: Boolean,
      examDate: Date,
      passingScore: Number
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ category: 1, type: 1 });
resourceSchema.index({ accessLevel: 1, isPublished: 1 });
resourceSchema.index({ 'stats.views': -1 });
resourceSchema.index({ publishedAt: -1 });

// Virtual for formatted file size
resourceSchema.virtual('formattedSize').get(function() {
  const totalSize = this.files.reduce((sum, file) => sum + (file.size || 0), 0);
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (totalSize === 0) return '0 Bytes';
  const i = Math.floor(Math.log(totalSize) / Math.log(1024));
  return Math.round(totalSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for total downloads
resourceSchema.virtual('totalDownloads').get(function() {
  return this.files.reduce((sum, file) => sum + (file.downloadCount || 0), 0);
});

// Generate slug before saving
resourceSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '-') // Include Arabic characters
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  if (this.isModified()) {
    this.lastUpdated = new Date();
  }
  
  next();
});

// Methods
resourceSchema.methods.incrementView = function() {
  this.stats.views += 1;
  return this.save();
};

resourceSchema.methods.incrementDownload = function(fileIndex = 0) {
  this.stats.downloads += 1;
  if (this.files[fileIndex]) {
    this.files[fileIndex].downloadCount += 1;
  }
  return this.save();
};

resourceSchema.methods.toggleLike = function(userId) {
  const userIndex = this.likedBy.indexOf(userId);
  if (userIndex > -1) {
    this.likedBy.splice(userIndex, 1);
    this.stats.likes -= 1;
  } else {
    this.likedBy.push(userId);
    this.stats.likes += 1;
  }
  return this.save();
};

// Static methods
resourceSchema.statics.getByCategory = function(category, limit = 20) {
  return this.find({ 
    category, 
    isPublished: true,
    accessLevel: { $in: ['public', 'registered'] }
  })
  .sort({ 'stats.views': -1, publishedAt: -1 })
  .limit(limit);
};

resourceSchema.statics.getPopular = function(limit = 10) {
  return this.find({ 
    isPublished: true,
    accessLevel: { $in: ['public', 'registered'] }
  })
  .sort({ 'stats.views': -1, 'stats.downloads': -1 })
  .limit(limit);
};

resourceSchema.statics.searchResources = function(query, filters = {}) {
  const searchQuery = {
    isPublished: true,
    accessLevel: { $in: ['public', 'registered'] },
    ...filters
  };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  return this.find(searchQuery)
    .sort(query ? { score: { $meta: 'textScore' } } : { publishedAt: -1 });
};

module.exports = mongoose.model('Resource', resourceSchema);
