const near = (a: number, b: number, e = 1e-9) => Math.abs(a - b) < e;
export const checks: Record<string, () => boolean | string> = {
  "fiftieth-term": () => 3 + 4 * 49 === 199,
  "powers-of-two-sum": () => { let s = 0; for (let k = 0; k <= 10; k++) s += 2 ** k; return s === 2047; },
  "sum-of-first-squares": () => { let s = 0; for (let k = 1; k <= 10; k++) s += k * k; return s === 385; },
  "sum-of-first-cubes": () => { let s = 0; for (let k = 1; k <= 10; k++) s += k ** 3; return s === 3025 && 55 ** 2 === 3025; },
  "triangular-over-a-thousand": () => { let s = 0; for (let n = 1; ; n++) { s += n; if (s > 1000) return n === 45; } },
  "tribonacci-tenth": () => { const a = [0, 1, 1, 2]; for (let n = 4; n <= 10; n++) a[n] = a[n - 1] + a[n - 2] + a[n - 3]; return a[10] === 149; },
  "pell-numbers": () => { const a = [1, 2]; for (let i = 2; i < 6; i++) a[i] = 2 * a[i - 1] + a[i - 2]; return a.slice(0, 5).join() === "1,2,5,12,29" && a[5] === 70; },
  "double-and-add-one": () => { let a = 1; for (let n = 1; n < 20; n++) a = 2 * a + 1; return a === 1048575; },
  "digits-one-to-999": () => { let s = 0; for (let n = 1; n <= 999; n++) s += [...String(n)].reduce((x, d) => x + Number(d), 0); return s === 13500; },
  "telescoping-offset-two": () => { let s = 0; for (let n = 1; n < 2_000_000; n++) s += 1 / (n * (n + 2)); return near(s, 0.75, 1e-6); },
  "collatz-twenty-seven": () => { let n = 27, c = 0; while (n !== 1) { n = n % 2 ? 3 * n + 1 : n / 2; c++; } return c === 111; },
  "terms-in-a-progression": () => { let c = 0; for (let t = 7; t <= 497; t += 5) c++; return c === 99; },
  "recaman-tenth": () => { const a = [0]; const used = new Set([0]); for (let n = 1; n <= 10; n++) { let v = a[n - 1] - n; if (v <= 0 || used.has(v)) v = a[n - 1] + n; a.push(v); used.add(v); } return a.join() === "0,1,3,6,2,7,13,20,12,21,11"; },
  "series-n-squared-over-two-to-n": () => { let s = 0; for (let n = 1; n < 400; n++) s += (n * n) / 2 ** n; return near(s, 6, 1e-9); },
  "fibonacci-below-a-million": () => { let a = 1n, b = 1n, c = 0; while (a < 1000000n) { c++; [a, b] = [b, a + b]; } return c === 30; },
  "fibonacci-last-digit": () => { let a = 1n, b = 1n; for (let i = 3; i <= 2026; i++) [a, b] = [b, a + b]; const last = Number(b % 10n); let x = 1, y = 1, per = 0; for (let i = 1; ; i++) { [x, y] = [y, (x + y) % 10]; if (x === 1 && y === 1) { per = i; break; } } let f46a = 1n, f46b = 1n; for (let i = 3; i <= 46; i++) [f46a, f46b] = [f46b, f46a + f46b]; return last === 3 && per === 60 && f46b === 1836311903n; },
};
