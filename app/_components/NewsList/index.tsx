import { News } from "@/app/_libs/microcms";
import Link from "next/link";
import Image from "next/image";
import Category from "../Category";
import Date from "../Date";

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
            {article.thumbnail ? (
              <Image
                src={article.thumbnail.url}
                alt=""
                className="h-auto w-[100px] shrink-0 rounded-xl object-cover"
                width={article.thumbnail.width}
                height={article.thumbnail.height}
              />
            ) : (
              <Image
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
                src="/giken_logo_simple.svg"
                alt="No Image"
                width={100}
                height={100}
              />
            )}

            <dl className="min-w-0">
              <dt className="text-lg font-bold text-zinc-900">
                {article.title}
              </dt>
              <dd className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                <Category category={article.category} />
                <Date date={article.publishedAt ?? article.createdAt} />
              </dd>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
