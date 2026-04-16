const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

// Insert container CSS right before /* v2.9.1 Original Wonguk Grid */
html = html.replace(/\/\* v2\.9\.1 Original Wonguk Grid \*\//, 
    `.container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        box-sizing: border-box;
    }

    /* v2.9.1 Original Wonguk Grid */`);

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Container CSS injected for perfect alignment.");