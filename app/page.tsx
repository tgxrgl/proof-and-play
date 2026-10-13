import { CategoryGrid } from "@/components/CategoryGrid";
import { Explorer } from "@/components/Explorer";
import { HomeSections } from "@/components/HomeSections";
import { SolveButton } from "@/components/SolveButton";
import { getSummaries } from "@/lib/puzzles";

export default function Home() {
  const puzzles = getSummaries();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="mx-auto max-w-3xl py-12 text-center sm:py-16" aria-labelledby="hero">
        <p className="eyebrow mb-4">{puzzles.length} puzzles · 10 branches · one sky</p>
        <h1 id="hero" className="text-5xl leading-[1.04] sm:text-7xl">Mathematics, mapped.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          Every puzzle is a star. Wander the atlas, pick a point on the sky, and light it up by solving it. Hints when you want them, proofs when you&apos;re ready.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <SolveButton slugs={puzzles.map((p) => p.slug)} />
          <a href="#library" className="btn btn-outline px-5 py-3 text-base">Explore the atlas</a>
        </div>
      </section>

      <div className="space-y-24">
        <Explorer puzzles={puzzles} />
        <HomeSections puzzles={puzzles} />
        <CategoryGrid puzzles={puzzles} />
      </div>
    </div>
  );
}
