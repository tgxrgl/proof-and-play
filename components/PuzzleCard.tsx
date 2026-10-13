"use client";
import Link from "next/link";
import { useProgress, useStore } from "@/lib/hooks";
import type { PuzzleSummary } from "@/lib/puzzles";
import { CatStyle, CategoryPill, DifficultyBadge, Minutes, StatusIcon } from "./ui";
import { Glyph } from "./Glyph";

export function PuzzleCard({ puzzle }: { puzzle: PuzzleSummary }) {
  const progress = useProgress(puzzle.slug);
  const { bookmarks, settings } = useStore();
  return (
    <CatStyle category={puzzle.category} className="h-full">
      <Link href={`/puzzle/${puzzle.slug}`} className="group card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-muted hover:shadow-sm">
        <div className="flex items-center justify-between border-b border-cat px-5 py-3 text-cat">
          <span className="font-mono text-xs tracking-widest">№ {String(puzzle.n).padStart(3, "0")}</span>
          <span className="flex items-center gap-3"><StatusIcon status={progress.status} bookmarked={bookmarks.includes(puzzle.slug)} />
            <Glyph category={puzzle.category} className="h-6 w-10 opacity-80 transition-transform group-hover:scale-110" /></span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <CategoryPill category={puzzle.category} />
          <h3 className="text-lg leading-snug">{puzzle.title}</h3>
          <p className="line-clamp-2 text-sm text-muted">{puzzle.teaser}</p>
          <div className="mt-auto flex items-center justify-between pt-3">
            <DifficultyBadge difficulty={puzzle.difficulty} />
            {settings.showTimes && <Minutes minutes={puzzle.minutes} />}
          </div>
        </div>
      </Link>
    </CatStyle>
  );
}
