/**
 * Generate 200 SuperMesh twitter posts: posts-twitter/<n>/post.txt + card.png
 * Graphics-rich 1600x900 cards (diagrams, charts, memes, terminals) rendered
 * from SVG via sharp. Deterministic, no API calls.
 * Usage: node scripts/gen-posts.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { POSTS_A } from "./posts-data-a.mjs";
import { POSTS_B } from "./posts-data-b.mjs";
import { POSTS_C } from "./posts-data-c.mjs";
import { POSTS_D } from "./posts-data-d.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const OUT = join(root, "posts-twitter");

const POSTS = [...POSTS_A, ...POSTS_B, ...POSTS_C, ...POSTS_D];
if (POSTS.length !== 200) throw new Error(`expected 200 posts, got ${POSTS.length}`);

const LOGO = readFileSync(join(root, "frontend", "public", "assets", "logo-mark.png")).toString("base64");

const W = 1600, H = 900;
const SANS = "Helvetica Neue, Helvetica, Arial, sans-serif";
const MONO = "Menlo, Monaco, Courier New, monospace";
const GREEN = "#14F195", PURPLE = "#9945FF", RED = "#ff4d6a", INK = "#e8edf2", DIM = "#8b95a3", FAINT = "#5d6875";

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

function wrap(text, maxChars) {
  const words = String(text).split(" ");
  const lines = []; let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; }
    else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

// drawn glyphs (avoid unicode rendering risk)
const tick = (x, y, c = GREEN, s = 1) =>
  `<path d="M ${x - 9 * s} ${y} l ${7 * s} ${8 * s} l ${13 * s} ${-16 * s}" fill="none" stroke="${c}" stroke-width="${3.4 * s}" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (x, y, c = RED, s = 1) =>
  `<path d="M ${x - 8 * s} ${y - 8 * s} l ${16 * s} ${16 * s} M ${x + 8 * s} ${y - 8 * s} l ${-16 * s} ${16 * s}" stroke="${c}" stroke-width="${3.4 * s}" stroke-linecap="round"/>`;
const dot = (x, y, c = FAINT) => `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="${c}" stroke-width="2.5"/>`;
const arrowR = (x, y, c = DIM, len = 46) =>
  `<path d="M ${x} ${y} h ${len - 12}" stroke="${c}" stroke-width="3"/><path d="M ${x + len - 14} ${y - 8} l 14 8 l -14 8 z" fill="${c}"/>`;

function bgDots(rnd, n = 70) {
  let s = "";
  for (let i = 0; i < n; i++)
    s += `<circle cx="${(rnd() * W).toFixed(0)}" cy="${(rnd() * H).toFixed(0)}" r="${(0.8 + rnd() * 1.6).toFixed(1)}" fill="#cdd6e0" fill-opacity="${(0.08 + rnd() * 0.18).toFixed(2)}"/>`;
  return s;
}
function bgGrid() {
  let s = "";
  for (let x = 0; x <= W; x += 100) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#cdd6e0" stroke-opacity="0.04"/>`;
  for (let y = 0; y <= H; y += 100) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#cdd6e0" stroke-opacity="0.04"/>`;
  return s;
}

const titleEl = (t, y = 172, size = 44, c = INK) =>
  `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="${SANS}" font-size="${size}" font-weight="700" letter-spacing="2" fill="${c}">${esc(t)}</text>`;
const noteEl = (t, y = H - 118, c = DIM) =>
  `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="${MONO}" font-size="24" letter-spacing="1.5" fill="${c}">${esc(t)}</text>`;

// ---------- renderers ----------

function rFlow(g) {
  const steps = g.steps, n = steps.length;
  const bw = Math.min(300, (W - 200 - (n - 1) * 70) / n), bh = 150;
  const total = n * bw + (n - 1) * 70;
  const x0 = (W - total) / 2, y = 400;
  let s = titleEl(g.title, 220, 48);
  steps.forEach((st, i) => {
    const x = x0 + i * (bw + 70);
    const hot = i === g.hot;
    const ac = g.accent === "red" ? RED : g.accent === "purple" ? PURPLE : GREEN;
    const stroke = hot ? ac : "#3a4450";
    s += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="14" fill="${hot ? "rgba(20,241,149,0.05)" : "rgba(255,255,255,0.02)"}" stroke="${stroke}" stroke-width="${hot ? 3 : 1.5}"/>`;
    if (hot) s += `<rect x="${x - 8}" y="${y - 8}" width="${bw + 16}" height="${bh + 16}" rx="18" fill="none" stroke="${ac}" stroke-opacity="0.25" stroke-width="1.5"/>`;
    s += `<text x="${x + bw / 2}" y="${y + 64}" text-anchor="middle" font-family="${SANS}" font-size="33" font-weight="700" letter-spacing="1.5" fill="${hot ? ac : INK}">${esc(st[0])}</text>`;
    s += `<text x="${x + bw / 2}" y="${y + 104}" text-anchor="middle" font-family="${MONO}" font-size="20" fill="${DIM}">${esc(st[1])}</text>`;
    if (i < n - 1) s += arrowR(x + bw + 12, y + bh / 2, "#6b7684", 46);
  });
  s += `<text x="${W / 2}" y="${W / 2 && y - 60}" text-anchor="middle" font-family="${MONO}" font-size="22" letter-spacing="4" fill="${FAINT}">${esc(g.sub || "")}</text>`;
  if (g.note) s += noteEl(g.note);
  return s;
}

function rVs(g) {
  const midX = W / 2, top = 250, colW = 560;
  let s = titleEl(g.title, 190, 46);
  s += `<line x1="${midX}" y1="${top - 20}" x2="${midX}" y2="${H - 180}" stroke="#3a4450" stroke-width="1.5" stroke-dasharray="6 8"/>`;
  s += `<circle cx="${midX}" cy="${(top + H - 200) / 2}" r="36" fill="#0b0e13" stroke="#3a4450" stroke-width="1.5"/>`;
  s += `<text x="${midX}" y="${(top + H - 200) / 2 + 8}" text-anchor="middle" font-family="${SANS}" font-size="24" font-weight="700" fill="${DIM}">VS</text>`;
  const col = (cx, head, items, good) => {
    let c = `<text x="${cx}" y="${top}" text-anchor="middle" font-family="${SANS}" font-size="32" font-weight="700" letter-spacing="2" fill="${good ? GREEN : "#98a1ad"}">${esc(head)}</text>`;
    items.forEach((it, i) => {
      const y = top + 74 + i * 66;
      c += good ? tick(cx - colW / 2 + 26, y - 8) : cross(cx - colW / 2 + 26, y - 8, "#77808c");
      wrap(it, 34).forEach((ln, k) => {
        c += `<text x="${cx - colW / 2 + 58}" y="${y + k * 30}" font-family="${MONO}" font-size="24" fill="${good ? INK : "#98a1ad"}">${esc(ln)}</text>`;
      });
    });
    return c;
  };
  s += col(midX - 400, g.l.h, g.l.items, false);
  s += col(midX + 400, g.r.h, g.r.items, true);
  if (g.v) s += noteEl(g.v, H - 120, GREEN);
  return s;
}

function rBars(g) {
  const x0 = 340, maxW = 860, y0 = 280, rh = Math.min(92, 460 / g.bars.length * 1.05);
  let s = titleEl(g.title, 200, 46);
  g.bars.forEach((b, i) => {
    const [label, disp, w, hot] = b;
    const y = y0 + i * rh;
    const bw = Math.max(10, maxW * w);
    const c = hot ? GREEN : "#4a5563";
    s += `<text x="${x0 - 24}" y="${y + 34}" text-anchor="end" font-family="${MONO}" font-size="25" fill="${hot ? INK : DIM}">${esc(label)}</text>`;
    s += `<rect x="${x0}" y="${y}" width="${maxW}" height="48" rx="8" fill="rgba(255,255,255,0.025)" stroke="#2a323d"/>`;
    s += `<rect x="${x0}" y="${y}" width="${bw}" height="48" rx="8" fill="${c}" fill-opacity="${hot ? 0.9 : 0.55}"/>`;
    if (hot) s += `<rect x="${x0}" y="${y}" width="${bw}" height="48" rx="8" fill="none" stroke="${GREEN}" stroke-opacity="0.6"/>`;
    s += `<text x="${x0 + maxW + 26}" y="${y + 34}" font-family="${MONO}" font-size="25" font-weight="${hot ? 700 : 400}" fill="${hot ? GREEN : DIM}">${esc(disp)}</text>`;
  });
  if (g.note) s += noteEl(g.note);
  return s;
}

function rLoop(g) {
  const cx = W / 2, cy = 480, R = 235;
  let s = titleEl(g.title, 180, 46);
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#3a4450" stroke-width="1.5" stroke-dasharray="4 10"/>`;
  s += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-family="${SANS}" font-size="42" font-weight="700" letter-spacing="4" fill="${GREEN}">${esc(g.center)}</text>`;
  s += `<text x="${cx}" y="${cy + 34}" text-anchor="middle" font-family="${MONO}" font-size="20" letter-spacing="3" fill="${FAINT}">${esc(g.centerSub || "")}</text>`;
  const n = g.nodes.length;
  g.nodes.forEach((label, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    const bw = 260, bh = 74;
    s += `<rect x="${x - bw / 2}" y="${y - bh / 2}" width="${bw}" height="${bh}" rx="12" fill="#0b0e13" stroke="#4a5563" stroke-width="1.5"/>`;
    s += `<text x="${x}" y="${y + 9}" text-anchor="middle" font-family="${SANS}" font-size="26" font-weight="600" letter-spacing="1" fill="${INK}">${esc(label)}</text>`;
    // arrow arc to next
    const a2 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / n;
    const am = (a + a2) / 2;
    const ax = cx + R * Math.cos(am), ay = cy + R * Math.sin(am);
    const dirx = -Math.sin(am), diry = Math.cos(am);
    s += `<path d="M ${ax - dirx * 14} ${ay - diry * 14} L ${ax + dirx * 10} ${ay + diry * 10} M ${ax + dirx * 10} ${ay + diry * 10} l ${-dirx * 10 - diry * 8} ${-diry * 10 + dirx * 8} M ${ax + dirx * 10} ${ay + diry * 10} l ${-dirx * 10 + diry * 8} ${-diry * 10 - dirx * 8}" stroke="${GREEN}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  });
  if (g.note) s += noteEl(g.note, H - 96);
  return s;
}

function rMeme(g, rnd) {
  let s = "";
  const top = wrap(g.top.toUpperCase(), 30);
  const bot = g.bottom ? wrap(g.bottom.toUpperCase(), 30) : [];
  const size = top.length + bot.length >= 5 ? 62 : 76;
  const lh = size * 1.2;
  let y = g.bottom ? 300 : 420 - ((top.length - 1) * lh) / 2;
  top.forEach((l) => {
    s += `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="${SANS}" font-size="${size}" font-weight="800" letter-spacing="1" fill="${INK}">${esc(l)}</text>`;
    y += lh;
  });
  if (bot.length) {
    y = H - 240 - (bot.length - 1) * lh;
    bot.forEach((l) => {
      s += `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="${SANS}" font-size="${size}" font-weight="800" letter-spacing="1" fill="${GREEN}">${esc(l)}</text>`;
      y += lh;
    });
  }
  if (g.stamp) {
    const sc = g.stampColor === "green" ? GREEN : RED;
    const ang = -12 + rnd() * 6;
    const sw = g.stamp.length * 34 + 90;
    s += `<g transform="translate(${W / 2},${g.bottom ? 470 : 640}) rotate(${ang})">
      <rect x="${-sw / 2}" y="-52" width="${sw}" height="104" rx="10" fill="none" stroke="${sc}" stroke-width="5" stroke-opacity="0.85"/>
      <text x="0" y="18" text-anchor="middle" font-family="${SANS}" font-size="54" font-weight="800" letter-spacing="8" fill="${sc}" fill-opacity="0.9">${esc(g.stamp)}</text></g>`;
  }
  return s;
}

function rDrake(g) {
  const rowH = 240, x0 = 140, y0 = 210, rw = W - 280;
  let s = "";
  const row = (y, txt, good) => {
    let c = `<rect x="${x0}" y="${y}" width="${rw}" height="${rowH}" rx="18" fill="${good ? "rgba(20,241,149,0.05)" : "rgba(255,255,255,0.02)"}" stroke="${good ? GREEN : "#3a4450"}" stroke-width="${good ? 2.5 : 1.5}"/>`;
    c += `<circle cx="${x0 + 110}" cy="${y + rowH / 2}" r="46" fill="none" stroke="${good ? GREEN : "#77808c"}" stroke-width="3"/>`;
    c += good ? tick(x0 + 110, y + rowH / 2, GREEN, 2.2) : cross(x0 + 110, y + rowH / 2, "#77808c", 2.2);
    const lines = wrap(txt, 44);
    const size = lines.length > 2 ? 34 : 40;
    let ty = y + rowH / 2 - ((lines.length - 1) * size * 1.25) / 2 + 12;
    lines.forEach((l) => {
      c += `<text x="${x0 + 210}" y="${ty}" font-family="${SANS}" font-size="${size}" font-weight="${good ? 700 : 500}" fill="${good ? INK : "#98a1ad"}">${esc(l)}</text>`;
      ty += size * 1.25;
    });
    return c;
  };
  s += row(y0, g.no, false);
  s += row(y0 + rowH + 50, g.yes, true);
  return s;
}

function rTerm(g) {
  const tx = 200, ty = 180, tw = W - 400, th = 560;
  let s = `<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="16" fill="#0a0d12" stroke="#3a4450" stroke-width="1.5"/>`;
  s += `<rect x="${tx}" y="${ty}" width="${tw}" height="56" rx="16" fill="#12161d"/><rect x="${tx}" y="${ty + 40}" width="${tw}" height="16" fill="#12161d"/>`;
  s += `<circle cx="${tx + 34}" cy="${ty + 28}" r="8" fill="#ff5f57"/><circle cx="${tx + 62}" cy="${ty + 28}" r="8" fill="#febc2e"/><circle cx="${tx + 90}" cy="${ty + 28}" r="8" fill="#28c840"/>`;
  s += `<text x="${tx + tw / 2}" y="${ty + 36}" text-anchor="middle" font-family="${MONO}" font-size="21" fill="${DIM}">${esc(g.title)}</text>`;
  let y = ty + 110;
  g.lines.forEach(([p, text]) => {
    const c = p === "$" ? GREEN : p === "ok" ? GREEN : p === "err" ? RED : p === "hi" ? INK : "#9aa7b6";
    const pre = p === "$" ? "$ " : p === "ok" ? "" : p === "err" ? "" : "  ";
    if (p === "ok") y += 6, (s += tick(tx + 52, y - 9, GREEN, 1.1));
    if (p === "err") y += 6, (s += cross(tx + 52, y - 9, RED, 1.1));
    const off = p === "ok" || p === "err" ? 80 : 40;
    s += `<text x="${tx + off}" y="${y}" font-family="${MONO}" font-size="26" fill="${c}">${esc(pre + text)}</text>`;
    y += 44;
  });
  if (g.note) s += noteEl(g.note, H - 100);
  return s;
}

function rStat(g) {
  const bigSize = g.big.length > 8 ? 150 : 190;
  let s = `<text x="${W / 2}" y="470" text-anchor="middle" font-family="${SANS}" font-size="${bigSize}" font-weight="800" letter-spacing="-2" fill="${g.color === "purple" ? PURPLE : g.color === "red" ? RED : GREEN}">${esc(g.big)}</text>`;
  const caps = wrap(g.cap, 46);
  let y = 560;
  caps.forEach((l) => {
    s += `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="${SANS}" font-size="40" font-weight="600" fill="${INK}">${esc(l)}</text>`;
    y += 54;
  });
  if (g.kick) s += `<text x="${W / 2}" y="240" text-anchor="middle" font-family="${MONO}" font-size="26" letter-spacing="5" fill="${DIM}">${esc(g.kick)}</text>`;
  if (g.foot) s += noteEl(g.foot, H - 110, FAINT);
  return s;
}

function rTimeline(g) {
  const y = 490, x0 = 170, x1 = W - 170;
  let s = titleEl(g.title, 210, 46);
  s += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#3a4450" stroke-width="2"/>`;
  const n = g.ev.length;
  g.ev.forEach((e, i) => {
    const x = x0 + ((x1 - x0) * i) / (n - 1);
    const hot = i === n - 1;
    s += `<circle cx="${x}" cy="${y}" r="${hot ? 13 : 9}" fill="${hot ? GREEN : "#0b0e13"}" stroke="${hot ? GREEN : "#6b7684"}" stroke-width="2.5"/>`;
    if (hot) s += `<circle cx="${x}" cy="${y}" r="26" fill="none" stroke="${GREEN}" stroke-opacity="0.35"/>`;
    const up = i % 2 === 0;
    const ly = up ? y - 68 : y + 92;
    s += `<line x1="${x}" y1="${y + (up ? -20 : 20)}" x2="${x}" y2="${up ? ly + 16 : ly - 40}" stroke="#3a4450" stroke-width="1.5"/>`;
    s += `<text x="${x}" y="${up ? ly - 34 : ly - 6 + 40}" text-anchor="middle" font-family="${MONO}" font-size="23" fill="${hot ? GREEN : DIM}">${esc(e[0])}</text>`;
    wrap(e[1], 20).forEach((ln, k) => {
      s += `<text x="${x}" y="${(up ? ly : ly + 40 + 28) + k * 28}" text-anchor="middle" font-family="${SANS}" font-size="24" font-weight="600" fill="${hot ? INK : "#98a1ad"}">${esc(ln)}</text>`;
    });
  });
  if (g.note) s += noteEl(g.note, H - 100);
  return s;
}

function rQuote(g) {
  let s = `<text x="200" y="330" font-family="Georgia, serif" font-size="220" fill="${GREEN}" fill-opacity="0.55">${esc('"')}</text>`;
  const lines = wrap(g.q, 40);
  const size = lines.length > 4 ? 46 : 54;
  let y = 400 - ((lines.length - 1) * size * 1.3) / 2 + 40;
  lines.forEach((l) => {
    s += `<text x="${W / 2 + 40}" y="${y}" text-anchor="middle" font-family="${SANS}" font-size="${size}" font-weight="600" fill="${INK}">${esc(l)}</text>`;
    y += size * 1.3;
  });
  s += `<text x="${W / 2 + 40}" y="${y + 50}" text-anchor="middle" font-family="${MONO}" font-size="27" fill="${DIM}">${esc(g.a)}</text>`;
  return s;
}

function rCheck(g) {
  let s = titleEl(g.title, 200, 46);
  const x0 = 360;
  g.items.forEach(([txt, st], i) => {
    const y = 300 + i * 78;
    if (st === "ok") s += tick(x0, y - 10, GREEN, 1.5);
    else if (st === "no") s += cross(x0, y - 10, RED, 1.5);
    else s += dot(x0, y - 10);
    s += `<text x="${x0 + 52}" y="${y}" font-family="${MONO}" font-size="30" fill="${st === "ok" ? INK : st === "no" ? "#98a1ad" : DIM}">${esc(txt)}</text>`;
  });
  if (g.note) s += noteEl(g.note);
  return s;
}

function rStack(g) {
  const lw = 760, x = (W - lw) / 2;
  const n = g.layers.length, lh2 = Math.min(120, 520 / n);
  let s = titleEl(g.title, 190, 46);
  g.layers.forEach((L, i) => {
    const [label, sub, hot] = L;
    const y = 250 + i * (lh2 + 14);
    s += `<rect x="${x}" y="${y}" width="${lw}" height="${lh2}" rx="12" fill="${hot ? "rgba(20,241,149,0.06)" : "rgba(255,255,255,0.02)"}" stroke="${hot ? GREEN : "#3a4450"}" stroke-width="${hot ? 3 : 1.5}"/>`;
    s += `<text x="${x + 40}" y="${y + lh2 / 2 - 4}" font-family="${SANS}" font-size="31" font-weight="700" letter-spacing="1" fill="${hot ? GREEN : INK}">${esc(label)}</text>`;
    s += `<text x="${x + 40}" y="${y + lh2 / 2 + 32}" font-family="${MONO}" font-size="20" fill="${DIM}">${esc(sub)}</text>`;
  });
  if (g.note) s += noteEl(g.note, H - 96);
  return s;
}

function rMap(g, rnd) {
  let s = titleEl(g.title, 190, 46);
  const nodes = [];
  for (let i = 0; i < 34; i++) nodes.push([220 + rnd() * (W - 440), 260 + rnd() * 420]);
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]);
      if (d < 240) s += `<line x1="${nodes[i][0].toFixed(0)}" y1="${nodes[i][1].toFixed(0)}" x2="${nodes[j][0].toFixed(0)}" y2="${nodes[j][1].toFixed(0)}" stroke="#cdd6e0" stroke-opacity="${(0.14 * (1 - d / 240)).toFixed(3)}"/>`;
    }
  nodes.forEach(([x, y]) => (s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="3" fill="#8b95a3" fill-opacity="0.6"/>`));
  (g.tags || []).forEach((tag, i) => {
    const [x, y] = nodes[Math.floor(rnd() * nodes.length)];
    s += `<circle cx="${x}" cy="${y}" r="7" fill="${GREEN}"/><circle cx="${x}" cy="${y}" r="18" fill="none" stroke="${GREEN}" stroke-opacity="0.5"/><circle cx="${x}" cy="${y}" r="32" fill="none" stroke="${GREEN}" stroke-opacity="0.18"/>`;
    const tw = tag.length * 14.5 + 40;
    const lx = Math.min(W - 200 - tw, Math.max(180, x - tw / 2)), ly = y - 70;
    s += `<rect x="${lx}" y="${ly - 30}" width="${tw}" height="44" rx="8" fill="#0b0e13" stroke="#3a4450"/>`;
    s += `<text x="${lx + tw / 2}" y="${ly}" text-anchor="middle" font-family="${MONO}" font-size="22" fill="${INK}">${esc(tag)}</text>`;
  });
  if (g.note) s += noteEl(g.note, H - 100);
  return s;
}

const RENDER = { flow: rFlow, vs: rVs, bars: rBars, loop: rLoop, meme: rMeme, drake: rDrake, term: rTerm, stat: rStat, tl: rTimeline, quote: rQuote, check: rCheck, stack: rStack, map: rMap };

function buildSVG(idx, post) {
  const rnd = mulberry32(idx * 7919 + 41);
  const body = RENDER[post.k](post.g, rnd);
  const pattern = post.k === "map" ? "" : idx % 2 ? bgDots(rnd) : bgGrid() + bgDots(rnd, 30);
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <radialGradient id="vig" cx="50%" cy="44%" r="78%">
      <stop offset="0%" stop-color="#0c1016"/><stop offset="70%" stop-color="#05070a"/><stop offset="100%" stop-color="#000000"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <g>${pattern}</g>
  <rect x="26" y="26" width="${W - 52}" height="${H - 52}" fill="none" stroke="#cdd6e0" stroke-opacity="0.18"/>
  <path d="M 26 62 V 26 H 62" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
  <path d="M ${W - 62} 26 H ${W - 26} V 62" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
  <path d="M 26 ${H - 62} V ${H - 26} H 62" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
  <path d="M ${W - 62} ${H - 26} H ${W - 26} V ${H - 62}" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
  <image href="data:image/png;base64,${LOGO}" x="56" y="48" width="52" height="52"/>
  <text x="122" y="82" font-family="${SANS}" font-size="24" font-weight="600" letter-spacing="7" fill="#f2f5f8">SUPERMESH</text>
  ${body}
  <text x="${W - 56}" y="${H - 52}" text-anchor="end" font-family="${MONO}" font-size="20" letter-spacing="2" fill="${FAINT}">@supermesh99</text>
  <text x="56" y="${H - 52}" font-family="${MONO}" font-size="20" letter-spacing="2" fill="${FAINT}">solana</text>
</svg>`;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let done = 0;
const BATCH = 10;
for (let start = 0; start < POSTS.length; start += BATCH) {
  await Promise.all(
    POSTS.slice(start, start + BATCH).map(async (post, k) => {
      const idx = start + k;
      const dir = join(OUT, String(idx + 1));
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "post.txt"), post.t + "\n");
      const svg = buildSVG(idx, post);
      await sharp(Buffer.from(svg), { density: 96 }).png({ compressionLevel: 9 }).toFile(join(dir, "card.png"));
      done++;
    })
  );
  process.stdout.write(`\r${done}/200`);
}
console.log("\ndone →", OUT);
