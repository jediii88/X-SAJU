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

html = html.replace('/* v2.9.1 Original Wonguk Grid */', pageStyles + '\n    /* v2.9.1 Original Wonguk Grid */');

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Restored CORE APP LAYOUT");