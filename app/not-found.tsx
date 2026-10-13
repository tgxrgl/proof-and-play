import Link from "next/link";
import { EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <EmptyState title="That page doesn't exist" body="The puzzle or page you're looking for may have moved. The library has plenty more.">
        <Link href="/" className="btn btn-primary">Back to the library</Link>
      </EmptyState>
    </div>
  );
}
