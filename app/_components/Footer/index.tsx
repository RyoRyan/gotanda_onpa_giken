import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white px-6 py-8">
      <nav className="mx-auto max-w-6xl">
        <ul className="flex items-center justify-evenly text-sm font-medium">
          <li>
            <Link
              href="/news"
              className="px-3 py-2 transition hover:opacity-70"
            >
              News
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="px-3 py-2 transition hover:opacity-70"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/works"
              className="px-3 py-2 transition hover:opacity-70"
            >
              Works
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="px-3 py-2 transition hover:opacity-70"
            >
              お問い合わせ
            </Link>
          </li>
        </ul>
      </nav>
      <p className="mt-6 text-center text-sm text-neutral-600">
        © 五反田音響波動技術研究所. All Rights Reserved 2026
      </p>
    </footer>
  );
}
