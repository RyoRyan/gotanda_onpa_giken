import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function ButtonLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="button bg-zinc-800 border-zinc-800 text-white border-2 p-2 rounded-sm"
    >
      {children}
    </Link>
  );
}
