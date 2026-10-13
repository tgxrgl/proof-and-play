"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";
import type { Profile } from "@/lib/online";

/** Current signed-in profile (null when signed out). Updates on sign-in/out. */
export function useProfile() {
  const [state, set] = useState<{ loading: boolean; profile: Profile | null }>({ loading: supabaseConfigured, profile: null });
  useEffect(() => {
    if (!supabaseConfigured) return;
    const sb = createClient();
    let alive = true;
    const load = async () => {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { if (alive) set({ loading: false, profile: null }); return; }
      const { data } = await sb.from("profiles").select("id,username,rating,games").eq("id", user.id).maybeSingle();
      if (alive) set({ loading: false, profile: (data as Profile | null) ?? null });
    };
    load();
    const { data: sub } = sb.auth.onAuthStateChange(() => { setTimeout(load, 0); });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);
  return state;
}
