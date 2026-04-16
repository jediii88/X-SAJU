const fs = require('fs');
let curr = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
let jeom = fs.readFileSync('jeomsin_old.html', 'utf8');

const currStyleMatch = curr.match(/<style>[\s\S]*?<\/style>/);
const jeomStyleMatch = jeom.match(/<style>[\s\S]*?<\/style>/g);

if (currStyleMatch && jeomStyleMatch) {
    // jeom_old has multiple style blocks. Let's combine them.
    const combinedStyles = jeomStyleMatch.join('\n\n');
    curr = curr.replace(currStyleMatch[0], combinedStyles);
    fs.writeFileSync('X-SAJU_MASTER.html', curr);
    console.log("Replaced full CSS with Jeomsin CSS.");
} else {
    console.log("Failed to match styles.");
}
