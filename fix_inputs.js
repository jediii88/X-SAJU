const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
const uiCss = fs.readFileSync('ui_core.css', 'utf8');

// Replace everything between `body { ... }` and `/* v2.9.1 Original Wonguk Grid */` with the new uiCss.
html = html.replace(/body\s*\{[\s\S]*?\}\s*(?:\.page\s*\{[\s\S]*?\})?\s*(?:\.page\.active\s*\{[\s\S]*?\})?\s*\/\* v2\.9\.1 Original Wonguk Grid \*\//, 
    `body { 
        font-family: 'Noto Sans KR', sans-serif; 
        background-color: #000; color: #fff; margin: 0; padding: 0;
    }

${uiCss}

    /* v2.9.1 Original Wonguk Grid */`);

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Input CSS injected!");