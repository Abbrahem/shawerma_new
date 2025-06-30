'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Leaf, Shield, Clock3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const DeliverySection = () => {
  const { t, isRTL } = useLanguage();

  const features = [
    {
      icon: Truck,
      titleKey: 'delivery.fastDelivery',
      descKey: 'delivery.fastDeliveryDesc',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Leaf,
      titleKey: 'delivery.freshIngredients',
      descKey: 'delivery.freshIngredientsDesc',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      titleKey: 'delivery.qualityAssured',
      descKey: 'delivery.qualityAssuredDesc',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Clock3,
      titleKey: 'delivery.service247',
      descKey: 'delivery.service247Desc',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('delivery.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('delivery.subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {t(feature.titleKey)}
              </h3>
              
              <p className="text-gray-600 text-center leading-relaxed">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {t('delivery.commitmentTitle')}
            </h3>
            
            <div className="space-y-6">
              <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('delivery.premiumIngredients')}</h4>
                  <p className="text-gray-600">
                    {t('delivery.premiumIngredientsDesc')}
                  </p>
                </div>
              </div>
              
              <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('delivery.hygienicPrep')}</h4>
                  <p className="text-gray-600">
                    {t('delivery.hygienicPrepDesc')}
                  </p>
                </div>
              </div>
              
              <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('delivery.tempControlled')}</h4>
                  <p className="text-gray-600">
                    {t('delivery.tempControlledDesc')}
                  </p>
                </div>
              </div>
              
              <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('delivery.ecoFriendly')}</h4>
                  <p className="text-gray-600">
                    {t('delivery.ecoFriendlyDesc')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Fresh ingredients"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6"
            >
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t('delivery.freshBadge')}</div>
                  <div className="text-sm text-gray-600">{t('delivery.dailySourced')}</div>
                </div>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 w-12 h-12 bg-green-200 rounded-full opacity-60 blur-sm"
            />
            
            <motion.div
              animate={{
                x: [0, 10, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-200 rounded-full opacity-60 blur-sm"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DeliverySection; 