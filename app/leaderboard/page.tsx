import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/ui";
import type { Profile } from "@/lib/online";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Leaderboard" };
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  let rows: Profile[] = [];
  let meId: string | null = null;
  if (supabaseConfigured) {
    const sb = createClient();
    const [{ data }, { data: { user } }] = await Promise.all([
      sb.from("profiles").select("id,username,rating,games").gt("games", 0).order("rating", { ascending: false }).limit(100),
      sb.auth.getUser(),
    ]);
    rows = (data ?? []) as Profile[];
    meId = user?.id ?? null;
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Ranked</p>
      <h1 className="mb-8 mt-1 text-4xl sm:text-5xl">Leaderboard</h1>
      {rows.length === 0 ? (
        <EmptyState title="No ranked games yet" body="Be the first on the board: finish a match to get a rating.">
          <Link href="/play" className="btn btn-primary">Find a match</Link>
        </EmptyState>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-subtle text-left text-muted">
              <tr><th className="px-4 py-2 font-medium">#</th><th className="px-4 py-2 font-medium">Player</th><th className="px-4 py-2 text-right font-medium">Games</th><th className="px-4 py-2 text-right font-medium">Rating</th></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={`border-t border-line ${r.id === meId ? "bg-subtle font-medium" : ""}`}>
                  <td className="px-4 py-2 font-mono text-muted">{i + 1}</td>
                  <td className="px-4 py-2">{r.username}{r.id === meId && " (you)"}</td>
                  <td className="px-4 py-2 text-right font-mono text-muted">{r.games}</td>
                  <td className="px-4 py-2 text-right font-mono">{r.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
