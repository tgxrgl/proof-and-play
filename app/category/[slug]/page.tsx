import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Explorer } from "@/components/Explorer";
import { CatStyle } from "@/components/ui";
import { Glyph } from "@/components/Glyph";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import { getSummaries } from "@/lib/puzzles";
import type { CategorySlug } from "@/lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => CATEGORIES.map((c) => ({ slug: c.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = CATEGORY_MAP[params.slug as CategorySlug];
  return c ? { title: c.name, description: c.blurb } : {};
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORY_MAP[params.slug as CategorySlug];
  if (!cat) notFound();
  const puzzles = getSummaries().filter((p) => p.category === cat.slug);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <CatStyle category={cat.slug} className="mb-10 flex items-center gap-6">
        <div className="hidden rounded-2xl bg-cat-soft p-5 text-cat sm:block"><Glyph category={cat.slug} className="h-14 w-24" /></div>
        <div>
          <p className="eyebrow">Category</p>
          <h1 className="text-4xl sm:text-5xl">{cat.name}</h1>
          <p className="mt-2 text-lg text-muted">{cat.blurb}</p>
        </div>
      </CatStyle>
      <Explorer puzzles={puzzles} fixedCategory={cat.slug} />
    </div>
  );
}
