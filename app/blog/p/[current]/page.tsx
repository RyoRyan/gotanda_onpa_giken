import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import ArticleList from "@/app/_components/ArticleList";
import Pagination from "@/app/_components/Pagination";
import { BLOG_PAGE_LIMIT } from "@/app/_constants";
import { getArticleList } from "@/app/_libs/microcms";
import { buildSocialMetadata } from "@/app/_libs/metadata";

type Props = {
  params: Promise<{
    current: string;
  }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const routeParams = await params;
  const current = parseInt(routeParams.current, 10);

  if (Number.isNaN(current) || current < 1) {
    notFound();
  }

  return buildSocialMetadata(
    {
      title: current > 1 ? `雑記 ${current}ページ` : "雑記",
    },
    parent,
  );
}

export default async function Page({ params }: Props) {
  const routeParams = await params;
  const current = parseInt(routeParams.current, 10);

  if (Number.isNaN(current) || current < 1) {
    notFound();
  }

  const { contents: articles, totalCount } = await getArticleList({
    limit: BLOG_PAGE_LIMIT,
    offset: BLOG_PAGE_LIMIT * (current - 1),
    filters: "project[not_exists]",
    orders: "-publishedAt",
  });

  if (articles.length === 0) {
    notFound();
  }

  return (
    <section className="space-y-6 leading-relaxed text-zinc-700">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-zinc-950">Blog</h2>
        <p>
          研究メモ、製作記録、実験ログ、部品レビューなどをまとめるための
          ブログセクションです。
        </p>
      </div>

      <ArticleList articles={articles} />

      <Pagination
        totalCount={totalCount}
        current={current}
        basePath="/blog"
        perPage={BLOG_PAGE_LIMIT}
      />
    </section>
  );
}
