import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getNewsList } from "@/app/_libs/microcms";
import NewsList from "@/app/_components/NewsList";
import { NEWS_LIST_LIMIT } from "@/app/_constants";
import Pagination from "@/app/_components/Pagination";
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
      title: current > 1 ? `最新情報 ${current}ページ` : "最新情報",
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

  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    offset: NEWS_LIST_LIMIT * (current - 1),
    orders: "-publishedAt",
  });

  if (news.length === 0) {
    notFound();
  }

  return (
    <>
      <NewsList news={news} />
      <Pagination totalCount={totalCount} current={current} />
    </>
  );
}
