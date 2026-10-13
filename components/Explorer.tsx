"use client";
import { useMemo, useState } from "react";
import { LayoutGrid, Orbit, RotateCcw, Search, X } from "lucide-react";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import { useDailySlug, useHydrated, useStore } from "@/lib/hooks";
import type { PuzzleSummary } from "@/lib/puzzles";
import type { CategorySlug, Difficulty } from "@/lib/types";
import { DIFFICULTIES, diffRank } from "@/lib/utils";
import { Atlas } from "./Atlas";
import { PuzzleCard } from "./PuzzleCard";
import { EmptyState } from "./ui";

type Completion = "all" | "unsolved" | "in-progress" | "solved" | "skipped" | "bookmarked";
type Sort = "default" | "newest" | "shortest" | "easiest" | "hardest" | "az";

const COMPLETION: { v: Completion; label: string }[] = [
  { v: "all", label: "All" }, { v: "unsolved", label: "Not started" }, { v: "in-progress", label: "In progress" },
  { v: "solved", label: "Solved" }, { v: "skipped", label: "Skipped" }, { v: "bookmarked", label: "Bookmarked" },
];

export function Explorer({ puzzles, fixedCategory }: { puzzles: PuzzleSummary[]; fixedCategory?: CategorySlug }) {
  const { progress, bookmarks, settings } = useStore();
  const hydrated = useHydrated();
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<CategorySlug[]>([]);
  const [diffs, setDiffs] = useState<Difficulty[]>([]);
  const [completion, setCompletion] = useState<Completion>("all");
  const [sort, setSort] = useState<Sort>("default");
  const [view, setView] = useState<"atlas" | "grid">("atlas");
  const dailySlug = useDailySlug(puzzles.map((p) => p.slug));

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const dirty = query || cats.length || diffs.length || completion !== "all" || sort !== "default";
  const clear = () => { setQuery(""); setCats([]); setDiffs([]); setCompletion("all"); setSort("default"); };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const status = (p: PuzzleSummary) => progress[p.slug];
    let list = puzzles.filter((p) => {
      if (q && !`${p.title} ${p.teaser} ${CATEGORY_MAP[p.category].name} ${p.difficulty}`.toLowerCase().includes(q)) return false;
      if (!fixedCategory && cats.length && !cats.includes(p.category)) return false;
      if (diffs.length && !diffs.includes(p.difficulty)) return false;
      const s = status(p);
      switch (completion) {
        case "unsolved": if (s?.attempted) return false; break;
        case "in-progress": if (!s?.attempted || s.status !== "unsolved") return false; break;
        case "solved": if (s?.status !== "solved") return false; break;
        case "skipped": if (s?.status !== "skipped") return false; break;
        case "bookmarked": if (!bookmarks.includes(p.slug)) return false; break;
        default: if (settings.autoHideSolved && s?.status === "solved") return false;
      }
      return true;
    });
    const cmp: Record<Sort, ((a: PuzzleSummary, b: PuzzleSummary) => number) | null> = {
      default: null,
      newest: (a, b) => b.added.localeCompare(a.added),
      shortest: (a, b) => a.minutes - b.minutes,
      easiest: (a, b) => diffRank(a.difficulty) - diffRank(b.difficulty) || a.minutes - b.minutes,
      hardest: (a, b) => diffRank(b.difficulty) - diffRank(a.difficulty) || b.minutes - a.minutes,
      az: (a, b) => a.title.localeCompare(b.title),
    };
    const f = cmp[sort];
    return f ? [...list].sort(f) : list;
  }, [puzzles, query, cats, diffs, completion, sort, progress, bookmarks, fixedCategory, settings.autoHideSolved]);

  return (
    <section aria-labelledby="library-title" id="library" className="scroll-mt-20">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{fixedCategory ? CATEGORY_MAP[fixedCategory].name : "The library"}</p>
          <h2 id="library-title" className="text-2xl sm:text-3xl">{fixedCategory ? "All puzzles in this category" : "Find a puzzle"}</h2>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted" aria-live="polite">{results.length} of {puzzles.length} puzzles</p>
          {!fixedCategory && (
            <div role="group" aria-label="Library view" className="flex rounded-lg border border-line bg-surface p-0.5">
              {([["atlas", Orbit, "Atlas"], ["grid", LayoutGrid, "Grid"]] as const).map(([v, Icon, label]) => (
                <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm text-muted transition-colors hover:text-ink aria-pressed:bg-ink aria-pressed:text-bg">
                  <Icon className="h-4 w-4" aria-hidden="true" />{label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search puzzles</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, topic or idea…"
              className="w-full rounded-lg border border-line bg-bg py-2 pl-9 pr-9 text-sm placeholder:text-muted focus:border-muted" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink"><X className="h-4 w-4" /></button>}
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink">
              <option value="default">Curated order</option><option value="newest">Newest first</option><option value="shortest">Shortest first</option>
              <option value="easiest">Easiest first</option><option value="hardest">Hardest first</option><option value="az">Title A–Z</option>
            </select>
          </label>
        </div>

        {!fixedCategory && (
          <fieldset>
            <legend className="eyebrow mb-2">Category</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="chip" aria-pressed={cats.length === 0} onClick={() => setCats([])}>All</button>
              {CATEGORIES.map((c) => (
                <button key={c.slug} type="button" className="chip" aria-pressed={cats.includes(c.slug)} onClick={() => setCats(toggle(cats, c.slug))}>{c.name}</button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <fieldset>
            <legend className="eyebrow mb-2">Difficulty</legend>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => <button key={d} type="button" className="chip" aria-pressed={diffs.includes(d)} onClick={() => setDiffs(toggle(diffs, d))}>{d}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend className="eyebrow mb-2">Status</legend>
            <div className="flex flex-wrap gap-2">
              {COMPLETION.map((c) => <button key={c.v} type="button" className="chip" aria-pressed={completion === c.v} onClick={() => setCompletion(c.v)}>{c.label}</button>)}
            </div>
          </fieldset>
        </div>
        {dirty && <button type="button" onClick={clear} className="btn btn-ghost -ml-2 px-2 py-1"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />Clear filters</button>}
      </div>

      {!fixedCategory && view === "atlas" && (
        <div className="mt-8">
          <Atlas puzzles={puzzles} matches={dirty ? new Set(results.map((p) => p.slug)) : null} activeCategories={cats}
            onCategory={(c) => setCats(toggle(cats, c))} dailySlug={dailySlug} />
          <ul className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted" aria-label="Legend">
            <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full border-2 border-ink" />Unsolved</li>
            <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-ink/40 ring-1 ring-ink" />In progress</li>
            <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-ink shadow-[0_0_8px_hsl(var(--ink))]" />Solved</li>
            <li>Distance from the centre = difficulty</li>
          </ul>
          {results.length === 0 && <div className="mt-6"><EmptyState title="No stars match" body="Try a broader search or remove a filter."><button type="button" className="btn btn-outline" onClick={clear}>Clear filters</button></EmptyState></div>}
        </div>
      )}

      <div className={`mt-6 ${!fixedCategory && view === "atlas" ? "hidden" : ""}`}>
        {!hydrated ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading puzzles">
            {Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton h-56" />)}
          </div>
        ) : results.length === 0 ? (
          <EmptyState title="No puzzles match" body={completion === "bookmarked" ? "You haven't bookmarked anything yet. Tap the bookmark on any puzzle to save it here." : "Try a broader search or remove a filter."}>
            <button type="button" className="btn btn-outline" onClick={clear}>Clear filters</button>
          </EmptyState>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => <li key={p.slug} className="animate-rise"><PuzzleCard puzzle={p} /></li>)}
          </ul>
        )}
      </div>
    </section>
  );
}
