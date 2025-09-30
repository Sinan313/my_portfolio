const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Create indexes
    const User = require('../models/User');
    const Course = require('../models/Course');
    const Resource = require('../models/Resource');
    
    console.log('📋 Creating database indexes...');
    
    await User.createIndexes();
    console.log('  ✓ User indexes created');
    
    await Course.createIndexes();
    console.log('  ✓ Course indexes created');
    
    await Resource.createIndexes();
    console.log('  ✓ Resource indexes created');
    
    console.log('🎉 Database setup completed successfully!');
    
    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@ctechsolutions.com' });
    
    if (!adminExists) {
      console.log('👤 Creating admin user...');
      
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@ctechsolutions.com',
        password: 'admin123456', // Change this in production!
        role: 'admin',
        isEmailVerified: true,
        country: 'India',
        city: 'Bengaluru'
      });
      
      console.log('  ✓ Admin user created with email: admin@ctechsolutions.com');
      console.log('  ⚠️  Default password: admin123456 (CHANGE THIS!)');
    } else {
      console.log('👤 Admin user already exists');
    }
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    process.exit(1);
  }
};

const setupDatabase = async () => {
  console.log('🚀 Starting database setup...');
  console.log('📡 Connecting to MongoDB...');
  
  await connectDB();
  
  mongoose.connection.close();
  console.log('✅ Database setup completed and connection closed');
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
