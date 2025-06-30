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
  available: { type: Boolean, default: true }, // Add available field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function updateProductsAvailable() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env.local');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas successfully');
    
    // Update all products to be available
    const result = await Product.updateMany({}, { available: true });
    console.log(`✅ Updated ${result.modifiedCount} products with available: true`);
    
    // Log all products
    const allProducts = await Product.find({});
    console.log(`📦 Total products in database: ${allProducts.length}`);
    
    allProducts.forEach((product, index) => {
      console.log(`🍽️ ${index + 1}. ${product.name} - Available: ${product.available} - Price: ${product.price} LE`);
    });
    
    await mongoose.disconnect();
    console.log('🔐 Database connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error updating products:', error);
    process.exit(1);
  }
}

updateProductsAvailable(); 