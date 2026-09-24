export const adminInputClass =
  "h-12 w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 text-base outline-none focus:border-[color:var(--brand-green)] sm:text-sm";

export const adminTextareaClass =
  "w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 text-base outline-none focus:border-[color:var(--brand-green)] sm:text-sm";

export function formatInrFromPaise(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export function formatDaysRemaining(days: number | null | undefined) {
  if (days == null) return null;
  if (days === 0) return "Expires today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export function AdminStatusBadge({ status }: { status: string }) {
  const tone =
    status === "active" ||
    status === "new" ||
    status === "paid" ||
    status === "activated" ||
    status === "renewed" ||
    status === "upgraded" ||
    status === "extended" ||
    status === "changed" ||
    status === "converted"
      ? "bg-[color:var(--brand-green)]/15 text-[color:var(--foreground)]"
      : status === "granted"
        ? "bg-[color:var(--brand-green)]/10 text-[color:var(--foreground)]"
        : status === "expired" || status === "cancelled"
          ? "bg-red-500/15 text-red-600 dark:text-red-300"
          : "text-[color:var(--muted)] bg-[color:var(--border)]/60";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold capitalize ${tone}`}
    >
      {status}
    </span>
  );
}
