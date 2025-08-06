'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Check, X, Navigation, AlertCircle, RefreshCw, Target, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onClose: () => void;
}

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const useMapEvents = dynamic(() => import('react-leaflet').then(mod => mod.useMapEvents), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, onClose }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number]>([26.8206, 30.8025]); // Default to center of Egypt
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([26.8206, 30.8025]);
  const [leaflet, setLeaflet] = useState<any>(null);
  const [mapKey, setMapKey] = useState(0);
  const [isMapReady, setIsMapReady] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number>(0);
  const [isWatchingLocation, setIsWatchingLocation] = useState<boolean>(false);
  const [autoLocationAttempted, setAutoLocationAttempted] = useState<boolean>(false);
  const watchIdRef = useRef<number | null>(null);

  // Fix Leaflet default markers
  const initLeaflet = async () => {
    if (typeof window !== 'undefined') {
      try {
        const L = await import('leaflet');
        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
        });
        
        setLeaflet(L);
        setIsMapReady(true);
      } catch (error) {
        console.error('Failed to initialize Leaflet:', error);
      }
    }
  };

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar,en&zoom=18&addressdetails=1`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      let address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      // إضافة أقرب معلم شهير إذا وجد
      let landmark = '';
      if (data.address) {
        const parts = [];
        if (data.address.house_number) parts.push(`رقم ${data.address.house_number}`);
        if (data.address.road) parts.push(data.address.road);
        if (data.address.neighbourhood) parts.push(data.address.neighbourhood);
        if (data.address.suburb) parts.push(data.address.suburb);
        if (data.address.quarter) parts.push(data.address.quarter);
        if (data.address.city_district) parts.push(data.address.city_district);
        if (data.address.city || data.address.town) parts.push(data.address.city || data.address.town);
        if (data.address.governorate || data.address.state) parts.push(data.address.governorate || data.address.state);
        if (data.address.country) parts.push(data.address.country);
        // البحث عن معلم شهير
        if (data.address.landmark) landmark = data.address.landmark;
        else if (data.address.attraction) landmark = data.address.attraction;
        else if (data.address.building) landmark = data.address.building;
        else if (data.address.mall) landmark = data.address.mall;
        else if (data.address.theatre) landmark = data.address.theatre;
        else if (data.address.hospital) landmark = data.address.hospital;
        else if (data.address.university) landmark = data.address.university;
        else if (data.address.school) landmark = data.address.school;
        if (parts.length > 0) {
          address = parts.join(', ');
        }
        if (landmark) {
          address += ` (بالقرب من: ${landmark})`;
        }
      }
      setSelectedLocation({ lat, lng, address });
    } catch (error) {
      console.error('Address lookup failed:', error);
      setSelectedLocation({ lat, lng, address: `الإحداثيات: ${lat.toFixed(6)}, ${lng.toFixed(6)}` });
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      // إيقاف مراقبة الموقع عند التأكيد
      stopWatchingLocation();
      
      Swal.fire({
        title: '🎯 تم تأكيد الموقع!',
        text: `دقة التحديد: ${locationAccuracy > 0 ? `${Math.round(locationAccuracy)} متر` : 'غير محدد'}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      onLocationSelect(selectedLocation);
    }
  };

  // دالة عالية الدقة لتحديد الموقع
  const getHighAccuracyLocation = () => {
    setIsLoading(true);
    setLocationError(null);

    // التحقق من دعم المتصفح
    if (!navigator.geolocation) {
      setLocationError('متصفحك لا يدعم خدمة تحديد الموقع');
      setIsLoading(false);
      showLocationHelp();
      return;
    }

    // محاولة سريعة أولاً بدقة متوسطة للاستجابة الفورية
    const quickOptions: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 5000, // 5 ثوانٍ فقط للاستجابة السريعة
      maximumAge: 60000 // قبول موقع محفوظ لمدة دقيقة
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationSuccess(position, 'سريع');
        setIsLoading(false);
        
        // الآن جرب الحصول على دقة أعلى في الخلفية
        setTimeout(() => {
          tryHighAccuracyInBackground();
        }, 1000);
      },
      (error) => {
        console.log('Quick location failed, trying high accuracy...');
        // إذا فشلت المحاولة السريعة، جرب دقة عالية
        tryHighAccuracyDirect();
      },
      quickOptions
    );
  };

  // محاولة دقة عالية مباشرة
  const tryHighAccuracyDirect = () => {
    const highAccuracyOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 ثانية
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationSuccess(position, 'عالية الدقة');
        setIsLoading(false);
      },
      (error) => {
        console.log('High accuracy failed, trying standard...');
        tryStandardAccuracy();
      },
      highAccuracyOptions
    );
  };

  // تحسين الدقة في الخلفية
  const tryHighAccuracyInBackground = () => {
    const highAccuracyOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { accuracy } = position.coords;
        // تحديث فقط إذا كانت الدقة أفضل
        if (!locationAccuracy || (accuracy && accuracy < locationAccuracy)) {
          handleLocationSuccess(position, 'دقة محسنة');
        }
      },
      (error) => {
        console.log('Background high accuracy failed:', error);
      },
      highAccuracyOptions
    );
  };

  // محاولة بدقة متوسطة كبديل
  const tryStandardAccuracy = () => {
    const standardOptions: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 30000 // قبول موقع محفوظ خلال 30 ثانية
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationSuccess(position, 'متوسطة');
      },
      (error) => {
        setIsLoading(false);
        handleLocationError(error);
      },
      standardOptions
    );
  };

  // معالجة نجاح تحديد الموقع
  const handleLocationSuccess = (position: GeolocationPosition, accuracyType: string) => {
    const { latitude, longitude, accuracy } = position.coords;
    const newPos: [number, number] = [latitude, longitude];
    
    setUserPosition(newPos);
    setMarkerPosition(newPos);
    setLocationError(null);
    setLocationAccuracy(accuracy || 0);
    setMapKey(prev => prev + 1);
    
    getAddressFromCoordinates(latitude, longitude);
    
    // رسالة نجاح سريعة وبسيطة
    const accuracyText = accuracy ? `±${Math.round(accuracy)}م` : '';
    
    if (accuracyType === 'سريع') {
      // رسالة خفيفة للتحديد السريع
      Swal.fire({
        title: '📍 تم تحديد موقعك',
        text: `جاري تحسين الدقة... ${accuracyText}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        timerProgressBar: true
      });
    } else if (accuracyType === 'دقة محسنة') {
      // رسالة تحسين الدقة
      Swal.fire({
        title: '🎯 تحسنت دقة الموقع',
        text: `دقة جديدة: ${accuracyText}`,
        icon: 'info',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else {
      // رسالة التحديد النهائي
      Swal.fire({
        title: '✅ تم تحديد موقعك بدقة عالية',
        text: `دقة التحديد: ${accuracyText} - جاهز للتوصيل`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        timerProgressBar: true
      });
    }
  };

  // مراقبة مستمرة للموقع للحصول على دقة أفضل
  const startWatchingLocation = () => {
    if (!navigator.geolocation || isWatchingLocation) return;

    setIsWatchingLocation(true);
    
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000 // تحديث كل 5 ثوانٍ
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // تحديث الموقع فقط إذا كانت الدقة أفضل
        if (!locationAccuracy || (accuracy && accuracy < locationAccuracy)) {
          const newPos: [number, number] = [latitude, longitude];
          setMarkerPosition(newPos);
          setLocationAccuracy(accuracy || 0);
          getAddressFromCoordinates(latitude, longitude);
          
          // إشعار بتحسن الدقة
          if (locationAccuracy && accuracy && accuracy < locationAccuracy) {
            Swal.fire({
              title: '📍 تحسنت دقة الموقع',
              text: `دقة جديدة: ${Math.round(accuracy)} متر`,
              icon: 'info',
              timer: 2000,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            });
          }
        }
      },
      (error) => {
        console.log('Watch position error:', error);
      },
      watchOptions
    );
  };

  // إيقاف مراقبة الموقع
  const stopWatchingLocation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsWatchingLocation(false);
    }
  };

  // معالجة أخطاء تحديد الموقع
  const handleLocationError = (error: GeolocationPositionError) => {
    let errorMessage = '';
    let helpMessage = '';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'تم رفض السماح بالوصول للموقع';
        helpMessage = 'يرجى السماح بتحديد الموقع من إعدادات المتصفح';
        showPermissionDeniedHelp();
        return; // استخدام رسالة خاصة لرفض الإذن
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'تعذر تحديد الموقع الحالي';
        helpMessage = 'تأكد من تفعيل خدمة الموقع وقوة الإشارة';
        break;
      case error.TIMEOUT:
        errorMessage = 'انتهت مهلة تحديد الموقع';
        helpMessage = 'جرب مرة أخرى أو انتقل لمكان مفتوح';
        break;
      default:
        errorMessage = 'حدث خطأ في تحديد الموقع';
        helpMessage = 'يرجى المحاولة مرة أخرى';
        break;
    }
    
    setLocationError(errorMessage);
    showAdvancedLocationError(errorMessage, helpMessage);
  };

  // رسالة خاصة لرفض السماح بالموقع
  const showPermissionDeniedHelp = () => {
    setLocationError('تم رفض السماح بالوصول للموقع');
    
    Swal.fire({
      title: '🔐 مطلوب السماح بتحديد الموقع',
      html: `
        <div style="text-align: right; font-family: Arial, sans-serif;">
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #dc2626;">
            <p style="color: #dc2626; font-weight: bold; margin-bottom: 5px;">❌ المشكلة:</p>
            <p style="color: #7f1d1d;">تم رفض السماح بالوصول لموقعك الجغرافي</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="font-weight: bold; color: #92400e; margin-bottom: 10px;">🔧 الحل السريع:</p>
            <ol style="text-align: right; color: #92400e; margin: 0; padding-right: 20px;">
              <li><strong>اضغط على أيقونة القفل 🔒</strong> بجوار رابط الموقع في المتصفح</li>
              <li><strong>اختر "السماح"</strong> أو "Allow" للموقع</li>
              <li><strong>أعد تحميل الصفحة</strong> بالضغط على F5</li>
              <li><strong>اضغط على زر تحديد الموقع مرة أخرى</strong></li>
            </ol>
          </div>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="font-weight: bold; color: #0284c7; margin-bottom: 10px;">🌐 في متصفحات مختلفة:</p>
            <ul style="text-align: right; color: #0369a1; margin: 0; padding-right: 20px;">
              <li><strong>Chrome:</strong> اضغط على أيقونة الموقع 📍 في شريط العنوان</li>
              <li><strong>Firefox:</strong> اضغط على أيقونة الدرع 🛡️ أو القفل 🔒</li>
              <li><strong>Safari:</strong> اضغط على أيقونة الموقع في شريط العنوان</li>
              <li><strong>Edge:</strong> اضغط على أيقونة القفل 🔒 في شريط العنوان</li>
            </ul>
          </div>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px;">
            <p style="font-weight: bold; color: #16a34a; margin-bottom: 10px;">✅ البدائل المتاحة الآن:</p>
            <ul style="text-align: right; color: #15803d; margin: 0; padding-right: 20px;">
              <li>🖱️ اضغط على أي مكان على الخريطة لتحديد موقعك</li>
              <li>🎯 اسحب العلامة الحمراء لموقعك الدقيق</li>
              <li>🔍 استخدم التكبير للحصول على دقة أفضل</li>
            </ul>
          </div>
          
          <div style="margin-top: 15px; padding: 10px; background: #e7f3ff; border-radius: 8px;">
            <p style="color: #1e40af; font-size: 12px; margin: 0;">
              💡 <strong>نصيحة:</strong> السماح بالموقع يساعدنا في توصيل طلبك بدقة أكبر وسرعة أعلى
            </p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '🔄 جربت السماح، أعد المحاولة',
      cancelButtonText: '📍 سأحدد يدوياً',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'text-right'
      },
      width: '650px'
    }).then((result) => {
      if (result.isConfirmed) {
        // إعادة محاولة تحديد الموقع
        getHighAccuracyLocation();
      } else {
        // عرض نصائح التحديد اليدوي
        showManualLocationTips();
      }
    });
  };

  // عرض رسالة خطأ متقدمة
  const showAdvancedLocationError = (errorMessage: string, helpMessage: string) => {
    Swal.fire({
      title: '⚠️ مشكلة في تحديد الموقع بدقة عالية',
      html: `
        <div style="text-align: right; font-family: Arial, sans-serif;">
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #dc2626;">
            <p style="color: #dc2626; font-weight: bold; margin-bottom: 5px;">المشكلة:</p>
            <p style="color: #7f1d1d;">${errorMessage}</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="font-weight: bold; color: #92400e; margin-bottom: 10px;">💡 للحصول على دقة عالية:</p>
            <ul style="text-align: right; color: #92400e; margin: 0; padding-right: 20px;">
              <li>انتقل لمكان مفتوح (تجنب المباني)</li>
              <li>تأكد من تفعيل GPS في جهازك</li>
              <li>اسمح للموقع في المتصفح</li>
              <li>تأكد من قوة الإنترنت</li>
              <li>انتظر قليلاً للحصول على دقة أفضل</li>
            </ul>
          </div>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px;">
            <p style="font-weight: bold; color: #16a34a; margin-bottom: 10px;">✅ البدائل المتاحة:</p>
            <ul style="text-align: right; color: #15803d; margin: 0; padding-right: 20px;">
              <li>تحديد يدوي عالي الدقة على الخريطة</li>
              <li>استخدام البحث بالعنوان</li>
              <li>إعادة المحاولة بدقة متوسطة</li>
            </ul>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">
            ${helpMessage}
          </p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '🔄 إعادة المحاولة بدقة عالية',
      cancelButtonText: '📍 تحديد يدوي',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'text-right'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        getHighAccuracyLocation();
      } else {
        // عرض نصائح للتحديد اليدوي
        showManualLocationTips();
      }
    });
  };

  // نصائح للتحديد اليدوي الدقيق
  const showManualLocationTips = () => {
    Swal.fire({
      title: '🎯 التحديد اليدوي بدقة عالية',
      html: `
        <div style="text-align: right; font-family: Arial, sans-serif;">
          <div style="background: #e0f7fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 2px solid #00bcd4;">
            <p style="color: #006064; font-weight: bold; margin-bottom: 10px;">✨ لا تقلق! التحديد اليدوي سهل ودقيق</p>
            <p style="color: #00838f; font-size: 14px;">يمكنك تحديد موقعك بدقة عالية باستخدام الخريطة التفاعلية</p>
          </div>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="font-weight: bold; color: #0284c7; margin-bottom: 10px;">🔍 خطوات التحديد الدقيق:</p>
            <ol style="text-align: right; color: #0369a1; margin: 0; padding-right: 20px; line-height: 1.6;">
              <li><strong>كبّر الخريطة</strong> باستخدام علامة + للحصول على تفاصيل أكثر</li>
              <li><strong>ابحث عن معالم مألوفة</strong> مثل المباني أو الشوارع القريبة</li>
              <li><strong>اضغط بدقة</strong> على موقعك الحقيقي على الخريطة</li>
              <li><strong>اسحب العلامة الحمراء</strong> إذا احتجت لتعديل الموقع</li>
            </ol>
          </div>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="font-weight: bold; color: #16a34a; margin-bottom: 10px;">⚡ نصائح للحصول على أفضل دقة:</p>
            <ul style="text-align: right; color: #15803d; margin: 0; padding-right: 20px; line-height: 1.5;">
              <li>🏠 ابحث عن منزلك أو مكتبك بالاسم في خرائط جوجل أولاً</li>
              <li>🎯 استخدم أقصى تكبير للحصول على دقة المتر الواحد</li>
              <li>🛣️ تأكد من أن العلامة على الشارع الصحيح</li>
              <li>🔄 يمكنك إعادة الضغط لتعديل الموقع في أي وقت</li>
            </ul>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px;">
            <p style="font-weight: bold; color: #92400e; margin-bottom: 10px;">📱 مساعدة إضافية:</p>
            <ul style="text-align: right; color: #92400e; margin: 0; padding-right: 20px;">
              <li>إذا كنت في مبنى، اختر المدخل الرئيسي</li>
              <li>إذا كنت في مجمع، اختر البوابة الأقرب</li>
              <li>يمكنك الاتصال بنا إذا احتجت مساعدة إضافية</li>
            </ul>
          </div>
          
          <div style="margin-top: 15px; padding: 10px; background: #f0fdf4; border-radius: 8px; border: 1px solid #16a34a;">
            <p style="color: #15803d; font-size: 12px; margin: 0; text-align: center;">
              💚 <strong>لا تقلق!</strong> سيتمكن فريق التوصيل من الوصول إليك حتى لو كان هناك فرق بسيط في الموقع
            </p>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: '👍 فهمت، سأبدأ التحديد',
      confirmButtonColor: '#16a34a',
      customClass: {
        popup: 'text-right'
      },
      width: '600px'
    });
  };

  // تحديد الموقع التلقائي عند فتح الخريطة
  const autoDetectLocation = async () => {
    if (autoLocationAttempted) return;
    
    setAutoLocationAttempted(true);
    
    // بدء التحديد فوراً بدون رسائل ترحيب
    console.log('Starting immediate location detection...');
    getHighAccuracyLocation();
    
    // بدء مراقبة الموقع للحصول على دقة أفضل بعد 3 ثوان
    setTimeout(() => {
      startWatchingLocation();
    }, 3000);
  };

  // عرض مساعدة تحديد الموقع
  const showLocationHelp = () => {
    Swal.fire({
      title: '📱 تفعيل الموقع عالي الدقة',
      html: `
        <div style="text-align: right; font-family: Arial, sans-serif;">
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="font-weight: bold; color: #0284c7; margin-bottom: 10px;">📱 في الجهاز:</p>
            <ol style="text-align: right; color: #0369a1; margin: 0; padding-right: 20px;">
              <li>إعدادات → الخصوصية والأمان</li>
              <li>خدمات الموقع → تشغيل</li>
              <li>تحسين الدقة → تشغيل</li>
              <li>السماح للمتصفح بالوصول للموقع</li>
            </ol>
          </div>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="font-weight: bold; color: #16a34a; margin-bottom: 10px;">🌐 في المتصفح:</p>
            <ol style="text-align: right; color: #15803d; margin: 0; padding-right: 20px;">
              <li>اضغط على أيقونة القفل/الموقع في شريط العنوان</li>
              <li>اختر "السماح" أو "Allow" للموقع</li>
              <li>اختر "دقة عالية" أو "High Accuracy"</li>
              <li>أعد تحميل الصفحة إذا لزم الأمر</li>
            </ol>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px;">
            <p style="font-weight: bold; color: #92400e; margin-bottom: 10px;">⚡ للدقة الأفضل:</p>
            <ul style="text-align: right; color: #92400e; margin: 0; padding-right: 20px;">
              <li>انتقل لمكان مفتوح</li>
              <li>تأكد من قوة إشارة الإنترنت</li>
              <li>اصبر قليلاً للحصول على أفضل دقة</li>
            </ul>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'فهمت',
      confirmButtonColor: '#f97316',
      customClass: {
        popup: 'text-right'
      }
    });
  };

  // Map click handler component
  const MapEvents = () => {
    if (!useMapEvents) return null;
    
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const newPos: [number, number] = [lat, lng];
        setMarkerPosition(newPos);
        getAddressFromCoordinates(lat, lng);
        
        // إيقاف مراقبة الموقع التلقائي عند التحديد اليدوي
        stopWatchingLocation();
        
        // تكبير الخريطة على الموقع المحدد
        map.setView([lat, lng], Math.max(map.getZoom(), 16), { animate: true });
        
        // إشعار للمستخدم
        Swal.fire({
          title: '📍 تم تحديد الموقع يدوياً',
          text: 'تم تحديد موقعك بنجاح على الخريطة',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      },
    });
    
    return null;
  };

  useEffect(() => {
    const initialize = async () => {
      await initLeaflet();
      // بدء التحديد التلقائي فوراً عند تحميل الخريطة
      setTimeout(() => {
        autoDetectLocation();
      }, 200); // تأخير قصير جداً فقط لضمان تحميل الخريطة
    };
    
    initialize();
    
    // تنظيف عند إغلاق المكون
    return () => {
      stopWatchingLocation();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl overflow-hidden w-full max-w-5xl max-h-[100vh] flex flex-col shadow-2xl"
        style={{ height: '100%', maxHeight: '100vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                تحديد موقع التوصيل بدقة عالية
              </h3>
              <p className="text-gray-600 mt-1">نظام تحديد تلقائي ودقيق للموقع</p>
              {selectedLocation && (
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-green-600 text-sm font-medium">✅ تم تحديد موقعك بنجاح</p>
                  {locationAccuracy > 0 && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      دقة: {Math.round(locationAccuracy)}م
                    </span>
                  )}
                  {isWatchingLocation && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full animate-pulse">
                      <Zap className="w-3 h-3 inline mr-1" />
                      تحسين الدقة...
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                stopWatchingLocation();
                onClose();
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Location Error Warning */}
          {locationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-lg shadow-sm"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-bold">⚠️ مطلوب السماح بتحديد الموقع</p>
                  <p className="text-sm text-red-700 mt-1">{locationError}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={showPermissionDeniedHelp}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                    >
                      🔧 كيفية السماح بالموقع
                    </button>
                    <button
                      onClick={showManualLocationTips}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                    >
                      📍 تحديد يدوي
                    </button>
                    <button
                      onClick={getHighAccuracyLocation}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                    >
                      🔄 إعادة المحاولة
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <Target className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-gray-700 font-medium">🎯 جاري تحديد موقعك الحالي...</p>
                <p className="text-sm text-gray-500 mt-2">سنجد موقعك خلال ثوانٍ قليلة</p>
                <div className="mt-3 bg-green-50 p-2 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700">✅ اسمح للموقع في المتصفح للحصول على أفضل دقة</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="w-full h-[60vh] md:h-[500px]">
            {isMapReady && (
              <MapContainer
                key={mapKey}
                center={userPosition}
                zoom={userPosition[0] !== 26.8206 || userPosition[1] !== 30.8025 ? 17 : 6}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                attributionControl={true}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                  maxZoom={19}
                />
                
                {/* Accuracy Circle */}
                {locationAccuracy > 0 && locationAccuracy < 100 && (
                  <Circle
                    center={markerPosition}
                    radius={locationAccuracy}
                    pathOptions={{
                      color: '#3b82f6',
                      fillColor: '#3b82f6',
                      fillOpacity: 0.1,
                      weight: 2
                    }}
                  />
                )}
                
                <Marker 
                  position={markerPosition}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target;
                      const position = marker.getLatLng();
                      const newPos: [number, number] = [position.lat, position.lng];
                      setMarkerPosition(newPos);
                      getAddressFromCoordinates(position.lat, position.lng);
                      
                      // إيقاف مراقبة الموقع عند السحب اليدوي
                      stopWatchingLocation();
                      
                      Swal.fire({
                        title: '📍 تم تحديث الموقع يدوياً',
                        text: 'تم تحديث موقعك بنجاح',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end'
                      });
                    },
                  }}
                />
                <MapEvents />
              </MapContainer>
            )}
          </div>
          
          {/* Control Buttons */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            {/* High Accuracy Location Button */}
            <button
              onClick={getHighAccuracyLocation}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-3 rounded-full shadow-lg transition-all duration-200 border-2 border-white"
              title="تحديد موقعي بدقة عالية"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Target className="w-5 h-5" />
              )}
            </button>
            
            {/* Standard Location Button */}
            <button
              onClick={tryStandardAccuracy}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-3 rounded-full shadow-lg transition-all duration-200 border-2 border-white"
              title="تحديد سريع (دقة متوسطة)"
            >
              <Navigation className="w-5 h-5" />
            </button>
            
            {/* Watch Location Toggle */}
            <button
              onClick={isWatchingLocation ? stopWatchingLocation : startWatchingLocation}
              className={`${isWatchingLocation 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
              } text-white p-2 rounded-full shadow-lg transition-all duration-200 border-2 border-white`}
              title={isWatchingLocation ? 'إيقاف تحسين الدقة' : 'تحسين مستمر للدقة'}
            >
              <Zap className={`w-4 h-4 ${isWatchingLocation ? 'animate-pulse' : ''}`} />
            </button>
            
            {/* Help Button */}
            <button
              onClick={showLocationHelp}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-2 rounded-full shadow-lg transition-colors border-2 border-white"
              title="مساعدة تحديد الموقع"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start space-x-3">
              <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  📍 العنوان المحدد:
                  {locationAccuracy > 0 && locationAccuracy <= 10 && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      دقة عالية جداً
                    </span>
                  )}
                  {locationAccuracy > 10 && locationAccuracy <= 50 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      دقة عالية
                    </span>
                  )}
                  {locationAccuracy > 50 && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      دقة متوسطة
                    </span>
                  )}
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed bg-white p-4 rounded-lg border-2 border-blue-100">
                  {selectedLocation.address}
                </p>
                <div className="mt-3 text-xs text-gray-500 flex items-center gap-4">
                  <span>الإحداثيات: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</span>
                  {locationAccuracy > 0 && (
                    <span>مستوى الدقة: ±{Math.round(locationAccuracy)} متر</span>
                  )}
                  {isWatchingLocation && (
                    <span className="text-blue-600 animate-pulse">⚡ جاري تحسين الدقة...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex space-x-4 bg-gray-50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirmLocation}
            disabled={!selectedLocation}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg border-2 border-white"
          >
            <Check className="w-5 h-5" />
            <span>تأكيد الموقع وإتمام الطلب 🎯</span>
            {locationAccuracy > 0 && locationAccuracy <= 20 && (
              <span className="ml-2 bg-white text-green-600 text-xs px-2 py-1 rounded-full">
                دقة ممتازة!
              </span>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              stopWatchingLocation();
              onClose();
            }}
            className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-full transition-colors bg-white"
          >
            إلغاء
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LocationPicker; 