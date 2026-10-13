const near = (a: number, b: number, e = 1e-9) => Math.abs(a - b) < e;
function perms<T>(a: T[]): T[][] { return a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])); }
// expected wait for a coin pattern, via Markov chain over longest matched prefix (value iteration)
function waitFor(pat: string) {
  const n = pat.length; const next = (s: number, c: string) => { const t = pat.slice(0, s) + c; for (let k = Math.min(n, t.length); k >= 0; k--) if (t.endsWith(pat.slice(0, k))) return k; return 0; };
  let E = new Array(n + 1).fill(0); for (let it = 0; it < 20000; it++) { const N = new Array(n + 1).fill(0); for (let s = 0; s < n; s++) N[s] = 1 + 0.5 * E[next(s, "H")] + 0.5 * E[next(s, "T")]; E = N; } return E[0];
}
// probability pattern A appears before B
function firstBefore(A: string, B: string) {
  let p = new Map<string, number>([["", 1]]); let a = 0; // exact over many steps
  for (let step = 0; step < 600; step++) { const q = new Map<string, number>(); for (const [h, pr] of p) for (const c of "HT") { const t = (h + c).slice(-2) === (h + c) ? h + c : (h + c).slice(-2); const full = h + c; if (full.endsWith(A)) { a += pr / 2; continue; } if (full.endsWith(B)) continue; q.set(full.slice(-2), (q.get(full.slice(-2)) ?? 0) + pr / 2); void t; } p = q; } return a;
}
export const checks: Record<string, () => boolean | string> = {
  "two-dice-seven": () => { let n = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === 7) n++; return n === 6; },
  "two-heads-in-four": () => { let n = 0; for (let m = 0; m < 16; m++) { let h = 0; for (let i = 0; i < 4; i++) h += (m >> i) & 1; if (h === 2) n++; } return n === 6; },
  "wait-for-a-six": () => { let e = 0; for (let n = 1; n < 2000; n++) e += n * (5 / 6) ** (n - 1) / 6; return near(e, 6, 1e-9); },
  "wait-for-two-heads": () => near(waitFor("HH"), 6, 1e-6),
  "wait-for-heads-tails": () => near(waitFor("HT"), 4, 1e-6),
  "at-least-one-boy": () => { const all = ["BB", "BG", "GB", "GG"].filter((x) => x.includes("B")); return near(all.filter((x) => x === "BB").length / all.length, 1 / 3); },
  "medical-test-bayes": () => near((0.99 * 0.01) / (0.99 * 0.01 + 0.01 * 0.99), 0.5),
  "fixed-points-expected": () => { for (const n of [3, 4, 5, 6]) { let tot = 0, c = 0; for (const p of perms([...Array(n).keys()])) { c++; tot += p.filter((v, i) => v === i).length; } if (!near(tot / c, 1)) return false; } return true; },
  "gamblers-ruin": () => { const N = 10; let p = new Array(N + 1).fill(0); p[N] = 1; for (let it = 0; it < 20000; it++) for (let i = 1; i < N; i++) p[i] = 0.5 * (p[i - 1] + p[i + 1]); return near(p[3], 0.3, 1e-9); },
  "coupon-collector-die": () => { let e = 0; for (let k = 0; k < 6; k++) e += 6 / (6 - k); return near(e, 14.7); },
  "three-dice-match": () => { let n = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++) if (a === b || b === c || a === c) n++; return n === 96 && near(n / 216, 4 / 9); },
  "expected-maximum-two-dice": () => { let s = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) s += Math.max(a, b); return s === 161; },
  "secretary-problem-ten": () => {
    const n = 10; const P = (r: number) => { let s = 0; for (let i = r; i <= n - 1; i++) s += 1 / i; return (r / n) * s; };
    // brute-force check the formula at n=7, r=3 over all permutations
    const n2 = 7, r2 = 3; let win = 0, tot = 0; for (const p of perms([...Array(n2).keys()])) { tot++; let best = -1; for (let i = 0; i < r2; i++) best = Math.max(best, p[i]); let pick = p[n2 - 1]; for (let i = r2; i < n2; i++) if (p[i] > best) { pick = p[i]; break; } if (pick === n2 - 1) win++; }
    let s = 0; for (let i = r2; i <= n2 - 1; i++) s += 1 / i; if (!near(win / tot, (r2 / n2) * s, 1e-12)) return "formula mismatch";
    let bestR = 1; for (let r = 1; r < n; r++) if (P(r) > P(bestR)) bestR = r;
    return bestR === 3 && near(P(3), 3349 / 8400, 1e-12) && near(P(1), 0.2829, 1e-4) && near(P(2), 0.3658, 1e-4) && near(P(4), 0.3983, 1e-4) && near(P(5), 0.3728, 1e-4);
  },
  "buffons-needle": () => { let a = 0; const N = 2_000_000; for (let i = 0; i < N; i++) { const th = ((i + 0.5) / N) * (Math.PI / 2); a += 0.5 * Math.sin(th) * (Math.PI / 2 / N); } return near(a / (Math.PI / 4), 2 / Math.PI, 1e-9); },
  "random-walk-returns": () => { let n = 0; for (let m = 0; m < 1024; m++) { let b = 0; for (let i = 0; i < 10; i++) b += (m >> i) & 1; if (b === 5) n++; } return n === 252 && near(n / 1024, 63 / 256); },
  "penneys-game": () => near(firstBefore("THH", "HHT"), 0.75, 1e-6),
};
