"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronRight, Eye, Lightbulb, Lock, RotateCcw, SkipForward } from "lucide-react";
import { CATEGORY_MAP } from "@/lib/categories";
import { useHydrated, useProgress, useStore } from "@/lib/hooks";
import type { PuzzleSummary } from "@/lib/puzzles";
import { actions } from "@/lib/store";
import type { Puzzle, PuzzleStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Diagram } from "./Diagram";
import { PuzzleCard } from "./PuzzleCard";
import { Rich } from "./Rich";
import { CatStyle, CategoryPill, DifficultyBadge, Minutes } from "./ui";

interface Props { puzzle: Puzzle; prev: PuzzleSummary | null; next: PuzzleSummary | null; related: PuzzleSummary[]; index: number; total: number }

export function Workspace({ puzzle, prev, next, related, index, total }: Props) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { bookmarks, settings } = useStore();
  const progress = useProgress(puzzle.slug);
  const cat = CATEGORY_MAP[puzzle.category];
  const bookmarked = bookmarks.includes(puzzle.slug);
  const hintsTotal = puzzle.hints.length;
  const canReset = progress.hintsShown > 0 || progress.solutionShown;

  // Notes: local draft, debounced into the store; re-sync when navigating to another puzzle.
  const [draft, setDraft] = useState("");
  const loadedFor = useRef<string | null>(null);
  useEffect(() => {
    if (hydrated && loadedFor.current !== puzzle.slug) { loadedFor.current = puzzle.slug; setDraft(progress.notes); }
  }, [hydrated, puzzle.slug, progress.notes]);
  useEffect(() => {
    if (loadedFor.current !== puzzle.slug || draft === progress.notes) return;
    const t = setTimeout(() => actions.setNotes(puzzle.slug, draft), 400);
    return () => clearTimeout(t);
  }, [draft, puzzle.slug, progress.notes]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowLeft" && prev) router.push(`/puzzle/${prev.slug}`);
      if (e.key === "ArrowRight" && next) router.push(`/puzzle/${next.slug}`);
      if (e.key.toLowerCase() === "h" && progress.hintsShown < hintsTotal) actions.showHint(puzzle.slug, progress.hintsShown + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router, progress.hintsShown, hintsTotal, puzzle.slug]);

  const setStatus = (s: PuzzleStatus) => actions.setStatus(puzzle.slug, progress.status === s ? "unsolved" : s);

  return (
    <CatStyle category={puzzle.category} className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Explore</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <Link href={`/category/${cat.slug}`} className="hover:text-ink">{cat.name}</Link>
        <span className="ml-auto hidden font-mono text-xs tracking-widest sm:inline">№ {String(index + 1).padStart(3, "0")} / {total}</span>
      </nav>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl space-y-3">
          <CategoryPill category={puzzle.category} />
          <h1 className="text-3xl sm:text-4xl">{puzzle.title}</h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <DifficultyBadge difficulty={puzzle.difficulty} />
            {settings.showTimes && <Minutes minutes={puzzle.minutes} />}
            <span className="text-xs text-muted">Source: {puzzle.source}</span>
          </div>
        </div>
        <button type="button" className="btn btn-outline" aria-pressed={bookmarked} onClick={() => actions.toggleBookmark(puzzle.slug)}>
          <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} aria-hidden="true" />{bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section aria-labelledby="problem" className="card p-6 sm:p-8">
            <h2 id="problem" className="eyebrow mb-4">The problem</h2>
            <Rich text={puzzle.statement} className="font-serif text-lg sm:text-xl" />
            {puzzle.diagram && <div className="mt-8 rounded-xl bg-subtle p-4"><Diagram id={puzzle.diagram} /></div>}
          </section>

          <section aria-labelledby="hints" className="card p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="hints" className="eyebrow flex items-center gap-2"><Lightbulb className="h-4 w-4" aria-hidden="true" />Hints</h2>
              <span className="flex items-center gap-1.5 text-xs text-muted" aria-label={`${progress.hintsShown} of ${hintsTotal} hints revealed`}>
                {puzzle.hints.map((_, i) => <span key={i} className={cn("h-1.5 w-6 rounded-full", i < progress.hintsShown ? "bg-cat" : "bg-line")} />)}
              </span>
            </div>
            {progress.hintsShown === 0 && <p className="mb-4 text-sm text-muted">Stuck? Reveal hints one at a time. Each nudges you a little further without giving the answer away.</p>}
            <ol className="space-y-3" aria-live="polite">
              {puzzle.hints.slice(0, progress.hintsShown).map((h, i) => (
                <li key={i} className="animate-rise flex gap-3 rounded-lg border border-cat bg-cat-soft p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cat text-xs font-semibold text-bg">{i + 1}</span>
                  <Rich text={h} />
                </li>
              ))}
            </ol>
            <button type="button" className="btn btn-outline mt-4" disabled={progress.hintsShown >= hintsTotal} onClick={() => actions.showHint(puzzle.slug, progress.hintsShown + 1)}>
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              {progress.hintsShown >= hintsTotal ? "All hints revealed" : `Reveal hint ${progress.hintsShown + 1} of ${hintsTotal}`}
              {progress.hintsShown < hintsTotal && <kbd className="ml-1 rounded border border-line px-1.5 text-[10px] text-muted">H</kbd>}
            </button>
          </section>

          <section aria-labelledby="solution" className="card p-6 sm:p-8">
            <h2 id="solution" className="eyebrow mb-4 flex items-center gap-2">{progress.solutionShown ? <Eye className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}Solution</h2>
            {!progress.solutionShown ? (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-muted">The full solution is hidden. Give it a real try first: a failed attempt teaches more than a read answer.</p>
                <button type="button" className="btn btn-primary" onClick={() => actions.revealSolution(puzzle.slug)}>Reveal solution</button>
              </div>
            ) : (
              <div className="animate-rise space-y-6">
                <div className="rounded-lg border border-cat bg-cat-soft p-4">
                  <p className="eyebrow mb-1 text-cat">Answer</p>
                  <Rich text={puzzle.answer} className="font-serif text-xl" />
                </div>
                <ol className="space-y-5">
                  {puzzle.solution.map((s, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cat text-xs font-semibold text-cat">{i + 1}</span>
                      <Rich text={s} className="min-w-0 flex-1" />
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start" aria-label="Puzzle tools">
          <div className="card p-5">
            <h2 className="eyebrow mb-3">Your status</h2>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={cn("btn btn-outline", progress.status === "solved" && "!bg-ink !text-bg")} aria-pressed={progress.status === "solved"} onClick={() => setStatus("solved")}>
                <Check className="h-4 w-4" aria-hidden="true" />Solved
              </button>
              <button type="button" className={cn("btn btn-outline", progress.status === "skipped" && "!bg-ink !text-bg")} aria-pressed={progress.status === "skipped"} onClick={() => setStatus("skipped")}>
                <SkipForward className="h-4 w-4" aria-hidden="true" />Skip
              </button>
            </div>
            <button type="button" className="btn btn-ghost mt-2 w-full" disabled={!canReset} onClick={() => actions.resetPuzzle(puzzle.slug)}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />Reset hints &amp; solution
            </button>
          </div>

          <div className="card p-5">
            <label htmlFor="notes" className="eyebrow mb-3 block">Working &amp; notes</label>
            <textarea id="notes" value={draft} onChange={(e) => setDraft(e.target.value)} rows={7} spellCheck={false}
              placeholder="Try small cases, sketch ideas, record dead ends. Saved on this device."
              className="w-full resize-y rounded-lg border border-line bg-bg p-3 font-mono text-sm placeholder:text-muted focus:border-muted" />
          </div>

          <div className="card divide-y divide-line">
            {[{ p: prev, dir: "prev" as const }, { p: next, dir: "next" as const }].map(({ p, dir }) =>
              p ? (
                <Link key={dir} href={`/puzzle/${p.slug}`} className="flex items-center gap-3 p-4 hover:bg-subtle">
                  {dir === "prev" && <ArrowLeft className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />}
                  <span className={cn("min-w-0 flex-1", dir === "next" && "text-right")}>
                    <span className="block text-xs text-muted">{dir === "prev" ? "Previous" : "Next"}</span>
                    <span className="block truncate font-serif">{p.title}</span>
                  </span>
                  {dir === "next" && <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />}
                </Link>
              ) : (
                <div key={dir} className="p-4 text-sm text-muted">{dir === "prev" ? "This is the first puzzle." : "You've reached the last puzzle."}</div>
              ),
            )}
            <p className="hidden p-3 text-center text-xs text-muted lg:block">Tip: use <kbd className="rounded border border-line px-1">←</kbd> <kbd className="rounded border border-line px-1">→</kbd> to move between puzzles</p>
          </div>
        </aside>
      </div>

      <section aria-labelledby="related" className="mt-14">
        <h2 id="related" className="mb-4 text-2xl">Related puzzles</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => <li key={p.slug}><PuzzleCard puzzle={p} /></li>)}
        </ul>
      </section>
    </CatStyle>
  );
}
