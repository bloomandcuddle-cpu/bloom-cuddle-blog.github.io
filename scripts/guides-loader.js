// js/guides-loader.js - هذا ليعرض البطاقات في guides.html
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

        reports.forEach(report => {
            container.innerHTML += `
                <div class="report-card">
                    <img src="${report.cover}" alt="${report.title}">
                    <h3>${report.title}</h3>
                    <p>${report.description}</p>
                    <a href="report.html?name=${report.name}" class="cta-button">Read Guide</a>
                </div>
            `;
        });
    }
}

// تشغيل النظام في guides.html
document.addEventListener('DOMContentLoaded', () => {
    new GuidesLoader();
});
