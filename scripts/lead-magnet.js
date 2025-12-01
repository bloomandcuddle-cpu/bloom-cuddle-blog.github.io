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
                    // إصلاح: إضافة رأس Content-Disposition عبر fetch
                    forceDownload(fileName, customFileName);
                    
                    // تتبع التنزيل
                    trackDownload(customFileName);
                    
                    // إظهار رسالة تأكيد
                    showDownloadMessage(customFileName);
                }
            });
        });
    }
});

// دالة جديدة لإجبار التحميل بدلاً من العرض
function forceDownload(filePath, customName) {
    // الحل الأفضل: استخدام fetch + blob
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            // إنشاء رابط للتنزيل
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // إعداد الرابط للتنزيل
            link.href = url;
            link.download = customName; // هذا يجبر المتصفح على التنزيل
            link.style.display = 'none';
            
            // إضافة الرابط والنقر عليه
            document.body.appendChild(link);
            link.click();
            
            // تنظيف بعد التنزيل
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        })
        .catch(error => {
            console.error('Download error:', error);
            // إذا فشل fetch، نستخدم الطريقة التقليدية
            fallbackDownload(filePath, customName);
        });
}

// طريقة بديلة إذا فشلت الطريقة الأولى
function fallbackDownload(filePath, customName) {
    // إنشاء رابط عادي مع إضافة timestamp لمنع الكاش
    const timestamp = new Date().getTime();
    const link = document.createElement('a');
    
    // إضافة بارامتر لمنع الكاش
    link.href = `${filePath}?t=${timestamp}`;
    link.download = customName;
    link.target = '_blank';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
}

// دالة لتتبع التحميلات
function trackDownload(fileName) {
    console.log('Downloaded:', fileName);
    console.log('Time:', new Date().toLocaleString());
    
    // تتبع Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'PDF',
            'event_label': fileName
        });
    }
    
    // تتبع Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: fileName
        });
    }
}

// دالة لعرض رسالة تأكيد
function showDownloadMessage(fileName) {
    // إضافة الأنيميشن إذا لم تكن موجودة
    if (!document.querySelector('#download-styles')) {
        const style = document.createElement('style');
        style.id = 'download-styles';
        style.textContent = `
            @keyframes slideInDownload {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutDownload {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .download-notification {
                animation: slideInDownload 0.3s ease forwards;
            }
            .download-notification.hiding {
                animation: slideOutDownload 0.3s ease forwards;
            }
        `;
        document.head.appendChild(style);
    }
    
    // إزالة أي إشعارات سابقة
    const oldNotifications = document.querySelectorAll('.download-notification');
    oldNotifications.forEach(notification => {
        notification.remove();
    });
    
    // إنشاء الإشعار الجديد
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            gap: 12px;
        ">
            <span style="font-size: 24px;">📥</span>
            <div>
                <strong style="display: block; margin-bottom: 4px;">Downloading...</strong>
                <span style="font-size: 14px; opacity: 0.9;">${fileName.replace('.pdf', '')}</span>
            </div>
        </div>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        background: white;
        color: #333;
        padding: 18px 22px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 9999;
        border-left: 5px solid #9D7BEF;
        font-family: 'Inter', sans-serif;
        max-width: 320px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);
    
    // إضافة زر إغلاق
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: #999;
        font-size: 16px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    `;
    closeBtn.addEventListener('click', () => {
        notification.classList.add('hiding');
        setTimeout(() => notification.remove(), 300);
    });
    notification.appendChild(closeBtn);
    
    // إزالة الإشعار تلقائياً بعد 4 ثوان
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('hiding');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

// إضافة مؤشر تحميل على الأزرار
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('download-btn')) {
        const button = e.target;
        const originalText = button.innerHTML;
        
        // تغيير نص الزر مؤقتاً
        button.innerHTML = '⏳ Preparing download...';
        button.style.opacity = '0.8';
        button.style.cursor = 'wait';
        
        // استعادة الزر بعد 2 ثانية
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }, 2000);
    }
});
