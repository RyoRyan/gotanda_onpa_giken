import { notFound } from "next/navigation";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import { getAllArticles, getArticleDetail } from "@/app/_libs/microcms";

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

  const blogArticles = await getAllArticles({
    filters: "project[not_exists]",
    orders: "-publishedAt",
  });
  const currentIndex = blogArticles.findIndex((article) => article.id === data.id);

  if (currentIndex === -1) {
    notFound();
  }

  const newerArticle = blogArticles[currentIndex - 1];
  const olderArticle = blogArticles[currentIndex + 1];

  return (
    <>
      <Article data={data} />
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            {olderArticle ? (
              <ButtonLink href={`/blog/${olderArticle.slug}`}>前の記事</ButtonLink>
            ) : null}
          </div>
          <div className="ml-auto">
            {newerArticle ? (
              <ButtonLink href={`/blog/${newerArticle.slug}`}>次の記事</ButtonLink>
            ) : null}
          </div>
        </div>
        <div className="flex justify-center">
          <ButtonLink href="/blog">ブログ一覧へ戻る</ButtonLink>
        </div>
      </div>
    </>
  );
}
