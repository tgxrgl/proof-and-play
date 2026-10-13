import type { Metadata } from "next";
import { ProgressView } from "@/components/ProgressView";
import { getSummaries } from "@/lib/puzzles";

export const metadata: Metadata = { title: "Progress" };

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Your progress</p>
      <h1 className="mb-8 mt-1 text-4xl sm:text-5xl">How far you&apos;ve come</h1>
      <ProgressView puzzles={getSummaries()} />
    </div>
  );
}
