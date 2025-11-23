// وظائف مشتركة لصفحتي الهبوط والشكر
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== وظائف صفحة الهبوط =====
    const subscribeForm = document.getElementById("subscribe-form");
    if (subscribeForm) {
        subscribeForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.getElementById("mce-EMAIL").value.trim();
            
            // تحقق من صحة الإيميل أولاً
            if (!isValidEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }
            
            // إيميلشامب endpoint
            const url = "https://gmail.us2.list-manage.com/subscribe/post-json?u=3fb474bb32938e63a769bb905&id=e02877e9b6";
            
            // إنشاء callback فريد لكل عملية
            const uniqueCallback = 'callback_' + Date.now();
            window[uniqueCallback] = function(response) {
                if (response.result === "success") {
                    window.location.href = "thank-you.html";
                } else {
                    alert("Please enter a valid email.");
                }
                // تنظيف الـ callback بعد الاستخدام
                delete window[uniqueCallback];
            };
            
            // إرسال البيانات
            const script = document.createElement("script");
            script.src = `${url}&EMAIL=${encodeURIComponent(email)}&c=${uniqueCallback}`;
            document.body.appendChild(script);
        });
    }
    
    // ===== وظائف صفحة الشكر =====
    const downloadButtons = document.querySelectorAll('.download-btn');
    if (downloadButtons.length > 0) {
        downloadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Your download will start now!');
                // هنا يمكنك إضافة روابط التحميل الحقيقية لاحقاً
            });
        });
    }
    
    // دالة التحقق من صحة الإيميل
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
