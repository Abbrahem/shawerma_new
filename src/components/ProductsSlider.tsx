'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductsContext';
import { showSuccessAlert } from '@/lib/sweetAlert';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

const ProductsSlider = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [previousOrders, setPreviousOrders] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { refreshTrigger } = useProducts();
  const sliderRef = useRef<HTMLDivElement>(null);

  // تحميل المنتجات المطلوبة سابقاً من localStorage
  useEffect(() => {
    const loadPreviousOrders = () => {
      try {
        const saved = localStorage.getItem('previousOrders');
        if (saved) {
          setPreviousOrders(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading previous orders:', error);
      }
    };

    loadPreviousOrders();
  }, []);

  // جلب المنتجات من API مع التحديث التلقائي والفوري
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 ProductsSlider: Fetching products... (refreshTrigger:', refreshTrigger, ')');
        const response = await fetch('/api/products?cache=' + Date.now()); // منع الـ cache
        if (response.ok) {
          const allProducts = await response.json();
          console.log('📦 ProductsSlider: Received products:', allProducts.length);
          
          // فلترة المنتجات المتوفرة فقط
          const availableProducts = allProducts.filter((product: Product) => product.available);
          console.log('✅ ProductsSlider: Available products:', availableProducts.length);
          
          if (availableProducts.length > 0) {
            // نأخذ أول 9 منتجات متاحة مباشرة لضمان العرض السريع (3 شرائح)
            const quickProducts = availableProducts.slice(0, 9);
            console.log('🎯 ProductsSlider: Setting quick products:', quickProducts.length);
            setProducts(quickProducts);
            
            // ثم نعيد ترتيبهم حسب الطلبات السابقة ونعرض جميع المنتجات المتاحة
            setTimeout(() => {
              let finalProducts;
              if (previousOrders.length > 0) {
                const prioritizedProducts = [
                  ...availableProducts.filter((product: Product) => previousOrders.includes(product._id)),
                  ...availableProducts.filter((product: Product) => !previousOrders.includes(product._id))
                ];
                finalProducts = prioritizedProducts; // عرض جميع المنتجات
                console.log('🔄 ProductsSlider: Reordered with priorities - showing all products');
              } else {
                finalProducts = availableProducts; // عرض جميع المنتجات
                console.log('📦 ProductsSlider: Showing all available products');
              }
              setProducts(finalProducts);
              console.log(`🎯 ProductsSlider: Total products in slider: ${finalProducts.length}`);
              
              if (refreshTrigger > 0) {
                console.log('✨ ProductsSlider: New product detected - slider updated instantly!');
              }
            }, 100);
          } else {
            console.log('⚠️ ProductsSlider: No available products found');
          }
        } else {
          console.error('❌ ProductsSlider: Failed to fetch products:', response.status);
        }
      } catch (error) {
        console.error('💥 ProductsSlider: Error fetching products:', error);
      } finally {
        console.log('🏁 ProductsSlider: Loading finished');
        setIsLoading(false);
      }
    };

    // التحميل الأولي أو عند التحديث الفوري
    fetchProducts();
    
    // التحديث التلقائي كل 30 ثانية للتحقق من منتجات جديدة (فقط للتحميل الأولي)
    let refreshInterval: NodeJS.Timeout;
    if (refreshTrigger === 0) {
      refreshInterval = setInterval(() => {
        console.log('🔄 ProductsSlider: Auto-refreshing products...');
        fetchProducts();
      }, 30000); // كل 30 ثانية
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshTrigger]); // إضافة refreshTrigger للتحديث الفوري

  // إعادة ترتيب المنتجات عند تغيير الطلبات السابقة
  useEffect(() => {
    if (products.length > 0 && previousOrders.length > 0) {
      const prioritizedProducts = [
        ...products.filter((product: Product) => previousOrders.includes(product._id)),
        ...products.filter((product: Product) => !previousOrders.includes(product._id))
      ];
      setProducts(prioritizedProducts);
    }
  }, [previousOrders]);

  // التحرك التلقائي للـ slider - يعمل دائماً
  useEffect(() => {
    if (products.length === 0 || isLoading) return;
    
    const maxSlides = Math.ceil(products.length / 3);
    if (maxSlides <= 1) return; // لا نحتاج تنقل إذا كان شريحة واحدة فقط
    
    // مدة الدوران متناسبة مع عدد المنتجات - كلما زادت المنتجات، كلما دار أسرع
    const rotationSpeed = products.length > 12 ? 3000 : products.length > 6 ? 3500 : 4000;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % maxSlides);
    }, rotationSpeed);

    return () => clearInterval(interval);
  }, [products.length, isLoading]); // إزالة isAutoPlaying dependency

  // حفظ منتج في الطلبات السابقة
  const saveToOrderHistory = (productId: string) => {
    try {
      const updated = [...new Set([...previousOrders, productId])]; // تجنب التكرار
      setPreviousOrders(updated);
      localStorage.setItem('previousOrders', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving to order history:', error);
    }
  };

  // إضافة منتج للسلة مع إعادة ترتيب المنتجات
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    saveToOrderHistory(product._id);
    showSuccessAlert('تم إضافة المنتج إلى السلة بنجاح! 🛒');
    
    // إعادة ترتيب المنتجات لإظهار المنتج المضاف في المقدمة
    setTimeout(() => {
      if (products.length > 0) {
        const reorderedProducts = [
          product, // المنتج المضاف يظهر أولاً
          ...products.filter(p => p._id !== product._id) // باقي المنتجات
        ];
        setProducts(reorderedProducts);
        console.log('🔄 Products reordered after adding to cart');
      }
    }, 2000); // انتظار ثانيتين ثم إعادة الترتيب
  };

  // التنقل في الـ slider
  const nextSlide = () => {
    if (isLoading) return;
    const maxSlides = Math.ceil(products.length / 3);
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    if (isLoading) return;
    const maxSlides = Math.ceil(products.length / 3);
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  // إزالة التوقف عند hover - الـ slider يعمل دائماً

  // عرض المنتجات الحالية (3 في المرة الواحدة)
  const getCurrentProducts = () => {
    const startIndex = currentSlide * 3;
    return products.slice(startIndex, startIndex + 3);
  };

  // لا نخفي الـ slider أبداً - نعرض دائماً إذا كان التحميل انتهى
  if (products.length === 0 && !isLoading) {
    return (
      <section className="py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              منتجات مقترحة لك 🌟
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              لا توجد منتجات متاحة حالياً. تحقق لاحقاً!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const maxSlides = isLoading ? 1 : Math.ceil(products.length / 3);

  return (
    <section className="py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            منتجات مقترحة لك 
            <span className="text-transparent bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text">✨</span>
            {!isLoading && products.length > 0 && (
              <span className="text-sm font-normal text-gray-500 block mt-1">
                ({products.length} منتج متاح)
              </span>
            )}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            اكتشف أشهى منتجاتنا الطازجة والمحضرة بعناية خاصة
            {previousOrders.length > 0 && products.some(p => previousOrders.includes(p._id)) && (
              <span className="block mt-2 text-amber-700 font-semibold bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-full inline-block shadow-sm">
                ⭐ المنتجات المُجربة تظهر أولاً
              </span>
            )}
          </motion.p>
        </div>

        {/* Slider Container */}
        <div 
          className="relative max-w-6xl mx-auto"
          ref={sliderRef}
        >
          {/* Products Grid */}
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {(isLoading ? 
                  // Skeleton products أثناء التحميل - 3 منتجات
                  Array(3).fill(0).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                    >
                      {/* Skeleton Image */}
                      <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100"></div>
                      
                      {/* Skeleton Content */}
                      <div className="p-4">
                        <div className="h-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded mb-2"></div>
                        <div className="h-4 bg-gradient-to-r from-orange-100 to-red-100 rounded mb-2"></div>
                        <div className="h-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gradient-to-r from-orange-100 to-red-100 rounded w-1/2 mb-3"></div>
                        <div className="h-10 bg-gradient-to-r from-amber-100 via-orange-100 to-red-100 rounded"></div>
                      </div>
                    </div>
                  )) :
                  // المنتجات الفعلية
                  getCurrentProducts().map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* صورة المنتج */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* شارة للمنتجات المطلوبة سابقاً */}
                      {previousOrders.includes(product._id) && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-lg border border-amber-300">
                          ⭐ مُجرب
                        </div>
                      )}
                      {/* سعر المنتج */}
                      <div className="absolute bottom-3 left-3 bg-orange-500 text-white font-bold px-3 py-1 rounded-full">
                        {product.price} ج.م
                      </div>
                    </div>

                    {/* معلومات المنتج */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="text-xs text-orange-600 mb-3 font-medium">
                        {product.category}
                      </div>

                      {/* أزرار التحكم */}
                      <div className="flex space-x-2 space-x-reverse">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>أضف للسلة</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          {!isLoading && maxSlides > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-amber-600 hover:text-orange-600 p-3 rounded-full shadow-xl border border-amber-200 hover:border-orange-300 transition-all duration-300 hover:scale-110 z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-amber-600 hover:text-orange-600 p-3 rounded-full shadow-xl border border-amber-200 hover:border-orange-300 transition-all duration-300 hover:scale-110 z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </>
          )}

          {/* Dots Navigation */}
          {!isLoading && maxSlides > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: maxSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 w-8 shadow-lg' 
                      : 'bg-amber-200 hover:bg-amber-300 hover:shadow-md'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* زر المزيد */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl border border-amber-300 hover:border-orange-400 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse mx-auto hover:shadow-2xl"
            >
              <span>المزيد من المنتجات</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSlider; 