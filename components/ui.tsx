import Link from "next/link";
import { Bookmark, Check, Clock, SkipForward } from "lucide-react";
import { CATEGORY_MAP } from "@/lib/categories";
import type { CategorySlug, Difficulty, PuzzleStatus } from "@/lib/types";
import { diffRank } from "@/lib/utils";

export function CatStyle({ category, className = "", children }: { category: CategorySlug; className?: string; children: React.ReactNode }) {
  return <div className={`cat ${className}`} style={{ "--h": CATEGORY_MAP[category].hue } as React.CSSProperties}>{children}</div>;
}

export function CategoryPill({ category, href = false }: { category: CategorySlug; href?: boolean }) {
  const c = CATEGORY_MAP[category];
  const inner = (
    <span className="cat inline-flex items-center gap-1.5 rounded-full border border-cat bg-cat-soft px-2.5 py-0.5 text-xs font-medium text-cat" style={{ "--h": c.hue } as React.CSSProperties}>
      <span className="h-1.5 w-1.5 rounded-full bg-cat" aria-hidden="true" />
      {c.name}
    </span>
  );
  return href ? <Link href={`/category/${category}`} className="rounded-full">{inner}</Link> : inner;
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const n = diffRank(difficulty) + 1;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted" title={`Difficulty: ${difficulty}`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((i) => <span key={i} className={`h-2.5 w-1 rounded-sm ${i <= n ? "bg-ink" : "bg-line"}`} />)}
      </span>
      {difficulty}
    </span>
  );
}

export function Minutes({ minutes }: { minutes: number }) {
  return <span className="inline-flex items-center gap-1 text-xs text-muted"><Clock className="h-3.5 w-3.5" aria-hidden="true" />~{minutes} min</span>;
}

export function StatusIcon({ status, bookmarked }: { status: PuzzleStatus; bookmarked?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {status === "solved" && <span className="inline-flex items-center gap-1 text-xs font-medium text-ink"><Check className="h-3.5 w-3.5" aria-hidden="true" />Solved</span>}
      {status === "skipped" && <span className="inline-flex items-center gap-1 text-xs text-muted"><SkipForward className="h-3.5 w-3.5" aria-hidden="true" />Skipped</span>}
      {bookmarked && <Bookmark className="h-3.5 w-3.5 fill-current text-ink" aria-label="Bookmarked" />}
    </span>
  );
}

export function EmptyState({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <svg viewBox="0 0 64 40" className="mb-4 h-10 w-16 text-line" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 34 H60 M10 34 L26 8 L42 34 M26 8 V34" /><circle cx="50" cy="16" r="8" />
      </svg>
      <h3 className="text-lg">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
