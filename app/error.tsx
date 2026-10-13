"use client";
import { EmptyState } from "@/components/ui";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <EmptyState title="Something went sideways" body="An unexpected error occurred. Your saved progress is safe on this device.">
        <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
      </EmptyState>
    </div>
  );
}
