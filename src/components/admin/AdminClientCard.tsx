import { AdminStatusBadge, formatDaysRemaining, formatInrFromPaise } from "@/components/admin/adminUi";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import Link from "next/link";

export type AdminClientCardData = {
  id: string;
  email: string;
  mobile: string | null;
  planName: string;
  status: string;
  startsAt?: string | null;
  expiresAt: string | null;
  daysRemaining?: number | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  appLinked?: boolean;
  paymentCount?: number;
  totalPaidPaise?: number;
  grantCount?: number;
  lastPaidAt?: string | null;
  expiringSoon?: boolean;
};

function paidLabel(client: AdminClientCardData) {
  if ((client.paymentCount ?? 0) > 0) {
    return {
      value: formatInrFromPaise(client.totalPaidPaise ?? 0),
      hint: `${client.paymentCount} ${client.paymentCount === 1 ? "order" : "orders"}`,
    };
  }
  if ((client.grantCount ?? 0) > 0) {
    return { value: "Granted", hint: "No checkout collected" };
  }
  return { value: "Unpaid", hint: "No payment recorded" };
}

function Detail({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string | null;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[0.65rem] tracking-[0.16em] text-[color:var(--muted)] uppercase">
        {label}
      </p>
      <p
        className="mt-1 break-words text-sm font-semibold sm:text-[0.95rem]"
        style={accent ? { color: FLUORO_GREEN } : undefined}
      >
        {value}
      </p>
      {hint ? <p className="mt-0.5 break-words text-xs text-[color:var(--muted)]">{hint}</p> : null}
    </div>
  );
}

export default function AdminClientCard({ client }: { client: AdminClientCardData }) {
  const name = client.fullName || client.email;
  const paid = paidLabel(client);
  const days = formatDaysRemaining(client.daysRemaining);

  return (
    <Link
      href={`/admin/clients/${client.id}`}
      className="block w-full rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-4 transition-colors hover:border-[color:var(--brand-green)] active:bg-[color:var(--border)]/20 sm:rounded-[1.75rem] sm:p-5 lg:p-6"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {client.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={client.avatarUrl}
            alt=""
            className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[color:var(--border)] object-cover sm:h-16 sm:w-16"
          />
        ) : (
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[color:var(--border)] text-lg font-semibold sm:h-16 sm:w-16 sm:text-xl">
            {name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 break-words text-lg font-semibold leading-tight sm:text-xl">
              {name}
            </h3>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <AdminStatusBadge status={client.status} />
              {client.expiringSoon ? (
                <span className="inline-flex rounded-full bg-red-500/15 px-2.5 py-1 text-[0.7rem] font-semibold text-red-600 dark:text-red-300">
                  Expiring
                </span>
              ) : null}
            </div>
          </div>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            {client.appLinked ? "App account linked" : "Has not signed into the app"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-[color:var(--border)] pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        <Detail label="Email" value={client.email} />
        <Detail label="Mobile" value={client.mobile || "No mobile on file"} />
        <Detail label="Plan" value={client.planName} />
        <Detail
          label="Days left"
          value={days || "No expiry"}
          hint={
            client.expiresAt
              ? `Expires ${new Date(client.expiresAt).toLocaleDateString()}`
              : null
          }
          accent={Boolean(days)}
        />
        <Detail label="Paid" value={paid.value} hint={paid.hint} accent={paid.value !== "Unpaid"} />
        <Detail
          label="Last payment"
          value={
            client.lastPaidAt ? new Date(client.lastPaidAt).toLocaleDateString() : "None yet"
          }
        />
        <Detail
          label="Started"
          value={
            client.startsAt ? new Date(client.startsAt).toLocaleDateString() : "Not started"
          }
        />
      </div>

      <p
        className="mt-4 text-sm font-bold sm:text-right"
        style={{ color: FLUORO_GREEN }}
      >
        Open coaching desk
      </p>
    </Link>
  );
}
