import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { safeNext } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  const next = safeNext(searchParams.next);
  if (!supabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl">Online play isn&apos;t configured</h1>
        <p className="mt-3 text-sm text-muted">Copy <code>.env.example</code> to <code>.env.local</code> and fill in your Supabase URL and anon key, then restart the dev server.</p>
      </div>
    );
  }
  const { data: { user } } = await createClient().auth.getUser();
  if (user) redirect(next);
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <p className="eyebrow">Proof &amp; Play</p>
      <h1 className="mb-6 mt-1 text-4xl">Sign in to play</h1>
      {searchParams.error && <p role="alert" className="mb-4 rounded-lg border border-line bg-subtle px-3 py-2 text-sm">Sign-in failed. Please try again.</p>}
      <LoginForm next={next} />
    </div>
  );
}
