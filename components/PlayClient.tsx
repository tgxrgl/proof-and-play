"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Swords } from "lucide-react";
import type { Profile } from "@/lib/online";
import { createClient } from "@/lib/supabase/client";

export function PlayClient({ me }: { me: Profile }) {
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const go = useCallback((id: string) => router.push(`/match/${id}`), [router]);

  // Offer to resume a match that is still running.
  useEffect(() => {
    createClient().from("matches").select("id").eq("status", "active").gt("ends_at", new Date().toISOString()).limit(1)
      .then(({ data }) => setActiveId(data?.[0]?.id ?? null));
  }, []);

  useEffect(() => {
    if (!searching) return;
    const sb = createClient();
    let cancelled = false;
    const started = Date.now();
    const tick = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);

    // join_queue is idempotent: re-calling refreshes our place and widens the rating window.
    const attempt = async () => {
      const { data, error } = await sb.rpc("join_queue");
      if (cancelled) return;
      if (error) { setError(error.message); setSearching(false); return; }
      if (data) go(data as string);
    };
    attempt();
    const poll = setInterval(attempt, 4000);

    const onInsert = (p: { new: Record<string, unknown> }) => go(p.new.id as string);
    const ch = sb.channel(`queue:${me.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "matches", filter: `p1=eq.${me.id}` }, onInsert)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "matches", filter: `p2=eq.${me.id}` }, onInsert)
      .subscribe();

    return () => {
      cancelled = true;
      clearInterval(tick); clearInterval(poll);
      sb.removeChannel(ch);
      sb.rpc("leave_queue").then(() => {}, () => {});
    };
  }, [searching, me.id, go]);

  const start = () => { setError(null); setElapsed(0); setSearching(true); };
  const window_ = 100 + 50 * Math.floor(elapsed / 10);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Ranked 1v1</p>
      <h1 className="mb-2 mt-1 text-4xl sm:text-5xl">Find an opponent</h1>
      <p className="mb-8 text-muted">Same problem, same clock. First correct answer wins and takes rating from the other player.</p>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div><p className="eyebrow">Playing as</p><p className="text-xl">{me.username}</p></div>
          <div className="text-right"><p className="eyebrow">Rating</p><p className="font-mono text-xl">{me.rating}</p></div>
        </div>

        {activeId && !searching && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-lg bg-subtle px-4 py-3 text-sm">
            <span>You have a match in progress.</span>
            <Link href={`/match/${activeId}`} className="btn btn-primary">Resume</Link>
          </div>
        )}

        <div className="mt-6">
          {searching ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center" role="status" aria-live="polite">
              <Loader2 className="h-6 w-6 animate-spin text-muted" aria-hidden="true" />
              <p>Searching… <span className="font-mono">{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}</span></p>
              <p className="text-sm text-muted">Looking for players rated {Math.max(0, me.rating - window_)}–{me.rating + window_}. The range widens while you wait.</p>
              <button type="button" className="btn btn-outline mt-1" onClick={() => setSearching(false)}>Cancel</button>
            </div>
          ) : (
            <button type="button" className="btn btn-primary w-full py-3 text-base" onClick={start}>
              <Swords className="h-4 w-4" aria-hidden="true" />Find match
            </button>
          )}
          {error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
      </div>

      <ul className="mt-8 space-y-2 text-sm text-muted">
        <li>• 20 minutes per match. No hints.</li>
        <li>• Answers are exact: an integer, fraction, or short expression as stated in the problem.</li>
        <li>• One guess every 5 seconds.</li>
        <li>• Nobody solves it? The match ends with no rating change.</li>
      </ul>
    </div>
  );
}
