const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    console.log('📍 Connection URI:', process.env.MONGODB_URI ? 'Found ✅' : 'Missing ❌');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env.local');
      console.log('📝 Please create .env.local file with your MongoDB Atlas connection string');
      return;
    }

    // إعدادات الاتصال
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    console.log('⏳ Connecting...');
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Connection details:');
    console.log(`   - Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   - Host: ${mongoose.connection.host}`);
    console.log(`   - Ready State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // اختبار كتابة بسيط
    console.log('🧪 Testing database write permissions...');
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Write test successful!');
    
    // حذف البيانات التجريبية
    await testCollection.deleteOne({ test: true });
    console.log('🧹 Cleaned up test data');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error('Error:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check your .env.local file exists and has MONGODB_URI');
    console.log('2. Verify your MongoDB Atlas connection string is correct');
    console.log('3. Ensure your IP address is whitelisted in Atlas');
    console.log('4. Check your username and password are correct');
    console.log('5. Make sure your cluster is running (not paused)');
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Connection closed');
  }
}

testConnection(); 