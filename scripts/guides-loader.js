class GuidesLoader {
    constructor() {
        this.init();
    }

    init() {
        this.displayReportCards();
    }

    displayReportCards() {
        const container = document.getElementById('reportsContainer');
        
        if (!container) return;

        // إنشاء جميع البطاقات مرة واحدة ثم إضافتها
        const cardsHTML = reports.map(report => `
            <div class="report-card">
                <img src="${report.cover}" alt="${report.title}">
                <h3>${report.title}</h3>
                <p>${report.description}</p>
                <a href="report.html?name=${report.name}" class="cta-button">Read Guide</a>
            </div>
        `).join('');

        container.innerHTML = cardsHTML;
    }
}

// تشغيل النظام في guides.html
document.addEventListener('DOMContentLoaded', () => {
    new GuidesLoader();
});
