"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="header h-24 bg-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-2">
        <div className="w-[400px] shrink-0">
          <Link
            href="/"
            className={`logoLink block ${
              isHome ? "pointer-events-none invisible" : ""
            }`}
          >
            <Image
              src="/giken_logo_horizontal.svg"
              alt="Gotanda Onpa Giken"
              className=""
              width={400}
              height={80}
              priority
            />
          </Link>
        </div>

        <nav className="h-full">
          <ul className="flex h-full items-center text-base font-medium">
            <li className="flex h-full items-center">
              <Link
                href="/news"
                className="flex h-full items-center px-3 transition hover:opacity-70"
              >
                最新情報
              </Link>
            </li>
            <li className="flex h-full items-center">
              <Link
                href="/about"
                className="flex h-full items-center px-3 transition hover:opacity-70"
              >
                技研について
              </Link>
            </li>
            <li className="flex h-full items-center">
              <Link
                href="/works"
                className="flex h-full items-center px-3 transition hover:opacity-70"
              >
                試作品集
              </Link>
            </li>
            <li className="flex h-full items-center">
              <Link
                href="/tools"
                className="flex h-full items-center px-3 transition hover:opacity-70"
              >
                設計補助機能
              </Link>
            </li>
            <li className="flex h-full items-center">
              <Link
                href="/contact"
                className="flex h-full items-center px-3 transition hover:opacity-70"
              >
                お問い合わせ
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
