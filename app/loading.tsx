export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-14 sm:px-6" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-10 w-2/3" /><div className="skeleton h-64" />
    </div>
  );
}
