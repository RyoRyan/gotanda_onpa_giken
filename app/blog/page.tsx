import ArticleList from "@/app/_components/ArticleList";
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
      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-6">
          <p className="text-sm text-zinc-600">まだ記事はありません。</p>
        </div>
      ) : (
        <>
          <ArticleList articles={articles} />
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
