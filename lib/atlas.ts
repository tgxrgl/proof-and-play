import { CATEGORIES } from "./categories";
import type { PuzzleSummary } from "./puzzles";
import { DIFFICULTIES } from "./utils";

export const SIZE = 800;
export const C = SIZE / 2;
export const R_INNER = 84;
const BANDS: Record<string, [number, number]> = { Easy: [104, 174], Medium: [186, 264], Hard: [276, 342] };
export const R_OUT = 350;

export interface AtlasNode { slug: string; x: number; y: number; category: PuzzleSummary["category"]; hue: number; n: number; title: string; difficulty: PuzzleSummary["difficulty"] }
export interface AtlasSector { slug: string; hue: number; short: string; name: string; start: number; mid: number; path: string; labelX: number; labelY: number; anchor: "start" | "middle" | "end"; line: string }

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (r: number, deg: number) => [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))] as const;
const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 2000) / 1000 - 1; };

export function layoutAtlas(puzzles: PuzzleSummary[]) {
  const nodes: AtlasNode[] = [];
  const lines: Record<string, string> = {};
  const sectors: AtlasSector[] = CATEGORIES.map((c, i) => {
    const start = -90 + i * 36, mid = start + 18;
    const [x1, y1] = pt(R_INNER, start), [x2, y2] = pt(R_OUT, start), [x3, y3] = pt(R_OUT, start + 36), [x4, y4] = pt(R_INNER, start + 36);
    const [lx, ly] = pt(R_OUT + 22, mid); const cos = Math.cos(rad(mid));
    const path = `M${x1} ${y1} L${x2} ${y2} A${R_OUT} ${R_OUT} 0 0 1 ${x3} ${y3} L${x4} ${y4} A${R_INNER} ${R_INNER} 0 0 0 ${x1} ${y1} Z`;
    const pts: (readonly [number, number])[] = [];
    DIFFICULTIES.forEach((d, di) => {
      const group = puzzles.filter((p) => p.category === c.slug && p.difficulty === d);
      const [r0, r1] = BANDS[d]; const mr = (r0 + r1) / 2, half = (r1 - r0) / 2;
      const ordered = group.map((p, k) => ({ p, k }));
      ordered.forEach(({ p, k }) => {
        const t = (k + 0.5) / group.length;
        const ang = start + 4 + 28 * t;
        const r = mr + (k % 2 ? 1 : -1) * half * 0.38 + hash(p.slug) * half * 0.22;
        const [x, y] = pt(r, ang);
        nodes.push({ slug: p.slug, x, y, category: p.category, hue: c.hue, n: p.n, title: p.title, difficulty: p.difficulty });
        pts.push([x, y]);
      });
      if (di % 2 === 1) { // serpentine: reverse the middle band so the constellation is one continuous path
        const n = group.length; if (n) pts.splice(pts.length - n, n, ...pts.slice(pts.length - n).reverse());
      }
    });
    lines[c.slug] = pts.map(([x, y], j) => `${j ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    return { slug: c.slug, hue: c.hue, short: c.short, name: c.name, start, mid, path, labelX: lx, labelY: ly, anchor: cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle", line: `M${x1} ${y1} L${x2} ${y2}` } as AtlasSector;
  });
  return { nodes, sectors, lines };
}
