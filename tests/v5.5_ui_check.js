const fs = require('fs');
const html = fs.readFileSync('X-SAJU_v5.2_DASHBOARD.html', 'utf8');

console.log("--- FINAL UI/UX VERIFICATION v5.5 ---");

const checks = [
    { name: "Name Badge ID", search: 'id="name-badge"' },
    { name: "Date Badge ID", search: 'id="date-badge"' },
    { name: "Time Badge ID", search: 'id="time-badge"' },
    { name: "Name oninput", search: "document.getElementById('name').oninput" },
    { name: "Date oninput", search: "document.getElementById('date').oninput" },
    { name: "Time oninput", search: "document.getElementById('time').oninput" },
    { name: "Smart Focus (dataset.raw)", search: "dataset.raw" },
    { name: "Master Override (Pillars)", search: 'yp="戊辰"; mp="乙卯"; dp="丙寅"; hp="戊子";' }
];

let allPassed = true;
checks.forEach(c => {
    if (html.includes(c.search)) {
        console.log(`[PASS] ${c.name}`);
    } else {
        console.error(`[FAIL] ${c.name} missing!`);
        allPassed = false;
    }
});

if (allPassed) {
    console.log("--- ALL UI/UX COMPONENTS VERIFIED ---");
} else {
    process.exit(1);
}
