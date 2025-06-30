import Swal from 'sweetalert2';

// Success Alert - for successful operations
export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'تم',
    confirmButtonColor: '#f97316', // Orange color to match theme
    timer: 3000,
    timerProgressBar: true,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

// Error Alert - for error messages
export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'حسناً',
    confirmButtonColor: '#f97316', // Orange color to match theme
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

// Warning Alert - for validation messages
export const showWarningAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'حسناً',
    confirmButtonColor: '#f97316', // Orange color to match theme
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

// Confirmation Alert - for delete confirmations
export const showConfirmAlert = (title: string, text: string) => {
  return Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'نعم، احذف',
    cancelButtonText: 'إلغاء',
    confirmButtonColor: '#dc2626', // Red for delete
    cancelButtonColor: '#6b7280', // Gray for cancel
    reverseButtons: true,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

// Order Success Alert - special alert for order confirmation
export const showOrderSuccessAlert = (orderData: {
  customerName: string;
  orderId: string;
  total: number;
  customerAddress: string;
  customerPhone: string;
}) => {
  const { customerName, orderId, total, customerAddress, customerPhone } = orderData;
  
  return Swal.fire({
    icon: 'success',
    title: `شكراً ${customerName}! 🎉`,
    html: `
      <div style="text-align: right; direction: rtl; font-family: 'Arial', sans-serif;">
        <p style="font-size: 18px; margin-bottom: 15px; color: #059669;">
          <strong>تم تأكيد طلبك بنجاح!</strong>
        </p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 10px; margin: 10px 0;">
          <p style="margin: 5px 0;"><strong>رقم الطلب:</strong> ${orderId.slice(-6).toUpperCase()}</p>
          <p style="margin: 5px 0;"><strong>إجمالي المطلوب:</strong> ${total} جنيه</p>
          <p style="margin: 5px 0;"><strong>سيتم التوصيل خلال:</strong> 30-45 دقيقة</p>
        </div>
        <div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 10px 0;">
          <p style="margin: 5px 0;"><strong>العنوان:</strong> ${customerAddress}</p>
          <p style="margin: 5px 0;"><strong>رقم الهاتف:</strong> +20${customerPhone}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">
          سنتواصل معك قريباً لتأكيد الطلب
        </p>
      </div>
    `,
    confirmButtonText: 'ممتاز! 🚀',
    confirmButtonColor: '#f97316',
    width: '500px',
    timer: 8000,
    timerProgressBar: true,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

// Info Alert - for general information
export const showInfoAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'حسناً',
    confirmButtonColor: '#f97316', // Orange color to match theme
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
}; 