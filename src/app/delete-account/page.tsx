import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delete your account · Hybrid Pro",
  description: "How to delete a Hybrid Pro account and the data stored with it.",
};

export default function DeleteAccountPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-16 text-[color:var(--foreground)]">
      <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--muted)] uppercase">
        Hybrid Pro
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Delete your account</h1>
      <div className="mt-8 space-y-4 text-base leading-relaxed text-[color:var(--muted)]">
        <p>You can delete your Hybrid Pro account from the app. Deletion is permanent.</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Open the Hybrid Pro app and sign in.</li>
          <li>Open Profile.</li>
          <li>Choose Delete account and confirm.</li>
        </ol>
        <p>
          This deletes your account info, workouts, meals, progress and meal photos, chat, and
          subscription record. Health Connect steps and heart rate stay on the device. Google Play
          keeps the purchase token on Google’s side. Signing out does not delete the account.
        </p>
        <p>
          Deletion URL:{" "}
          <a className="underline" href="https://hybridpro.in/delete-account">
            https://hybridpro.in/delete-account
          </a>
        </p>
        <p>
          If you cannot open the app, email{" "}
          <a className="underline" href="mailto:hello@hybridpro.fit">
            hello@hybridpro.fit
          </a>{" "}
          from the address on the account and ask for deletion.
        </p>
        <p>
          <Link href="/privacy" className="underline">
            Privacy policy
          </Link>
        </p>
      </div>
    </main>
  );
}
