import type { CategorySlug } from "@/lib/types";

/** Tiny abstract line illustration per category, used on cards. */
export function Glyph({ category, className }: { category: CategorySlug; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const dots = [[10,10],[22,10],[34,10],[46,10],[58,10],[10,22],[22,22],[34,22],[46,22],[58,22],[10,34],[22,34],[34,34],[46,34],[58,34]];
  const primes = new Set([1, 2, 4, 6, 8, 12]);
  let body;
  switch (category) {
    case "algebra": body = <><path {...p} d="M6 38 H66 M12 40 V6" /><path {...p} d="M16 10 Q36 60 58 8" /></>; break;
    case "geometry": body = <><path {...p} d="M8 36 L30 8 L52 36 Z" /><circle {...p} cx="48" cy="26" r="12" /></>; break;
    case "number-theory": body = <>{dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={primes.has(i) ? 4 : 2} fill={primes.has(i) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" />)}</>; break;
    case "logic": body = <><circle {...p} cx="26" cy="22" r="14" /><circle {...p} cx="44" cy="22" r="14" /></>; break;
    case "combinatorics": body = <><path {...p} d="M36 6 V14 M36 14 L16 26 M36 14 L56 26 M16 26 L8 38 M16 26 L24 38 M56 26 L48 38 M56 26 L64 38" /><circle cx="36" cy="6" r="2.5" fill="currentColor" /></>; break;
    case "probability": body = <><path {...p} d="M4 38 H68" /><path {...p} d="M6 38 C22 38 24 6 36 6 C48 6 50 38 66 38" /></>; break;
    case "sequences": body = <>{[0,1,2,3,4].map((i) => <rect key={i} x={8 + i * 12} y={34 - (i + 1) * 5 - i * i} width="8" height={(i + 1) * 5 + i * i + 2} rx="1.5" {...p} />)}</>; break;
    case "graph-theory": body = <><path {...p} d="M12 12 L34 8 L58 16 L44 36 L16 32 Z M34 8 L44 36 M12 12 L44 36" /><g fill="currentColor">{[[12,12],[34,8],[58,16],[44,36],[16,32]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" />)}</g></>; break;
    case "calculus": body = <><path d="M12 38 C22 38 22 12 36 12 C48 12 50 30 60 30 V38 Z" fill="currentColor" opacity=".18" /><path {...p} d="M4 38 H68 M12 38 C22 38 22 12 36 12 C48 12 50 30 60 30" /></>; break;
    default: body = <><rect {...p} x="12" y="6" width="32" height="32" rx="2" /><path {...p} d="M28 6 V38 M12 22 H44 M44 6 H60 V38 H44" /></>;
  }
  return <svg viewBox="0 0 72 44" className={className} aria-hidden="true">{body}</svg>;
}
