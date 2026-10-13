const near = (a: number, b: number, e = 1e-9) => Math.abs(a - b) < e;
function det(a: number[][]) { const n = a.length; a = a.map((r) => [...r]); let d = 1; for (let i = 0; i < n; i++) { let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(a[r][i]) > Math.abs(a[p][i])) p = r; if (Math.abs(a[p][i]) < 1e-12) return 0; if (p !== i) { [a[i], a[p]] = [a[p], a[i]]; d = -d; } d *= a[i][i]; for (let r = i + 1; r < n; r++) { const f = a[r][i] / a[i][i]; for (let c = i; c < n; c++) a[r][c] -= f * a[i][c]; } } return d; }
function trees(n: number, edges: [number, number][]) { const L = Array.from({ length: n }, () => new Array(n).fill(0)); for (const [u, v] of edges) { L[u][u]++; L[v][v]++; L[u][v]--; L[v][u]--; } return Math.round(det(L.slice(1).map((r) => r.slice(1)))); }
function colorable(n: number, adj: number[][], k: number) { const col = new Array(n).fill(-1); const go = (v: number): boolean => { if (v === n) return true; for (let c = 0; c < k; c++) if (adj[v].every((u) => col[u] !== c)) { col[v] = c; if (go(v + 1)) return true; col[v] = -1; } return false; }; return go(0); }
function chromatic(n: number, adj: number[][]) { for (let k = 1; k <= n; k++) if (colorable(n, adj, k)) return k; return -1; }
export const checks: Record<string, () => boolean | string> = {
  "edges-of-k10": () => (10 * 9) / 2 === 45,
  "edges-of-a-tree": () => { let e = 0; for (let v = 1; v < 20; v++) e++; return e === 19 && trees(4, [[0, 1], [1, 2], [2, 3]]) === 1; },
  "cubic-graph-edges": () => (8 * 3) / 2 === 12,
  "euler-circuits-in-kn": () => { let c = 0; for (let n = 2; n <= 10; n++) if ((n - 1) % 2 === 0) c++; return c === 4; },
  "max-planar-edges": () => 3 * 10 - 6 === 24,
  "petersen-coloring": () => { const adj: number[][] = Array.from({ length: 10 }, () => []); const add = (a: number, b: number) => { adj[a].push(b); adj[b].push(a); }; for (let i = 0; i < 5; i++) { add(i, (i + 1) % 5); add(5 + i, 5 + ((i + 2) % 5)); add(i, 5 + i); } return chromatic(10, adj) === 3 && !colorable(10, adj, 2); },
  "spanning-trees-k23": () => { const e: [number, number][] = []; for (let a = 0; a < 2; a++) for (let b = 2; b < 5; b++) e.push([a, b]); return trees(5, e) === 12 && 2 ** 2 * 3 === 12; },
  "shortest-route": () => { const E: [string, string, number][] = [["A", "B", 4], ["A", "C", 2], ["B", "C", 1], ["B", "D", 5], ["C", "D", 8], ["C", "E", 10], ["D", "E", 2], ["D", "F", 6], ["E", "F", 3]]; const d: Record<string, number> = { A: 0, B: 1e9, C: 1e9, D: 1e9, E: 1e9, F: 1e9 }; for (let it = 0; it < 10; it++) for (const [u, v, w] of E) { d[v] = Math.min(d[v], d[u] + w); d[u] = Math.min(d[u], d[v] + w); } return d.F === 13 && d.B === 3 && d.D === 8 && d.E === 10 && 2 + 1 + 5 + 2 + 3 === 13; },
  "mantel-triangle-free": () => { // brute force n=6 -> max edges 9, formula floor(n^2/4)
    const n = 6, pairs: [number, number][] = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([i, j]); let best = 0;
    for (let m = 0; m < 1 << pairs.length; m++) { const A = Array.from({ length: n }, () => new Array(n).fill(false)); let e = 0; pairs.forEach(([i, j], k) => { if ((m >> k) & 1) { A[i][j] = A[j][i] = true; e++; } }); if (e <= best) continue; let tri = false; for (let i = 0; i < n && !tri; i++) for (let j = i + 1; j < n && !tri; j++) if (A[i][j]) for (let k = j + 1; k < n; k++) if (A[i][k] && A[j][k]) { tri = true; break; } if (!tri) best = e; }
    return best === 9 && Math.floor(100 / 4) === 25; },
  "perfect-matchings-k44": () => { let n = 0; const go = (i: number, used: number) => { if (i === 4) { n++; return; } for (let j = 0; j < 4; j++) if (!((used >> j) & 1)) go(i + 1, used | (1 << j)); }; go(0, 0); return n === 24; },
  "labeled-graphs-four": () => 2 ** 6 === 64,
  "ramsey-six": () => {
    const mono = (n: number, col: number[][]) => { for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) if (col[i][j] === col[i][k] && col[i][j] === col[j][k]) return true; return false; };
    const pairs = (n: number) => { const p: [number, number][] = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) p.push([i, j]); return p; };
    const exists = (n: number) => { const P = pairs(n); for (let m = 0; m < 1 << P.length; m++) { const col = Array.from({ length: n }, () => new Array(n).fill(0)); P.forEach(([i, j], k) => { col[i][j] = col[j][i] = (m >> k) & 1; }); if (!mono(n, col)) return true; } return false; };
    return exists(5) && !exists(6); },
  "hamiltonian-cycles-k8": () => { const count = (n: number) => { let c = 0; const go = (cur: number, used: number, k: number) => { if (k === n) { c++; return; } for (let j = 1; j < n; j++) if (!((used >> j) & 1)) go(j, used | (1 << j), k + 1); }; go(0, 1, 1); return c / 2; }; return count(6) === 60 && 5040 / 2 === 2520; },
  "cube-antipodal-paths": () => { let n = 0; const go = (v: number, steps: number) => { if (steps === 3) { if (v === 7) n++; return; } for (let b = 0; b < 3; b++) if (!((v >> b) & 1)) go(v | (1 << b), steps + 1); }; go(0, 0); return n === 6; },
  "wheel-six-coloring": () => { const adj: number[][] = Array.from({ length: 7 }, () => []); const add = (a: number, b: number) => { adj[a].push(b); adj[b].push(a); }; for (let i = 0; i < 6; i++) { add(i, (i + 1) % 6); add(i, 6); } return chromatic(7, adj) === 3; },
  "domino-tilings-chessboard": () => { const W = 8, H = 8; let dp = new Map<number, number>([[0, 1]]);
    for (let r = 0; r < H; r++) { const nd = new Map<number, number>(); for (const [mask, cnt] of dp) { const go = (c: number, cur: number, next: number) => { if (c === W) { nd.set(next, (nd.get(next) ?? 0) + cnt); return; } if ((cur >> c) & 1) return go(c + 1, cur, next); if (r < H - 1) go(c + 1, cur, next | (1 << c)); if (c + 1 < W && !((cur >> (c + 1)) & 1)) go(c + 2, cur, next); }; go(0, mask, 0); } dp = nd; }
    return dp.get(0) === 12988816; },
};
