const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

// 1. Move Sticky Nav below Avatar Header and make it actually sticky
const navRegex = /<div class="jeomsin-nav">[\s\S]*?<\/script>\n/;
const navMatch = html.match(navRegex);
if(navMatch) {
    html = html.replace(navMatch[0], ''); // remove it from above
    const avatarRegex = /<div class="avatar-header">[\s\S]*?<\/div>\n/;
    html = html.replace(avatarRegex, (match) => {
        return match + '\n        ' + navMatch[0]; // insert below avatar
    });
}

// Update css for jeomsin-nav to be sticky
html = html.replace(/\.jeomsin-nav \{/, `.jeomsin-nav {
            position: sticky;
            top: 0;
            z-index: 100;
            background: var(--bg);`);

// 2. Fix Strength Gauge alignment
const oldGauge = `<div class="gauge-wrap" id="strength-gauge">
                <svg class="gauge-svg" viewBox="0 0 200 100">
                    <defs>
                        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#4e87d9" />
                            <stop offset="50%" stop-color="#c7a76a" />
                            <stop offset="100%" stop-color="#d45a52" />
                        </linearGradient>
                    </defs>
                    <path class="gauge-arc" d="M 20 90 A 80 80 0 0 1 180 90" />
                    <!-- Length of semi circle r=80 is ~251 -->
                    <path class="gauge-fill" id="gauge-path" d="M 20 90 A 80 80 0 0 1 180 90" stroke-dasharray="251" stroke-dashoffset="251" />
                </svg>
                <div class="gauge-needle" id="gauge-needle" style="transform: rotate(-90deg);"></div>
                <div class="gauge-labels"><span>신약</span><span>중화</span><span>신강</span></div>
                <div class="gauge-text" id="strength-text">-</div>
                <div class="gauge-sub" id="strength-sub">에너지 강도</div>
            </div>`;

const newGauge = `<div class="gauge-wrap" id="strength-gauge">
                <div style="position:relative; width:200px; height:110px; display:flex; justify-content:center;">
                    <svg class="gauge-svg" viewBox="0 0 200 100" style="position:absolute; top:0; left:0;">
                        <defs>
                            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#4e87d9" />
                                <stop offset="50%" stop-color="#c7a76a" />
                                <stop offset="100%" stop-color="#d45a52" />
                            </linearGradient>
                        </defs>
                        <path class="gauge-arc" d="M 20 90 A 80 80 0 0 1 180 90" />
                        <path class="gauge-fill" id="gauge-path" d="M 20 90 A 80 80 0 0 1 180 90" stroke-dasharray="251" stroke-dashoffset="251" />
                    </svg>
                    <div class="gauge-needle" id="gauge-needle" style="transform: rotate(-90deg); position:absolute; bottom:20px; left:calc(50% - 2px);"></div>
                </div>
                <div class="gauge-labels" style="margin-top:-10px;"><span>신약</span><span style="color:var(--gold);">중화</span><span>신강</span></div>
                <div class="gauge-text" id="strength-text" style="margin-top: 10px;">-</div>
                <div class="gauge-sub" id="strength-sub">에너지 강도</div>
            </div>`;

html = html.replace(oldGauge, newGauge);

// 3. Fix Yonghee colors (remove hardcoded label colors)
html = html.replace(/<div class="info-label" style="color:var\(--wood\)">용신/g, '<div class="info-label">용신');
html = html.replace(/<div class="info-label" style="color:var\(--fire\)">희신/g, '<div class="info-label">희신');
html = html.replace(/<div class="info-label" style="color:var\(--water\)">기신/g, '<div class="info-label">기신');
html = html.replace(/<div class="info-label" style="color:var\(--metal\)">구신/g, '<div class="info-label">구신');

const yongColorJs = `
        const korE = {wood:"목(木)", fire:"화(火)", earth:"토(土)", metal:"금(金)", water:"수(水)"};
        
        const setYong = (id, key) => {
            const el = document.getElementById(id);
            el.innerText = korE[key];
            el.className = 'info-value ' + key; // applies color text
        };
        setYong('yong-val', yong);
        setYong('hee-val', hee);
        setYong('gi-val', gi);
        setYong('goo-val', goo);
`;

html = html.replace(/const korE = {wood:"목\(木\)", fire:"화\(火\)", earth:"토\(土\)", metal:"금\(金\)", water:"수\(水\)"};\s*document\.getElementById\('yong-val'\)\.innerText = korE\[yong\];\s*document\.getElementById\('hee-val'\)\.innerText = korE\[hee\];\s*document\.getElementById\('gi-val'\)\.innerText = korE\[gi\];\s*document\.getElementById\('goo-val'\)\.innerText = korE\[goo\];/, yongColorJs);

// 4. Center modal text properly and add line-height
html = html.replace(/\.modal-body \{/, `.modal-body {
            line-height: 1.6;
            text-align: left;`);

// 5. Clean up section padding/margin so it doesn't look clumped
html = html.replace(/\.section \{/, `.section {
            padding-top: 60px; /* offset for sticky nav */
            margin-top: -40px;`);

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log('Polished');
