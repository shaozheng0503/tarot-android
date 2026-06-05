#!/usr/bin/env node
/**
 * 生成应用图标:深紫径向背景 + 金色四角星(✦)+ 柔光。
 * 直接按各密度尺寸渲染(无缩放损失),写入 android 的 mipmap 资源,
 * 并生成 Android 8+ 的自适应图标(adaptive-icon)。
 *
 * 用法: node scripts/gen-icon.mjs
 */
import zlib from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RES = join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

// ---------- PNG 编码 ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit, RGBA
  const stride = w * 4 + 1;
  const raw = Buffer.alloc(stride * h);
  for (let y = 0; y < h; y++) rgba.copy(raw, y * stride + 1, y * w * 4, (y + 1) * w * 4);
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// ---------- 绘制 ----------
const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => Math.round(a + (b - a) * t);

const GOLD = [232, 197, 71];
const GOLD_GLOW = [201, 162, 39];
const BG_IN = [42, 20, 80];   // 中心紫
const BG_OUT = [13, 4, 32];   // 边缘深紫

function genIcon(size, { filled, reach = 0.37, round = false }) {
  const buf = Buffer.alloc(size * size * 4);
  const c = size / 2;
  const R = size * reach;       // 星芒长度
  const w0 = R * 0.2;           // 中心半宽
  const coreR = w0 * 1.05;      // 中心核(略大于半宽即可,避免根部凸起)
  const aa = size * 0.004 + 0.6;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - c, dy = y + 0.5 - c;
      const ax = Math.abs(dx), ay = Math.abs(dy);
      const dist = Math.hypot(dx, dy);
      let r, g, b, a;
      if (filled) {
        const t = Math.min(1, dist / (size * 0.62));
        r = lerp(BG_IN[0], BG_OUT[0], t); g = lerp(BG_IN[1], BG_OUT[1], t); b = lerp(BG_IN[2], BG_OUT[2], t); a = 255;
      } else { r = 0; g = 0; b = 0; a = 0; }
      // 柔光
      const glow = Math.pow(Math.max(0, 1 - dist / (R * 1.7)), 2) * 0.6;
      if (glow > 0) {
        r = lerp(r, GOLD_GLOW[0], glow);
        g = lerp(g, GOLD_GLOW[1], glow);
        b = lerp(b, GOLD_GLOW[2], glow);
        if (!filled) a = Math.max(a, Math.round(glow * 255));
      }
      // 四角星(竖芒 + 横芒 + 中心核)
      let cov = 0;
      if (ay <= R) { const allow = w0 * (1 - ay / R); cov = Math.max(cov, smooth(allow + aa, allow - aa, ax)); }
      if (ax <= R) { const allow = w0 * (1 - ax / R); cov = Math.max(cov, smooth(allow + aa, allow - aa, ay)); }
      cov = Math.max(cov, smooth(coreR + aa, coreR - aa, dist));
      if (cov > 0) {
        r = lerp(r, GOLD[0], cov); g = lerp(g, GOLD[1], cov); b = lerp(b, GOLD[2], cov);
        if (!filled) a = Math.max(a, Math.round(cov * 255));
      }
      // 圆形遮罩(round 版本)
      if (round) { const m = smooth(c, c - aa, dist); a = Math.round(a * m); }
      const o = (y * size + x) * 4;
      buf[o] = r; buf[o + 1] = g; buf[o + 2] = b; buf[o + 3] = a;
    }
  }
  return encodePNG(size, size, buf);
}

// ---------- 输出 ----------
const DENSITIES = [
  ['mdpi', 48, 108], ['hdpi', 72, 162], ['xhdpi', 96, 216],
  ['xxhdpi', 144, 324], ['xxxhdpi', 192, 432],
];

for (const [d, legacy, fg] of DENSITIES) {
  const dir = join(RES, `mipmap-${d}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'ic_launcher.png'), genIcon(legacy, { filled: true }));
  writeFileSync(join(dir, 'ic_launcher_round.png'), genIcon(legacy, { filled: true, round: true }));
  writeFileSync(join(dir, 'ic_launcher_foreground.png'), genIcon(fg, { filled: false, reach: 0.30 }));
  console.log(`✓ mipmap-${d}: ${legacy}px + fg ${fg}px`);
}

// 自适应图标(Android 8+)
const anydpi = join(RES, 'mipmap-anydpi-v26');
mkdirSync(anydpi, { recursive: true });
const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;
writeFileSync(join(anydpi, 'ic_launcher.xml'), adaptive);
writeFileSync(join(anydpi, 'ic_launcher_round.xml'), adaptive);

const values = join(RES, 'values');
mkdirSync(values, { recursive: true });
writeFileSync(join(values, 'ic_launcher_background.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#1a0a2e</color>
</resources>
`);

// 预览图(应用商店用,512)
writeFileSync('/tmp/icon_preview.png', genIcon(512, { filled: true }));
writeFileSync('/tmp/icon_fg_preview.png', genIcon(512, { filled: false, reach: 0.30 }));
console.log('✓ adaptive-icon + 背景色 + 预览图(/tmp/icon_preview.png)');
