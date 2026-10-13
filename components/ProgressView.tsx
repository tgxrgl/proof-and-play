"use client";
import Link from "next/link";
import { Bookmark, CheckCircle2, Compass, Flame, PencilLine } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { useHydrated, useStore } from "@/lib/hooks";
import type { PuzzleSummary } from "@/lib/puzzles";
import { DIFFICULTIES, pct } from "@/lib/utils";
import { CatStyle, EmptyState } from "./ui";
import { Atlas } from "./Atlas";
import { PuzzleCard } from "./PuzzleCard";

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Flame; label: string; value: string | number; sub?: string }) {
  return (
    <div className="card p-5">
      <Icon className="mb-3 h-5 w-5 text-muted" aria-hidden="true" />
      <p className="font-serif text-4xl tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function ProgressView({ puzzles }: { puzzles: PuzzleSummary[] }) {
  const { progress, bookmarks } = useStore();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="grid gap-4 sm:grid-cols-4" aria-busy="true">{Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-32" />)}</div>;

  const solved = puzzles.filter((p) => progress[p.slug]?.status === "solved");
  const attempted = puzzles.filter((p) => progress[p.slug]?.attempted);
  const saved = puzzles.filter((p) => bookmarks.includes(p.slug));
  const empty = attempted.length === 0 && saved.length === 0;
  const hintsUsed = puzzles.reduce((n, p) => n + (progress[p.slug]?.hintsShown ?? 0), 0);

  if (empty) {
    return (
      <EmptyState title="Your journey starts here" body="Solve, skip or even just peek at a puzzle and your progress will appear on this page. Everything is stored privately on this device.">
        <Link href="/#library" className="btn btn-primary"><Compass className="h-4 w-4" aria-hidden="true" />Find a puzzle</Link>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-12">
      <section aria-labelledby="sky"><h2 id="sky" className="mb-2 text-xl">Your sky</h2>
        <p className="mb-4 text-sm text-muted">Solved puzzles glow. Dim hollow stars are still waiting for you.</p>
        <Atlas puzzles={puzzles} matches={null} /></section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={CheckCircle2} label="Puzzles solved" value={solved.length} sub={`${pct(solved.length, puzzles.length)}% of ${puzzles.length}`} />
        <Stat icon={PencilLine} label="Puzzles attempted" value={attempted.length} sub={`${attempted.length - solved.length} still open`} />
        <Stat icon={Bookmark} label="Bookmarked" value={saved.length} />
        <Stat icon={Flame} label="Hints used" value={hintsUsed} sub={solved.length ? `${(hintsUsed / solved.length).toFixed(1)} per solve` : undefined} />
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <section aria-labelledby="by-cat" className="card p-6 lg:col-span-3">
          <h2 id="by-cat" className="mb-5 text-xl">By category</h2>
          <ul className="space-y-4">
            {CATEGORIES.map((c) => {
              const all = puzzles.filter((p) => p.category === c.slug);
              const n = all.filter((p) => progress[p.slug]?.status === "solved").length;
              return (
                <li key={c.slug}>
                  <CatStyle category={c.slug}>
                    <Link href={`/category/${c.slug}`} className="block">
                      <div className="mb-1.5 flex justify-between text-sm"><span>{c.name}</span><span className="text-muted tabular-nums">{n}/{all.length}</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-subtle" role="progressbar" aria-valuenow={n} aria-valuemin={0} aria-valuemax={all.length} aria-label={`${c.name} solved`}>
                        <div className="h-full rounded-full bg-cat transition-all" style={{ width: `${pct(n, all.length)}%` }} />
                      </div>
                    </Link>
                  </CatStyle>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="by-diff" className="card p-6 lg:col-span-2">
          <h2 id="by-diff" className="mb-5 text-xl">By difficulty</h2>
          <ul className="space-y-5">
            {DIFFICULTIES.map((d) => {
              const all = puzzles.filter((p) => p.difficulty === d);
              const n = all.filter((p) => progress[p.slug]?.status === "solved").length;
              return (
                <li key={d}>
                  <div className="mb-1.5 flex justify-between text-sm"><span>{d}</span><span className="text-muted tabular-nums">{n}/{all.length}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-subtle" role="progressbar" aria-valuenow={n} aria-valuemin={0} aria-valuemax={all.length} aria-label={`${d} solved`}>
                    <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${pct(n, all.length)}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {saved.length > 0 && (
        <section aria-labelledby="saved">
          <h2 id="saved" className="mb-4 text-2xl">Bookmarks</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{saved.map((p) => <li key={p.slug}><PuzzleCard puzzle={p} /></li>)}</ul>
        </section>
      )}
    </div>
  );
}
