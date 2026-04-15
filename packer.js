const fs = require('fs');
const path = require('path');

function pack(outputName = 'SAJU_XFILE_DELIVERY.html') {
    let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
    
    // External Scripts to Inline
    const scripts = [
        { src: 'lunar.js', file: 'lunar.js' },
        { src: 'constants.js', file: 'constants.js' },
        { src: 'calculation_engine.js', file: 'calculation_engine.js' },
        { src: 'saju_database.js', file: 'saju_database.js' },
        { src: 'report_engine.js', file: 'report_engine.js' }
    ];

    scripts.forEach(s => {
        const scriptTag = `<script src="${s.src}"></script>`;
        if (html.includes(scriptTag)) {
            const content = fs.readFileSync(s.file, 'utf8');
            html = html.replace(scriptTag, `<script>\n${content}\n</script>`);
        }
    });

    // Branded Header injection (Optional: can be customized per user)
    html = html.replace('<div class="brand">X-SAJU MASTER</div>', '<div class="brand" style="color:var(--gold); font-weight:900;">Saju X-FILE: TOP SECRET</div>');

    fs.writeFileSync(outputName, html);
    console.log(`Successfully packed into ${outputName}`);
}

if (require.main === module) {
    pack();
}
