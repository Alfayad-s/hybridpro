"use client";

import BrandLogo from "@/components/BrandLogo";
import { useTheme } from "@/components/ThemeProvider";
import { FLUORO_GREEN } from "@/components/sections/Reveal";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

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

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] lg:flex">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[color:var(--border)] bg-[var(--card)] px-4 py-5 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-2">
          <BrandLogo className="h-8 w-auto text-[var(--foreground)]" title="" />
          <div>
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

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {links.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium"
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
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-[color:var(--muted)]"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 border-b border-[color:var(--border)] px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-[color:var(--border)] px-3 py-2 text-sm"
          >
            Menu
          </button>
          <p
            className="text-xl tracking-[0.04em] uppercase"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Admin
          </p>
        </div>
        <div className="px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
