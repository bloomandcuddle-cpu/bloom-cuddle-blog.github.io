// scripts/report.js - النسخة النهائية الصحيحة
class ReportLoader {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadReportContent();
        this.injectSoftCTA(); // ⭐ هذه الدالة تضيف CTA بعد الفقرة الثالثة
    }

    async loadReportContent() {
        const params = new URLSearchParams(window.location.search);
        const reportName = params.get('name');
        
        if (!reportName) {
            console.log('No report name specified');
            return;
        }

        // البحث عن التقرير في القائمة (من reports-list.js)
        const report = reports.find(r => r.name === reportName);
        if (!report) {
            console.log('Report not found:', reportName);
            return;
        }

        // تحديث عنوان الصفحة
        document.title = `${report.title} - Bloom & Cuddle`;

        try {
            // تحميل محتوى Markdown
            const response = await fetch(`reports-content/${reportName}.md`);
            if (!response.ok) throw new Error('File not found');
            
            const markdown = await response.text();
            // تحويل Markdown إلى HTML
            const html = marked.parse(markdown);
            // عرض المحتوى في الصفحة
            document.getElementById('reportContent').innerHTML = html;
            
        } catch (error) {
            console.error('Error loading report:', error);
            document.getElementById('reportContent').innerHTML = 
                '<p>⚠️ Unable to load this report. Please try again later.</p>';
        }
    }

    // ⭐ ⭐ ⭐ هذه الدالة تضيف CTA بعد الفقرة الثالثة ⭐ ⭐ ⭐
    injectSoftCTA() {
        setTimeout(() => {
            const paragraphs = document.querySelectorAll('#reportContent p');
            console.log('Found paragraphs:', paragraphs.length);
            
            if (paragraphs.length >= 3) {
                const softCTA = `
                    <div class="soft-cta">
                        <p>Get future newborn guides delivered to your inbox</p>
                        <a href="lead-magnet.html" class="soft-cta-link">Join the Mom List</a>
                    </div>
                `;
                // إضافة CTA بعد الفقرة الثالثة مباشرة
                paragraphs[2].insertAdjacentHTML('afterend', softCTA);
                console.log('✅ Soft CTA injected after 3rd paragraph');
            } else {
                console.log('❌ Not enough paragraphs for CTA');
            }
        }, 800); // وقت أطول لضمان تحميل المحتوى
    }
}

// تشغيل النظام عندما تكون الصفحة جاهزة
document.addEventListener('DOMContentLoaded', () => {
    // ننتظر قليلاً لضمان تحميل الهيدر والفوتر أولاً
    setTimeout(() => {
        new ReportLoader();
    }, 300);
});
