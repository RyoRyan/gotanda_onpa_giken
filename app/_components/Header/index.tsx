"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/news", label: "最新情報" },
    { href: "/about", label: "技研について" },
    { href: "/projects", label: "プロジェクト" },
    { href: "/blog", label: "雑記" },
    { href: "/tools", label: "設計補助機能" },
  ];

  return (
    <header className="header sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="w-[260px] shrink-0 lg:w-[400px]">
          <Link
            href="/"
            className={`logoLink block transition-all duration-700 ${
              isHome
                ? "pointer-events-none -translate-x-4 opacity-0 md:-translate-x-4"
                : "translate-x-0 opacity-100"
            }`}
          >
            <Image
              src="/giken_logo_horizontal.svg"
              alt="Gotanda Onpa Giken"
              className="h-auto w-full"
              width={400}
              height={80}
              priority
            />
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label="メニューを開く"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 bg-white/90 text-zinc-900 shadow-sm transition hover:bg-zinc-100 lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${
                isMenuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition ${
                isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        <nav className="hidden h-full lg:block">
          <ul className="flex h-full items-center text-base font-medium">
            {navItems.map((item) => (
              <li key={item.href} className="flex h-full items-center">
                <Link
                  href={item.href}
                  className="flex h-full items-center px-3 transition hover:opacity-70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={`absolute inset-x-0 top-full lg:hidden ${
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-x-0 top-0 h-screen bg-white/30 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        <nav
          id="mobile-navigation"
          aria-hidden={!isMenuOpen}
          className={`relative ml-auto w-[min(22rem,calc(100vw-1rem))] border-l border-zinc-200 bg-white/95 px-4 py-4 shadow-lg transition-transform duration-300 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <ul className="space-y-1 text-base font-medium">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-4 py-3 transition hover:bg-zinc-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
