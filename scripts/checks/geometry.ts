const near = (a: number, b: number, e = 1e-9) => Math.abs(a - b) < e;
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
export const checks: Record<string, () => boolean | string> = {
  "circle-around-a-square": () => near(Math.PI * (Math.hypot(10, 10) / 2) ** 2, 50 * Math.PI),
  "thirty-sixty-ninety": () => near(0.5 * 6 * 6 * Math.sqrt(3), 18 * Math.sqrt(3)) && near(12 * Math.sin(Math.PI / 6), 6),
  "angle-of-a-dodecagon": () => near(180 - 360 / 12, 150) && near(((12 - 2) * 180) / 12, 150),
  "heron-13-14-15": () => { const s = 21; return near(Math.sqrt(s * 8 * 7 * 6), 84); },
  "distance-to-a-chord": () => near(Math.sqrt(13 ** 2 - 12 ** 2), 5),
  "external-tangent": () => { // centres (0,0) and (13,0); tangent points via direct construction
    const r = 4, R = 9, d = r + R; const sin = (R - r) / d; const t = d * Math.sqrt(1 - sin * sin); return near(t, 12) && near(2 * Math.sqrt(r * R), 12); },
  "incircle-512-13": () => near((5 + 12 - 13) / 2, 2) && near(30 / 15, 2),
  "square-in-circle-leftover": () => near(Math.PI - (2 ** 2) / 2, Math.PI - 2),
  "picks-theorem-triangle": () => { let n = 0; for (let x = 1; x < 8; x++) for (let y = 1; y < 6; y++) if (6 * x + 8 * y < 48) n++; return n === 17 && 24 - (8 + 6 + gcd(8, 6)) / 2 + 1 === 17; },
  "diagonals-of-a-polygon": () => (20 * 17) / 2 === 170,
  "similar-shadows": () => near((6 / 4) * 30, 45),
  "box-diagonal": () => near(Math.sqrt(9 + 16 + 144), 13),
  "sphere-in-cylinder": () => near(((4 / 3) * Math.PI) / (2 * Math.PI), 2 / 3),
  "ptolemy-on-the-circle": () => {
    const s = Math.sqrt(37), R = s / Math.sqrt(3); const pt = (a: number) => ({ x: R * Math.cos(a), y: R * Math.sin(a) });
    const A = pt(Math.PI / 2), B = pt(Math.PI / 2 + (2 * Math.PI) / 3), Cc = pt(Math.PI / 2 + (4 * Math.PI) / 3);
    const dist = (p: any, q: any) => Math.hypot(p.x - q.x, p.y - q.y);
    let lo = Math.PI / 2, hi = Math.PI / 2 + (2 * Math.PI) / 3; // arc AB not containing C
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (dist(pt(m), A) < 3) lo = m; else hi = m; }
    const P = pt(lo); return near(dist(P, A), 3, 1e-6) && near(dist(P, B), 4, 1e-6) && near(dist(P, Cc), 7, 1e-6);
  },
  "distances-three-four-five": () => {
    const s = Math.sqrt(25 + 12 * Math.sqrt(3)); const x = (s * s - 7) / (2 * s); const y = Math.sqrt(9 - x * x);
    const C = { x: s / 2, y: (s * Math.sqrt(3)) / 2 }; const pc = Math.hypot(x - C.x, y - C.y);
    const inside = y > 0 && y < Math.sqrt(3) * x + 1e-9 && y < Math.sqrt(3) * (s - x) + 1e-9;
    return near(pc, 5, 1e-9) && inside && near((Math.sqrt(3) / 4) * s * s, 9 + (25 * Math.sqrt(3)) / 4);
  },
  "soddy-circle": () => { const r = 2 / Math.sqrt(3) - 1; const k = 1 / r; const k1 = 1; const desc = 3 * k1 + 2 * Math.sqrt(3 * k1 * k1); return near(k, desc, 1e-9) && near(r, 0.1547, 1e-4); },
};
