"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/kumbara", label: "Kumbara" },
    { href: "/tool", label: "Dashboard Tool" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      {/* ÜST NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[radial-gradient(1000px_400px_at_10%_-10%,rgba(255,0,0,.08),transparent),radial-gradient(1000px_400px_at_90%_-10%,rgba(255,255,255,.04),transparent)] backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] flex items-center justify-between px-6 py-4">
          {/* Logo ve başlık */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/20 grid place-items-center shadow-[0_0_20px_rgba(230,0,0,.2)]">
              <span className="text-lg">🧰</span>
            </div>
            <div>
              <div className="font-semibold text-white/90">Vodafone All In One App</div>
              <div className="text-xs text-white/60 -mt-0.5">Internal Platform</div>
            </div>
          </div>

          {/* Menü */}
          <nav className="flex items-center gap-3 text-sm">
            {navItems.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    isActive
                      ? "bg-red-500/20 border-red-500/40 text-red-300"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Sayfa içeriği */}
      <main className="pt-6">{children}</main>
    </div>
  );
}