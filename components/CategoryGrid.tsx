"use client";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { useStore } from "@/lib/hooks";
import type { PuzzleSummary } from "@/lib/puzzles";
import { CatStyle } from "./ui";
import { Glyph } from "./Glyph";

export function CategoryGrid({ puzzles }: { puzzles: PuzzleSummary[] }) {
  const { progress } = useStore();
  return (
    <section aria-labelledby="cats-title">
      <h2 id="cats-title" className="mb-4 text-2xl">Ten ways into mathematics</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((c) => {
          const all = puzzles.filter((p) => p.category === c.slug);
          const solved = all.filter((p) => progress[p.slug]?.status === "solved").length;
          return (
            <li key={c.slug}>
              <CatStyle category={c.slug} className="h-full">
                <Link href={`/category/${c.slug}`} className="group card flex h-full flex-col gap-3 p-4 transition hover:border-muted">
                  <span className="text-cat"><Glyph category={c.slug} className="h-9 w-14 transition-transform group-hover:scale-105" /></span>
                  <span className="font-serif text-base leading-tight">{c.name}</span>
                  <span className="mt-auto text-xs text-muted">{solved}/{all.length} solved</span>
                  <span className="h-1 overflow-hidden rounded-full bg-subtle" aria-hidden="true"><span className="block h-full bg-cat transition-all" style={{ width: `${all.length ? (solved / all.length) * 100 : 0}%` }} /></span>
                </Link>
              </CatStyle>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
