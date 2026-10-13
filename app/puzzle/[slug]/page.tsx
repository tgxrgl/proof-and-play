import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Workspace } from "@/components/Workspace";
import { getAllPuzzles, getNeighbors, getPuzzle, getRelated } from "@/lib/puzzles";

export const dynamicParams = false;
export const generateStaticParams = () => getAllPuzzles().map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPuzzle(params.slug);
  return p ? { title: p.title, description: p.teaser } : {};
}

export default function PuzzlePage({ params }: { params: { slug: string } }) {
  const puzzle = getPuzzle(params.slug);
  if (!puzzle) notFound();
  const { prev, next, index } = getNeighbors(puzzle.slug);
  return <Workspace key={puzzle.slug} puzzle={puzzle} prev={prev} next={next} index={index} total={getAllPuzzles().length} related={getRelated(puzzle.slug)} />;
}
