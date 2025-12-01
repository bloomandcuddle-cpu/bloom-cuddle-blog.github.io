// كود صفحة الهبوط - نموذج الاشتراك
document.getElementById("subscribe-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("mce-EMAIL").value;

    // Mailchimp JSONP endpoint
    const url =
      "https://gmail.us2.list-manage.com/subscribe/post-json?u=3fb474bb32938e63a769bb905&id=e02877e9b6&c=callback";

    // JSONP callback
    window.callback = function(response) {
        if (response.result === "success") {
            window.location.href = "thankpage.html";
        } else {
            alert("Please enter a valid email.");
        }
    };

    const script = document.createElement("script");
    script.src = `${url}&EMAIL=${encodeURIComponent(email)}`;
    document.body.appendChild(script);
});

// كود صفحة الشكر -  تحميل الملفات
document.addEventListener('DOMContentLoaded', function() {
    // فقط في صفحة الشكر (تحتوي على أزرار التحميل)
    if (document.querySelector('.download-btn')) {
        document.querySelectorAll('.download-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // الحصول على رابط التحميل الحقيقي (يمكن استبدال # بالروابط الفعلية)
                const downloadUrl = this.getAttribute('href');
                
                if (downloadUrl && downloadUrl !== '#') {
                    // بدء التحميل الفعلي
                    window.location.href = downloadUrl;
                } else {
                    // عرض رسالة للمستخدم
                    alert('Your download will start now!');
                    
                    // هنا يمكن إضافة روابط التحميل الفعلية
                    // مثال:
                    // const fileName = this.textContent.includes('Gas & Reflux') 
                    //     ? 'gas-reflux-cheatsheet.pdf' 
                    //     : 'newborn-checklist.pdf';
                    // window.location.href = `downloads/${fileName}`;
                }
            });
        });
    }
});
