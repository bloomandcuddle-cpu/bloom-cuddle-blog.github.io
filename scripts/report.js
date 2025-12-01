class ReportLoader {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadReportContent();
        this.injectSoftCTA();
        this.setupBackToTop();
        this.setupScrollEffects();
    }

    async loadReportContent() {
        const params = new URLSearchParams(window.location.search);
        const reportName = params.get('name');
        
        if (!reportName) {
            console.log('No report name specified');
            return;
        }

        // البحث عن التقرير في القائمة
        const report = reports.find(r => r.name === reportName);
        if (!report) {
            console.log('Report not found:', reportName);
            return;
        }

        document.title = `${report.title} - Bloom & Cuddle`;

        try {
            const response = await fetch(`reports-content/${reportName}.md`);
            if (!response.ok) throw new Error('File not found');
            
            const markdown = await response.text();
            const html = marked.parse(markdown);
            document.getElementById('reportContent').innerHTML = html;
            
            // إضافة تأثيرات للصور بعد تحميل المحتوى
            this.setupImageEffects();
            
        } catch (error) {
            console.error('Error loading report:', error);
            document.getElementById('reportContent').innerHTML = 
                '<p>⚠️ Unable to load this report. Please try again later.</p>';
        }
    }

    injectSoftCTA() {
        const paragraphs = document.querySelectorAll('#reportContent p');
        
        if (paragraphs.length > 0) {
            // حساب 40% من عدد الفقرات
            const targetIndex = Math.floor(paragraphs.length * 0.4);
            
            // التأكد من أن الفهرس ضمن النطاق
            const safeIndex = Math.max(0, Math.min(targetIndex, paragraphs.length - 1));
            
            const softCTA = `
                <div class="soft-cta">
                    <p>Get future newborn guides delivered to your inbox</p>
                    <a href="lead-magnet.html" class="soft-cta-button">Join the Mom List</a>
                </div>
            `;
            
            // إدراج الـ CTA بعد نهاية الفقرة مباشرة
            paragraphs[safeIndex].insertAdjacentHTML('afterend', softCTA);
        }
    }

    setupBackToTop() {
        // إنشاء زر العودة للأعلى
        const backToTopButton = document.createElement('button');
        backToTopButton.id = 'backToTop';
        backToTopButton.className = 'back-to-top';
        backToTopButton.innerHTML = '↑ العودة للأعلى';
        backToTopButton.setAttribute('aria-label', 'العودة للأعلى');
        backToTopButton.style.display = 'none';
        backToTopButton.style.opacity = '0';
        backToTopButton.style.transform = 'translateY(10px)';
        backToTopButton.style.transition = 'opacity 0.3s, transform 0.3s';
        
        // إضافة الزر إلى الصفحة
        document.body.appendChild(backToTopButton);
        
        // التحكم في ظهور/اختفاء الزر عند التمرير
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'block';
                
                // تأثير ظهور سلس
                setTimeout(() => {
                    backToTopButton.style.opacity = '1';
                    backToTopButton.style.transform = 'translateY(0)';
                }, 10);
            } else {
                backToTopButton.style.opacity = '0';
                backToTopButton.style.transform = 'translateY(10px)';
                
                // إخفاء بعد الانتهاء من التلاشي
                setTimeout(() => {
                    if (window.scrollY <= 300) {
                        backToTopButton.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        // حدث النقر للعودة للأعلى
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // تأثير عند النقر
            backToTopButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                backToTopButton.style.transform = '';
            }, 200);
        });
        
        // تأثيرات hover
        backToTopButton.addEventListener('mouseenter', () => {
            backToTopButton.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        backToTopButton.addEventListener('mouseleave', () => {
            backToTopButton.style.transform = window.scrollY > 300 ? 'translateY(0) scale(1)' : '';
        });
    }

    setupImageEffects() {
        const images = document.querySelectorAll('.report-article img');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // إضافة تأثير إضافي للصور
                    entry.target.classList.add('loaded');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        images.forEach(img => {
            // إعدادات أولية للصور
            img.style.opacity = '0';
            img.style.transform = 'translateY(20px)';
            img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            // إضافة تأثير تأخير لصور متعددة
            const index = Array.from(images).indexOf(img);
            img.style.transitionDelay = `${index * 0.1}s`;
            
            imageObserver.observe(img);
        });
    }

    setupScrollEffects() {
        // تأثيرات للعناوين عند التمرير
        const headings = document.querySelectorAll('.report-article h2, .report-article h3');
        
        const headingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // إضافة تأثير للعناوين الجانبية
                    if (entry.target.tagName === 'H2') {
                        entry.target.style.borderRightWidth = '6px';
                        setTimeout(() => {
                            entry.target.style.borderRightWidth = '4px';
                        }, 300);
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '-50px 0px -50px 0px'
        });
        
        headings.forEach(heading => {
            heading.style.transition = 'all 0.4s ease';
            headingObserver.observe(heading);
        });
        
        // تأثير لصندوق الـ CTA عند التمرير
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.3
        });
        
        // إضافة تأثير لـ CTA الموجود
        const ctaElements = document.querySelectorAll('.soft-cta, .strong-cta');
        ctaElements.forEach(cta => {
            cta.style.opacity = '0';
            cta.style.transform = 'translateY(20px)';
            cta.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            ctaObserver.observe(cta);
        });
    }
}

// تشغيل النظام
document.addEventListener('DOMContentLoaded', () => {
    new ReportLoader();
    
    // إضافة تأثيرات للصفحة بأكملها
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
