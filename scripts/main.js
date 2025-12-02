// ===== نظام تحميل المكونات =====
class ComponentLoader {
    constructor() {
        this.components = {
            'header-container': 'components/header.html',
            'footer-container': 'components/footer.html'
        };
        this.init();
    }

    // تهيئة النظام
    init() {
        this.loadAllComponents();
        this.setupEventListeners();
    }

    // دالة محسنة لتحميل المكونات
    async loadComponent(elementId, filePath) {
        try {
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
            }
            
            const html = await response.text();
            const element = document.getElementById(elementId);
            
            if (element) {
                element.innerHTML = html;
                
                // تفعيل الوظائف بعد تحميل الهيدر
                if (elementId === 'header-container') {
                    this.setupMobileMenu();
                    this.setupHeaderInteractions();
                }
                
                // تفعيل الوظائف بعد تحميل الفوتر
                if (elementId === 'footer-container') {
                    this.setupFooterInteractions();
                }
                
                console.log(`✅ ${filePath} loaded successfully`);
            } else {
                console.warn(`⚠️ Element #${elementId} not found`);
            }
        } catch (error) {
            console.error(`❌ Error loading ${filePath}:`, error);
            this.handleLoadError(elementId, error);
        }
    }

    // تحميل جميع المكونات
    async loadAllComponents() {
        const loadPromises = Object.entries(this.components).map(
            ([elementId, filePath]) => this.loadComponent(elementId, filePath)
        );
        
        await Promise.allSettled(loadPromises);
    }

    // ===== نظام القائمة الهاتف =====
    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (!hamburger || !navLinks) return;

        // تبديل القائمة
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // إغلاق القائمة عند تغيير حجم النافذة
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ===== وظائف الهيدر الإضافية =====
    setupHeaderInteractions() {
        // تأثير التمرير على الهيدر
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.main-header');
            if (!header) return;

            if (window.scrollY > 100) {
                header.style.background = 'rgba(250, 249, 247, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'var(--warm-white)';
                header.style.backdropFilter = 'none';
            }

            // إخفاء/إظهار الهيدر عند التمرير
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = window.scrollY;
        });

        // تأثيرات الروابط
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // ===== وظائف الفوتر =====
    setupFooterInteractions() {
        // تأثيرات روابط الفوتر
        document.querySelectorAll('.footer-section a').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });

        // سنة التحديث التلقائية
        const yearElement = document.querySelector('.footer-bottom p');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
        }
    }

    // ===== معالجة الأخطاء =====
    handleLoadError(elementId, error) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #666;">
                    <p>⚠️ Unable to load component</p>
                    <small>${error.message}</small>
                </div>
            `;
        }
    }

    // ===== إعداد مستمعي الأحداث =====
    setupEventListeners() {
        // إعادة التحميل عند استعادة الاتصال
        window.addEventListener('online', () => {
            console.log('🌐 Connection restored, reloading components...');
            this.loadAllComponents();
        });

        // إعادة المحاولة عند فشل التحميل
        window.addEventListener('focus', () => {
            const header = document.getElementById('header-container');
            if (header && header.innerHTML.trim() === '') {
                console.log('🔄 Refocus detected, reloading components...');
                this.loadAllComponents();
            }
        });
    }
}

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', function() {
    new ComponentLoader();  // ← الإصلاح الوحيد هنا
});

// ===== وظائف مساعدة عالمية =====
window.App = {
    reloadComponents: function() {
        new ComponentLoader();
    },
    
    // لإعادة تحميل مكون محدد
    reloadComponent: function(elementId, filePath) {
        const loader = new ComponentLoader();
        loader.loadComponent(elementId, filePath);
    }
};
