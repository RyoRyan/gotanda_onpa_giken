import { notFound } from "next/navigation";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import { getArticleDetail } from "@/app/_libs/microcms";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const data = await getArticleDetail(slug).catch(notFound);

  if (data.project) {
    notFound();
  }

  return (
    <>
      <Article data={data} />
      <div className="mt-8">
        <ButtonLink href="/blog">ブログ一覧へ戻る</ButtonLink>
      </div>
    </>
  );
}
