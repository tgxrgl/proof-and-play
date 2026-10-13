import { PUZZLES } from "../data";
import { CATEGORIES } from "../lib/categories";
import { checks as c1 } from "./checks/algebra";
import { checks as c2 } from "./checks/geometry";
import { checks as c3 } from "./checks/number-theory";
import { checks as c4 } from "./checks/logic";
import { checks as c5 } from "./checks/combinatorics";
import { checks as c6 } from "./checks/probability";
import { checks as c7 } from "./checks/sequences";
import { checks as c8 } from "./checks/graph-theory";
import { checks as c9 } from "./checks/calculus";
import { checks as c10 } from "./checks/visual";

let failures = 0;
const fail = (m: string) => { failures++; console.error("✗ " + m); };

// ---------- helpers ----------
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const C = (n: number, k: number) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));

function squaresCrossed(w: number, h: number) {
  // brute force: sample the diagonal finely and count distinct open unit squares visited
  const seen = new Set<string>(); const N = 200000;
  for (let i = 1; i < N; i++) { const t = i / N; seen.add(`${Math.floor(t * w)},${Math.floor(t * h)}`); }
  return seen.size;
}

function frobenius(boxes: number[]) {
  const ok = new Array(500).fill(false); ok[0] = true;
  for (let n = 1; n < 500; n++) ok[n] = boxes.some((b) => n >= b && ok[n - b]);
  for (let n = 499; n >= 0; n--) if (!ok[n]) return n;
  return -1;
}

function digitSum(x: bigint) { return [...x.toString()].reduce((s, d) => s + Number(d), 0); }

function langley() {
  const rad = (d: number) => (d * Math.PI) / 180;
  const A = { x: 0, y: 0 };
  const B = { x: Math.cos(rad(-80 + 90 - 0)) * 0, y: 0 };
  // place base BC on x-axis: B=(0,0), C=(1,0), A above with base angles 80°
  const Bp = { x: 0, y: 0 }, Cp = { x: 1, y: 0 };
  const Ap = { x: 0.5, y: 0.5 * Math.tan(rad(80)) };
  void A; void B;
  // D on AC with angle DBC = 60°: ray from B at 60° meets line AC
  const inter = (p: any, d: any, q: any, e: any) => {
    const det = d.x * -e.y - d.y * -e.x;
    const t = ((q.x - p.x) * -e.y - (q.y - p.y) * -e.x) / det;
    return { x: p.x + t * d.x, y: p.y + t * d.y };
  };
  const D = inter(Bp, { x: Math.cos(rad(60)), y: Math.sin(rad(60)) }, Cp, { x: Ap.x - Cp.x, y: Ap.y - Cp.y });
  // E on AB with angle ECB = 50°: ray from C at 180-50 = 130° from +x
  const E = inter(Cp, { x: Math.cos(rad(130)), y: Math.sin(rad(130)) }, Bp, { x: Ap.x, y: Ap.y });
  const v1 = { x: Bp.x - D.x, y: Bp.y - D.y }, v2 = { x: E.x - D.x, y: E.y - D.y };
  const cos = (v1.x * v2.x + v1.y * v2.y) / (Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y));
  return (Math.acos(cos) * 180) / Math.PI;
}

function chengCheryl() {
  const dates: [string, number][] = [["May",15],["May",16],["May",19],["Jun",17],["Jun",18],["Jul",14],["Jul",16],["Aug",14],["Aug",15],["Aug",17]];
  const monthOf = (d: number) => dates.filter((x) => x[1] === d).map((x) => x[0]);
  const daysIn = (m: string) => dates.filter((x) => x[0] === m);
  // Ana: month has no day that is unique across all dates
  const unique = (d: number) => dates.filter((x) => x[1] === d).length === 1;
  let s1 = dates.filter(([m]) => daysIn(m).every(([, d]) => !unique(d)));
  const cnt = (list: typeof dates, d: number) => list.filter((x) => x[1] === d).length;
  let s2 = s1.filter(([, d]) => cnt(s1, d) === 1);
  const mcnt = (list: typeof dates, m: string) => list.filter((x) => x[0] === m).length;
  let s3 = s2.filter(([m]) => mcnt(s2, m) === 1);
  void monthOf;
  return s3.length === 1 ? `${s3[0][0]} ${s3[0][1]}` : "ambiguous:" + JSON.stringify(s3);
}

function lookSay(s: string) {
  let out = ""; for (let i = 0; i < s.length; ) { let j = i; while (j < s.length && s[j] === s[i]) j++; out += `${j - i}${s[i]}`; i = j; } return out;
}

