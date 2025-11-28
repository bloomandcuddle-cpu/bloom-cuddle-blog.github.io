class ReportLoader {
    async loadReportContent() {
        // هذا الكود يقرأ اسم التقرير من الرابط
        // ثم يحمل ملف الـ Markdown 
        // ثم يحوله إلى HTML
        // ثم يعرضه في الصفحة
    }

    injectMidCTA() {
        // هذا الكود يضيف الـ CTA بعد الفقرة الثالثة
    }
}
// scripts/report.js
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
        
        if (!reportName) return;

        const report = reports.find(r => r.name === reportName);
        if (!report) return;

        document.title = `${report.title} - Bloom & Cuddle`;

        try {
            const response = await fetch(`reports-content/${reportName}.md`);
            const markdown = await response.text();
            const html = marked.parse(markdown);
            document.getElementById('reportContent').innerHTML = html;
            
        } catch (error) {
            document.getElementById('reportContent').innerHTML = 
                '<p>⚠️ Unable to load this report.</p>';
        }
    }

    // ⭐ ⭐ ⭐ هذه الدالة تضيف CTA بعد الفقرة الثالثة ⭐ ⭐ ⭐
    injectSoftCTA() {
        setTimeout(() => {
            const paragraphs = document.querySelectorAll('#reportContent p');
            
            if (paragraphs.length >= 3) {
                const softCTA = `
                    <div class="soft-cta">
                        <p>Get future newborn guides delivered to your inbox</p>
                        <a href="lead-magnet.html" class="soft-cta-link">Join the Mom List</a>
                    </div>
                `;
                // إضافة CTA بعد الفقرة الثالثة مباشرة
                paragraphs[2].insertAdjacentHTML('afterend', softCTA);
            }
        }, 500);
    }
}

// تشغيل النظام
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new ReportLoader();
    }, 300);
});
