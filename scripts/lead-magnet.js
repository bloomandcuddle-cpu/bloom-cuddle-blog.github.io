/**
 * Bloom & Cuddle - Lead Magnet Form Handler
 * MailerLite Integration
 */

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initLeadMagnetForm();
});

/**
 * تهيئة نموذج الاشتراك
 */
function initLeadMagnetForm() {
    const form = document.getElementById('subscribe-form');
    const emailInput = document.getElementById('user-email');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!form || !emailInput) {
        console.error('Form elements not found');
        return;
    }
    
    form.addEventListener('submit', handleFormSubmit);
    
    // تحسين تجربة المستخدم
    emailInput.addEventListener('input', function() {
        this.style.borderColor = '#ddd';
    });
}

/**
 * معالجة إرسال النموذج
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('user-email');
    const submitBtn = document.getElementById('submit-btn');
    const email = emailInput.value.trim();
    
    // التحقق من الإيميل
    if (!validateEmail(email)) {
        showError('Please enter a valid email address.', emailInput);
        return;
    }
    
    // تعطيل الزر أثناء الإرسال
    disableSubmitButton(submitBtn);
    
    // إرسال البيانات لـ MailerLite
    submitToMailerLite(email)
        .then(() => {
            // الانتقال لصفحة الشكر
            redirectToThankYouPage();
        })
        .catch(error => {
            console.error('Submission error:', error);
            showError('Something went wrong. Please try again.', emailInput);
            enableSubmitButton(submitBtn);
        });
}

/**
 * التحقق من صحة الإيميل
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * إرسال البيانات لـ MailerLite
 */
function submitToMailerLite(email) {
    return new Promise((resolve, reject) => {
        if (typeof ml === 'undefined') {
            reject(new Error('MailerLite not loaded'));
            return;
        }
        
        try {
            // إرسال البيانات للنموذج المخفي
            ml('webform', '5Spc2L', 'submit', { 
                email: email,
                // يمكن إضافة حقول إضافية هنا
                // name: document.getElementById('name')?.value,
                // resubscribe: true
            });
            
            // تأخير لحفظ البيانات أولاً
            setTimeout(() => {
                resolve();
            }, 300);
            
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * التوجيه لصفحة الشكر
 */
function redirectToThankYouPage() {
    // الانتقال لصفحة الشكر
    window.location.href = 'thankpage.html';
    
    // بديل: فتح في نافذة جديدة
    // window.open('thankpage.html', '_blank');
}

/**
 * تعطيل زر الإرسال
 */
function disableSubmitButton(button) {
    button.disabled = true;
    button.value = 'Sending...';
    button.style.opacity = '0.7';
    button.style.cursor = 'not-allowed';
}

/**
 * تفعيل زر الإرسال
 */
function enableSubmitButton(button) {
    button.disabled = false;
    button.value = '👉 Send Me My Free Resource';
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
}

/**
 * عرض رسالة خطأ
 */
function showError(message, inputElement) {
    alert(message); // يمكن استبدالها بعرض رسالة في الصفحة
    
    if (inputElement) {
        inputElement.style.borderColor = '#ff4757';
        inputElement.focus();
        
        // إزالة اللون بعد 3 ثواني
        setTimeout(() => {
            inputElement.style.borderColor = '#ddd';
        }, 3000);
    }
}

/**
 * تتبع التحويل (اختياري)
 */
function trackConversion(eventName = 'lead_form_submit') {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName);
    }
    
    // Google Tag Manager
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': eventName,
            'form_type': 'lead_magnet'
        });
    }
}
