"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/online";

export function AccountForm({ profile, email }: { profile: Profile; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(profile.username);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const valid = /^[A-Za-z0-9_]{3,20}$/.test(name);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || name === profile.username) return;
    setBusy(true); setMsg(null);
    const { error } = await createClient().rpc("set_username", { p_name: name });
    setBusy(false);
    if (error) setMsg({ ok: false, text: error.code === "23505" ? "That username is taken." : error.message });
    else { setMsg({ ok: true, text: "Saved." }); router.refresh(); }
  }

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card grid grid-cols-3 divide-x divide-line text-center">
        {[["Rating", profile.rating], ["Games", profile.games], ["Email", email]].map(([k, v]) => (
          <div key={k} className="min-w-0 px-3 py-4">
            <p className="eyebrow">{k}</p>
            <p className="mt-1 truncate font-mono text-lg" title={String(v)}>{v}</p>
          </div>
        ))}
      </div>
      <form onSubmit={save} className="card space-y-3 p-5">
        <label className="block text-sm font-medium">Username
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} autoComplete="off"
            className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-muted" />
        </label>
        <p className="text-xs text-muted">3–20 characters: letters, numbers, underscore. Shown to opponents and on the leaderboard.</p>
        {msg && <p role="status" className={`text-sm ${msg.ok ? "text-muted" : "text-red-600 dark:text-red-400"}`}>{msg.text}</p>}
        <button className="btn btn-primary" disabled={busy || !valid || name === profile.username}>Save username</button>
      </form>
      <button type="button" className="btn btn-outline" onClick={signOut}>Sign out</button>
    </div>
  );
}
