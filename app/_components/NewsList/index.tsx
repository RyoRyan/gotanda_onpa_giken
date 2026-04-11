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
        <li
          key={article.id}
          className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-zinc-200 bg-white/70 p-4 text-left transition hover:border-zinc-300 hover:shadow-sm sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4"
        >
          <Link href={`/news/${article.slug || article.id}`}>
            {article.coverImage ? (
              <Image
                src={article.coverImage.url}
                alt=""
                className="h-[66px] w-[88px] rounded-xl object-cover sm:h-[90px] sm:w-[120px]"
                width={article.coverImage.width}
                height={article.coverImage.height}
              />
            ) : (
              <Image
                className="h-[66px] w-[88px] rounded-xl bg-white p-2 object-contain sm:h-[90px] sm:w-[120px] sm:p-3"
                src="/giken_logo_simple.svg"
                alt="No Image"
                width={100}
                height={100}
              />
            )}
          </Link>

          <dl className="min-w-0">
            <dt className="line-clamp-2 text-lg font-bold text-zinc-900">
              <Link
                href={`/news/${article.slug || article.id}`}
                className="transition hover:text-zinc-700"
              >
                {article.title}
              </Link>
            </dt>
            <dd className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
              <Category
                category={article.category}
                href={`/news/category/${article.category.id}`}
              />
              <Date date={article.publishedAt ?? article.createdAt} />
            </dd>
          </dl>
        </li>
      ))}
    </ul>
  );
}