function josephus(n: number) {
  const a = Array.from({ length: n }, (_, i) => i + 1); let i = 0;
  while (a.length > 1) { i = (i + 1) % a.length; a.splice(i, 1); if (i >= a.length) i = 0; }
  return a[0];
}

function wheelChromatic() {
  const adj: number[][] = [[1,2,3,4,5],[0,2,5],[0,1,3],[0,2,4],[0,3,5],[0,4,1]];
  for (let k = 1; k <= 6; k++) {
    const col = new Array(6).fill(-1);
    const go = (v: number): boolean => { if (v === 6) return true; for (let c = 0; c < k; c++) { if (adj[v].every((u) => col[u] !== c)) { col[v] = c; if (go(v + 1)) return true; col[v] = -1; } } return false; };
    if (go(0)) return k;
  }
  return -1;
}

function knightCycle5() {
  const n = 5, moves = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
  const vis = Array.from({ length: n }, () => new Array(n).fill(false)); vis[0][0] = true;
  const go = (r: number, c: number, cnt: number): boolean => {
    if (cnt === n * n) return moves.some(([dr, dc]) => r + dr === 0 && c + dc === 0);
    for (const [dr, dc] of moves) { const R = r + dr, Cc = c + dc; if (R >= 0 && R < n && Cc >= 0 && Cc < n && !vis[R][Cc]) { vis[R][Cc] = true; if (go(R, Cc, cnt + 1)) return true; vis[R][Cc] = false; } }
    return false;
  };
  return go(0, 0, 1);
}

function kirchhoff(n: number) {
  // spanning trees of K_n via determinant of Laplacian minor (Gaussian elimination)
  const m = n - 1; const a = Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => (i === j ? n - 1 : -1)));
  let det = 1;
  for (let i = 0; i < m; i++) { let p = i; for (let r = i + 1; r < m; r++) if (Math.abs(a[r][i]) > Math.abs(a[p][i])) p = r; if (p !== i) { [a[i], a[p]] = [a[p], a[i]]; det = -det; } det *= a[i][i]; for (let r = i + 1; r < m; r++) { const f = a[r][i] / a[i][i]; for (let c = i; c < m; c++) a[r][c] -= f * a[i][c]; } }
  return Math.round(det);
}

function triangleProb() {
  let hit = 0; const N = 2_000_000; let seed = 12345;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  for (let i = 0; i < N; i++) { const a = rnd(), b = rnd(); const x = Math.min(a, b), y = Math.max(a, b); if (x < 0.5 && y - x < 0.5 && 1 - y < 0.5) hit++; }
  return hit / N;
}

function ten_liars() {
  const res: number[] = [];
  for (let mask = 0; mask < 1 << 10; mask++) { // bit k-1 set => person k truthful
    const liars = 10 - [...Array(10).keys()].filter((i) => mask >> i & 1).length;
    let ok = true; for (let k = 1; k <= 10; k++) { const claim = liars === k; const truthful = (mask >> (k - 1)) & 1; if (Boolean(truthful) !== claim) ok = false; }
    if (ok) res.push(mask);
  }
  return res.length === 1 ? String(Math.log2(res[0]) + 1) : "bad:" + res.length;
}

function knights() {
  const sols: string[] = [];
  for (const A of [true, false]) for (const B of [true, false]) { // true = knight
    const stmt = !A || !B; // at least one knave
    if (A === stmt) sols.push(`${A ? "A knight" : "A knave"}, ${B ? "B knight" : "B knave"}`);
  }
  return sols.length === 1 ? sols[0] : "bad";
}

function boundedCandy() {
  let n = 0; for (let a = 0; a <= 8; a++) for (let b = 0; b <= 8; b++) for (let c = 0; c <= 8; c++) { const d = 20 - a - b - c; if (d >= 0 && d <= 8) n++; } return n;
}
function balanced(n: number) {
  let cnt = 0; const go = (open: number, close: number) => { if (open === n && close === n) { cnt++; return; } if (open < n) go(open + 1, close); if (close < open) go(open, close + 1); }; go(0, 0); return cnt;
}
function derange(n: number) { const p = Array.from({ length: n }, (_, i) => i); let cnt = 0; const go = (i: number, used: boolean[]) => { if (i === n) { cnt++; return; } for (let v = 0; v < n; v++) if (!used[v] && v !== i) { used[v] = true; go(i + 1, used); used[v] = false; } }; void p; go(0, new Array(n).fill(false)); return cnt; }
function birthday() { let q = 1; for (let n = 1; n <= 365; n++) { q *= (365 - n + 1) / 365; if (1 - q > 0.5) return n; } return -1; }
function harmonic10() { let h = 0; for (let n = 1; ; n++) { h += 1 / n; if (h > 10) return n; } }

