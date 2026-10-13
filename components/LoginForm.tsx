"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Msg = { kind: "error" | "info"; text: string } | null;
const field = "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-muted";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const redirectTo = () => `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const sb = createClient();
    if (mode === "in") {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) setMsg({ kind: "error", text: error.message });
      else { router.replace(next); router.refresh(); }
    } else {
      const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo() } });
      if (error) setMsg({ kind: "error", text: error.message });
      else if (data.session) { router.replace(next); router.refresh(); }
      else setMsg({ kind: "info", text: "Check your email to confirm your account, then sign in." });
    }
    setBusy(false);
  }

  async function oauth(provider: "google" | "github") {
    setMsg(null);
    const { error } = await createClient().auth.signInWithOAuth({ provider, options: { redirectTo: redirectTo() } });
    if (error) setMsg({ kind: "error", text: error.message });
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-subtle p-1 text-sm" role="tablist" aria-label="Sign in or create account">
        {(["in", "up"] as const).map((m) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setMsg(null); }}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${mode === m ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}>
            {m === "in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-3">
        <label className="block text-sm">Email
          <input className={`${field} mt-1`} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm">Password
          <input className={`${field} mt-1`} type="password" minLength={8} required autoComplete={mode === "in" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {msg && <p role="alert" className={`text-sm ${msg.kind === "error" ? "text-red-600 dark:text-red-400" : "text-muted"}`}>{msg.text}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}{mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="btn btn-outline" onClick={() => oauth("google")}>Google</button>
        <button type="button" className="btn btn-outline" onClick={() => oauth("github")}>GitHub</button>
      </div>
      <p className="mt-4 text-xs text-muted">Google and GitHub only work after you enable them in Supabase → Authentication → Providers.</p>
    </div>
  );
}
