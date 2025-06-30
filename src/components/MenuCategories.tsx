'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const MenuCategories = () => {
  const { t, isRTL } = useLanguage();

  const categories = [
    {
      nameKey: 'menu.offers',
      descKey: 'menu.offersDesc',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      gradient: 'from-red-500 to-orange-500',
      link: 'offers'
    },
    {
      nameKey: 'menu.sandwiches',
      descKey: 'menu.sandwichesDesc',
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      gradient: 'from-orange-500 to-yellow-500',
      link: 'sandwiches'
    },
    {
      nameKey: 'menu.crepes',
      descKey: 'menu.crepesDesc',
      image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      gradient: 'from-yellow-500 to-green-500',
      link: 'crepes'
    },
    {
      nameKey: 'menu.boxes',
      descKey: 'menu.boxesDesc',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      gradient: 'from-green-500 to-blue-500',
      link: 'boxes'
    },
    {
      nameKey: 'menu.extras',
      descKey: 'menu.extrasDesc',
      image: 'https://images.unsplash.com/photo-1541691551820-7f8e6b88c548?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      gradient: 'from-blue-500 to-purple-500',
      link: 'extras'
    },
    {
      nameKey: 'menu.meals',
      descKey: 'menu.mealsDesc',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      gradient: 'from-purple-500 to-pink-500',
      link: 'meals'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('menu.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('menu.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category, index) => (
            <motion.div key={category.nameKey} variants={itemVariants}>
              <Link href={`/products?category=${category.link}`}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer"
                >
                  {/* Background Image */}
                  <div className="relative h-64 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundImage: `url(${category.image})` }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80 transition-opacity duration-300 group-hover:opacity-70`} />
                    
                    {/* Category Name */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.h3
                        className="text-3xl font-bold text-white text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {t(category.nameKey)}
                      </motion.h3>
                    </div>
                    
                    {/* Hover Arrow */}
                    <motion.div
                      className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  
                  {/* Description */}
                  <div className="p-6">
                    <p className="text-gray-600 text-center font-medium">
                      {t(category.descKey)}
                    </p>
                    
                    {/* View More Button */}
                    <motion.div
                      className="mt-4 flex items-center justify-center text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ x: isRTL ? -5 : 5 }}
                    >
                      <span className={isRTL ? 'ml-2' : 'mr-2'}>{t('menu.viewMenu')}</span>
                      <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </motion.div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MenuCategories; 