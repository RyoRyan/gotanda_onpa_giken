import type { Metadata, ResolvingMetadata } from "next";
import { getCategoryDetail, getNewsList } from "@/app/_libs/microcms";
import { notFound } from "next/navigation";
import NewsList from "@/app/_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import Category from "@/app/_components/Category";
import { buildSocialMetadata } from "@/app/_libs/metadata";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryDetail(id).catch(notFound);

  return buildSocialMetadata(
    {
      title: `${category.name}の最新情報`,
      description: category.description,
    },
    parent,
  );
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const category = await getCategoryDetail(id).catch(notFound);
  const { contents: news, totalCount } = await getNewsList({
    filters: `category[equals]${category.id}`,
  });
  return (
    <>
      <p>
        <Category category={category} />
        の一覧
      </p>
      <NewsList news={news} />
      <Pagination
        totalCount={totalCount}
        basePath={`/news/category/${category.id}`}
      />
    </>
  );
}
