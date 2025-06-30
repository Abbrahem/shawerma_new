# 🥙 Shawarma Time - Modern E-Commerce Restaurant Website

A modern, animated e-commerce website for a Middle Eastern restaurant built with Next.js, React, TailwindCSS, and MongoDB.

![Shawarma Time](https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## ✨ Features

### 🏠 Main Website Features
- **Modern Navbar** with restaurant logo, navigation links, and cart icon
- **Hero Section** with full-screen background and CTA button
- **Menu Categories** - 6 interactive category cards (Offers, Sandwiches, Crepes, Boxes, Extras, Meals)
- **Product Details Pages** with image gallery and Add to Cart functionality
- **About Section** showcasing restaurant history and values
- **Delivery & Ingredients** section highlighting quality and service
- **Footer** with embedded Google Maps, contact info, and Arabic address
- **Browse Menu Page** with search and category filters
- **Shopping Cart** with quantity controls and checkout process

### 🔐 Admin Panel Features
- **Secure Admin Login** accessible via `/admin` URL with JWT authentication
- **Admin Dashboard** with three main sections:
  - **Add New Product** - Form to create new menu items
  - **Products Management** - View, edit, and delete products
  - **Orders Management** - Track and manage customer orders
- **MongoDB Integration** for data storage and management
- **JWT-based Authentication** for secure admin access

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: TailwindCSS, Framer Motion (animations)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Icons**: Lucide React
- **Forms**: React Hook Form with Yup validation
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shawarma-time
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   
   **Option A: Local MongoDB**
   - Install MongoDB on your system
   - Start MongoDB service
   - Database will be created automatically

   **Option B: MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Create database user and get connection string

4. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/shawarma-time
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shawarma-time

   # JWT Secret (change this to a secure secret in production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Create Admin User**
   ```bash
   node src/scripts/createAdminMongoDB.js
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Routes

### Customer-Facing Pages
- **`/`** - Homepage with hero, menu categories, about, and delivery sections
- **`/products`** - Browse menu with search and filters
- **`/products?category=sandwiches`** - Category-specific product listings
- **`/cart`** - Shopping cart and checkout
- **`/orders`** - Customer order tracking

### Admin Panel
- **`/admin`** - Admin login page
- **`/admin/dashboard`** - Protected admin dashboard

### API Routes
- **`/api/auth/login`** - Admin authentication
- **`/api/auth/register`** - User registration
- **`/api/products`** - Products CRUD operations
- **`/api/orders`** - Orders management

## 🎨 Design Features

- **Ultra-modern, clean UI** with smooth animations
- **Framer Motion animations** for enhanced user experience
- **Fully responsive design** (mobile-first approach)
- **High-quality hover effects** and transitions
- **Beautiful gradient backgrounds** and glassmorphism effects
- **Arabic text support** in footer for international appeal

## 🔧 Development

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── orders/        # Orders API
│   │   └── products/      # Products API
│   ├── admin/             # Admin panel pages
│   ├── cart/              # Shopping cart page
│   ├── orders/            # Orders page
│   ├── products/          # Product listing page
│   └── page.tsx           # Homepage
├── components/            # Reusable React components
├── contexts/              # React Context providers
├── lib/                   # Utility functions (MongoDB connection)
├── models/                # MongoDB/Mongoose models
├── scripts/               # Helper scripts
└── types/                 # TypeScript type definitions
```

### Database Models

**User Model**
```javascript
{
  email: String (required, unique)
  password: String (required, hashed with bcryptjs)
  isAdmin: Boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

**Product Model**
```javascript
{
  name: String (required)
  price: Number (required)
  description: String (required)
  image: String (required)
  category: String (required)
  createdAt: Date
  updatedAt: Date
}
```

**Order Model**
```javascript
{
  customerName: String (required)
  customerPhone: String (required)
  customerAddress: String (required)
  items: Array of OrderItems
  totalAmount: Number (required)
  status: String (pending, preparing, ready, delivered, cancelled)
  paymentMethod: String (cash, card)
  createdAt: Date
  updatedAt: Date
}
```

### Key Components
- **Navbar** - Navigation with cart icon and mobile menu
- **Hero** - Animated hero section with CTA
- **MenuCategories** - Interactive category cards
- **ProductCard** - Product display with Add to Cart
- **About** - Restaurant story and features
- **DeliverySection** - Quality and delivery information
- **Footer** - Contact info and Google Maps

### Admin Features
- **JWT Authentication** - Secure token-based authentication
- **Product Management** - CRUD operations for menu items
- **Order Tracking** - Real-time order status updates
- **Protected API Routes** - Secure backend endpoints

## 🎯 Demo Credentials

For testing the admin panel:
- **Email**: admin@shawarmatime.com
- **Password**: admin123

*Note: Created automatically when you run the createAdminMongoDB script*

## 📦 Production Deployment

### Build the application
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET` 
   - `NEXT_PUBLIC_APP_URL`
4. Deploy automatically on every push

### MongoDB Atlas Setup for Production
1. Create MongoDB Atlas cluster
2. Create database user with appropriate permissions
3. Configure network access (IP whitelist)
4. Update `MONGODB_URI` with Atlas connection string
5. Ensure strong JWT_SECRET in production

## 🔒 Security Features

- **Password Hashing** - Using bcryptjs for secure password storage
- **JWT Authentication** - Stateless authentication with secure tokens
- **Protected Routes** - Admin routes protected with middleware
- **Environment Variables** - Sensitive data stored securely
- **Input Validation** - Form validation on both client and server
- **CORS Configuration** - Proper cross-origin request handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide React](https://lucide.dev)
- Design inspiration from modern restaurant websites
- MongoDB for database services
- Next.js team for the amazing framework

## 📞 Support

For support, email support@shawarmatime.com or create an issue on GitHub.

---

**Built with ❤️ for great food experiences**

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Issues**
```bash
# Check if MongoDB is running (local installation)
sudo systemctl status mongod

# Start MongoDB service
sudo systemctl start mongod
```

**JWT Token Issues**
- Ensure JWT_SECRET is set in .env.local
- Check token expiration (default: 7 days)
- Clear localStorage if token issues persist

**Admin User Creation**
```bash
# If admin creation fails, try:
node src/scripts/createAdminMongoDB.js
```

**Build Issues**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```
