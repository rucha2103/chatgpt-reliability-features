export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 pb-32">
      <h1 className="mb-2 text-3xl font-semibold text-text-primary">
        What can I help with?
      </h1>
      <p className="max-w-md text-center text-sm text-text-muted">
        Ask a coding question, explore approaches, or start with the demo prompt
        in the input below.
      </p>
    </div>
  );
}
