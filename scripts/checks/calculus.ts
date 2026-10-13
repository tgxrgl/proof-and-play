const near = (a: number, b: number, e = 1e-9) => Math.abs(a - b) < e;
const simpson = (f: (x: number) => number, a: number, b: number, n = 20000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return (s * h) / 3; };
export const checks: Record<string, () => boolean | string> = {
  "slope-at-two": () => { const f = (x: number) => x ** 3 - 3 * x; return near((f(2 + 1e-6) - f(2 - 1e-6)) / 2e-6, 9, 1e-5); },
  "area-under-x-squared": () => near(simpson((x) => x * x, 0, 3), 9, 1e-9),
  "removable-limit": () => near(((2 + 1e-7) ** 2 - 4) / 1e-7, 4, 1e-5),
  "sine-limit-five": () => near(Math.sin(5e-7) / 1e-7, 5, 1e-6),
  "sine-squared-integral": () => near(simpson((x) => Math.sin(x) ** 2, 0, Math.PI / 2), Math.PI / 4, 1e-9),
  "peak-of-x-e-minus-x": () => { let m = 0; for (let x = 0; x < 20; x += 1e-4) m = Math.max(m, x * Math.exp(-x)); return near(m, 1 / Math.E, 1e-7); },
  "limit-to-e-cubed": () => near((1 + 3 / 1e9) ** 1e9, Math.E ** 3, 1e-5),
  "line-and-parabola-area": () => near(simpson((x) => x - x * x, 0, 1), 1 / 6, 1e-9),
  "paraboloid-volume": () => near(simpson((x) => Math.PI * x, 0, 4), 8 * Math.PI, 1e-9),
  "one-minus-cosine-limit": () => near((1 - Math.cos(1e-3)) / 1e-6, 0.5, 1e-6),
  "integral-x-e-x": () => near(simpson((x) => x * Math.exp(x), 0, 1), 1, 1e-9),
  "integral-of-ln": () => near(simpson((x) => Math.log(x), 1, Math.E), 1, 1e-9),
  "gaussian-integral": () => near(simpson((x) => Math.exp(-x * x), 0, 12, 200000), Math.sqrt(Math.PI) / 2, 1e-9),
  "wallis-sine-sixth": () => near(simpson((x) => Math.sin(x) ** 6, 0, Math.PI / 2), (5 * Math.PI) / 32, 1e-9),
  "square-root-limit": () => { const n = 1e6; return near(n * (Math.sqrt(n * n + 1) - n), 0.5, 1e-5); },
  "minimum-of-x-to-the-x": () => { let m = Infinity; for (let x = 0.01; x < 3; x += 1e-5) m = Math.min(m, x ** x); return near(m, Math.exp(-1 / Math.E), 1e-8); },
};
