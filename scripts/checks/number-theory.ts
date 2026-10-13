const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const isPrime = (n: number) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const divs = (n: number) => { let c = 0; for (let d = 1; d <= n; d++) if (n % d === 0) c++; return c; };
export const checks: Record<string, () => boolean | string> = {
  "lcm-of-three": () => { for (let t = 1; ; t++) if (t % 12 === 0 && t % 18 === 0 && t % 30 === 0) return t === 180; },
  "sum-of-divisors-28": () => { let s = 0; for (let d = 1; d <= 28; d++) if (28 % d === 0) s += d; return s === 56; },
  "two-to-the-hundred-mod-seven": () => Number((2n ** 100n) % 7n) === 2,
  "zeros-of-100-factorial": () => { let f = 1n; for (let i = 2n; i <= 100n; i++) f *= i; const s = f.toString(); return s.length - s.replace(/0+$/, "").length === 24; },
  "primes-below-a-hundred": () => { let n = 0; for (let i = 2; i < 100; i++) if (isPrime(i)) n++; return n === 25; },
  "twelve-divisors": () => { for (let n = 1; ; n++) if (divs(n) === 12) return n === 60; },
  "last-two-digits-of-sevens": () => Number((7n ** 2026n) % 100n) === 49,
  "coprime-to-thirty": () => { let n = 0; for (let i = 1; i <= 1000; i++) if (i % 2 && i % 3 && i % 5) n++; return n === 266; },
  "n-plus-one-divides": () => { let s = 0; for (let n = 1; n < 100000; n++) if ((n * n + 7) % (n + 1) === 0) s += n; return s === 11; },
  "prime-triplets": () => { let n = 0; for (let p = 2; p < 200000; p++) if (isPrime(p) && isPrime(p + 2) && isPrime(p + 4)) n++; return n === 1; },
  "sunzi-remainders": () => { for (let n = 1; ; n++) if (n % 3 === 2 && n % 5 === 3 && n % 7 === 2) return n === 23; },
  "square-divisors-of-7200": () => { let c = 0; for (let d = 1; d <= 7200; d++) if (7200 % d === 0 && Number.isInteger(Math.sqrt(d))) c++; return c === 12 && 7200 === 2 ** 5 * 9 * 25; },
  "sum-of-coprime-residues": () => { let s = 0, c = 0; for (let k = 1; k <= 100; k++) if (gcd(k, 100) === 1) { s += k; c++; } return s === 2000 && c === 40; },
  "two-squares-of-sixty-five": () => { let n = 0; for (let x = -9; x <= 9; x++) for (let y = -9; y <= 9; y++) if (x * x + y * y === 65) n++; return n === 16; },
  "wilson-twenty-factorial": () => { let f = 1n; for (let i = 2n; i <= 20n; i++) f *= i; return Number(f % 23n) === 11; },
  "remainders-one-less": () => { for (let n = 1; ; n++) { let ok = true; for (let k = 2; k <= 10; k++) if (n % k !== k - 1) { ok = false; break; } if (ok) return n === 2519; } },
};
