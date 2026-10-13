import type { Puzzle, PuzzleInput } from "@/lib/types";
import { algebra } from "./algebra";
import { geometry } from "./geometry";
import { numberTheory } from "./number-theory";
import { logic } from "./logic";
import { combinatorics } from "./combinatorics";
import { probability } from "./probability";
import { sequences } from "./sequences";
import { graphTheory } from "./graph-theory";
import { calculus } from "./calculus";
import { visual } from "./visual";

import { algebraMore } from "./more/algebra";
import { geometryMore } from "./more/geometry";
import { numberTheoryMore } from "./more/number-theory";
import { logicMore } from "./more/logic";
import { combinatoricsMore } from "./more/combinatorics";
import { probabilityMore } from "./more/probability";
import { sequencesMore } from "./more/sequences";
import { graphTheoryMore } from "./more/graph-theory";
import { calculusMore } from "./more/calculus";
import { visualMore } from "./more/visual";

const all: PuzzleInput[] = [
  ...algebra, ...geometry, ...numberTheory, ...logic, ...combinatorics,
  ...probability, ...sequences, ...graphTheory, ...calculus, ...visual,
  ...algebraMore, ...geometryMore, ...numberTheoryMore, ...logicMore, ...combinatoricsMore,
  ...probabilityMore, ...sequencesMore, ...graphTheoryMore, ...calculusMore, ...visualMore,
];

const BASE = Date.UTC(2026, 7, 1);

/** Puzzles without an explicit `added` date get consecutive days in file order. */
export const PUZZLES: Puzzle[] = all.map((p, i) => ({
  ...p,
  added: p.added ?? new Date(BASE + i * 86_400_000).toISOString().slice(0, 10),
}));
