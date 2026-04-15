const fs = require('fs');

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

// 1. 고객 이름 밑에 한자 (아바타 하단 한자)에 특정 색상 넣기
// It is currently:
// descHanja.innerText = `${dayStem}${pillars[1].h[1]}`;
// descHanja.className = elType;
// descHanja.style.color = '#fff';
// Let's remove the forced white color and just let it use the CSS variable of the Wuxing color.

const oldDescLogic = `descHanja.innerText = \`\${dayStem}\${pillars[1].h[1]}\`;
            descHanja.className = elType; // Optional: apply color to Hanja text if we want, but let's keep it white/clean. Actually let's just make the text color gold or white.
            descHanja.style.color = '#fff';`;

const newDescLogic = `descHanja.innerText = \`\${dayStem}\${pillars[1].h[1]}\`;
            descHanja.style.color = 'var(--' + elType + ')';`;

html = html.replace(oldDescLogic, newDescLogic);

// 2. 원국에 보여지는 폰트 더 얇게 하기 (폰트는 Noto Serif KR 그대로)
// The user said "원국에 보여지는 폰트 더 얇게해달라니까. 저거 폰트는 그대로 하되"
// Let's check how .m-hanja is styled.
// Earlier I did: font-weight: 300; letter-spacing: 2px; font-family: 'Noto Serif KR', serif;
// Maybe 300 is not thin enough, or it didn't apply because the font isn't loaded with 300 weight?
// Let's check the Google Fonts import in the HTML.
