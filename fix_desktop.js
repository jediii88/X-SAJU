const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

// Remove the 600px max-width container that I added earlier
html = html.replace(/\.container \{\s*max-width: 600px;\s*margin: 0 auto;\s*padding-bottom: 50px;\s*\}/g, '.container {\n        width: 100%;\n        max-width: 1200px;\n        margin: 0 auto;\n        padding-bottom: 50px;\n    }');

// Let's add real luxury CSS for the report container
const luxuryCSS = `
    /* === X-SAJU LUXURY EDITORIAL LAYOUT === */
    #report-container {
        font-family: 'Noto Serif KR', serif;
        line-height: 2.0;
        color: #eee;
        max-width: 850px;
        margin: 0 auto;
        padding: 60px 40px;
        background: #050505;
        border: 1px solid #222;
        box-shadow: 0 0 40px rgba(0,0,0,0.8);
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
        padding: 30px 40px;
        margin: 50px 0;
        font-size: 16px;
        font-family: 'Noto Serif KR', serif;
        color: #fff;
        line-height: 1.9;
        box-shadow: inset 0 0 20px rgba(199, 167, 106, 0.05);
    }
    .report-intro-luxury {
        padding: 100px 40px !important;
        background: radial-gradient(circle at center, rgba(199,167,106,0.15) 0%, #000 80%);
        border: 1px solid rgba(199, 167, 106, 0.3) !important;
        border-radius: 0;
        margin-bottom: 80px;
    }
    /* ======================================= */
`;

html = html.replace(/\/\* === X-SAJU LUXURY EDITORIAL LAYOUT === \*\/[\s\S]*?\/\* ======================================= \*\//, luxuryCSS);

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Desktop view fixed and luxury styling enhanced.");
