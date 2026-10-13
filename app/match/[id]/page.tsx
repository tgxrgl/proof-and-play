import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MatchClient } from "@/components/MatchClient";
import type { MatchPuzzle, MatchRow, Player } from "@/lib/online";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Match" };
export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function MatchPage({ params }: { params: { id: string } }) {
  if (!UUID.test(params.id)) notFound();
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect(`/login?next=/match/${params.id}`);

  // RLS only returns the row to its two participants.
  const { data: match } = await sb.from("matches").select("id,p1,p2,puzzle_slug,status,winner,ends_at").eq("id", params.id).maybeSingle();
  if (!match) notFound();

  const [{ data: puzzle }, { data: players }] = await Promise.all([
    sb.from("puzzles").select("slug,title,category,difficulty,minutes,statement,diagram").eq("slug", match.puzzle_slug).maybeSingle(),
    sb.from("profiles").select("id,username,rating").in("id", [match.p1, match.p2]),
  ]);
  if (!puzzle || !players) notFound();

  return (
    <MatchClient
      match={match as MatchRow}
      puzzle={puzzle as MatchPuzzle}
      players={players as Player[]}
      meId={user.id}
      serverNow={Date.now()}
    />
  );
}
