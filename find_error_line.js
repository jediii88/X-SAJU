const fs = require('fs');
const html = fs.readFileSync('/home/node/.openclaw/workspace/X-SAJU_MASTER.html','utf-8');

const scriptMatches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
const allScript = scriptMatches.map(m => m[1]).join('\n');
const lines = allScript.split('\n');
console.log('Total script lines:', lines.length);
console.log('Lines 1510-1545:');
lines.slice(1509, 1545).forEach((l, i) => console.log(1510+i, ':', l.trim().slice(0,120)));
