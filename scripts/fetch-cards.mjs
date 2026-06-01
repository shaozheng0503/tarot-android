#!/usr/bin/env node
/**
 * 从 Wikimedia Commons 批量下载 Rider-Waite-Smith 塔罗牌图(78 张)
 *
 * 策略:
 *   1. API 搜索拿候选文件名列表
 *   2. 优先选择 public domain + 含 Rider-Waite/RWS 的 .jpg/.png
 *   3. 重试 3 次,每次重试换下一个候选
 *   4. 全部失败则写 1x1 占位 PNG
 *
 * 使用方法: node scripts/fetch-cards.mjs
 */

import { writeFile, mkdir, access, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ASSETS = join(ROOT, 'assets', 'cards');

const UA = 'TarotAndroidBuilder/1.0 (educational; rider-waite public domain)';
const CONCURRENCY = 3;
const TIMEOUT_MS = 30000;

const MAJOR = [
  ['00', 'Fool', '愚者', 'The Fool'],
  ['01', 'Magician', '魔术师', 'The Magician'],
  ['02', 'High Priestess', '女祭司', 'The High Priestess'],
  ['03', 'Empress', '皇后', 'The Empress'],
  ['04', 'Emperor', '皇帝', 'The Emperor'],
  ['05', 'Hierophant', '教皇', 'The Hierophant'],
  ['06', 'Lovers', '恋人', 'The Lovers'],
  ['07', 'Chariot', '战车', 'The Chariot'],
  ['08', 'Strength', '力量', 'Strength'],
  ['09', 'Hermit', '隐士', 'The Hermit'],
  ['10', 'Wheel of Fortune', '命运之轮', 'Wheel of Fortune'],
  ['11', 'Justice', '正义', 'Justice'],
  ['12', 'Hanged Man', '倒吊人', 'The Hanged Man'],
  ['13', 'Death', '死神', 'Death'],
  ['14', 'Temperance', '节制', 'Temperance'],
  ['15', 'Devil', '恶魔', 'The Devil'],
  ['16', 'Tower', '塔', 'The Tower'],
  ['17', 'Star', '星星', 'The Star'],
  ['18', 'Moon', '月亮', 'The Moon'],
  ['19', 'Sun', '太阳', 'The Sun'],
  ['20', 'Judgement', '审判', 'Judgement'],
  ['21', 'World', '世界', 'The World'],
];

const SUITS = {
  wands: { zh: '权杖', en: 'Wands' },
  cups: { zh: '圣杯', en: 'Cups' },
  swords: { zh: '宝剑', en: 'Swords' },
  pentacles: { zh: '星币', en: 'Pentacles' },
};

const RANKS = [
  ['ace', '首牌'],
  ['two', '二'],
  ['three', '三'],
  ['four', '四'],
  ['five', '五'],
  ['six', '六'],
  ['seven', '七'],
  ['eight', '八'],
  ['nine', '九'],
  ['ten', '十'],
  ['page', '侍从'],
  ['knight', '骑士'],
  ['queen', '王后'],
  ['king', '国王'],
];

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function fetchWithTimeout(url, opts = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

async function searchFilenames(query) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=20`;
  try {
    const res = await fetchWithTimeout(apiUrl, { headers: { 'User-Agent': UA } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.query?.search || []).map(r => r.title);
  } catch { return []; }
}

async function getImageUrl(title) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url`;
  try {
    const res = await fetchWithTimeout(apiUrl, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages || {};
    const first = Object.values(pages)[0];
    return first?.imageinfo?.[0]?.url || null;
  } catch { return null; }
}

function scoreTitle(title) {
  // 越高分越好
  const t = title.toLowerCase();
  if (!/rider|rws|waite/.test(t)) return -100;
  if (/\.svg$/i.test(title)) return -50; // 后续可处理,先跳过
  let score = 0;
  if (/rider[- ]waite/.test(t)) score += 20;
  if (/rws/.test(t)) score += 15;
  if (/\.jpe?g$/i.test(title)) score += 10;
  if (/\.png$/i.test(title)) score += 5;
  if (/yale|pamela|saskia/i.test(t)) score += 5;
  if (/1909|original/i.test(t)) score += 3;
  if (/scanned|scan/i.test(t)) score += 2;
  return score;
}

async function download(url, outPath) {
  try {
    const res = await fetchWithTimeout(url, { headers: { 'User-Agent': UA } }, 30000);
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) return false; // 太小的肯定不是真图
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, buf);
    return true;
  } catch {
    return false;
  }
}

function buildPlaceholderPng() {
  return Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41,
    0x54, 0x08, 0x99, 0x63, 0x18, 0x1d, 0x1a, 0x6e,
    0x62, 0x60, 0x00, 0x00, 0x00, 0x07, 0x00, 0x01,
    0x5e, 0x83, 0x7c, 0x6c, 0x00, 0x00, 0x00, 0x00,
    0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
}

async function placeholder(target) {
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, buildPlaceholderPng());
}

async function fetchOne(queries, target, label) {
  if (await exists(target)) {
    const s = await stat(target);
    if (s.size > 1024) {
      console.log(`✓ ${label} (cached, ${(s.size/1024).toFixed(0)}KB)`);
      return true;
    }
  }

  // 多个搜索查询,合并候选
  const allCandidates = new Set();
  for (const q of queries) {
    const titles = await searchFilenames(q);
    titles.forEach(t => allCandidates.add(t));
  }
  const candidates = [...allCandidates]
    .filter(t => /\.(jpe?g|png)$/i.test(t))
    .sort((a, b) => scoreTitle(b) - scoreTitle(a))
    .slice(0, 8);

  for (const title of candidates) {
    const url = await getImageUrl(title);
    if (url && await download(url, target)) {
      console.log(`✓ ${label}  <-  ${title}`);
      return true;
    }
  }
  // 兜底
  await placeholder(target);
  console.log(`✗ ${label}  (placeholder after ${candidates.length} tries)`);
  return false;
}

async function pMap(items, mapper, concurrency = CONCURRENCY) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await mapper(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

async function main() {
  console.log(`=== 拉取 Rider-Waite-Smith 78 张塔罗牌(API + 重试, 并发 ${CONCURRENCY})===\n`);
  await mkdir(ASSETS, { recursive: true });

  const tasks = [];

  for (const [num, name, zh, fullName] of MAJOR) {
    const target = join(ASSETS, 'major', `${num}-${name.toLowerCase().replace(/ /g, '-')}.jpg`);
    const label = `${num} ${zh}`;
    const queries = [
      `Rider Waite ${fullName}`,
      `RWS Tarot ${num} ${name}`,
      `RWS Tarot ${fullName}`,
    ];
    tasks.push({ queries, target, label });
  }

  for (const [suitKey, suitInfo] of Object.entries(SUITS)) {
    for (const [rankKey, rankZh] of RANKS) {
      const target = join(ASSETS, 'minor', suitKey, `${rankKey}.jpg`);
      const label = `${suitInfo.zh}${rankZh}`;
      const capRank = rankKey.charAt(0).toUpperCase() + rankKey.slice(1);
      const queries = [
        `Rider Waite ${capRank} of ${suitInfo.en}`,
        `${capRank} of ${suitInfo.en} Rider-Waite`,
      ];
      tasks.push({ queries, target, label });
    }
  }

  await pMap(tasks, async (t) => {
    await fetchOne(t.queries, t.target, t.label);
  }, CONCURRENCY);

  console.log('\n=== 完成 ===');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
