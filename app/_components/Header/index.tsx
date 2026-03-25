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
    </header>
  );
}
