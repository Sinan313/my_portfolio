const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies (optional)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Token is not valid. User not found.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired'
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Server error'
      });
    }
  }
};

// Optional protect - adds user to request if token exists but doesn't require it
const optionalProtect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid, continue without user
        console.log('Optional auth failed:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. ${req.user.role} role is not authorized for this action.`
      });
    }

    next();
  };
};

// Check if user owns resource or is admin
const checkOwnership = (Model, resourceField = 'userId') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id || req.params.courseId || req.params.resourceId;
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          status: 'error',
          message: 'Resource not found'
        });
      }

      // Check ownership or admin role
      const ownerId = resource[resourceField] || resource.instructor || resource.author;
      if (ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. You can only access your own resources.'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error'
      });
    }
  };
};

// Rate limiting helper
const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests') => {
  const requests = new Map();

  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean old entries
    for (const [key, value] of requests.entries()) {
      if (now - value.resetTime > windowMs) {
        requests.delete(key);
      }
    }

    const clientRequests = requests.get(clientId);
    
    if (!clientRequests) {
      requests.set(clientId, {
        count: 1,
        resetTime: now
      });
      next();
    } else if (now - clientRequests.resetTime > windowMs) {
      requests.set(clientId, {
        count: 1,
        resetTime: now
      });
      next();
    } else if (clientRequests.count < max) {
      clientRequests.count++;
      next();
    } else {
      res.status(429).json({
        status: 'error',
        message,
        retryAfter: Math.ceil((windowMs - (now - clientRequests.resetTime)) / 1000)
      });
    }
  };
};

// Validate request body
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Cache middleware (simple in-memory cache)
const cache = (duration = 300) => { // Default 5 minutes
  const cacheStore = new Map();

  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cached = cacheStore.get(key);

    if (cached && Date.now() - cached.timestamp < duration * 1000) {
      return res.json(cached.data);
    }

    const originalJson = res.json;
    res.json = function(data) {
      if (res.statusCode === 200) {
        cacheStore.set(key, {
          data,
          timestamp: Date.now()
        });
      }
      originalJson.call(this, data);
    };

    next();
  };
};

module.exports = {
  protect,
  optionalProtect,
  authorize,
  checkOwnership,
  createRateLimit,
  validateBody,
  cache
};
