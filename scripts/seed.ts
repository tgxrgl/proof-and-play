/** Imports every puzzle into Supabase. Answers/solutions go to `puzzle_secrets` (no client access).
 *  Usage: npm run seed   (needs NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local)
 *  Safe to re-run: content is upserted; existing puzzle ratings are preserved. */
import { createClient } from "@supabase/supabase-js";
import { PUZZLES } from "../data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });
const SEED_RATING = { Easy: 1000, Medium: 1500, Hard: 2000 } as const;

function chunk<T>(a: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n));
  return out;
}

async function main() {
  const { data: existing, error: e0 } = await sb.from("puzzles").select("slug,rating");
  if (e0) throw e0;
  const have = new Map<string, number>((existing ?? []).map((r) => [r.slug as string, r.rating as number]));

  const puzzles = PUZZLES.map((p) => ({
    slug: p.slug, title: p.title, category: p.category, difficulty: p.difficulty, minutes: p.minutes,
    teaser: p.teaser, statement: p.statement, hints: p.hints, source: p.source,
    diagram: p.diagram ?? null, added: p.added, rating: have.get(p.slug) ?? SEED_RATING[p.difficulty],
  }));
  for (const c of chunk(puzzles, 100)) {
    const { error } = await sb.from("puzzles").upsert(c, { onConflict: "slug" });
    if (error) throw error;
  }

  const secrets = PUZZLES.map((p) => ({ slug: p.slug, answer: p.answer, answer_value: p.answerValue, solution: p.solution }));
  for (const c of chunk(secrets, 100)) {
    const { error } = await sb.from("puzzle_secrets").upsert(c, { onConflict: "slug" });
    if (error) throw error;
  }
  console.log(`Seeded ${puzzles.length} puzzles (${puzzles.length - have.size} new).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
