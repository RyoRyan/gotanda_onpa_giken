import Link from "next/link";

type Props = {
  totalCount: number;
  current?: number;
  basePath?: string;
  perPage?: number;
};

export default function Pagination({
  totalCount,
  current = 1,
  basePath = "/news",
  perPage = 10,
}: Props) {
  const pages = Array.from(
    { length: Math.ceil(totalCount / perPage) },
    (_, i) => i + 1,
  );

  return (
    <nav className="mt-8 flex justify-center">
      <ul className="flex items-center gap-2">
        {pages.map((p) => (
          <li key={p}>
            {current !== p ? (
              <Link
                href={`${basePath}/p/${p}`}
                className="flex h-10 min-w-10 items-center justify-center rounded-full border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-800 hover:text-zinc-900"
              >
                {p}
              </Link>
            ) : (
              <span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-zinc-800 px-3 text-sm font-medium text-white">
                {p}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
