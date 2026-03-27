import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function ButtonLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="button rounded-sm border-2 border-zinc-800 bg-zinc-800 p-2 text-white transition-opacity duration-300 hover:opacity-60"
    >
      {children}
    </Link>
  );
}
