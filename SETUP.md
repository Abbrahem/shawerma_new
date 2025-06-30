# 🚀 إعداد سريع - Shawarma Time

## 📋 المتطلبات
- Node.js 18+
- MongoDB (محلي أو MongoDB Atlas)

## ⚡ التشغيل السريع

### 1. تنصيب المكتبات
```bash
npm install
```

### 2. إعداد MongoDB

**الخيار الأول: MongoDB محلي**
```bash
# تنصيب MongoDB على النظام
# تشغيل خدمة MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb  # macOS
```

**الخيار الثاني: MongoDB Atlas (سحابي)**
1. إنشاء حساب في [MongoDB Atlas](https://www.mongodb.com/atlas)
2. إنشاء cluster جديد
3. الحصول على connection string

### 3. متغيرات البيئة
إنشاء ملف `.env.local`:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/shawarma-time
# أو للـ Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shawarma-time

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. إنشاء مستخدم Admin
```bash
node src/scripts/createAdminMongoDB.js
```

### 5. تشغيل المشروع
```bash
npm run dev
```

### 6. الوصول للموقع
- الموقع الرئيسي: http://localhost:3000
- لوحة الإدارة: http://localhost:3000/admin

## 🔑 بيانات الدخول الافتراضية
- **البريد الإلكتروني**: admin@shawarmatime.com
- **كلمة المرور**: admin123

---

## 🔧 استكشاف الأخطاء

### خطأ اتصال MongoDB
```bash
# تحقق من تشغيل MongoDB
sudo systemctl status mongod

# تشغيل MongoDB
sudo systemctl start mongod
```

### مشاكل JWT
- تأكد من وجود `JWT_SECRET` في `.env.local`
- امسح localStorage في المتصفح عند مشاكل تسجيل الدخول

### مشاكل البناء
```bash
# مسح cache
rm -rf .next
npm run build
```

---

## 📚 الميزات الجديدة
✅ MongoDB بدلاً من Firebase  
✅ JWT Authentication  
✅ bcryptjs لتشفير كلمات المرور  
✅ API Routes محمية  
✅ نفس التصميم والوظائف  

## 🎯 المتحققات التالية
- [ ] إضافة validation أقوى
- [ ] تحسين أمان API
- [ ] إضافة rate limiting
- [ ] تحسين error handling 