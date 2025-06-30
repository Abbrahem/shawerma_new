'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.menu': { en: 'Menu', ar: 'القائمة' },
  'nav.about': { en: 'About', ar: 'عنا' },
  'nav.contact': { en: 'Contact', ar: 'اتصل بنا' },
  'nav.cart': { en: 'Cart', ar: 'السلة' },
  
  // Hero Section
  'hero.welcome': { en: 'Welcome to', ar: 'مرحباً بكم في' },
  'hero.brandName': { en: 'Shawarma Time', ar: 'شاورما تايم' },
  'hero.title': { en: 'Authentic Middle Eastern Cuisine', ar: 'مأكولات شرق أوسطية أصيلة' },
  'hero.subtitle': { en: 'Experience the authentic taste of Middle Eastern cuisine with our freshly made shawarmas, crafted with love and the finest ingredients.', ar: 'اختبر الطعم الأصيل للمأكولات الشرق أوسطية مع الشاورما الطازجة، المصنوعة بحب وأجود المكونات.' },
  'hero.browseMenu': { en: 'Browse Menu', ar: 'تصفح القائمة' },
  'hero.orderNow': { en: 'Order Now', ar: 'اطلب الآن' },
  'hero.viewMenu': { en: 'View Menu', ar: 'عرض القائمة' },
  
  // About Section
  'about.ourStory': { en: 'Our Story', ar: 'قصتنا' },
  'about.title': { en: 'About Shawarma Time', ar: 'عن شاورما تايم' },
  'about.subtitle': { en: 'Where tradition meets taste', ar: 'حيث يلتقي التقليد بالطعم' },
  'about.description1': { en: 'Welcome to Shawarma Time, where tradition meets taste! Founded in 2025, but the chef staff has 20 years of experience we\'ve been serving authentic Middle Eastern cuisine to our community for over two decades. Our journey began with a simple mission: to share the rich flavors and warm hospitality of Middle Eastern culture through food.', ar: 'مرحباً بكم في شاورما تايم، حيث يلتقي التقليد بالطعم! تأسست في 2025، لكن فريق الطهاة لديه خبرة 20 عاماً، نحن نقدم المأكولات الشرق أوسطية الأصيلة لمجتمعنا لأكثر من عقدين. بدأت رحلتنا بمهمة بسيطة: مشاركة النكهات الغنية والضيافة الدافئة للثقافة الشرق أوسطية من خلال الطعام.' },
  'about.description2': { en: 'From our signature shawarma wraps to our delicious crepes and traditional meals, every item on our menu tells a story of heritage, quality, and passion. We believe that great food brings people together, and we\'re honored to be part of your dining experience.', ar: 'من لفائف الشاورما المميزة إلى الكريب اللذيذ والوجبات التقليدية، كل عنصر في قائمتنا يحكي قصة من التراث والجودة والشغف. نؤمن أن الطعام الرائع يجمع الناس، ونحن فخورون بأن نكون جزءاً من تجربة تناول الطعام الخاصة بك.' },
  'about.madeWithLove': { en: 'Made with Love', ar: 'مصنوع بحب' },
  'about.madeWithLoveDesc': { en: 'Every dish is prepared with passion and traditional family recipes', ar: 'كل طبق يُحضر بشغف ووصفات عائلية تقليدية' },
  'about.familyTradition': { en: 'Family Tradition', ar: 'تقليد عائلي' },
  'about.familyTraditionDesc': { en: 'Three generations of authentic Middle Eastern cooking expertise', ar: 'ثلاثة أجيال من خبرة الطبخ الشرق أوسطي الأصيل' },
  'about.qualityIngredients': { en: 'Quality Ingredients', ar: 'مكونات عالية الجودة' },
  'about.qualityIngredientsDesc': { en: 'We source only the finest and freshest ingredients for our dishes', ar: 'نحصل على أجود وأطازج المكونات لأطباقنا فقط' },
  'about.freshDaily': { en: 'Fresh Daily', ar: 'طازج يومياً' },
  'about.freshDailyDesc': { en: 'All our food is prepared fresh daily with no preservatives', ar: 'جميع طعامنا يُحضر طازجاً يومياً بدون مواد حافظة' },
  'about.yearsExperience': { en: 'Years of Excellence', ar: 'سنوات من التميز' },
  'about.happyCustomers': { en: 'Happy Customers', ar: 'عملاء سعداء' },
  
  // Menu Categories
  'menu.title': { en: 'Our Menu', ar: 'قائمتنا' },
  'menu.subtitle': { en: 'Explore our diverse range of authentic Middle Eastern dishes, crafted with traditional recipes and fresh ingredients.', ar: 'استكشف مجموعتنا المتنوعة من الأطباق الشرق أوسطية الأصيلة، المصنوعة بوصفات تقليدية ومكونات طازجة.' },
  'menu.offers': { en: 'Offers', ar: 'عروض' },
  'menu.offersDesc': { en: 'Special deals and combo offers', ar: 'عروض خاصة وعروض مجمعة' },
  'menu.sandwiches': { en: 'Sandwiches', ar: 'ساندوتشات' },
  'menu.sandwichesDesc': { en: 'Delicious shawarma sandwiches', ar: 'ساندوتشات شاورما لذيذة' },
  'menu.crepes': { en: 'Crepes', ar: 'كريب' },
  'menu.crepesDesc': { en: 'Sweet and savory crepes', ar: 'كريب حلو ومالح' },
  'menu.boxes': { en: 'Boxes', ar: 'صناديق' },
  'menu.boxesDesc': { en: 'Complete meal boxes', ar: 'صناديق وجبات كاملة' },
  'menu.extras': { en: 'Extras', ar: 'إضافات' },
  'menu.extrasDesc': { en: 'Sides and appetizers', ar: 'أطباق جانبية ومقبلات' },
  'menu.meals': { en: 'Meals', ar: 'وجبات' },
  'menu.mealsDesc': { en: 'Full traditional meals', ar: 'وجبات تقليدية كاملة' },
  'menu.viewMenu': { en: 'View Menu', ar: 'عرض القائمة' },
  
  // Delivery Section
  'delivery.title': { en: 'Quality & Delivery', ar: 'الجودة والتوصيل' },
  'delivery.subtitle': { en: 'We\'re committed to delivering not just great food, but an exceptional experience. From farm-fresh ingredients to your table, every step is handled with care.', ar: 'نحن ملتزمون بتقديم ليس فقط طعام رائع، بل تجربة استثنائية. من المكونات الطازجة من المزرعة إلى طاولتك، كل خطوة تُتعامل معها بعناية.' },
  'delivery.fastDelivery': { en: 'Fast Delivery', ar: 'توصيل سريع' },
  'delivery.fastDeliveryDesc': { en: 'Quick and reliable delivery to your doorstep within 30-45 minutes', ar: 'توصيل سريع وموثوق إلى باب منزلك خلال 30-45 دقيقة' },
  'delivery.freshIngredients': { en: 'Fresh Ingredients', ar: 'مكونات طازجة' },
  'delivery.freshIngredientsDesc': { en: 'Locally sourced, organic ingredients prepared fresh daily', ar: 'مكونات محلية وعضوية تُحضر طازجة يومياً' },
  'delivery.qualityAssured': { en: 'Quality Assured', ar: 'جودة مضمونة' },
  'delivery.qualityAssuredDesc': { en: 'Rigorous quality control and food safety standards', ar: 'مراقبة جودة صارمة ومعايير سلامة غذائية' },
  'delivery.service247': { en: '24/7 Service', ar: 'خدمة 24/7' },
  'delivery.service247Desc': { en: 'Available round the clock for your convenience', ar: 'متاح على مدار الساعة لراحتك' },
  'delivery.commitmentTitle': { en: 'Our Commitment to Excellence', ar: 'التزامنا بالتميز' },
  'delivery.premiumIngredients': { en: 'Premium Ingredients', ar: 'مكونات عالية الجودة' },
  'delivery.premiumIngredientsDesc': { en: 'We partner with local farms and trusted suppliers to ensure every ingredient meets our high standards for freshness and quality.', ar: 'نتعاون مع المزارع المحلية والموردين الموثوقين لضمان أن كل مكون يلبي معاييرنا العالية للطازجة والجودة.' },
  'delivery.hygienicPrep': { en: 'Hygienic Preparation', ar: 'تحضير صحي' },
  'delivery.hygienicPrepDesc': { en: 'Our kitchen follows strict hygiene protocols and food safety guidelines to ensure every meal is prepared in a clean, safe environment.', ar: 'مطبخنا يتبع بروتوكولات نظافة صارمة وإرشادات سلامة الغذاء لضمان تحضير كل وجبة في بيئة نظيفة وآمنة.' },
  'delivery.tempControlled': { en: 'Temperature Controlled', ar: 'مُتحكم في درجة الحرارة' },
  'delivery.tempControlledDesc': { en: 'Our delivery vehicles are equipped with temperature control systems to maintain food quality during transport.', ar: 'مركبات التوصيل لدينا مجهزة بأنظمة التحكم في درجة الحرارة للحفاظ على جودة الطعام أثناء النقل.' },
  'delivery.ecoFriendly': { en: 'Eco-Friendly Packaging', ar: 'تغليف صديق للبيئة' },
  'delivery.ecoFriendlyDesc': { en: 'We use biodegradable and recyclable packaging materials to minimize our environmental impact while keeping your food fresh.', ar: 'نستخدم مواد تغليف قابلة للتحلل الحيوي وقابلة لإعادة التدوير لتقليل تأثيرنا البيئي مع الحفاظ على طعامك طازجاً.' },
  'delivery.freshBadge': { en: '100% Fresh', ar: '100% طازج' },
  'delivery.dailySourced': { en: 'Daily Sourced', ar: 'يومياً من المصدر' },
  
  // Footer
  'footer.description': { en: 'Authentic Middle Eastern cuisine served with passion and tradition. Experience the taste of the Middle East in every bite.', ar: 'مأكولات شرق أوسطية أصيلة تُقدم بشغف وتقليد. اختبر طعم الشرق الأوسط في كل قضمة.' },
  'footer.quickLinks': { en: 'Quick Links', ar: 'روابط سريعة' },
  'footer.services': { en: 'Our Services', ar: 'خدماتنا' },
  'footer.hours': { en: 'Operating Hours', ar: 'ساعات العمل' },
  'footer.followUs': { en: 'Follow Us', ar: 'تابعنا' },
  'footer.rights': { en: '© 2025 Shawarma Time. All rights reserved.', ar: '© 2025 شاورما تايم. جميع الحقوق محفوظة.' },
  'footer.madeWith': { en: 'Made with', ar: 'صُنع بـ' },
  'footer.forFood': { en: 'for great food', ar: 'للطعام الرائع' },
  
  // Services
  'service.dineIn': { en: 'Dine In', ar: 'تناول في المكان' },
  'service.takeaway': { en: 'Takeaway', ar: 'طلبات خارجية' },
  'service.delivery': { en: 'Home Delivery', ar: 'توصيل منزلي' },
  'service.catering': { en: 'Catering', ar: 'خدمات الطعام' },
  'service.party': { en: 'Party Orders', ar: 'طلبات الحفلات' },
  'service.corporate': { en: 'Corporate Events', ar: 'فعاليات الشركات' },
  
  // Hours
  'hours.weekdays': { en: 'Mon - Thu: 10:00 AM - 11:00 PM', ar: 'الإثنين - الخميس: 10:00 ص - 11:00 م' },
  'hours.weekend': { en: 'Fri - Sun: 10:00 AM - 12:00 AM', ar: 'الجمعة - الأحد: 10:00 ص - 12:00 ص' },
  
  // Products
  'products.title': { en: 'Our Menu', ar: 'قائمتنا' },
  'products.loading': { en: 'Loading products...', ar: 'جاري تحميل المنتجات...' },
  'products.error': { en: 'Error loading products', ar: 'خطأ في تحميل المنتجات' },
  'products.addToCart': { en: 'Add to Cart', ar: 'إضافة للسلة' },
  'products.price': { en: 'Price', ar: 'السعر' },
  
  // Cart
  'cart.title': { en: 'Shopping Cart', ar: 'سلة التسوق' },
  'cart.empty': { en: 'Your cart is empty', ar: 'سلتك فارغة' },
  'cart.total': { en: 'Total', ar: 'الإجمالي' },
  'cart.checkout': { en: 'Checkout', ar: 'الدفع' },
  'cart.remove': { en: 'Remove', ar: 'إزالة' },
  'cart.quantity': { en: 'Quantity', ar: 'الكمية' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Set document direction based on language
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 