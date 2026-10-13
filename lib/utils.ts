import type { Difficulty } from "./types";

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
export const diffRank = (d: Difficulty) => DIFFICULTIES.indexOf(d);
export const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));
