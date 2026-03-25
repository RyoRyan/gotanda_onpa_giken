import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <nav>
        <ul>
          <li>
            <Link href="/news">News</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/works">Works</Link>
          </li>
          <li>
            <Link href="/contact">お問い合わせ</Link>
          </li>
        </ul>
      </nav>
      <p className="cr">© 五反田音響波動技術研究所. All Rights Reserved 2026</p>
    </footer>
  );
}
