import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy · Hybrid Pro",
  description:
    "Hybrid Pro data safety: account info, Health Connect steps and heart rate, progress and meal photos, and Google Play purchase tokens.",
};

const safetyRows = [
  {
    data: "Account info",
    detail: "Name, email, and user ID you use to sign in with an email code or Google.",
    shared: "Not shared",
    purpose: "Account",
  },
  {
    data: "Health Connect",
    detail:
      "Step count, heart rate, and resting heart rate, plus activity recognition, if you allow it. Used for the current week’s charts. Health-data history is not requested.",
    shared: "Not shared",
    purpose: "App functionality",
  },
  {
    data: "Progress and meal photos",
    detail: "Progress photos, meal photos, and chat photos you upload.",
    shared: "Not shared",
    purpose: "App functionality",
  },
  {
    data: "Play purchase tokens",
    detail:
      "The Google Play purchase token, plan, and access dates for a coaching subscription bought in the Android app. Card and UPI details stay with Google Play.",
    shared: "With Google Play for the transaction",
    purpose: "Purchases",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16 text-[color:var(--foreground)]">
      <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--muted)] uppercase">
        Hybrid Pro
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Privacy policy</h1>
      <p className="mt-4 text-base leading-relaxed text-[color:var(--muted)]">
        This is the privacy policy for the Hybrid Pro app and website. Health and account data
        is not used for advertising and is not sold.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Data safety</h2>
        <p className="mt-2 text-base leading-relaxed text-[color:var(--muted)]">
          The Android app collects the following. Each row matches the Play Console Data safety
          form.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[color:var(--border)]">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-[var(--card)] text-[color:var(--foreground)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">What is collected</th>
                <th className="px-4 py-3 font-semibold">Shared</th>
                <th className="px-4 py-3 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--muted)]">
              {safetyRows.map((row) => (
                <tr key={row.data} className="border-t border-[color:var(--border)] align-top">
                  <th className="px-4 py-3 font-semibold text-[color:var(--foreground)]">
                    {row.data}
                  </th>
                  <td className="px-4 py-3 leading-relaxed">{row.detail}</td>
                  <td className="px-4 py-3 leading-relaxed">{row.shared}</td>
                  <td className="px-4 py-3">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 space-y-3 text-base leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Deletion</h2>
        <p>
          Users can request deletion. In the app, open Profile and choose Delete account. That
          removes the account and the data above, including workouts, meals, photos, chat, and the
          subscription record.
        </p>
        <p>
          Deletion URL:{" "}
          <Link href="/delete-account" className="underline">
            https://hybridpro.in/delete-account
          </Link>
        </p>
        <p>
          Privacy policy URL:{" "}
          <a className="underline" href="https://hybridpro.in/privacy">
            https://hybridpro.in/privacy
          </a>
        </p>
      </section>

      <section className="mt-10 text-base leading-relaxed text-[color:var(--muted)]">
        <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Contact</h2>
        <p className="mt-2">
          Questions about this policy:{" "}
          <a className="underline" href="mailto:hello@hybridpro.fit">
            hello@hybridpro.fit
          </a>
        </p>
      </section>
    </main>
  );
}
