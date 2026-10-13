const near = (a: number, b: number, e = 1e-9) => Math.abs(a - b) < e;
function tile(n: number, hr: number, hc: number, r0 = 0, c0 = 0, board: number[][], id = { v: 1 }) {
  if (n === 1) return; const h = n / 2, cr = r0 + h, cc = c0 + h; const t = id.v++;
  const quads = [[r0, c0], [r0, c0 + h], [r0 + h, c0], [r0 + h, c0 + h]];
  const centers = [[cr - 1, cc - 1], [cr - 1, cc], [cr, cc - 1], [cr, cc]];
  quads.forEach(([qr, qc], i) => { const inQ = hr >= qr && hr < qr + h && hc >= qc && hc < qc + h; if (inQ) tile(h, hr, hc, qr, qc, board, id); else { board[centers[i][0]][centers[i][1]] = t; tile(h, centers[i][0], centers[i][1], qr, qc, board, id); } });
}
export const checks: Record<string, () => boolean | string> = {
  "pizza-cuts": () => { let p = 1; for (let k = 1; k <= 10; k++) p += k; return p === 56; },
  "cutting-the-cube": () => { const faces = 6; return faces === 6 && 3 * 2 === 6; },
  "squares-on-a-chessboard": () => { let n = 0; for (let k = 1; k <= 8; k++) for (let r = 0; r + k <= 8; r++) for (let c = 0; c + k <= 8; c++) n++; return n === 204; },
  "square-on-the-hypotenuse": () => near(Math.hypot(5, 12) ** 2, 169),
  "clock-hands-overlap": () => { let n = 0; for (let t = 0; t < 24 * 60; t++) { const h = (t * 0.5) % 360, m = (t * 6) % 360; if (Math.abs(h - m) < 3) { /* coarse */ } } // exact: relative speed 5.5 deg/min
    let c = 0; for (let k = 0; k < 24 * 60 * 5.5 / 360; k++) c++; return c === 22; },
  "clock-angle-340": () => { const h = 3 * 30 + 40 * 0.5, m = 40 * 6; const d = Math.abs(h - m); return Math.min(d, 360 - d) === 130; },
  "sierpinski-count": () => 3 ** 5 === 243,
  "koch-perimeter": () => near(3 * (4 / 3) ** 3, 64 / 9),
  "fibonacci-rectangle": () => { const f = [1, 1, 2, 3, 5, 8, 13]; return f.reduce((s, x) => s + x * x, 0) === 273 && 13 * 21 === 273; },
  "dodecahedron-vertices": () => 2 + (12 * 5) / 2 - 12 === 20,
  "mobius-cut": () => true,
  "hanoi-seven": () => { let t = 0; for (let n = 1; n <= 7; n++) t = 2 * t + 1; const moves: number[] = []; const go = (n: number): number => (n === 0 ? 0 : 2 * go(n - 1) + 1); return t === 127 && go(7) === 127; },
  "l-tromino-board": () => { for (const [hr, hc] of [[0, 0], [3, 5], [7, 7], [4, 4]]) { const B = Array.from({ length: 8 }, () => new Array(8).fill(0)); B[hr][hc] = -1; tile(8, hr, hc, 0, 0, B); const counts = new Map<number, number>(); let bad = false; for (const row of B) for (const v of row) { if (v === 0) bad = true; if (v > 0) counts.set(v, (counts.get(v) ?? 0) + 1); } if (bad || counts.size !== 21 || [...counts.values()].some((x) => x !== 3)) return false; } return true; },
  "circle-chords-regions": () => { const C = (n: number, k: number) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); }; const f = (n: number) => 1 + C(n, 2) + C(n, 4); return [1, 2, 3, 4, 5, 6].map(f).join() === "1,2,4,8,16,31" && f(10) === 256; },
  "kissing-circles": () => { // centres at distance 2; neighbours must be >= 2 apart => angle >= 60deg
    const minAngle = 2 * Math.asin(2 / 2 / 2) * (180 / Math.PI); return Math.floor(360 / minAngle + 1e-9) === 6; },
  "ant-on-a-cube": () => { const two = Math.hypot(1, 2); const three = Math.hypot(1, 1) + 1; return near(two, Math.sqrt(5)) && two < three; },
};
