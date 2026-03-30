import { notFound } from "next/navigation";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import {
  getArticleDetail,
  getArticlesByProjectId,
} from "@/app/_libs/microcms";

type Props = {
  params: Promise<{
    projectSlug: string;
    articleSlug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { projectSlug, articleSlug } = await params;
  const data = await getArticleDetail(articleSlug).catch(notFound);

  if (!data.project || data.project.slug !== projectSlug) {
    notFound();
  }

  const projectArticles = await getArticlesByProjectId(data.project.id, {
    orders: "-publishedAt",
  });
  const currentIndex = projectArticles.findIndex(
    (article) => article.id === data.id,
  );

  if (currentIndex === -1) {
    notFound();
  }

  const newerArticle = projectArticles[currentIndex - 1];
  const olderArticle = projectArticles[currentIndex + 1];

  return (
    <>
      <Article data={data} showExcerpt={false} />
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            {olderArticle ? (
              <ButtonLink href={`/projects/${projectSlug}/${olderArticle.slug}`}>
                前の記事
              </ButtonLink>
            ) : null}
          </div>
          <div className="ml-auto">
            {newerArticle ? (
              <ButtonLink href={`/projects/${projectSlug}/${newerArticle.slug}`}>
                次の記事
              </ButtonLink>
            ) : null}
          </div>
        </div>
        <div className="flex justify-center">
          <ButtonLink href={`/projects/${projectSlug}`}>
            プロジェクトページに戻る
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