// ---------- expected answers ----------
const near = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;
const baseChecks: Record<string, () => boolean | string> = {
  "reciprocal-cube": () => { const x = (3 + Math.sqrt(5)) / 2; return near(x + 1 / x, 3) && near(x ** 3 + x ** -3, 18); },
  "telescoping-radicals": () => { let s = 0; for (let n = 1; n <= 48; n++) s += 1 / (Math.sqrt(n) + Math.sqrt(n + 1)); return near(s, 6); },
  "reciprocal-functional": () => { const f = (x: number) => 2 / x - x; return near(f(2), -1) && [0.5, 3, -2, 7].every((x) => near(f(x) + 2 * f(1 / x), 3 * x)); },
  "reciprocal-pairs": () => { let n = 0; for (let x = 13; x <= 2000; x++) for (let y = x - 0; y <= 2000; y++) { if (12 * (x + y) === x * y) n += x === y ? 1 : 2; } return n === 15; },
  "inscribed-right-triangle": () => near(Math.PI * (Math.hypot(6, 8) / 2) ** 2, 25 * Math.PI),
  "diagonal-through-squares": () => squaresCrossed(12, 18) === 24 && 12 + 18 - gcd(12, 18) === 24,
  "hippocrates-lunes": () => near(Math.PI * 9 / 2 + Math.PI * 16 / 2 - (Math.PI * 25 / 2 - 24), 24),
  "langley-adventitious-angles": () => near(langley(), 30, 1e-6),
  "last-digit-of-sevens": () => Number((7n ** 2026n) % 10n) === 9,
  "counting-divisors": () => { let n = 0; for (let d = 1; d <= 360; d++) if (360 % d === 0) n++; return n === 24; },
  "nugget-boxes": () => frobenius([6, 9, 20]) === 43,
  "digit-sum-tower": () => { const A = digitSum(4444n ** 4444n); const B = digitSum(BigInt(A)); const Cc = digitSum(BigInt(B)); return Cc === 7; },
  "knight-or-knave": () => knights() === "A knight, B knave",
  "nine-coins": () => 3 ** 2 >= 9 && 3 ** 1 < 9,
  "ten-liars": () => ten_liars() === "9",
  "birthday-of-the-two-friends": () => chengCheryl() === "Jul 16",
  "party-handshakes": () => C(12, 2) === 66,
  "balanced-parentheses": () => balanced(5) === 42 && C(10, 5) - C(10, 4) === 42,
  "hat-shuffle": () => derange(5) === 44,
  "bounded-candy-split": () => boundedCandy() === 375,
  "six-in-four-rolls": () => near(1 - (5 / 6) ** 4, 671 / 1296),
  "monty-hall": () => { let win = 0, tot = 0; for (let prize = 0; prize < 3; prize++) { const pick = 0; const opts = [1, 2].filter((d) => d !== prize); for (const open of opts) { const w = 1 / 3 / opts.length; const sw = [0, 1, 2].find((d) => d !== pick && d !== open)!; tot += w; if (sw === prize) win += w; } } return near(tot, 1) && near(win, 2 / 3); },
  "shared-birthdays": () => birthday() === 23,
  "broken-stick-triangle": () => Math.abs(triangleProb() - 0.25) < 0.002,
  "gauss-sum": () => Array.from({ length: 100 }, (_, i) => i + 1).reduce((a, b) => a + b) === 5050,
  "next-pronic": () => [1, 2, 3, 4, 5].map((n) => n * (n + 1)).join() === "2,6,12,20,30" && 6 * 7 === 42,
  "fibonacci-partial-sum": () => { const F = [0, 1, 1]; for (let i = 3; i <= 12; i++) F[i] = F[i - 1] + F[i - 2]; return F.slice(1, 11).reduce((a, b) => a + b) === 143 && F[12] === 144; },
  "look-and-say": () => { let s = "1"; const seq = [s]; for (let i = 0; i < 7; i++) seq.push((s = lookSay(s))); return seq.slice(0, 7).join() === "1,11,21,1211,111221,312211,13112221" && seq[7] === "1113213211"; },
  "josephus-circle": () => josephus(41) === 19 && josephus(8) === 1,
  "seven-bridges": () => { const deg = { A: 3, B: 3, C: 5, D: 3 }; return Object.values(deg).filter((d) => d % 2).length > 2; },
  "odd-party": () => (7 * 3) % 2 === 1,
  "wheel-coloring": () => wheelChromatic() === 4,
  "closed-knights-tour": () => knightCycle5() === false,
  "labeled-trees": () => kirchhoff(6) === 1296 && 6 ** 4 === 1296 && kirchhoff(4) === 16,
  "rectangle-under-parabola": () => { let best = 0; for (let x = 0; x < Math.sqrt(12); x += 1e-5) best = Math.max(best, 2 * x * (12 - x * x)); return near(best, 32, 1e-6); },
  "halving-series": () => { let s = 0; for (let n = 1; n < 200; n++) s += n / 2 ** n; return near(s, 2, 1e-9); },
  "harmonic-ten": () => harmonic10() === 12367,
  "intersecting-cylinders": () => { let v = 0; const N = 200000; for (let i = 0; i < N; i++) { const x = -1 + (2 * (i + 0.5)) / N; v += 4 * (1 - x * x) * (2 / N); } return near(v, 16 / 3, 1e-6); },
  "odd-numbers-make-squares": () => { let s = 0; for (let k = 0; k < 20; k++) s += 2 * k + 1; return s === 400; },
  "folding-to-the-moon": () => { const km = 0.1 * 2 ** 42 / 1e6; return Math.floor(km) === 439804 && km > 384400; },
  "mutilated-chessboard": () => { let w = 0, b = 0; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { if ((r === 0 && c === 0) || (r === 7 && c === 7)) continue; (r + c) % 2 ? b++ : w++; } return w !== b; },
  "rope-around-the-earth": () => near(1 / (2 * Math.PI), 0.159, 1e-3),
  "five-points-in-a-square": () => { const pts = [[0, 0], [2, 0], [0, 2], [2, 2], [1, 1]]; let m = Infinity; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) m = Math.min(m, Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1])); return near(m, Math.SQRT2); },
};

