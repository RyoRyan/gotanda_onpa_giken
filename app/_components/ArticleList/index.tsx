import Image from "next/image";
import Link from "next/link";
import Category from "@/app/_components/Category";
import Date from "@/app/_components/Date";
import type { Article } from "@/app/_libs/microcms";

type Props = {
  articles: Article[];
};

const getArticleHref = (article: Article) => {
  if (article.project) {
    return `/projects/${article.project.slug || article.project.id}/${article.slug || article.id}`;
  }

  return `/blog/${article.slug || article.id}`;
};

export default function ArticleList({ articles }: Props) {
  return (
    <ul className="space-y-6">
      {articles.map((article) => (
        <li
          key={article.id}
          className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/80"
        >
          <div className="grid gap-5 p-5 text-left md:grid-cols-[200px_minmax(0,1fr)] md:p-6">
            <Link href={getArticleHref(article)} className="transition hover:opacity-90">
              {article.coverImage ? (
                <Image
                  src={article.coverImage.url}
                  alt=""
                  width={article.coverImage.width}
                  height={article.coverImage.height}
                  className="aspect-[4/3] h-auto w-full rounded-2xl object-cover"
                />
            ) : (
              <Image
                className="hidden aspect-[4/3] h-auto w-full rounded-2xl bg-white p-4 object-contain md:block"
                src="/giken_logo_simple.svg"
                alt="No Image"
                width={200}
                height={150}
                />
              )}
            </Link>

            <dl className="min-w-0 space-y-3">
              <dt className="line-clamp-2 text-2xl font-bold text-zinc-900">
                <Link
                  href={getArticleHref(article)}
                  className="transition hover:text-zinc-700"
                >
                  {article.title}
                </Link>
              </dt>
              <dd className="line-clamp-3 leading-7 text-zinc-600">
                {article.excerpt}
              </dd>
              <dd className="flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                <Category category={article.category} />
                <Date date={article.publishedAt ?? article.createdAt} />
                {article.project ? (
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600">
                    {article.project.title}
                  </span>
                ) : null}
              </dd>
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
}
