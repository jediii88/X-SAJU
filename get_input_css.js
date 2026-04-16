const { execSync } = require('child_process');
const fs = require('fs');
const html = execSync('git show 3ea0dab:X-SAJU_MASTER.html').toString();

const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (cssMatch) {
    fs.writeFileSync('input_css.txt', cssMatch[1]);
}