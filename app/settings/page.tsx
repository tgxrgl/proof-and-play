import type { Metadata } from "next";
import { SettingsView } from "@/components/SettingsView";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Settings</p>
      <h1 className="mb-8 mt-1 text-4xl">Make it yours</h1>
      <SettingsView />
    </div>
  );
}
