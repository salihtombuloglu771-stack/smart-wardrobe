const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fb7185"/>
      <stop offset="100%" stop-color="#9f1239"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
  </defs>

  <!-- Background rounded square -->
  <rect width="512" height="512" rx="108" fill="url(#bg)"/>
  <!-- Shine overlay -->
  <rect width="512" height="256" rx="108" fill="url(#shine)"/>

  <!-- Hanger hook (top loop) -->
  <path d="M256,138 C256,116 268,98 288,94 C312,90 330,108 322,130 C316,146 298,152 280,146"
        stroke="white" stroke-width="20" fill="none"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Hanger neck -->
  <line x1="256" y1="140" x2="256" y2="196"
        stroke="white" stroke-width="20" stroke-linecap="round"/>

  <!-- Hanger left arm -->
  <line x1="256" y1="196" x2="98" y2="318"
        stroke="white" stroke-width="20" stroke-linecap="round"/>

  <!-- Hanger right arm -->
  <line x1="256" y1="196" x2="414" y2="318"
        stroke="white" stroke-width="20" stroke-linecap="round"/>

  <!-- Hanger bottom bar -->
  <line x1="98" y1="318" x2="414" y2="318"
        stroke="white" stroke-width="20" stroke-linecap="round"/>

  <!-- Sparkle top-right (large) -->
  <g transform="translate(400,148)">
    <line x1="0" y1="-18" x2="0" y2="18" stroke="rgba(255,255,255,0.9)" stroke-width="5" stroke-linecap="round"/>
    <line x1="-18" y1="0" x2="18" y2="0" stroke="rgba(255,255,255,0.9)" stroke-width="5" stroke-linecap="round"/>
    <line x1="-12" y1="-12" x2="12" y2="12" stroke="rgba(255,255,255,0.55)" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="12" y1="-12" x2="-12" y2="12" stroke="rgba(255,255,255,0.55)" stroke-width="3.5" stroke-linecap="round"/>
  </g>

  <!-- Sparkle top-left (medium) -->
  <g transform="translate(108,200)">
    <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(255,255,255,0.75)" stroke-width="4" stroke-linecap="round"/>
    <line x1="-12" y1="0" x2="12" y2="0" stroke="rgba(255,255,255,0.75)" stroke-width="4" stroke-linecap="round"/>
    <line x1="-8" y1="-8" x2="8" y2="8" stroke="rgba(255,255,255,0.4)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="8" y1="-8" x2="-8" y2="8" stroke="rgba(255,255,255,0.4)" stroke-width="2.5" stroke-linecap="round"/>
  </g>

  <!-- Sparkle bottom-right (small) -->
  <g transform="translate(390,370)">
    <line x1="0" y1="-8" x2="0" y2="8" stroke="rgba(255,255,255,0.65)" stroke-width="3" stroke-linecap="round"/>
    <line x1="-8" y1="0" x2="8" y2="0" stroke="rgba(255,255,255,0.65)" stroke-width="3" stroke-linecap="round"/>
  </g>

  <!-- Dot bottom-left -->
  <circle cx="118" cy="375" r="5" fill="rgba(255,255,255,0.5)"/>

  <!-- Dot center-top area -->
  <circle cx="340" cy="108" r="4" fill="rgba(255,255,255,0.45)"/>
</svg>`;

const outDir = path.join(__dirname, 'frontend', 'public', 'icons');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function generate() {
  const buf = Buffer.from(svg);

  await sharp(buf).resize(512, 512).png().toFile(path.join(outDir, 'icon-512.png'));
  console.log('icon-512.png oluşturuldu');

  await sharp(buf).resize(192, 192).png().toFile(path.join(outDir, 'icon-192.png'));
  console.log('icon-192.png oluşturuldu');

  // Also generate a favicon
  await sharp(buf).resize(32, 32).png().toFile(path.join(__dirname, 'frontend', 'public', 'favicon.png'));
  console.log('favicon.png oluşturuldu');
}

generate().catch(console.error);
