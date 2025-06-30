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
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const newProducts = [
  // Sandwiches
  {
    name: 'Mixed Shawarma Sandwich',
    price: 55,
    description: 'Chicken and beef shawarma with special sauce and vegetables',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Sandwiches',
    available: true
  },
  {
    name: 'Chicken Shawarma Super',
    price: 65,
    description: 'Extra large chicken shawarma with double meat and premium toppings',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Sandwiches',
    available: true
  },
  {
    name: 'Spicy Beef Shawarma',
    price: 60,
    description: 'Hot and spicy beef shawarma with jalapeños and spicy sauce',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Sandwiches',
    available: true
  },

  // Boxes
  {
    name: 'Family Shawarma Box',
    price: 120,
    description: 'Large box for family sharing with chicken, beef, rice, and salads',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Boxes',
    available: true
  },
  {
    name: 'Chicken Box Deluxe',
    price: 85,
    description: 'Premium chicken shawarma box with extra sides and premium sauces',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Boxes',
    available: true
  },
  {
    name: 'Beef Box Special',
    price: 95,
    description: 'Special beef shawarma box with grilled vegetables and tahini',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Boxes',
    available: true
  },

  // Meals
  {
    name: 'Shawarma Feast',
    price: 150,
    description: 'Complete feast with mixed shawarma, rice, bread, salads, and drinks',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Meals',
    available: true
  },
  {
    name: 'Chicken Meal Combo',
    price: 95,
    description: 'Chicken shawarma with rice, salad, bread, fries, and soft drink',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Meals',
    available: true
  },
  {
    name: 'Beef Meal Premium',
    price: 110,
    description: 'Premium beef shawarma meal with grilled vegetables and juice',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Meals',
    available: true
  },

  // Crepes
  {
    name: 'Chicken Crepe',
    price: 40,
    description: 'Crispy crepe filled with chicken shawarma and vegetables',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Crepes',
    available: true
  },
  {
    name: 'Mixed Crepe',
    price: 50,
    description: 'Delicious crepe with chicken and beef shawarma mix',
    image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Crepes',
    available: true
  },
  {
    name: 'Cheese Chicken Crepe',
    price: 45,
    description: 'Chicken shawarma crepe with melted cheese and special sauce',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Crepes',
    available: true
  },

  // Extras
  {
    name: 'French Fries',
    price: 20,
    description: 'Crispy golden french fries with special seasoning',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Extras',
    available: true
  },
  {
    name: 'Garlic Sauce',
    price: 10,
    description: 'Homemade garlic sauce - perfect with shawarma',
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Extras',
    available: true
  },
  {
    name: 'Mixed Salad',
    price: 25,
    description: 'Fresh mixed salad with tomatoes, cucumbers, and dressing',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Extras',
    available: true
  },
  {
    name: 'Soft Drink',
    price: 15,
    description: 'Cold soft drink - Coca Cola, Pepsi, or Sprite',
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Extras',
    available: true
  },

  // Offers
  {
    name: 'Student Offer',
    price: 35,
    description: 'Special student discount - Chicken sandwich + fries + drink',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Offers',
    available: true
  },
  {
    name: 'Family Offer',
    price: 180,
    description: 'Family package - 2 boxes + 4 sandwiches + salads + drinks',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Offers',
    available: true
  },
  {
    name: 'Happy Hour',
    price: 70,
    description: 'Limited time offer - 2 sandwiches + 2 drinks at special price',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Offers',
    available: true
  }
];

async function addMoreProducts() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env.local');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas successfully');
    
    // إضافة المنتجات الجديدة بدون حذف القديمة
    const insertedProducts = await Product.insertMany(newProducts);
    console.log(`✅ Added ${insertedProducts.length} new products to database`);
    
    // عرض جميع المنتجات
    const allProducts = await Product.find({});
    console.log(`📦 Total products in database: ${allProducts.length}`);
    
    // تجميع حسب الفئة
    const categories = {};
    allProducts.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = 0;
      }
      categories[product.category]++;
    });
    
    console.log('\n📊 Products by category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });
    
    await mongoose.disconnect();
    console.log('\n🔐 Database connection closed');
    console.log('🎉 Ready to test the website with more products!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

addMoreProducts(); 