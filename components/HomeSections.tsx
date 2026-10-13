"use client";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useDailySlug, useHydrated, useStore } from "@/lib/hooks";
import type { PuzzleSummary } from "@/lib/puzzles";
import { CatStyle, CategoryPill, DifficultyBadge, Minutes } from "./ui";
import { Glyph } from "./Glyph";
import { PuzzleCard } from "./PuzzleCard";

export function HomeSections({ puzzles }: { puzzles: PuzzleSummary[] }) {
  const { progress } = useStore();
  const hydrated = useHydrated();
  const dailySlug = useDailySlug(puzzles.map((p) => p.slug));
  const daily = puzzles.find((p) => p.slug === dailySlug) ?? null;
  const recent = [...puzzles].sort((a, b) => b.added.localeCompare(a.added)).slice(0, 3);
  const inProgress = puzzles
    .filter((p) => progress[p.slug]?.attempted && progress[p.slug].status === "unsolved")
    .sort((a, b) => progress[b.slug].updatedAt - progress[a.slug].updatedAt)
    .slice(0, 3);

  return (
    <div className="space-y-14">
      <div className="grid gap-5 lg:grid-cols-5">
        <section aria-labelledby="daily-title" className="lg:col-span-3">
          <h2 id="daily-title" className="eyebrow mb-3 flex items-center gap-2"><CalendarDays className="h-4 w-4" aria-hidden="true" />Daily challenge</h2>
          {daily ? (
            <CatStyle category={daily.category}>
              <Link href={`/puzzle/${daily.slug}`} className="group card flex min-h-56 flex-col justify-between gap-6 p-6 transition hover:border-muted sm:flex-row sm:items-center">
                <div className="space-y-3">
                  <CategoryPill category={daily.category} />
                  <h3 className="text-2xl sm:text-3xl">{daily.title}</h3>
                  <p className="max-w-md text-muted">{daily.teaser}</p>
                  <div className="flex items-center gap-4 pt-1"><DifficultyBadge difficulty={daily.difficulty} /><Minutes minutes={daily.minutes} /></div>
                  <span className="inline-flex items-center gap-1.5 pt-2 text-sm font-medium">Take today&apos;s challenge<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                </div>
                <div className="hidden shrink-0 rounded-xl bg-cat-soft p-6 text-cat sm:block"><Glyph category={daily.category} className="h-20 w-32" /></div>
              </Link>
            </CatStyle>
          ) : <div className="skeleton h-56" aria-busy="true" />}
        </section>

        <section aria-labelledby="continue-title" className="lg:col-span-2">
          <h2 id="continue-title" className="eyebrow mb-3">Continue solving</h2>
          <div className="card min-h-52 p-2">
            {!hydrated ? <div className="skeleton h-48" /> : inProgress.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center px-6 text-center">
                <p className="font-serif text-lg">Nothing in progress</p>
                <p className="mt-1 text-sm text-muted">Open a hint, jot a note or start a puzzle, and it will wait for you here.</p>
              </div>
            ) : (
              <ul>
                {inProgress.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/puzzle/${p.slug}`} className="flex items-center justify-between gap-3 rounded-lg p-3 hover:bg-subtle">
                      <span><span className="block font-serif text-base">{p.title}</span>
                        <span className="text-xs text-muted">Hint {progress[p.slug].hintsShown} shown · {p.difficulty}</span></span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <section aria-labelledby="recent-title">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="recent-title" className="text-2xl">Recently added</h2>
          <Link href="#library" className="text-sm text-muted hover:text-ink">Browse all →</Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((p) => <li key={p.slug}><PuzzleCard puzzle={p} /></li>)}
        </ul>
      </section>
    </div>
  );
}
