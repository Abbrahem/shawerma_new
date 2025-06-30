require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Offers', 'Sandwiches', 'Crepes', 'Boxes', 'Extras', 'Meals']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function clearProducts() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env.local');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas successfully');
    
    // Clear all products
    const result = await Product.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} products from database`);
    console.log('✨ Database is now clean and ready for your real products!');
    
    console.log('🔐 Database connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error clearing products:', error);
    process.exit(1);
  }
}

clearProducts(); 