import type { CategorySlug } from "./types";

export interface Category {
  slug: CategorySlug;
  name: string;
  hue: number;
  short: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { slug: "algebra", short: "Algebra", name: "Algebra", hue: 222, blurb: "Symbols, structure, and the art of rearranging." },
  { slug: "geometry", short: "Geometry", name: "Geometry", hue: 160, blurb: "Shapes, angles, and the proofs hiding in pictures." },
  { slug: "number-theory", short: "Numbers", name: "Number Theory", hue: 280, blurb: "Primes, divisors, and the secrets of the integers." },
  { slug: "logic", short: "Logic", name: "Logic & Deduction", hue: 38, blurb: "Reason your way out of contradictions." },
  { slug: "combinatorics", short: "Counting", name: "Combinatorics & Counting", hue: 340, blurb: "How many ways? Count without listing." },
  { slug: "probability", short: "Chance", name: "Probability & Statistics", hue: 190, blurb: "Chance, expectation, and surprising odds." },
  { slug: "sequences", short: "Patterns", name: "Sequences & Patterns", hue: 12, blurb: "Spot the rule, then prove it." },
  { slug: "graph-theory", short: "Graphs", name: "Graph Theory", hue: 120, blurb: "Dots, lines, and global structure." },
  { slug: "calculus", short: "Calculus", name: "Calculus & Analysis", hue: 250, blurb: "Change, limits, and infinite sums." },
  { slug: "visual", short: "Intuition", name: "Visual & Intuitive Mathematics", hue: 85, blurb: "Insight you can see before you can prove." },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<CategorySlug, Category>;
