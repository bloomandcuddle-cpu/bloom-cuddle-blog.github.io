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
    if (document.querySelector('.download-btn')) {
        document.querySelectorAll('.download-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
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
                    forceDownload(fileName, customFileName);
                    trackDownload(customFileName);
                    showDownloadMessage(customFileName);
                }
            });
        });
    }
});

// ⭐⭐⭐ التعديلات هنا (الدالة الجديدة فقط) ⭐⭐⭐
function forceDownload(filePath, customName) {
    fetch(filePath)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);

            // كشف أجهزة iPhone / iPad
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (isIOS) {
                // iOS لا يدعم download — تحويل blob إلى Base64
                const reader = new FileReader();
                reader.onload = function() {
                    const link = document.createElement('a');
                    link.href = reader.result;
                    link.download = customName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
                reader.readAsDataURL(blob);
                return;
            }

            // باقي الأجهزة (Android + Desktop)
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = customName;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(link);
            }, 100);
        })
        .catch(error => {
            console.error('Download error:', error);
            fallbackDownload(filePath, customName);
        });
}

// fallback — فقط إزالة فتح نافذة جديدة
function fallbackDownload(filePath, customName) {
    const timestamp = new Date().getTime();
    const link = document.createElement('a');

    link.href = `${filePath}?t=${timestamp}`;
    link.download = customName;
    // ❌ تمت إزالة link.target = "_blank" لأنه يفتح PDF بدل تحميله
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
}

// دالة تتبع التحميلات
function trackDownload(fileName) {
    console.log('Downloaded:', fileName);
    console.log('Time:', new Date().toLocaleString());
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'PDF',
            'event_label': fileName
        });
    }
    
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: fileName
        });
    }
}

// دالة الإشعار
function showDownloadMessage(fileName) {
    if (!document.querySelector('#download-styles')) {
        const style = document.createElement('style');
        style.id = 'download-styles';
        style.textContent = `
            @keyframes slideInDownload {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutDownload {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .download-notification { animation: slideInDownload 0.3s ease forwards; }
            .download-notification.hiding { animation: slideOutDownload 0.3s ease forwards; }
        `;
        document.head.appendChild(style);
    }
    
    const oldNotifications = document.querySelectorAll('.download-notification');
    oldNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:24px;">📥</span>
            <div>
                <strong style="display:block;margin-bottom:4px;">Downloading...</strong>
                <span style="font-size:14px;opacity:0.9;">${fileName.replace('.pdf', '')}</span>
            </div>
        </div>
    `;
    
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
    
    document.body.appendChild(notification);
    
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
        width: 24px;
        height: 24px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:50%;
    `;
    closeBtn.addEventListener('click', () => {
        notification.classList.add('hiding');
        setTimeout(() => notification.remove(), 300);
    });
    notification.appendChild(closeBtn);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('hiding');
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// تحميل الزر
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('download-btn')) {
        const button = e.target;
        const originalText = button.innerHTML;

        button.innerHTML = '⏳ Preparing download...';
        button.style.opacity = '0.8';
        button.style.cursor = 'wait';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }, 2000);
    }
});
