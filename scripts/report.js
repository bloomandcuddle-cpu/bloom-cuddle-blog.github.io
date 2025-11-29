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
        
        if (!reportName) return;

        const report = reports.find(r => r.name === reportName);
        if (!report) return;

        document.title = `${report.title} - Bloom & Cuddle`;

        try {
            const response = await fetch(`reports-content/${reportName}.md`);
            if (!response.ok) throw new Error('File not found');
            
            const markdown = await response.text();
            const html = marked.parse(markdown);
            document.getElementById('reportContent').innerHTML = html;
            
        } catch (error) {
            document.getElementById('reportContent').innerHTML = 
                '<p>⚠️ Unable to load this report. Please try again later.</p>';
        }
    }

    injectSoftCTA() {
        console.log('🔄 injectSoftCTA function called!');
        
        const paragraphs = document.querySelectorAll('#reportContent p');
        console.log('📊 Number of paragraphs found:', paragraphs.length);
        
        if (paragraphs.length > 0) {
            const targetIndex = Math.floor(paragraphs.length * 0.4);
            const safeIndex = Math.max(0, Math.min(targetIndex, paragraphs.length - 1));
            
            console.log('🎯 Target paragraph index:', safeIndex);
            
            const softCTA = `
                <div class="soft-cta" style="background: red; color: white; padding: 20px; margin: 20px 0; border: 3px solid yellow;">
                    <p>🚨 TEST: This is the NEW Soft CTA after 40% of content!</p>
                    <p>If you see this, JavaScript is working! ✅</p>
                    <a href="lead-magnet.html" class="soft-cta-button">Join the Mom List</a>
                </div>
            `;
            
            paragraphs[safeIndex].insertAdjacentHTML('afterend', softCTA);
            console.log('✅ Soft CTA injected after paragraph:', safeIndex + 1);
        } else {
            console.log('❌ No paragraphs found to inject CTA');
        }
    }
}

// تشغيل النظام
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded - Initializing ReportLoader');
    new ReportLoader();
});
