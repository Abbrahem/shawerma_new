'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Zap } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onOrderNow: () => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onAddToCart, onOrderNow }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl group"
    >
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {product.category}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
            {product.price} LE
          </span>
        </div>

        {/* Quick Add Button (appears on hover) */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddToCart}
          className="absolute bottom-4 right-4 w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price and Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-orange-600">
              {product.price} LE
            </span>
            <span className="text-xs text-gray-500">
              {product.category}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            {/* Order Now Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOrderNow}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-4 h-4" />
              <span>Order Now</span>
            </motion.button>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddToCart}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-orange-100 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-red-100 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 delay-100" />
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 