import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountForm } from "@/components/AccountForm";
import type { Profile } from "@/lib/online";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login?next=/account");
  const { data } = await sb.from("profiles").select("id,username,rating,games").eq("id", user.id).maybeSingle();
  const profile = data as Profile | null;
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Account</p>
      <h1 className="mb-8 mt-1 text-4xl">Your profile</h1>
      {profile ? <AccountForm profile={profile} email={user.email ?? ""} /> : <p className="text-muted">Profile not found. Try signing out and back in.</p>}
    </div>
  );
}
