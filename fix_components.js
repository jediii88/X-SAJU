const fs = require('fs');
const html5e = fs.readFileSync('old_5e.html', 'utf8');

// The second style tag in 5e39b6f contains the missing component styles.
const styleBlocks = html5e.match(/<style>([\s\S]*?)<\/style>/g);
if (styleBlocks && styleBlocks.length >= 2) {
    const compCss = styleBlocks[1].replace(/<\/?style>/g, '');
    let currHtml = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
    
    // Inject compCss right before </style>
    currHtml = currHtml.replace(/<\/style>/, compCss + '\n</style>');
    fs.writeFileSync('X-SAJU_MASTER.html', currHtml);
    console.log("Component CSS restored.");
} else {
    console.log("Could not find second style block.");
}