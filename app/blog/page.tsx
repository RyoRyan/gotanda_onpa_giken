import Link from "next/link";
import Image from "next/image";
import Category from "@/app/_components/Category";
import Date from "@/app/_components/Date";
import Pagination from "@/app/_components/Pagination";
import { BLOG_PAGE_LIMIT } from "@/app/_constants";
import { getArticleList } from "@/app/_libs/microcms";

export default async function Page() {
  const { contents: articles, totalCount } = await getArticleList({
    limit: BLOG_PAGE_LIMIT,
    filters: "project[not_exists]",
    orders: "-publishedAt",
  });

  return (
    <section className="space-y-6 leading-relaxed text-zinc-700">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-zinc-950">Blog</h2>
        <p>
          研究メモ、製作記録、実験ログ、部品レビューなどをまとめるための
          ブログセクションです。
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-6">
          <p className="text-sm text-zinc-600">まだ記事はありません。</p>
        </div>
      ) : (
        <>
          <ul className="space-y-6">
            {articles.map((article) => (
              <li
                key={article.id}
                className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/80"
              >
                <Link
                  href={`/blog/${article.slug}`}
                  className="grid gap-5 p-5 text-left transition hover:opacity-90 md:grid-cols-[200px_minmax(0,1fr)] md:p-6"
                >
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
                      className="aspect-[4/3] h-auto w-full rounded-2xl bg-white p-4 object-contain"
                      src="/giken_logo_simple.svg"
                      alt="No Image"
                      width={200}
                      height={150}
                    />
                  )}

                  <dl className="min-w-0 space-y-3">
                    <dt className="line-clamp-2 text-2xl font-bold text-zinc-900">
                      {article.title}
                    </dt>
                    <dd className="line-clamp-3 leading-7 text-zinc-600">
                      {article.excerpt}
                    </dd>
                    <dd className="flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                      <Category category={article.category} />
                      <Date date={article.publishedAt ?? article.createdAt} />
                    </dd>
                  </dl>
                </Link>
              </li>
            ))}
          </ul>
          <Pagination
            totalCount={totalCount}
            basePath="/blog"
            perPage={BLOG_PAGE_LIMIT}
          />
        </>
      )}
    </section>
  );
}
