const near = (a: number, b: number, e = 1e-9) => Math.abs(a - b) < e;
function perms<T>(a: T[]): T[][] { return a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])); }

export const checks: Record<string, () => boolean | string> = {
  "mislabeled-fruit-boxes": () => {
    const labels = ["A", "O", "M"]; const worlds = perms(labels).filter((c) => c.every((x, i) => x !== labels[i])); // c[i]=true contents of box labeled labels[i]
    const outcomes = new Map<string, number>(); for (const w of worlds) { const seen = w[2] === "A" ? "apple" : "orange"; outcomes.set(seen, (outcomes.get(seen) ?? 0) + 1); }
    return worlds.length === 2 && outcomes.size === 2 && [...outcomes.values()].every((v) => v === 1);
  },
  "wolf-goat-cabbage": () => {
    const ok = (s: number[]) => { const [f, w, g, c] = s; return !(w === g && f !== g) && !(g === c && f !== g); };
    const k = (s: number[]) => s.join(""); const q: [number[], number][] = [[[0, 0, 0, 0], 0]]; const seen = new Set([k(q[0][0])]);
    while (q.length) { const [s, d] = q.shift()!; if (k(s) === "1111") return d === 7;
      for (let carry = -1; carry < 3; carry++) { const n = [...s]; n[0] = 1 - n[0]; if (carry >= 0) { if (s[carry + 1] !== s[0]) continue; n[carry + 1] = n[0]; } if (ok(n) && !seen.has(k(n))) { seen.add(k(n)); q.push([n, d + 1]); } } }
    return false;
  },
  "eight-five-three-jugs": () => {
    const cap = [8, 5, 3]; const q: [number[], number][] = [[[8, 0, 0], 0]]; const seen = new Set(["8,0,0"]);
    while (q.length) { const [s, d] = q.shift()!; if (s[0] === 4 && s[1] === 4) return d === 7;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== j) { const t = Math.min(s[i], cap[j] - s[j]); if (t > 0) { const n = [...s]; n[i] -= t; n[j] += t; if (!seen.has(n.join())) { seen.add(n.join()); q.push([n, d + 1]); } } } }
    return false;
  },
  "two-guards": () => {
    for (const askedTruthful of [true, false]) for (const safe of [0, 1]) {
      const otherAnswer = askedTruthful ? 1 - safe /* liar points to danger */ : safe /* truthful points to safe */; // what the other guard would say
      const reply = askedTruthful ? otherAnswer : 1 - otherAnswer; // asked guard reports truthfully / lies about it
      if (reply === safe) return false; // reply must point to danger
    }
    return true;
  },
  "three-liars-chain": () => {
    const sols: string[] = [];
    for (let m = 0; m < 8; m++) { const [A, B, C] = [m & 1, (m >> 1) & 1, (m >> 2) & 1].map(Boolean); // truthful?
      if (A === !B && B === !C && C === (!A && !B)) sols.push(`${+A}${+B}${+C}`); }
    return sols.length === 1 && sols[0] === "010";
  },
  "sum-and-product-puzzle": () => {
    const pairs: [number, number][] = []; for (let x = 2; x < 100; x++) for (let y = x + 1; x + y <= 100; y++) pairs.push([x, y]);
    const group = (f: (p: [number, number]) => number, list: [number, number][]) => { const m = new Map<number, [number, number][]>(); list.forEach((p) => { const k = f(p); (m.get(k) ?? m.set(k, []).get(k)!).push(p); }); return m; };
    const P = (p: [number, number]) => p[0] * p[1], Sm = (p: [number, number]) => p[0] + p[1];
    const byP = group(P, pairs), byS = group(Sm, pairs);
    const sums = new Set([...byS.keys()].filter((s) => byS.get(s)!.every((p) => byP.get(P(p))!.length > 1)));
    if ([...sums].sort((a, b) => a - b).join() !== "11,17,23,27,29,35,37,41,47,53") return "sum list mismatch";
    const c2 = pairs.filter((p) => sums.has(Sm(p))); const g2 = group(P, c2); const c3 = c2.filter((p) => g2.get(P(p))!.length === 1);
    const g3 = group(Sm, c3); const c4 = c3.filter((p) => g3.get(Sm(p))!.length === 1);
    return c4.length === 1 && c4[0][0] === 4 && c4[0][1] === 13;
  },
  "pairs-of-socks": () => { for (const picks of perms([0, 1, 2])) if (new Set(picks).size < picks.length) return false; return true; },
  "three-switches": () => {
    // switch states after procedure: s1 on-then-off (warm, dark), s2 on (lit), s3 never (cold, dark); observation is injective
    const obs = (st: string) => (st === "s1" ? "warm-dark" : st === "s2" ? "lit" : "cold-dark");
    return new Set(["s1", "s2", "s3"].map(obs)).size === 3;
  },
  "bridge-and-torch": () => {
    const t = [1, 2, 5, 10], n = 4, full = 15; const seen = new Set<string>(); const pq: [number, number, number][] = [[0, full, 0]];
    while (pq.length) { pq.sort((a, b) => a[0] - b[0]); const [c, m, side] = pq.shift()!; const k = m + "," + side; if (seen.has(k)) continue; seen.add(k); if (m === 0 && side === 1) return c === 17;
      const from = side === 0 ? m : full & ~m; const idx = [0, 1, 2, 3].filter((i) => (from >> i) & 1);
      for (const i of idx) for (const j of idx) if (j >= i) { const mv = (1 << i) | (1 << j); pq.push([c + Math.max(t[i], t[j]), side === 0 ? m & ~mv : m | mv, 1 - side]); } }
    return false;
  },
  "hundred-prisoners": () => {
    const q = (n: number) => { let h = 0; for (let k = n / 2 + 1; k <= n; k++) h += 1 / k; return 1 - h; };
    // exact check at n=6 (half=3) by enumerating permutations: success iff all cycles <= 3
    let good = 0, tot = 0; for (const p of perms([0, 1, 2, 3, 4, 5])) { tot++; const seen = new Array(6).fill(false); let ok = true; for (let i = 0; i < 6; i++) if (!seen[i]) { let len = 0, j = i; while (!seen[j]) { seen[j] = true; j = p[j]; len++; } if (len > 3) ok = false; } if (ok) good++; }
    return near(good / tot, q(6), 1e-12) && near(q(100), 0.3118, 1e-4);
  },
  "twelve-coins-three-weighings": () => { let k = 0; while (3 ** k < 24) k++; return k === 3 && 3 ** 2 < 24; },
  "pets-by-elimination": () => {
    const sols: string[][] = []; for (const p of perms(["cat", "dog", "fish"])) { const [a, b, c] = p; if (a !== "dog" && c !== "cat" && b !== "fish" && c !== "dog") sols.push(p); }
    return sols.length === 1 && sols[0][2] === "fish";
  },
  "knights-trio": () => {
    const sols: string[] = []; for (let m = 0; m < 8; m++) { const k = [m & 1, (m >> 1) & 1, (m >> 2) & 1].map(Boolean); const n = k.filter(Boolean).length;
      const sa = n === 0, sb = n === 1; if (k[0] === sa && k[1] === sb) sols.push(k.map((x) => (x ? "knight" : "knave")).join()); }
    return sols.length === 1 && sols[0] === "knave,knight,knave";
  },
  "blue-eyed-islanders": () => {
    for (let n = 3; n <= 5; n++) for (let k = 1; k <= n; k++) {
      let W: number[] = []; for (let m = 1; m < 1 << n; m++) W.push(m); const actual = (1 << k) - 1;
      const leavers = (w: number, Ws: number[]) => { let L = 0; for (let i = 0; i < n; i++) { const a = Ws.includes(w), b = Ws.includes(w ^ (1 << i)); if (a && !b) L |= 1 << i; } return L; };
      let night = 0, found = -1;
      for (night = 1; night <= n + 1 && found < 0; night++) { const L = leavers(actual, W); if (L) { found = night; if (L !== actual) return false; } W = W.filter((v) => leavers(v, W) === L); }
      if (found !== k) return false;
    }
    return true;
  },
  "census-ages": () => {
    const t: number[][] = []; for (let a = 1; a <= 36; a++) for (let b = a; b <= 36; b++) for (let c = b; c <= 36; c++) if (a * b * c === 36) t.push([a, b, c]);
    const sums = new Map<number, number[][]>(); t.forEach((x) => { const s = x[0] + x[1] + x[2]; (sums.get(s) ?? sums.set(s, []).get(s)!).push(x); });
    const amb = [...sums.values()].filter((v) => v.length > 1); return amb.length === 1 && amb[0].length === 2 && amb[0].filter((x) => x[2] > x[1]).length === 1 && amb[0].find((x) => x[2] > x[1])!.join() === "2,2,9";
  },
  "twenty-one-sticks": () => { const win: boolean[] = [false]; for (let n = 1; n <= 21; n++) win[n] = [1, 2, 3].some((t) => n >= t && !win[n - t]); const good = [1, 2, 3].filter((t) => !win[21 - t]); return win[21] && good.length === 1 && good[0] === 1; },
};
