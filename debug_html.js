const fs = require('fs');

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
if (html.includes('.page {')) {
    console.log(".page class EXISTS in HTML");
} else {
    console.log(".page class MISSING");
}
if (html.includes('.page.active {')) {
    console.log(".page.active class EXISTS in HTML");
} else {
    console.log(".page.active class MISSING");
}
if (html.includes('id="step-1" class="page active"')) {
    console.log("step-1 HAS CORRECT CLASSES");
}
if (html.includes('id="step-2" class="page"')) {
    console.log("step-2 HAS CORRECT CLASSES");
}