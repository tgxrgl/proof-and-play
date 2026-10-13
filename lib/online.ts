import type { CategorySlug, Difficulty } from "./types";

export interface Profile { id: string; username: string; rating: number; games: number }
export interface Player { id: string; username: string; rating: number }
export interface MatchRow {
  id: string; p1: string; p2: string; puzzle_slug: string;
  status: "active" | "finished"; winner: string | null; ends_at: string;
}
export interface MatchPuzzle {
  slug: string; title: string; category: CategorySlug; difficulty: Difficulty;
  minutes: number | null; statement: string; diagram: string | null;
}
