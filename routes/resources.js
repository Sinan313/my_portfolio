const express = require('express');
const Resource = require('../models/Resource');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all resources with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { 
      isPublished: true,
      accessLevel: { $in: ['public', 'registered'] }
    };
    
    // Apply filters
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }
    
    if (req.query.type) {
      query.type = req.query.type;
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
        sort = { 'stats.views': -1, 'stats.downloads': -1 };
        break;
      case 'newest':
        sort = { publishedAt: -1 };
        break;
      case 'alphabetical':
        sort = { title: 1 };
        break;
      case 'rating':
        sort = { 'stats.averageRating': -1 };
        break;
      default:
        sort = { publishedAt: -1 };
    }
    
    // Execute query
    const resources = await Resource.find(query)
      .select('-chapters -detailedDescription') // Exclude heavy content for listing
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Resource.countDocuments(query);
    
    // Get filter options
    const categories = await Resource.distinct('category', { isPublished: true });
    const types = await Resource.distinct('type', { isPublished: true });
    const levels = await Resource.distinct('level', { isPublished: true });
    
    res.status(200).json({
      status: 'success',
      data: {
        resources,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        filters: {
          categories: categories.sort(),
          types: types.sort(),
          levels: levels.sort()
        }
      }
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get resources by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const resources = await Resource.getByCategory(category, limit);
    
    res.status(200).json({
      status: 'success',
      data: { resources }
    });
  } catch (error) {
    console.error('Get resources by category error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get popular resources
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const resources = await Resource.getPopular(limit);
    
    res.status(200).json({
      status: 'success',
      data: { resources }
    });
  } catch (error) {
    console.error('Get popular resources error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Search resources
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { category, type, level } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (category) filters.category = category;
    if (type) filters.type = type;
    if (level) filters.level = level;
    
    const resources = await Resource.searchResources(query, filters)
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      status: 'success',
      data: { resources }
    });
  } catch (error) {
    console.error('Search resources error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get resource by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by ID first, then by slug
    let resource;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      resource = await Resource.findById(identifier);
    } else {
      resource = await Resource.findOne({ slug: identifier });
    }
    
    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found'
      });
    }
    
    // Check access permissions
    if (!resource.isPublished) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found'
      });
    }
    
    // Check access level
    if (resource.accessLevel === 'registered' && !req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Login required to access this resource'
      });
    }
    
    if (resource.accessLevel === 'premium' && (!req.user || req.user.role === 'student')) {
      return res.status(403).json({
        status: 'error',
        message: 'Premium access required'
      });
    }
    
    // Populate related resources
    await resource.populate('relatedResources', 'title description thumbnail category');
    await resource.populate('relatedCourses', 'title description thumbnail instructor');
    
    // Increment view count
    await resource.incrementView();
    
    // Check if user liked this resource
    let isLiked = false;
    if (req.user) {
      isLiked = resource.likedBy.includes(req.user.id);
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        resource,
        isLiked
      }
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Download resource file
router.get('/:resourceId/download/:fileIndex?', async (req, res) => {
  try {
    const { resourceId, fileIndex = 0 } = req.params;
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found'
      });
    }
    
    // Check access permissions
    if (resource.accessLevel === 'registered' && !req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Login required to download this resource'
      });
    }
    
    if (resource.accessLevel === 'premium' && (!req.user || req.user.role === 'student')) {
      return res.status(403).json({
        status: 'error',
        message: 'Premium access required'
      });
    }
    
    // Check if file exists
    const file = resource.files[parseInt(fileIndex)];
    if (!file) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }
    
    // Increment download count
    await resource.incrementDownload(parseInt(fileIndex));
    
    // For demo purposes, return download info
    // In production, you would serve the actual file
    res.status(200).json({
      status: 'success',
      message: 'Download started',
      data: {
        filename: file.originalName,
        size: file.size,
        mimetype: file.mimetype,
        url: file.url
      }
    });
  } catch (error) {
    console.error('Download resource error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Like/unlike resource
router.post('/:resourceId/like', protect, async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found'
      });
    }
    
    await resource.toggleLike(req.user.id);
    const isLiked = resource.likedBy.includes(req.user.id);
    
    res.status(200).json({
      status: 'success',
      message: isLiked ? 'Resource liked' : 'Resource unliked',
      data: {
        isLiked,
        totalLikes: resource.stats.likes
      }
    });
  } catch (error) {
    console.error('Like resource error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create new resource (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Resource created successfully',
      data: { resource }
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update resource (admin only)
router.put('/:resourceId', protect, authorize('admin'), async (req, res) => {
  try {
    const { resourceId } = req.params;
    
    const resource = await Resource.findByIdAndUpdate(
      resourceId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Resource updated successfully',
      data: { resource }
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete resource (admin only)
router.delete('/:resourceId', protect, authorize('admin'), async (req, res) => {
  try {
    const { resourceId } = req.params;
    
    const resource = await Resource.findByIdAndDelete(resourceId);
    
    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
