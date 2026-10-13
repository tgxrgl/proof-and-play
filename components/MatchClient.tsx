"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Timer, Trophy } from "lucide-react";
import type { DiagramId } from "@/lib/types";
import type { MatchPuzzle, MatchRow, Player } from "@/lib/online";
import { createClient } from "@/lib/supabase/client";
import { Diagram } from "./Diagram";
import { Rich } from "./Rich";
import { CatStyle, CategoryPill, DifficultyBadge } from "./ui";

interface Props { match: MatchRow; puzzle: MatchPuzzle; players: Player[]; meId: string; serverNow: number }
interface Reveal { answer: string; solution: string[] }
type Feedback = { kind: "wrong" | "error"; text: string } | null;

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function MatchClient({ match, puzzle, players: initialPlayers, meId, serverNow }: Props) {
  const endsMs = new Date(match.ends_at).getTime();
  const offset = useRef(serverNow - Date.now()); // server clock minus local clock
  const nowMs = () => Date.now() + offset.current;

  const [status, setStatus] = useState(match.status);
  const [winner, setWinner] = useState(match.winner);
  const [players, setPlayers] = useState(initialPlayers);
  const [remaining, setRemaining] = useState(Math.max(0, Math.ceil((endsMs - serverNow) / 1000)));
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [cool, setCool] = useState(0);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [reveal, setReveal] = useState<Reveal | null>(null);

  const me = players.find((p) => p.id === meId);
  const opp = players.find((p) => p.id !== meId);
  const finished = status === "finished";

  // Countdown + guess cooldown, driven by the server-corrected clock.
  useEffect(() => {
    const t = setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((endsMs - nowMs()) / 1000)));
      setCool(Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)));
    }, 250);
    return () => clearInterval(t);
  }, [endsMs, cooldownUntil]);

  // Realtime: opponent solved it (or the match was finalized).
  useEffect(() => {
    const sb = createClient();
    const ch = sb.channel(`match:${match.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "matches", filter: `id=eq.${match.id}` }, (p) => {
        const row = p.new as Partial<MatchRow>;
        if (row.status) setStatus(row.status);
        if (row.winner !== undefined) setWinner(row.winner);
      })
      .subscribe();
    return () => { sb.removeChannel(ch); };
  }, [match.id]);

  // Time ran out with no winner: finalize the match server-side (an empty guess is rejected as late).
  useEffect(() => {
    if (finished || remaining > 0) return;
    const t = setTimeout(() => { createClient().rpc("submit_answer", { p_match: match.id, p_answer: "" }).then(() => {}, () => {}); }, 1000);
    return () => clearTimeout(t);
  }, [finished, remaining, match.id]);

  // Once finished: pull the solution and fresh ratings.
  useEffect(() => {
    if (!finished) return;
    const sb = createClient();
    sb.rpc("reveal_solution", { p_slug: puzzle.slug }).then(({ data }) => { if (data) setReveal(data as Reveal); });
    sb.from("profiles").select("id,username,rating").in("id", [match.p1, match.p2]).then(({ data }) => { if (data) setPlayers(data as Player[]); });
  }, [finished, puzzle.slug, match.p1, match.p2]);

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const guess = answer.trim();
    if (!guess || busy || cool > 0 || finished) return;
    setBusy(true); setFeedback(null);
    const { data, error } = await createClient().rpc("submit_answer", { p_match: match.id, p_answer: guess });
    setBusy(false);
    if (error) { setFeedback({ kind: "error", text: error.message }); return; }
    const res = data as { status: "active" | "finished"; correct: boolean; winner: string | null };
    if (res.status === "finished") { setStatus("finished"); setWinner(res.winner); return; }
    setFeedback({ kind: "wrong", text: "Not correct. Try again." });
    setCooldownUntil(Date.now() + 5000);
  }, [answer, busy, cool, finished, match.id]);

  const expired = !finished && remaining === 0;
  const outcome = !finished ? null : winner === meId ? "win" : winner ? "loss" : "none";

  return (
    <CatStyle category={puzzle.category} className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="card mb-6 flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-5 text-sm">
          <div><p className="eyebrow">You</p><p>{me?.username} <span className="font-mono text-muted">{me?.rating}</span></p></div>
          <span className="text-muted" aria-hidden="true">vs</span>
          <div><p className="eyebrow">Opponent</p><p>{opp?.username} <span className="font-mono text-muted">{opp?.rating}</span></p></div>
        </div>
        <div className="flex items-center gap-2 font-mono text-2xl" role="timer" aria-label="Time remaining">
          <Timer className="h-5 w-5 text-muted" aria-hidden="true" />{mmss(remaining)}
        </div>
      </div>

      {outcome && (
        <div role="status" className="card mb-6 flex items-center gap-3 px-5 py-4">
          <Trophy className="h-5 w-5" aria-hidden="true" />
          <p className="text-lg">
            {outcome === "win" && "You solved it first. You win!"}
            {outcome === "loss" && `${opp?.username ?? "Your opponent"} solved it first.`}
            {outcome === "none" && "Time ran out. No rating change."}
          </p>
        </div>
      )}

      <article className="card p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-3"><CategoryPill category={puzzle.category} /><DifficultyBadge difficulty={puzzle.difficulty} /></div>
        <h1 className="mb-5 text-3xl">{puzzle.title}</h1>
        <Rich text={puzzle.statement} className="text-[1.05rem]" />
        {puzzle.diagram && <div className="mt-6 rounded-xl bg-subtle p-4"><Diagram id={puzzle.diagram as DiagramId} /></div>}
      </article>

      {!finished && !expired && (
        <form onSubmit={submit} className="card mt-6 p-5">
          <label htmlFor="ans" className="mb-2 block text-sm font-medium">Your answer</label>
          <div className="flex gap-2">
            <input id="ans" value={answer} onChange={(e) => setAnswer(e.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} maxLength={100}
              placeholder="e.g. 42 or 3/7" className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 font-mono outline-none focus:border-muted" />
            <button className="btn btn-primary" disabled={busy || cool > 0 || !answer.trim()}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : cool > 0 ? `Wait ${cool}s` : "Submit"}
            </button>
          </div>
          {feedback && <p role="alert" className={`mt-3 text-sm ${feedback.kind === "error" ? "text-red-600 dark:text-red-400" : "text-muted"}`}>{feedback.text}</p>}
        </form>
      )}

      {expired && <p className="mt-6 text-center text-muted">Time&apos;s up. Finishing the match…</p>}

      {finished && (
        <section className="mt-6 space-y-6">
          {reveal && (
            <div className="card p-6">
              <p className="eyebrow">Answer</p>
              <p className="mb-4 mt-1 text-xl"><Rich inline text={reveal.answer} /></p>
              <p className="eyebrow mb-2">Solution</p>
              <ol className="list-decimal space-y-3 pl-5">
                {reveal.solution.map((s, i) => <li key={i}><Rich text={s} /></li>)}
              </ol>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Link href="/play" className="btn btn-primary">Play again</Link>
            <Link href="/leaderboard" className="btn btn-outline">Leaderboard</Link>
          </div>
        </section>
      )}
    </CatStyle>
  );
}
