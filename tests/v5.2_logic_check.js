// Logic Verification Script for v5.4
const fs = require('fs');
const html = fs.readFileSync('X-SAJU_v5.2_DASHBOARD.html', 'utf8');

console.log("--- TESTING v5.4 FULL STACK ---");

// 1. Check if AXE_DATA is assigned correctly
if (html.includes('AXE_DATA = [')) {
    console.log("[PASS] AXE_DATA global assignment found.");
} else {
    console.error("[FAIL] AXE_DATA global assignment NOT found.");
}

// 2. Check for Validation Badges
if (html.includes('id="name-badge"') && html.includes('id="date-badge"') && html.includes('id="time-badge"')) {
    console.log("[PASS] Validation badge IDs restored.");
} else {
    console.error("[FAIL] Validation badge IDs missing.");
}

// 3. Check for Event Listeners (Live Formatting)
if (html.includes("document.getElementById('name').addEventListener('input'")) {
    console.log("[PASS] Name validation listener restored.");
} else {
    console.error("[FAIL] Name validation listener missing.");
}

if (html.includes("document.getElementById('date').addEventListener('blur'")) {
    console.log("[PASS] Date formatting (blur) listener restored.");
} else {
    console.error("[FAIL] Date formatting listener missing.");
}

// 4. Check for Engine Logic (Smart Focus)
if (html.includes('dIn.dataset.raw')) {
    console.log("[PASS] Smart Focus (dataset.raw) logic confirmed.");
} else {
    console.error("[FAIL] Smart Focus logic missing.");
}

console.log("--- TEST COMPLETE ---");
