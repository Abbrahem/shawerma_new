'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Package, 
  ShoppingCart, 
  LogOut, 
  Users, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts, ProductsProvider } from '@/contexts/ProductsContext';
import { useOrders, OrdersProvider } from '@/contexts/OrdersContext';
import { Product, Order, CATEGORIES } from '@/types';
import { showWarningAlert, showSuccessAlert, showErrorAlert, showConfirmAlert } from '@/lib/sweetAlert';
import { formatOrderAddress } from '@/lib/orderFunction';     
const AdminDashboardContent = () => {
  const { user, logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, refreshProducts, loading: productsLoading, triggerProductsRefresh } = useProducts();
  const { orders, updateOrderStatus, loading: ordersLoading } = useOrders();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Sandwiches',
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Pending Orders',
      value: orders.filter(o => o.status === 'pending').length,
      icon: ShoppingCart,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Total Revenue',
      value: `${orders.reduce((sum, order) => sum + order.total, 0)} LE`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm();
            setShowAddProductForm(true);
          }}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </motion.button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-orange-600">{product.price} LE</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product)}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        await showWarningAlert('حجم الصورة كبير جداً!', 'يرجى اختيار صورة أصغر من 2 ميجابايت');
        return;
      }
      setImageFile(file);
      try {
        const compressedBase64 = await compressImage(file);
        setImagePreview(compressedBase64);
        setProductData(prev => ({ ...prev, image: compressedBase64 }));
        console.log('Image compressed and converted to Base64');
      } catch (error) {
        console.error('Error compressing image:', error);
        await showErrorAlert('خطأ في معالجة الصورة', 'حدث خطأ أثناء ضغط الصورة. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      image: product.image
    });
    setImagePreview(product.image.startsWith('data:') ? product.image : '');
    setShowAddProductForm(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    const result = await showConfirmAlert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف "${product.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`
    );
    if (result.isConfirmed) {
      try {
        await deleteProduct(product.id);
        await showSuccessAlert('تم حذف المنتج بنجاح! 🗑️');
        await refreshProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        await showErrorAlert('خطأ في حذف المنتج', 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setProductData({
      name: '',
      price: '',
      description: '',
      category: 'Sandwiches',
      image: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImage(true);
    try {
      let imageURL = productData.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
      if (productData.image && productData.image.startsWith('data:')) {
        imageURL = productData.image;
      }
      const productDataToSave = {
        name: productData.name,
        price: parseFloat(productData.price),
        description: productData.description,
        category: productData.category,
        image: imageURL,
        createdAt: editingProduct ? editingProduct.createdAt : new Date()
      };
      if (editingProduct) {
        await updateProduct(editingProduct.id, productDataToSave);
        await showSuccessAlert('تم تحديث المنتج بنجاح! ✏️');
      } else {
        await addProduct(productDataToSave);
        await showSuccessAlert('تم إضافة المنتج بنجاح! 🎉');
      }
      await refreshProducts();
      triggerProductsRefresh();
      setShowAddProductForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      await showErrorAlert(
        editingProduct ? 'خطأ في تحديث المنتج' : 'خطأ في إضافة المنتج',
        'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const renderAddProductForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={() => {
                setShowAddProductForm(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        <form onSubmit={handleProductSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              required
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-amber-900 font-medium"
              placeholder="e.g., Chicken Shawarma Sandwich"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (LE)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-amber-900 font-medium"
                placeholder="45.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={productData.category}
                onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-amber-900 font-medium"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              required
              rows={4}
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-amber-900 font-medium"
              placeholder="Describe your delicious product..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <div className="text-xs mt-1 space-y-1">
              <p className="text-gray-500">Choose an image for your product (optional)</p>
              <p className="text-blue-600 font-medium">🚀 ضغط تلقائي + Base64 - أسرع وأأمن!</p>
              <p className="text-green-600">✅ حد أقصى 2MB - سيتم ضغطها تلقائياً</p>
            </div>
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddProductForm(false);
                resetForm();
              }}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <div className="flex-1 flex space-x-2">
              <button
                type="submit"
                disabled={uploadingImage}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploadingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingProduct ? 'Updating Product...' : 'Saving Product...'}
                  </>
                ) : (
                  editingProduct ? 'Update Product' : 'Add Product'
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await showSuccessAlert('تم تحديث الحالة!', `تم تحديث حالة الطلب إلى: ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      await showErrorAlert('خطأ في تحديث الحالة', 'حدث خطأ أثناء تحديث حالة الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
      {ordersLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</h3>
                  <p className="text-gray-600">{order.customerName} • {order.customerPhone}</p>
                  <p className="text-gray-600 text-sm">{order.customerAddress}</p>
                  <p className="text-gray-500 text-xs mt-1">{new Date(order.createdAt).toLocaleString('ar-EG')}</p>
                </div>
                <div className="text-right">
                  <select
                    value={order.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleUpdateOrderStatus(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'ready' ? 'bg-green-100 text-green-800' :
                      order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <p className="text-xl font-bold text-gray-900 mt-2">{order.totalAmount || order.total} LE</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Order Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-lg">🥙</span>
                        </div>
                        <span className="text-gray-900">{item.quantity}x {('name' in item ? item.name : '')}</span>
                      </div>
                      <span className="font-medium text-gray-900">{('price' in item ? (item.price * item.quantity).toFixed(0) : '')} LE</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[{ id: 'overview', label: 'Overview' }, { id: 'products', label: 'Products' }, { id: 'orders', label: 'Orders' }].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
      </div>
      {showAddProductForm && renderAddProductForm()}
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <ProductsProvider>
      <OrdersProvider>
        <AdminDashboardContent />
      </OrdersProvider>
    </ProductsProvider>
  );
};

export default AdminDashboard;