require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection from .env.local
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  console.log('📝 Please make sure .env.local file exists with MONGODB_URI');
  process.exit(1);
}

// User schema (same as in the model)
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log('📍 Using URI from .env.local');
    
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB Atlas successfully');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@shawarmatime.com' });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
      console.log('📧 Email: admin@shawarmatime.com');
      console.log('🔑 You can use existing password: admin123');
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Create admin user
    const admin = new User({
      email: 'admin@shawarmatime.com',
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@shawarmatime.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️ Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env.local file exists');
    console.log('2. Verify MONGODB_URI is correct');
    console.log('3. Make sure Atlas cluster is running');
    console.log('4. Check network access settings in Atlas');
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
  }
}

createAdmin(); 