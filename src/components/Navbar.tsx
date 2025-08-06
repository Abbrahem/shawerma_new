'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Menu, X, Languages } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useCart();
  const { language, toggleLanguage, t, isRTL } = useLanguage();

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.menu') },
    { href: '#about', label: t('nav.about') },
    { href: '#contact', label: t('nav.contact') },
  ];

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-orange-500 transition-colors">
              Shawarma Time
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Language Toggle & Cart Icon */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}
          >
            {/* Language Toggle Button */}
            {/* زر تغيير اللغة يظهر فقط في الديسكتوب */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors hidden md:flex"
              title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              <div className="flex items-center space-x-1">
                <Languages className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  {language === 'en' ? 'عربي' : 'EN'}
                </span>
              </div>
            </motion.button>

            <Link href="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-orange-600" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Mobile Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="w-full text-left text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Languages className="w-5 h-5" />
              <span>{language === 'en' ? 'عربي' : 'English'}</span>
            </div>
          </button>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar; 