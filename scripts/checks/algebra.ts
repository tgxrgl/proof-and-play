const near = (a: number, b: number, e = 1e-9) => Math.abs(a - b) < e;
export const checks: Record<string, () => boolean | string> = {
  "sum-from-product": () => { const d = Math.sqrt(49 - 40); const x = (7 + d) / 2, y = (7 - d) / 2; return near(x * y, 10) && near(x * x + y * y, 29); },
  "two-thousand-twenty-six": () => 2026 ** 2 - 2024 ** 2 === 8100,
  "sum-of-root-cubes": () => { const d = Math.sqrt(25 - 12); const r = (5 + d) / 2, s = (5 - d) / 2; return near(r ** 3 + s ** 3, 80); },
  "two-absolute-values": () => { const f = (x: number) => Math.abs(x - 3) + Math.abs(x + 2); const sols: number[] = []; for (let x = -100000; x <= 100000; x++) if (near(f(x / 100), 9, 1e-9)) sols.push(x / 100); return sols.length === 2 && near(sols[0] + sols[1], 1); },
  "minimum-of-a-parabola": () => { let m = Infinity; for (let x = -50; x <= 50; x += 0.001) m = Math.min(m, x * x - 6 * x + 13); return near(m, 4, 1e-5); },
  "ages-and-the-past": () => { for (let A = 1; A < 63; A++) { const B = 63 - A; const ago = A - B; if (ago > 0 && B - ago > 0 && A === 2 * (B - ago)) return A === 36; } return false; },
  "chained-exponents": () => { const x = Math.log2(5), y = Math.log(8) / Math.log(5); return near(x * y, 3, 1e-9); },
  "denesting-a-radical": () => near(Math.sqrt(7 + 4 * Math.sqrt(3)), 2 + Math.sqrt(3)),
  "three-symmetric-sums": () => { const v = [1, 2, 3]; return v[0] + v[1] + v[2] === 6 && 2 + 6 + 3 === 11 && v[0] * v[1] * v[2] === 6 && v.reduce((s, t) => s + t ** 3, 0) === 36; },
  "amgm-minimum": () => { let m = Infinity; for (let x = 0.01; x < 100; x += 0.001) m = Math.min(m, x + 9 / x); return near(m, 6, 1e-4); },
  "remainder-theorem-pair": () => { const R = (x: number) => 2 * x + 3; return R(1) === 5 && R(2) === 7 && R(3) === 9; },
  "a-logarithm-equation": () => near(Math.log2(4) + Math.log2(2), 3),
  "three-and-five": () => { let n = 0; for (let x = 0; x <= 40; x++) for (let y = 0; y <= 25; y++) if (3 * x + 5 * y === 100) n++; return n === 7; },
  "difference-of-squares-2024": () => { let n = 0; for (let y = 1; y < 2000; y++) { const x = Math.sqrt(2024 + y * y); if (Number.isInteger(x)) n++; } return n === 4; },
  "a-quadratic-recurrence": () => { let f = 0; for (let x = 0; x < 10; x++) f += 2 * x + 1; return f === 100; },
  "exponent-equals-one": () => { const sols = [1, 2, 3, 4, 5]; return sols.every((x) => near(Math.pow(x * x - 5 * x + 5, x * x - 9 * x + 20), 1)) && sols.reduce((a, b) => a + b) === 15; },
};
