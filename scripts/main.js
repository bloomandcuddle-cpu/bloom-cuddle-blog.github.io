// دالة لتحميل المكونات في الصفحة
function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
            // بعد تحميل الهيدر، نشغل وظيفة القائمة الهاتف
            if (elementId === 'header-container') {
                initMobileMenu();
            }
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

// دالة لتفعيل القائمة الهاتف (الثلاث خطوط)
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // تبديل حالة القائمة
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.nav-links') && !event.target.closest('.hamburger')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

// دالة لتحميل جميع المكونات
function loadAllComponents() {
    loadComponent('header-container', 'components/header.html');
    loadComponent('footer-container', 'components/footer.html');
}

// تشغيل كل شيء عندما تكون الصفحة جاهزة
document.addEventListener('DOMContentLoaded', function() {
    loadAllComponents();
});

// إعادة تحميل المكونات إذا كان هناك خطأ في الشبكة
window.addEventListener('online', function() {
    console.log('Connection restored, reloading components...');
    loadAllComponents();
});
