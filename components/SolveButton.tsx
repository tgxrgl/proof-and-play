"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/hooks";

export function SolveButton({ slugs, className = "btn btn-primary px-5 py-3 text-base" }: { slugs: string[]; className?: string }) {
  const router = useRouter();
  const { progress } = useStore();
  const go = () => {
    const open = slugs.filter((s) => progress[s]?.status !== "solved");
    const pool = open.length ? open : slugs;
    const pick = open.length ? pool[0] : pool[Math.floor(Math.random() * pool.length)];
    router.push(`/puzzle/${pick}`);
  };
  return <button type="button" onClick={go} className={className}>Solve a puzzle<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>;
}
