"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORY_MAP } from "@/lib/categories";
import { C, R_INNER, R_OUT, SIZE, layoutAtlas } from "@/lib/atlas";
import { useHydrated, useStore } from "@/lib/hooks";
import type { PuzzleSummary } from "@/lib/puzzles";
import type { CategorySlug } from "@/lib/types";
import { DifficultyBadge } from "./ui";

interface Props {
  puzzles: PuzzleSummary[];
  /** Slugs that match the current filters; null means everything matches. */
  matches: Set<string> | null;
  activeCategories?: CategorySlug[];
  onCategory?: (c: CategorySlug) => void;
  dailySlug?: string | null;
}

export function Atlas({ puzzles, matches, activeCategories = [], onCategory, dailySlug }: Props) {
  const { nodes, sectors, lines } = useMemo(() => layoutAtlas(puzzles), [puzzles]);
  const { progress, bookmarks } = useStore();
  const hydrated = useHydrated();
  const [hover, setHover] = useState<string | null>(null);
  const [hoverCat, setHoverCat] = useState<CategorySlug | null>(null);
  const byslug = useMemo(() => new Map(puzzles.map((p) => [p.slug, p])), [puzzles]);
  const solved = hydrated ? puzzles.filter((p) => progress[p.slug]?.status === "solved").length : 0;
  const hovered = hover ? nodes.find((n) => n.slug === hover) : null;
  const hp = hover ? byslug.get(hover) : null;
  const flip = hovered ? hovered.y < SIZE * 0.34 : false;
  const left = hovered ? Math.min(82, Math.max(18, (hovered.x / SIZE) * 100)) : 0;

  return (
    <div className="relative mx-auto w-full max-w-[860px]">
      <div className="overflow-x-auto sm:overflow-visible [-webkit-overflow-scrolling:touch]">
        <svg viewBox={`-60 -30 ${SIZE + 120} ${SIZE + 60}`} className="mx-auto block min-w-[620px] sm:min-w-0 w-full select-none" role="group" aria-label="Atlas of puzzles. Each star is a puzzle; distance from the centre shows difficulty.">
          <defs>
            <radialGradient id="atlas-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.18" /><stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={C} cy={C} r={R_OUT + 10} fill="url(#atlas-core)" />
          {[104, 180, 270, 345].map((r) => <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="hsl(var(--line))" strokeWidth="1" strokeDasharray={r === 345 ? undefined : "2 6"} />)}
          {sectors.map((s) => {
            const on = hoverCat === s.slug || activeCategories.includes(s.slug as CategorySlug);
            return (
              <g key={s.slug} className="cat" style={{ "--h": s.hue } as React.CSSProperties}>
                <path d={s.path} fill="var(--c)" opacity={on ? 0.12 : 0} className="transition-opacity duration-300" />
                <path d={s.line} stroke="hsl(var(--line))" strokeWidth="1" />
                <path d={lines[s.slug]} fill="none" stroke="var(--c)" strokeWidth="1" opacity={on ? 0.7 : 0.28} className="transition-opacity" />
                <a href={`/category/${s.slug}`} onClick={onCategory ? (e) => { e.preventDefault(); onCategory(s.slug as CategorySlug); } : undefined}
                  onMouseEnter={() => setHoverCat(s.slug as CategorySlug)} onMouseLeave={() => setHoverCat(null)} onFocus={() => setHoverCat(s.slug as CategorySlug)} onBlur={() => setHoverCat(null)}
                  aria-label={onCategory ? `Filter by ${s.name}` : `Open ${s.name}`}>
                  <text x={s.labelX} y={s.labelY} textAnchor={s.anchor} dominantBaseline="middle" fill="var(--c)" fontSize="15" letterSpacing="2.5" style={{ fontFamily: "var(--font-sans)", fontWeight: 600, textTransform: "uppercase" }}>{s.short}</text>
                </a>
              </g>
            );
          })}

          {nodes.map((n) => {
            const st = hydrated ? progress[n.slug] : undefined;
            const dim = matches !== null && !matches.has(n.slug);
            const isSolved = st?.status === "solved", tried = st?.attempted && !isSolved;
            const isDaily = dailySlug === n.slug;
            return (
              <g key={n.slug} className="cat" style={{ "--h": n.hue, opacity: dim ? 0.1 : 1, transition: "opacity .25s" } as React.CSSProperties}>
                <Link href={`/puzzle/${n.slug}`} tabIndex={dim ? -1 : 0}
                  aria-label={`Number ${n.n}, ${n.title}, ${CATEGORY_MAP[n.category].name}, ${n.difficulty}${isSolved ? ", solved" : tried ? ", in progress" : ""}`}
                  onMouseEnter={() => setHover(n.slug)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(n.slug)} onBlur={() => setHover(null)} className="outline-none">
                  <circle cx={n.x} cy={n.y} r="13" fill="transparent" />
                  {isDaily && <circle cx={n.x} cy={n.y} r="12" fill="none" stroke="var(--c)" strokeWidth="1.2" className="animate-ping" style={{ transformOrigin: `${n.x}px ${n.y}px` }} />}
                  <circle cx={n.x} cy={n.y} r={hover === n.slug ? 7.5 : isSolved ? 6 : 4.6}
                    fill={isSolved ? "var(--c)" : tried ? "var(--c)" : "hsl(var(--bg))"} fillOpacity={isSolved ? 1 : tried ? 0.4 : 1}
                    stroke="var(--c)" strokeWidth={isSolved ? 0 : 1.6} style={isSolved ? { filter: "drop-shadow(0 0 5px var(--c))" } : undefined} className="transition-all duration-150" />
                  {hydrated && bookmarks.includes(n.slug) && <path d={`M${n.x} ${n.y - 11} l3.2 3.2 -3.2 3.2 -3.2 -3.2 z`} fill="hsl(var(--ink))" />}
                </Link>
              </g>
            );
          })}

          <circle cx={C} cy={C} r={R_INNER - 14} fill="hsl(var(--surface))" stroke="hsl(var(--line))" />
          <text x={C} y={C - 2} textAnchor="middle" fill="hsl(var(--ink))" fontSize="46" style={{ fontFamily: "var(--font-serif)" }}>{solved}</text>
          <text x={C} y={C + 22} textAnchor="middle" fill="hsl(var(--muted))" fontSize="12" letterSpacing="2" style={{ textTransform: "uppercase" }}>of {puzzles.length} solved</text>
        </svg>
      </div>

      {hovered && hp && (
        <div role="status" className="pointer-events-none absolute z-10 w-64 animate-rise rounded-xl border border-line bg-surface/95 p-4 shadow-xl backdrop-blur"
          style={{ left: `${left}%`, top: `${(hovered.y / SIZE) * 100}%`, transform: flip ? "translate(-50%, 18px)" : "translate(-50%, calc(-100% - 18px))" }}>
          <CardInner p={hp} status={hydrated ? progress[hp.slug]?.status : undefined} />
        </div>
      )}
    </div>
  );
}

function CardInner({ p, status }: { p: PuzzleSummary; status?: string }) {
  const c = CATEGORY_MAP[p.category];
  return (
    <div className="cat" style={{ "--h": c.hue } as React.CSSProperties}>
      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-cat"><span>{c.name}</span><span className="font-mono text-muted">№ {String(p.n).padStart(3, "0")}</span></div>
      <p className="mt-1 font-serif text-lg leading-snug">{p.title}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted">{p.teaser}</p>
      <div className="mt-2 flex items-center justify-between"><DifficultyBadge difficulty={p.difficulty} /><span className="text-xs text-muted">{status === "solved" ? "Solved ✓" : `~${p.minutes} min`}</span></div>
    </div>
  );
}
