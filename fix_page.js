const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const pageStyles = `
    /* === CORE APP LAYOUT === */
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding-bottom: 50px;
    }
    .page {
        display: none;
    }
    .page.active {
        display: block;
    }
    /* ======================= */
`;

if (!html.includes('.page {') && !html.includes('.page.active')) {
    html = html.replace('/* === X-SAJU LUXURY EDITORIAL LAYOUT === */', pageStyles + '\n    /* === X-SAJU LUXURY EDITORIAL LAYOUT === */');
    fs.writeFileSync('X-SAJU_MASTER.html', html);
    console.log("Fixed page routing CSS.");
} else {
    console.log("Page styles already exist or not applied.");
}
