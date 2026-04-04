import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/microcms";
import NewsArticle from "@/app/_components/NewsArticle";
import ButtonLink from "@/app/_components/ButtonLink";
import { buildSocialMetadata } from "@/app/_libs/metadata";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    dk?: string;
  }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props,
parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const { dk } = await searchParams;
  const data = await getNewsDetail(slug, { draftKey: dk }).catch(notFound);

  return buildSocialMetadata(
    {
      title: data.title,
      description: data.excerpt,
      image: data.coverImage
        ? {
            url: data.coverImage.url,
            width: data.coverImage.width,
            height: data.coverImage.height,
          }
        : null,
    },
    parent,
  );
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { dk } = await searchParams;
  const data = await getNewsDetail(slug, { draftKey: dk }).catch(notFound);

  return (
    <>
      <NewsArticle data={data} />
      <div className="mt-8 flex justify-center">
        <ButtonLink href="/news">一覧に戻る</ButtonLink>
      </div>
    </>
  );
}
