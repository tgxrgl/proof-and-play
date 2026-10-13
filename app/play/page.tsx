import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlayClient } from "@/components/PlayClient";
import type { Profile } from "@/lib/online";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Play" };
export const dynamic = "force-dynamic";

export default async function PlayPage() {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login?next=/play");
  const { data } = await sb.from("profiles").select("id,username,rating,games").eq("id", user.id).maybeSingle();
  if (!data) redirect("/account");
  return <PlayClient me={data as Profile} />;
}
