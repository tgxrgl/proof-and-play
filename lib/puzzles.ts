import { PUZZLES } from "@/data";
import type { CategorySlug, Puzzle } from "./types";
import { diffRank } from "./utils";

export type PuzzleSummary = Pick<Puzzle, "slug" | "title" | "category" | "difficulty" | "minutes" | "teaser" | "added"> & { n: number };

const NUMBER = new Map(PUZZLES.map((p, i) => [p.slug, i + 1]));

export const toSummary = ({ slug, title, category, difficulty, minutes, teaser, added }: Puzzle): PuzzleSummary => ({
  slug, title, category, difficulty, minutes, teaser, added, n: NUMBER.get(slug) ?? 0,
});

export const getAllPuzzles = () => PUZZLES;
export const getSummaries = () => PUZZLES.map(toSummary);
export const getPuzzle = (slug: string) => PUZZLES.find((p) => p.slug === slug);
export const getByCategory = (c: CategorySlug) => PUZZLES.filter((p) => p.category === c);

export function getNeighbors(slug: string) {
  const i = PUZZLES.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? toSummary(PUZZLES[i - 1]) : null,
    next: i >= 0 && i < PUZZLES.length - 1 ? toSummary(PUZZLES[i + 1]) : null,
    index: i,
  };
}

/** Same-category puzzles first (closest difficulty first), then others of the same difficulty. */
export function getRelated(slug: string, n = 3): PuzzleSummary[] {
  const me = getPuzzle(slug);
  if (!me) return [];
  return PUZZLES.filter((p) => p.slug !== slug)
    .map((p) => ({
      p,
      score: (p.category === me.category ? 10 : 0) - Math.abs(diffRank(p.difficulty) - diffRank(me.difficulty)) * 2,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => toSummary(x.p));
}
