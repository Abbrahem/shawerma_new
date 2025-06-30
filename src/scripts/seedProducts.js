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

const sampleProducts = [
  {
    name: 'Chicken Shawarma Sandwich',
    price: 45,
    description: 'Tender chicken shawarma with fresh vegetables and garlic sauce in pita bread',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Sandwiches'
  },
  {
    name: 'Beef Shawarma Sandwich',
    price: 50,
    description: 'Juicy beef shawarma with tahini sauce and fresh vegetables',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Sandwiches'
  },
  {
    name: 'Mixed Shawarma Box',
    price: 75,
    description: 'Chicken and beef shawarma with rice, salad, and sauces',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Boxes'
  },
  {
    name: 'Chicken Shawarma Meal',
    price: 85,
    description: 'Complete meal with chicken shawarma, rice, salad, and drinks',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Meals'
  }
];

async function seedProducts() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env.local');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas successfully');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Added ${insertedProducts.length} sample products to database`);
    
    // Log product IDs for reference
    insertedProducts.forEach((product, index) => {
      console.log(`📦 ${index + 1}. ${product.name} - ID: ${product._id}`);
    });
    
    console.log('🔐 Database connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts(); 