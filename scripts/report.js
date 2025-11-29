class ReportLoader {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadReportContent();
        this.injectSoftCTA();
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
            
        } catch (error) {
            console.error('Error loading report:', error);
            document.getElementById('reportContent').innerHTML = 
                '<p>⚠️ Unable to load this report. Please try again later.</p>';
        }
    }

    injectSoftCTA() {
        // حقن الـ CTA مباشرة بعد تحميل المحتوى
        const paragraphs = document.querySelectorAll('#reportContent p');
        
        if (paragraphs.length >= 3) {
            const softCTA = `
                <div class="soft-cta">
                    <p>Get future newborn guides delivered to your inbox</p>
                    <a href="lead-magnet.html" class="soft-cta-link">Join the Mom List</a>
                </div>
            `;
            paragraphs[2].insertAdjacentHTML('afterend', softCTA);
        }
    }
}

// تشغيل النظام
document.addEventListener('DOMContentLoaded', () => {
    new ReportLoader();
});
