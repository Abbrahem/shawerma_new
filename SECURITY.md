# 🔐 دليل الأمان - Security Guide

## 🇸🇦 النسخة العربية

### إعداد قواعد Firebase Security Rules

#### 📋 **Firestore Database Rules**
1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروع `shawarma-time1`
3. من القائمة الجانبية اختر `Firestore Database`
4. انقر على تبويب `Rules`
5. انسخ محتوى ملف `firestore.rules` والصقه
6. انقر `Publish` لحفظ التغييرات

#### 📁 **Firebase Storage Rules**
1. في نفس المشروع، اذهب إلى `Storage`
2. انقر على تبويب `Rules`
3. انسخ محتوى ملف `storage.rules` والصقه
4. انقر `Publish` لحفظ التغييرات

### 🛡️ **مستويات الأمان**

#### **للعملاء (Customers)**:
- ✅ قراءة قائمة الطعام والمنتجات
- ✅ إنشاء حساب وتسجيل الدخول
- ✅ إضافة طلبات جديدة
- ✅ قراءة طلباتهم الشخصية فقط
- ✅ تعديل ملفهم الشخصي
- ✅ إضافة تقييمات للمنتجات

#### **للأدمن (Admin)**:
- ✅ جميع صلاحيات العملاء
- ✅ إضافة/تعديل/حذف المنتجات
- ✅ قراءة جميع الطلبات
- ✅ تحديث حالة الطلبات
- ✅ إدارة التقييمات
- ✅ رفع صور المنتجات والمطعم

### 🔑 **بيانات تسجيل الدخول للأدمن**
```
البريد الإلكتروني: admin@shawarmatime.com
كلمة المرور: admin123456
```

---

## 🇺🇸 English Version

### Firebase Security Rules Setup

#### 📋 **Firestore Database Rules**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project `shawarma-time1`
3. Navigate to `Firestore Database` from sidebar
4. Click on `Rules` tab
5. Copy content from `firestore.rules` file and paste it
6. Click `Publish` to save changes

#### 📁 **Firebase Storage Rules**
1. In the same project, go to `Storage`
2. Click on `Rules` tab
3. Copy content from `storage.rules` file and paste it
4. Click `Publish` to save changes

### 🛡️ **Security Levels**

#### **For Customers**:
- ✅ Read menu and products
- ✅ Create account and login
- ✅ Create new orders
- ✅ Read their own orders only
- ✅ Update their profile
- ✅ Add product reviews

#### **For Admin**:
- ✅ All customer permissions
- ✅ Add/edit/delete products
- ✅ Read all orders
- ✅ Update order status
- ✅ Manage reviews
- ✅ Upload product and restaurant images

### 🔑 **Admin Login Credentials**
```
Email: admin@shawarmatime.com
Password: admin123456
```

---

## 🔧 **Technical Details**

### **Collections Structure**:
- `products/` - Menu items and products
- `orders/` - Customer orders
- `users/` - User profiles and authentication
- `reviews/` - Product reviews and ratings
- `coupons/` - Discount coupons
- `restaurant_info/` - Restaurant details and info
- `analytics/` - Website analytics data

### **Storage Structure**:
- `products/{productId}/` - Product images
- `users/{userId}/avatar.*` - User profile pictures
- `restaurant/` - Restaurant photos

### **Security Functions**:
- `isAdmin()` - Check if user is admin
- `isOwner(userId)` - Check if user owns resource
- `isValidOrderData()` - Validate order data
- `isValidImage()` - Validate image uploads

---

## ⚠️ **Important Notes**

1. **Never expose admin credentials** in client-side code
2. **Always validate data** on both client and server side
3. **Monitor Firebase usage** to prevent abuse
4. **Update rules** as your app grows
5. **Test rules thoroughly** before deploying to production

---

## 📞 **Support**

If you need help with security setup, contact the development team or check Firebase documentation:
- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security) 