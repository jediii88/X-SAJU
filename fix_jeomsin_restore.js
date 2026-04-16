const fs = require('fs');
const jeom = fs.readFileSync('jeomsin_old.html', 'utf8');
let current = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

// 1. Extract Jeomsin CSS
const cssMatch = jeom.match(/\/\* 점신 스타일 만세력 그리드 \*\/[\s\S]*?(?=\.fortune-scroll)/);
if (cssMatch) {
    const jeomsinCss = cssMatch[0];
    // Replace current wonguk-container-v20 CSS
    current = current.replace(/\/\* v2\.9\.1 Original Wonguk Grid \*\/[\s\S]*?(?=\/\* Luck Cards \*\/)/, jeomsinCss + "\n    ");
}

// 2. Extract Jeomsin JS render logic
const jsMatch = jeom.match(/\/\/ 2\. 만세력 \(점신 스타일\)[\s\S]*?(?=\/\/ 3\. 관계 그리드)/);
if (jsMatch) {
    const jeomsinJs = jsMatch[0];
    // Replace current grid render logic
    current = current.replace(/\/\/ 4\. v2\.9\.1 Original Grid Layout \(수직 5열 그리드\)[\s\S]*?(?=\/\/ 3\. 관계 그리드)/, jeomsinJs + "\n    ");
}

// 3. Make sure to keep max-width 1000px
current = current.replace(/max-width: 600px;/, 'max-width: 1000px;');

fs.writeFileSync('X-SAJU_MASTER.html', current);
console.log("Jeomsin aesthetic restored!");