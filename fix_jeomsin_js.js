const fs = require('fs');
const jeom = fs.readFileSync('jeomsin_old.html', 'utf8');
let current = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const jsMatch = jeom.match(/\/\/ 2\. 만세력 \(정밀 복구\)[\s\S]*?(?=\/\/ 3\. 관계 그리드)/);
if (jsMatch) {
    const jeomsinJs = jsMatch[0];
    current = current.replace(/\/\/ 4\. v2\.9\.1 Original Grid Layout \(수직 5열 그리드\)[\s\S]*?(?=\/\/ 3\. 관계 그리드)/, jeomsinJs + "\n    ");
}

fs.writeFileSync('X-SAJU_MASTER.html', current);
console.log("Jeomsin JS rendering restored!");