#!/usr/bin/env node
/**
 * 从 metabismuth/tarot-json(MIT,350×600 RWS 牌图)下载 78 张牌面,
 * 落地到 assets/cards/,并生成 src/data/cardImages.ts(id → require 映射)。
 *
 * 注:图片为 Rider-Waite-Smith 1971 U.S. Games 版扫描,经典且广泛使用;
 * 个人/学习用途无虞,商用上架前请改用 1909 公有领域来源或 CC0 包。
 *
 * 用法: node scripts/fetch-rws.mjs
 */
import { writeFile, mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ASSETS = join(ROOT, 'assets', 'cards');
const BASE = 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards';

const SUIT_LETTER = { wands: 'w', cups: 'c', swords: 's', pentacles: 'p' };
const RANKS = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'page', 'knight', 'queen', 'king'];

// 构造 [cardId, repoFile] 列表
function buildPairs() {
  const pairs = [];
  for (let n = 0; n <= 21; n++) {
    const nn = String(n).padStart(2, '0');
    pairs.push([`major-${nn}`, `m${nn}`]);
  }
  for (const [suit, letter] of Object.entries(SUIT_LETTER)) {
    RANKS.forEach((rank, i) => {
      const num = String(i + 1).padStart(2, '0');
      pairs.push([`${suit}-${rank}`, `${letter}${num}`]);
    });
  }
  return pairs;
}

async function download(file, outPath) {
  const res = await fetch(`${BASE}/${file}.jpg`, {
    headers: { 'User-Agent': 'TarotAndroid/1.0' },
  });
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) throw new Error(`${file}: too small (${buf.length}B)`);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
  return buf.length;
}

async function main() {
  const pairs = buildPairs();
  console.log(`=== 下载 ${pairs.length} 张 RWS 牌图 ===\n`);
  await mkdir(ASSETS, { recursive: true });

  let ok = 0;
  for (const [id, file] of pairs) {
    const out = join(ASSETS, `${file}.jpg`);
    try {
      const size = await download(file, out);
      ok++;
      console.log(`✓ ${id.padEnd(14)} <- ${file}.jpg (${(size / 1024).toFixed(0)}KB)`);
    } catch (e) {
      console.log(`✗ ${id.padEnd(14)} ${e.message}`);
    }
  }

  // 生成 require 映射
  const lines = pairs.map(([id, file]) => `  '${id}': require('../../assets/cards/${file}.jpg'),`);
  const ts = `// 自动生成,请勿手改 —— 由 scripts/fetch-rws.mjs 生成
// Rider-Waite-Smith 牌图(metabismuth/tarot-json, MIT;牌图为 RWS 1971 版扫描)
import type { ImageSourcePropType } from 'react-native';

export const CARD_IMAGES: Record<string, ImageSourcePropType> = {
${lines.join('\n')}
};

export function getCardImage(id: string): ImageSourcePropType | undefined {
  return CARD_IMAGES[id];
}
`;
  const mapPath = join(ROOT, 'src', 'data', 'cardImages.ts');
  await writeFile(mapPath, ts);
  console.log(`\n✓ 生成 ${mapPath}`);

  const total = (await Promise.all(pairs.map(async ([, f]) => {
    try { return (await stat(join(ASSETS, `${f}.jpg`))).size; } catch { return 0; }
  }))).reduce((a, b) => a + b, 0);
  console.log(`\n=== 完成:${ok}/${pairs.length} 张,合计 ${(total / 1024 / 1024).toFixed(1)}MB ===`);
}

main().catch(e => { console.error(e); process.exit(1); });
