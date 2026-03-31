import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function ButtonLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center justify-center rounded-sm border-2 border-zinc-800 bg-zinc-800 px-3 py-1.5 text-sm text-white transition-opacity duration-300 hover:opacity-60"
    >
      {children}
    </Link>
  );
}
