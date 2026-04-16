const fs = require('fs');

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const editorialStyles = `
    /* === X-SAJU LUXURY EDITORIAL LAYOUT === */
    #report-container {
        font-family: 'Noto Sans KR', sans-serif;
        line-height: 1.8;
        color: #ddd;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
    }
    .report-chapter {
        margin-bottom: 80px;
        position: relative;
    }
    .ch-title {
        font-family: 'Noto Serif KR', serif;
        font-size: 26px;
        font-weight: 700;
        color: var(--gold);
        margin-bottom: 25px;
        letter-spacing: -0.5px;
        border-bottom: 1px solid rgba(199, 167, 106, 0.3);
        padding-bottom: 15px;
    }
    .ch-text {
        font-size: 15px;
        line-height: 1.9;
        margin-bottom: 20px;
        color: #ccc;
        word-break: keep-all;
    }
    .axe-advice {
        background: rgba(199, 167, 106, 0.05);
        border-left: 4px solid var(--gold);
        padding: 25px 30px;
        margin: 40px 0;
        font-size: 15px;
        color: #eee;
        line-height: 1.8;
        border-radius: 0 8px 8px 0;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .report-intro-luxury {
        padding: 80px 20px !important;
        background: radial-gradient(circle at center, rgba(199,167,106,0.1) 0%, transparent 70%);
        border: 1px solid rgba(199, 167, 106, 0.2) !important;
        border-radius: 12px;
    }
    /* ======================================= */
</style>`;

html = html.replace('</style>', editorialStyles);
fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Editorial Styles Added.");
