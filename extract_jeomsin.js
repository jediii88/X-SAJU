const { execSync } = require('child_process');
const fs = require('fs');

const jeomsinHtml = execSync('git show 0c86d3a:X-SAJU_MASTER.html').toString();
fs.writeFileSync('jeomsin_old.html', jeomsinHtml);