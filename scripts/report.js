class ReportLoader {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadReportContent();
        // ⬇️ نزيد الوقت لضمان اكتمال معالجة Markdown
        setTimeout(() => {
            this.injectSoftCTA();
        }, 500);
    }

    async loadReportContent() {
        const params = new URLSearchParams(window.location.search);
        const reportName = params.get('name');
        
        if (!reportName) {
            console.log('No report name specified');
            return;
        }

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
        const paragraphs = document.querySelectorAll('#reportContent p');
        console.log('🔍 عدد الفقرات الفعلي:', paragraphs.length);
        
        if (paragraphs.length > 0) {
            // حساب 40% من عدد الفقرات
            const targetIndex = Math.floor(paragraphs.length * 0.4);
            console.log('🎯 الفهرس المستهدف:', targetIndex);
            
            const safeIndex = Math.max(0, Math.min(targetIndex, paragraphs.length - 1));
            
            const softCTA = `
                <div class="soft-cta" style="border: 3px solid red; background: yellow; padding: 20px;">
                    <p>🎯 <strong>هذا CTA بعد 40% من المحتوى!</strong></p>
                    <p>تم إدراجه بعد الفقرة رقم ${safeIndex + 1} من ${paragraphs.length}</p>
                    <a href="lead-magnet.html" class="soft-cta-link">Join the Mom List</a>
                </div>
            `;
            
            paragraphs[safeIndex].insertAdjacentHTML('afterend', softCTA);
            console.log('✅ تم إضافة CTA بعد الفقرة:', safeIndex + 1);
        } else {
            console.log('❌ لم يتم العثور على فقرات - إعادة المحاولة...');
            // إعادة المحاولة بعد وقت إضافي
            setTimeout(() => this.injectSoftCTA(), 300);
        }
    }
}

// تشغيل النظام
document.addEventListener('DOMContentLoaded', () => {
    new ReportLoader();
});
