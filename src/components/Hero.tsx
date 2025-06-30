'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
  const { t, isRTL } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Carousel slides data
  const slides = [
    // Slide 1: Original Hero Content
    {
      id: 1,
      title: 'مرحباً بك في',
      brandName: 'شاورما تايم',
      subtitle: 'أفضل شاورما في المدينة مع أطيب المأكولات الشرقية الأصيلة المحضرة بحب وعناية خاصة',
      buttonText: 'تصفح القائمة',
      buttonLink: '/products',
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60')",
      showIcon: false,
      iconType: 'none'
    },
    // Slide 2: Fast Delivery Focus
    {
      id: 2,
      title: 'توصيل سريع',
      brandName: 'في 30 دقيقة',
      subtitle: 'نصل إليك في أسرع وقت مع أطيب الشاورما الساخنة والطازجة مباشرة من المطعم إلى بابك',
      buttonText: 'اطلب الآن',
      buttonLink: '/products',
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60')",
      showIcon: true,
      iconType: 'truck'
    },
    // Slide 3: Quality & Fresh Ingredients
    {
      id: 3,
      title: 'مكونات طازجة',
      brandName: 'جودة عالية',
      subtitle: 'نستخدم أجود المكونات الطازجة يومياً من اللحوم المختارة والخضروات الطازجة والتوابل الأصيلة',
      buttonText: 'شاهد القائمة',
      buttonLink: '/products',
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60')",
      showIcon: true,
      iconType: 'award'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Render icon based on type
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'truck':
        return <Truck className="w-10 h-10 text-white" />;
      case 'award':
        return <Award className="w-10 h-10 text-white" />;
      default:
        return null;
    }
  };

  return (
    <section 
      className="relative h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: slides[currentSlide].backgroundImage
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Icon for slides 2 and 3 */}
              {slides[currentSlide].showIcon && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="flex justify-center mb-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    {renderIcon(slides[currentSlide].iconType)}
                  </div>
                </motion.div>
              )}

              <motion.h1 
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {slides[currentSlide].title}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                  {slides[currentSlide].brandName}
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {slides[currentSlide].subtitle}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link href={slides[currentSlide].buttonLink}>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl transition-all duration-300 transform hover:shadow-orange-500/25"
                  >
                    <span className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                      <span>{slides[currentSlide].buttonText}</span>
                      <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 ${isRTL ? 'rotate-180' : ''}`} />
                    </span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Simplified Floating Elements */}
          <div className="absolute top-20 left-10 w-16 h-16 bg-orange-400/10 rounded-full blur-xl" />
          <div className="absolute bottom-32 right-16 w-12 h-12 bg-red-400/10 rounded-full blur-xl" />
          <div className="absolute top-1/3 right-20 w-8 h-8 bg-yellow-400/20 rounded-full blur-lg" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>

      {/* Dots Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-orange-500 w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </motion.div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-red-500"
          initial={{ width: "0%" }}
          animate={{ width: isAutoPlaying ? "100%" : "0%" }}
          transition={{ 
            duration: isAutoPlaying ? 5 : 0, 
            ease: "linear",
            onComplete: () => {
              if (isAutoPlaying) {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
              }
            }
          }}
          key={`${currentSlide}-${isAutoPlaying}`}
        />
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero; 