import { News } from "@/app/_libs/microcms";
import Link from "next/link";
import Image from "next/image";

type Props = {
  news: News[];
};

export default function NewsList({ news }: Props) {
  if (news.length === 0) {
    return <p>記事がありません</p>;
  }
  return (
    <ul className="space-y-4">
      {news.map((article) => (
        <li key={article.id}>
          <Link
            href={`/news/${article.id}`}
            className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-4 text-left transition hover:border-zinc-300 hover:shadow-sm"
          >
            <Image
              className="h-20 w-20 shrink-0 rounded-xl object-cover"
              src="/giken_logo_simple.svg"
              alt="No Image"
              width={100}
              height={100}
            />
            <dl className="min-w-0">
              <dt className="text-lg font-bold text-zinc-900">
                {article.title}
              </dt>
              <dd className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium tracking-wide text-zinc-700">
                  {article.category.name}
                </span>
                <span>{article.publishedAt}</span>
              </dd>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
