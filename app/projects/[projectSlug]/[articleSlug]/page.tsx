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
  searchParams: Promise<{
    dk?: string;
  }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { projectSlug, articleSlug } = await params;
  const { dk } = await searchParams;
  const isDraftPreview = Boolean(dk);
  const data = await getArticleDetail(articleSlug, {
    draftKey: dk,
  }).catch(notFound);

  if (!data.project || (data.project.slug || data.project.id) !== projectSlug) {
    notFound();
  }

  const projectArticles = await getArticlesByProjectId(data.project.id, {
    orders: "-publishedAt",
  });
  const currentIndex = projectArticles.findIndex(
    (article) => article.id === data.id,
  );

  if (currentIndex === -1 && !isDraftPreview) {
    notFound();
  }

  const newerArticle = currentIndex > 0 ? projectArticles[currentIndex - 1] : null;
  const olderArticle =
    currentIndex >= 0 ? projectArticles[currentIndex + 1] : null;

  return (
    <>
      <Article data={data} showExcerpt={false} />
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            {/* Neighboring project articles need their own draft keys, so keep
                navigation disabled while previewing the current draft entry. */}
            {!isDraftPreview && olderArticle ? (
              <ButtonLink
                href={`/projects/${projectSlug}/${olderArticle.slug || olderArticle.id}`}
              >
                前の記事
              </ButtonLink>
            ) : null}
          </div>
          <div className="ml-auto">
            {!isDraftPreview && newerArticle ? (
              <ButtonLink
                href={`/projects/${projectSlug}/${newerArticle.slug || newerArticle.id}`}
              >
                次の記事
              </ButtonLink>
            ) : null}
          </div>
        </div>
        <div className="flex justify-center">
          <ButtonLink href={`/projects/${projectSlug}`}>プロジェクトに戻る</ButtonLink>
        </div>
      </div>
    </>
  );
}
