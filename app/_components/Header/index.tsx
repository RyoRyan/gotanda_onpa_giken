import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="logoLink">
        <Image
          src="/logo.svg"
          alt="Gotanda Onpa Giken"
          className="logo"
          width={348}
          height={133}
          priority
        />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/news">ニュース</Link>
          </li>
          <li>
            <Link href="/about">技研について</Link>
          </li>
          <li>
            <Link href="/works">Works</Link>
          </li>
          <li>
            <Link href="/contact">お問い合わせ</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