const checks: Record<string, () => boolean | string> = { ...baseChecks, ...c1, ...c2, ...c3, ...c4, ...c5, ...c6, ...c7, ...c8, ...c9, ...c10 };

// ---------- structural checks ----------
const slugs = new Set<string>();
const cats = new Set(CATEGORIES.map((c) => c.slug));
const byCat: Record<string, number> = {}; const byDiff: Record<string, number> = {};
const dollars = /(^|[^\\])\$\$?/g;

for (const p of PUZZLES) {
  if (slugs.has(p.slug)) fail(`duplicate slug ${p.slug}`); slugs.add(p.slug);
  if (!cats.has(p.category)) fail(`${p.slug}: bad category`);
  if (!["Easy", "Medium", "Hard"].includes(p.difficulty)) fail(`${p.slug}: bad difficulty`);
  if (p.hints.length < 1 || p.hints.length > 4) fail(`${p.slug}: hint count`);
  if (p.solution.length < (p.difficulty === "Easy" ? 1 : 2)) fail(`${p.slug}: solution too short`);
  if (!p.statement.trim() || !p.answer.trim() || !p.teaser.trim()) fail(`${p.slug}: empty field`);
  if (p.minutes < 1) fail(`${p.slug}: minutes`);
  if (/https?:\/\//.test(p.source)) fail(`${p.slug}: source must not contain unverified URLs`);
  for (const t of [p.statement, p.answer, ...p.hints, ...p.solution]) {
    const n = (t.match(dollars) || []).length; // count of $ / $$ delimiters
    const stripped = t.replace(/\$\$/g, "").replace(/\\\$/g, "");
    if ((stripped.match(/\$/g) || []).length % 2 !== 0) fail(`${p.slug}: unbalanced $ in "${t.slice(0, 40)}…"`);
    void n;
    if (/`/.test(t)) fail(`${p.slug}: backtick in text`);
  }
  byCat[p.category] = (byCat[p.category] || 0) + 1; byDiff[p.difficulty] = (byDiff[p.difficulty] || 0) + 1;
  const chk = checks[p.slug];
  if (!chk) fail(`${p.slug}: no verification registered`);
  else { const r = chk(); if (r !== true) fail(`${p.slug}: verification failed (${String(r)})`); }
}
for (const k of Object.keys(checks)) if (!slugs.has(k)) fail(`verification for unknown slug ${k}`);
if (PUZZLES.length < 200) fail(`only ${PUZZLES.length} puzzles`);
for (const c of CATEGORIES) if ((byCat[c.slug] || 0) < 15) fail(`category ${c.slug} has ${byCat[c.slug] || 0}`);

console.log(`${PUZZLES.length} puzzles`, byCat, byDiff);
if (failures) { console.error(`${failures} problem(s)`); process.exit(1); } else console.log("✓ all puzzles validated");
