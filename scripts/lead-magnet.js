// كود صفحة الهبوط - نموذج  الاشتراك
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

// كود صفحة الشكر - تحميل الملفات
document.addEventListener('DOMContentLoaded', function() {
    // فقط في صفحة الشكر (تحتوي على أزرار التحميل)
    if (document.querySelector('.download-btn')) {
        document.querySelectorAll('.download-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // تحديد أي ملف سيتم تنزيله بناءً على نص الزر
                let fileName;
                let customFileName;
                
                if (this.textContent.includes('Gas & Reflux')) {
                    fileName = 'downloads/gas-reflux-cheatsheet.pdf';
                    customFileName = 'Gas_and_Reflux_Calming_Guide.pdf';
                } else if (this.textContent.includes('Newborn')) {
                    fileName = 'downloads/newborn-checklist.pdf';
                    customFileName = 'Newborn_Essentials_Checklist.pdf';
                } else {
                    fileName = '';
                    customFileName = '';
                }
                
                if (fileName) {
                    // تنزيل الملف مع اسم مخصص
                    downloadFile(fileName, customFileName);
                    
                    // تتبع التنزيل
                    trackDownload(customFileName);
                    
                    // إظهار رسالة تأكيد
                    showDownloadMessage(customFileName);
                } else {
                    alert('Your download will start now!');
                }
            });
        });
    }
});

// دالة لتنزيل الملفات بأسماء مخصصة
function downloadFile(filePath, customName) {
    // إنشاء رابط مؤقت للتنزيل
    const link = document.createElement('a');
    link.href = filePath;
    link.download = customName; // هذا سيغير اسم الملف عند التنزيل
    link.target = '_blank';
    link.style.display = 'none';
    
    // إضافة الرابط إلى الصفحة والنقر عليه
    document.body.appendChild(link);
    link.click();
    
    // إزالة الرابط بعد النقر
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
}

// دالة لتتبع التحميلات
function trackDownload(fileName) {
    console.log('Downloaded:', fileName);
    console.log('Time:', new Date().toLocaleString());
    
    // يمكنك إضافة تتبع Google Analytics هنا
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'PDF',
            'event_label': fileName
        });
    }
}

// دالة لعرض رسالة تأكيد أنيقة
function showDownloadMessage(fileName) {
    // إنشاء عنصر الإشعار
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-family: 'Inter', sans-serif;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">📥</span>
                <div>
                    <strong>Download Started!</strong>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">${fileName} is downloading...</p>
                </div>
            </div>
        </div>
    `;
    
    // إضافة الأنيميشن
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // إضافة الرسالة إلى الصفحة
    document.body.appendChild(message);
    
    // إزالة الرسالة بعد 3 ثوان
    setTimeout(() => {
        message.firstChild.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(message);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}
