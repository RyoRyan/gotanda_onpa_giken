import { notFound } from "next/navigation";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import { getAllArticles, getArticleDetail } from "@/app/_libs/microcms";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    dk?: string;
  }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { dk } = await searchParams;
  const isDraftPreview = Boolean(dk);
  const data = await getArticleDetail(slug, { draftKey: dk }).catch(notFound);

  if (data.project) {
    notFound();
  }

  const blogArticles = await getAllArticles({
    filters: "project[not_exists]",
    orders: "-publishedAt",
  });
  const currentIndex = blogArticles.findIndex((article) => article.id === data.id);

  if (currentIndex === -1 && !isDraftPreview) {
    notFound();
  }

  const newerArticle = currentIndex > 0 ? blogArticles[currentIndex - 1] : null;
  const olderArticle =
    currentIndex >= 0 ? blogArticles[currentIndex + 1] : null;

  return (
    <>
      <Article data={data} />
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            {/* A microCMS draft key is entry-specific, so draft preview should not
                link into neighboring published entries. */}
            {!isDraftPreview && olderArticle ? (
              <ButtonLink href={`/blog/${olderArticle.slug || olderArticle.id}`}>
                前の記事
              </ButtonLink>
            ) : null}
          </div>
          <div className="ml-auto">
            {!isDraftPreview && newerArticle ? (
              <ButtonLink href={`/blog/${newerArticle.slug || newerArticle.id}`}>
                次の記事
              </ButtonLink>
            ) : null}
          </div>
        </div>
        <div className="flex justify-center">
          <ButtonLink href="/blog">一覧に戻る</ButtonLink>
        </div>
      </div>
    </>
  );
}
