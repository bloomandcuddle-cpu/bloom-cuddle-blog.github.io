/**
 * Bloom & Cuddle - Lead Magnet Form Handler
 * تأكد أن هذا الملف موجود في: scripts/lead-magnet.js
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Page loaded, initializing form...');
    
    const form = document.getElementById('subscribe-form');
    if (!form) {
        console.error('❌ Form not found!');
        return;
    }
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('🔄 Form submitted');
        
        const emailInput = document.getElementById('mce-EMAIL');
        const submitBtn = document.getElementById('mc-embedded-subscribe');
        const email = emailInput.value.trim();
        
        // التحقق من الإيميل
        if (!email || !email.includes('@') || !email.includes('.')) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // تعطيل الزر
        submitBtn.disabled = true;
        submitBtn.value = 'Sending...';
        
        // ====== الأهم: إرسال لـ MailerLite ======
        console.log('📤 Sending to MailerLite:', email);
        
        if (typeof ml !== 'undefined') {
            console.log('✅ ml is available');
            
            try {
                // الطريقة المباشرة
                ml('webform', '5Spc2L', 'submit', { 
                    email: email 
                });
                
                console.log('✅ MailerLite submission successful');
                
            } catch (error) {
                console.error('❌ MailerLite error:', error);
                
                // طريقة بديلة
                try {
                    ml('form', '5Spc2L', 'submit', { email: email });
                } catch (e) {
                    console.error('❌ Alternative method also failed:', e);
                }
            }
        } else {
            console.error('❌ ml is NOT defined! Check MailerLite script.');
        }
        
        // ====== الانتقال لصفحة الشكر ======
        setTimeout(function() {
            console.log('➡️ Redirecting to thank you page...');
            window.location.href = 'thankpage.html';
        }, 1500); // تأخير 1.5 ثانية
        
    });
    
    console.log('✅ Form initialized successfully');
});

// دالة مساعدة للتحقق
function checkMailerLite() {
    console.log('🔍 Checking MailerLite...');
    console.log('ml exists?', typeof ml !== 'undefined');
    console.log('ml type:', typeof ml);
    
    // اختبار بسيط
    if (typeof ml === 'function') {
        console.log('✅ ml is a function, ready to use');
    } else {
        console.error('❌ ml is not a function!');
    }
}

// تشغيل التحقق عند التحميل
window.addEventListener('load', checkMailerLite);
