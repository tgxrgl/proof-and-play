export type CategorySlug =
  | "algebra"
  | "geometry"
  | "number-theory"
  | "logic"
  | "combinatorics"
  | "probability"
  | "sequences"
  | "graph-theory"
  | "calculus"
  | "visual";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type DiagramId =
  | "inscribed"
  | "diagonal"
  | "lunes"
  | "langley"
  | "konigsberg"
  | "wheel"
  | "chessboard"
  | "pigeonhole"
  | "oddsquares"
  | "steinmetz";

export interface PuzzleInput {
  slug: string;
  title: string;
  category: CategorySlug;
  difficulty: Difficulty;
  minutes: number;
  teaser: string;
  /** Text with $inline$ and $$display$$ LaTeX. Blank lines separate paragraphs. */
  statement: string;
  hints: string[];
  /** Short displayed answer (may contain LaTeX). */
  answer: string;
  /** Canonical machine-checkable answer, used by scripts/validate-puzzles.ts. */
  answerValue: string;
  solution: string[];
  source: string;
  diagram?: DiagramId;
  added?: string;
}

export interface Puzzle extends PuzzleInput {
  added: string;
}

export type PuzzleStatus = "unsolved" | "solved" | "skipped";

export interface PuzzleProgress {
  status: PuzzleStatus;
  attempted: boolean;
  hintsShown: number;
  solutionShown: boolean;
  notes: string;
  updatedAt: number;
}

export interface Settings {
  theme: "light" | "dark" | "system";
  showTimes: boolean;
  autoHideSolved: boolean;
}
