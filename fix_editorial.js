const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const luxuryCSS = `
    /* === X-SAJU LUXURY EDITORIAL LAYOUT === */
    #report-container {
        font-family: 'Noto Serif KR', serif;
        line-height: 2.0;
        color: #eee;
        max-width: 850px;
        margin: 0 auto;
        padding: 40px 20px;
        background: #000;
    }
    .report-chapter {
        margin-bottom: 100px;
        position: relative;
        padding-top: 40px;
        border-top: 1px solid rgba(199, 167, 106, 0.2);
    }
    .ch-title {
        font-family: 'Noto Serif KR', serif;
        font-size: 32px;
        font-weight: 900;
        color: var(--gold);
        margin-bottom: 35px;
        letter-spacing: -1px;
        line-height: 1.3;
    }
    .ch-text {
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 16px;
        line-height: 2.0;
        margin-bottom: 25px;
        color: #ddd;
        word-break: keep-all;
        text-align: justify;
    }
    .axe-advice {
        background: linear-gradient(135deg, rgba(199, 167, 106, 0.1) 0%, rgba(0,0,0,0) 100%);
        border-left: 4px solid var(--gold);
        padding: 30px 20px;
        margin: 50px 0;
        font-size: 16px;
        font-family: 'Noto Serif KR', serif;
        color: #fff;
        line-height: 1.9;
        box-shadow: inset 0 0 20px rgba(199, 167, 106, 0.05);
    }
    .report-intro-luxury {
        padding: 80px 20px !important;
        background: radial-gradient(circle at center, rgba(199,167,106,0.15) 0%, #000 80%);
        border: 1px solid rgba(199, 167, 106, 0.3) !important;
        border-radius: 0;
        margin-bottom: 80px;
    }
    /* ======================================= */
`;

html = html.replace('</style>', luxuryCSS + '\n</style>');
fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Safely added Editorial Layout without breaking classes.");