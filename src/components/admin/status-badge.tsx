export function StatusBadge({ value }: { value: string }) {
  const styles =
    value === "CONFIRMED"
      ? "bg-green-50 text-green-700 border-green-200"
      : value === "PENDING"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : value === "CANCELED"
          ? "bg-red-50 text-red-700 border-red-200"
          : value === "COMPLETED"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-zinc-50 text-zinc-700 border-zinc-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}>{value}</span>;
}
