"use client";

import BrandLogo from "@/components/BrandLogo";
import { useTheme } from "@/components/ThemeProvider";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type AdminShellProps = {
  children: ReactNode;
  onLogout?: () => Promise<void> | void;
};

export default function AdminShell({ children, onLogout }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    if (onLogout) {
      await onLogout();
      return;
    }
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
  };

  const links = [
    {
      href: "/admin",
      label: "Clients",
      match: (path: string) => path === "/admin" || path.startsWith("/admin/clients"),
    },
    {
      href: "/admin/contacts",
      label: "Contact",
      match: (path: string) => path.startsWith("/admin/contacts"),
    },
  ];

  const pageTitle =
    pathname.startsWith("/admin/contacts")
      ? "Contact"
      : pathname.startsWith("/admin/clients")
        ? "Client"
        : "Clients";

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[var(--background)] text-[var(--foreground)] lg:flex">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(18rem,88vw)] flex-col border-r border-[color:var(--border)] bg-white px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[8px_0_24px_rgba(17,17,17,0.08)] transition-transform duration-200 dark:bg-black dark:shadow-[8px_0_24px_rgba(0,0,0,0.45)] lg:static lg:w-64 lg:translate-x-0 lg:bg-[var(--background)] lg:pt-5 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo className="h-8 w-auto shrink-0 text-[var(--foreground)]" title="" />
            <div className="min-w-0">
              <p className="text-[0.65rem] tracking-[0.28em] text-[color:var(--muted)] uppercase">
                Hybrid Pro
              </p>
              <p
                className="text-xl leading-none tracking-[0.04em] uppercase"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                Admin
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-[color:var(--border)] text-lg lg:hidden"
          >
            ×
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {links.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium"
                style={
                  active
                    ? { background: FLUORO_GREEN, color: "#111" }
                    : undefined
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-[color:var(--border)] pt-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="h-12 w-full rounded-xl px-3 text-left text-sm text-[color:var(--muted)]"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="h-12 w-full rounded-xl px-3 text-left text-sm"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[color:var(--border)] bg-[var(--background)]/90 px-4 py-2.5 pt-[max(0.65rem,env(safe-area-inset-top))] backdrop-blur-md lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[color:var(--border)]"
          >
            <span className="flex w-4 flex-col gap-1" aria-hidden>
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
            </span>
          </button>
          <div className="min-w-0">
            <p className="text-[0.65rem] tracking-[0.22em] text-[color:var(--muted)] uppercase">
              Hybrid Pro
            </p>
            <p
              className="truncate text-lg leading-none tracking-[0.04em] uppercase"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {pageTitle}
            </p>
          </div>
        </header>
        <div className="px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
