/**
 * Bloom & Cuddle - Lead Magnet Form Handler
 * MailerLite Integration
 * يحافظ على التصميم الأصلي
 */

// تهيئة عند  تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initLeadMagnetForm();
});

function initLeadMagnetForm() {
    const form = document.getElementById('subscribe-form');
    
    if (!form) {
        console.error('Form not found');
        return;
    }
    
    // استخدام الـ IDs الأصلية
    const emailInput = document.getElementById('mce-EMAIL');
    const submitBtn = document.getElementById('mc-embedded-subscribe');
    
    form.addEventListener('submit', handleFormSubmit);
    
    // إضافة CSS بسيط لإصلاح أي مشاكل
    fixCSSIssues();
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('mce-EMAIL');
    const submitBtn = document.getElementById('mc-embedded-subscribe');
    const email = emailInput.value.trim();
    
    // التحقق من الإيميل
    if (!validateEmail(email)) {
        showError('Please enter a valid email address.', emailInput);
        return;
    }
    
    // حفظ النص الأصلي للزر
    const originalBtnText = submitBtn.value;
    
    // تعطيل الزر مؤقتاً
    submitBtn.disabled = true;
    submitBtn.value = 'Sending...';
    
    // إرسال لـ MailerLite
    try {
        if (typeof ml !== 'undefined') {
            ml('webform', '5Spc2L', 'submit', { 
                email: email
            });
            
            // الانتظار قليلاً ثم الانتقال
            setTimeout(function() {
                window.location.href = 'thankpage.html';
            }, 300);
            
        } else {
            throw new Error('MailerLite not loaded');
        }
    } catch (error) {
        console.error('Error:', error);
        
        // إعادة تفعيل الزر
        submitBtn.disabled = false;
        submitBtn.value = originalBtnText;
        
        alert('Something went wrong. Please try again.');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(message, inputElement) {
    // طريقة بسيطة لعرض الخطأ
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.innerHTML = `<span style="color: #ff4757; font-size: 14px;">${message}</span>`;
    errorDiv.style.marginTop = '10px';
    
    // إضافة بعد النموذج
    const form = document.getElementById('subscribe-form');
    form.parentNode.insertBefore(errorDiv, form.nextSibling);
    
    // إزالة بعد 5 ثواني
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function fixCSSIssues() {
    // إصلاح أي مشاكل CSS قد تظهر
    const style = document.createElement('style');
    style.textContent = `
        /* إصلاحات عامة */
        #subscribe-form {
            position: relative !important;
            z-index: 1 !important;
        }
        
        /* تأكد أن النموذج المخفي لا يؤثر على التصميم */
        .ml-embedded {
            display: none !important;
        }
        
        /* الحفاظ على تصميم المدخلات */
        #mce-EMAIL, #mc-embedded-subscribe {
            position: relative !important;
            visibility: visible !important;
            opacity: 1 !important;
            transform: none !important;
        }
        
        /* منع أي تأثير من JavaScript */
        .ml-form-embedContainer,
        .ml-form-embedWrapper {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
        }
    `;
    document.head.appendChild(style);
}
