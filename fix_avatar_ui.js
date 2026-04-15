const fs = require('fs');

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

// 1. Fix the image path issue. It seems the file name in CSS is incorrect.
// The user gave me: 01dd6bee-f1f9-4d7b-8d76-7509736e1c8f.jpg (yesterday)
// Wait, the user just said "그때 내가 준 이미지는 안나오는데". Let's check local media.
