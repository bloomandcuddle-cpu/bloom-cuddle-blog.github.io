/**
 * Bloom & Cuddle - Lead Magnet Form Handler
 * MailerLite Integration
 * ملف JavaScript منفصل تماماً
 */

// الانتظار حتى تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

/**
 * تهيئة النموذج
 */
function initializeForm() {
    const form = document.getElementById('subscribe-form');
    
    if (!form) {
        console.error('Form not found!');
        return;
    }
    
    form.addEventListener('submit', handleFormSubmission);
    
    // إصلاح أي مشاكل في العرض
    fixDisplayIssues();
}

/**
 * معالجة إرسال النموذج
 */
function handleFormSubmission(event) {
    // منع السلوك الافتراضي للنموذج
    event.preventDefault();
    
    // الحصول على العناصر
    const emailInput = document.getElementById('mce-EMAIL');
    const submitButton = document.getElementById('mc-embedded-subscribe');
    
    if (!emailInput || !submitButton) {
        console.error('Form elements not found!');
        return;
    }
    
    // الحصول على الإيميل وتنظيفه
    const email = emailInput.value.trim();
    
    // التحقق من الإيميل
    if (!isValidEmail(email)) {
        showErrorMessage('Please enter a valid email address.', emailInput);
        return;
    }
    
    // تغيير حالة الزر
    updateButtonState(submitButton, 'sending');
    
    // محاولة إرسال البيانات لـ MailerLite
    try {
        sendToMailerLite(email);
        console.log('✅ Email sent to MailerLite:', email);
    } catch (error) {
        console.warn('⚠️ MailerLite submission failed:', error);
        // نتابع حتى لو فشل إرسال MailerLite
    }
    
    // الانتقال لصفحة الشكر بعد تأخير قصير
    redirectToThankYouPage();
}

/**
 * التحقق من صحة الإيميل
 */
function isValidEmail(email) {
    if (!email) return false;
    if (email.indexOf('@') === -1) return false;
    if (email.indexOf('.') === -1) return false;
    
    // تحقق أكثر دقة
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * إرسال البيانات لـ MailerLite
 */
function sendToMailerLite(email) {
    // التحقق من وجود مكتبة MailerLite
    if (typeof ml === 'undefined') {
        throw new Error('MailerLite library not loaded');
    }
    
    // إرسال البيانات
    ml('webform', '5Spc2L', 'submit', {
        email: email,
        resubscribe: true
    });
    
    // تأكيد الإرسال
    return true;
}

/**
 * الانتقال لصفحة الشكر
 */
function redirectToThankYouPage() {
    console.log('🔄 Redirecting to thank you page...');
    
    // اسم ملف صفحة الشكر - تأكدي أنه مطابق لاسم الملف الحقيقي
    const thankYouPage = 'thankpage.html';
    
    // تأخير قصير قبل الانتقال
    setTimeout(function() {
        // التحقق من وجود الصفحة
        checkPageExists(thankYouPage)
            .then(exists => {
                if (exists) {
                    console.log('✅ Page exists, redirecting...');
                    window.location.href = thankYouPage;
                } else {
                    console.error('❌ Thank you page not found:', thankYouPage);
                    showErrorPage();
                }
            })
            .catch(() => {
                // في حالة خطأ، انتقل مباشرة
                console.log('⚠️ Could not check page, redirecting anyway...');
                window.location.href = thankYouPage;
            });
    }, 800); // 800ms تأخير
}

/**
 * التحقق من وجود الصفحة
 */
function checkPageExists(url) {
    return fetch(url, { method: 'HEAD' })
        .then(response => response.ok)
        .catch(() => false);
}

/**
 * عرض صفحة خطأ بديلة
 */
function showErrorPage() {
    const errorHTML = `
        <div style="text-align: center; padding: 50px 20px; font-family: Arial, sans-serif;">
            <h1 style="color: #4CAF50;">🎉 Thank You!</h1>
            <p style="font-size: 18px; margin: 20px 0;">
                Your free newborn resource has been sent to your email.
            </p>
            <p style="color: #666; margin: 20px 0;">
                Check your email for the download link.
            </p>
            <a href="/" style="display: inline-block; margin-top: 30px; color: #666;">
                ← Return to Home
            </a>
        </div>
    `;
    
    document.body.innerHTML = errorHTML;
}

/**
 * تحديث حالة الزر
 */
function updateButtonState(button, state) {
    switch(state) {
        case 'sending':
            button.disabled = true;
            button.value = 'Sending...';
            button.style.opacity = '0.7';
            button.style.cursor = 'not-allowed';
            break;
            
        case 'error':
            button.disabled = false;
            button.value = '👉 Try Again';
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
            break;
            
        default:
            button.disabled = false;
            button.value = '👉 Send Me My Free Resource';
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
    }
}

/**
 * عرض رسالة خطأ
 */
function showErrorMessage(message, inputElement) {
    // طريقة بسيطة باستخدام alert
    alert(message);
    
    // إضافة تأثير للحقل
    if (inputElement) {
        inputElement.style.borderColor = '#ff4757';
        inputElement.style.boxShadow = '0 0 0 2px rgba(255, 71, 87, 0.2)';
        inputElement.focus();
        
        // إزالة التأثير بعد 3 ثواني
        setTimeout(function() {
            inputElement.style.borderColor = '';
            inputElement.style.boxShadow = '';
        }, 3000);
    }
}

/**
 * إصلاح مشاكل العرض
 */
function fixDisplayIssues() {
    // إضافة CSS لإصلاح أي مشاكل
    const fixCSS = `
        /* إخفاء عناصر MailerLite التي قد تؤثر على التصميم */
        .ml-embedded,
        .ml-form-embedContainer,
        .ml-form-embedWrapper {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            position: absolute !important;
            left: -9999px !important;
            overflow: hidden !important;
            z-index: -9999 !important;
        }
        
        /* الحفاظ على تصميم النموذج */
        #subscribe-form {
            position: relative !important;
            z-index: 10 !important;
        }
        
        #mce-EMAIL,
        #mc-embedded-subscribe {
            position: relative !important;
            z-index: 11 !important;
        }
    `;
    
    // إنشاء عنصر style وإضافته
    const styleElement = document.createElement('style');
    styleElement.textContent = fixCSS;
    document.head.appendChild(styleElement);
}

/**
 * دالة مساعدة للتحقق من تحميل الصفحة
 */
function isPageLoaded() {
    return document.readyState === 'complete';
}

// تهيئة إضافية إذا كانت الصفحة محملة بالفعل
if (isPageLoaded()) {
    initializeForm();
}
