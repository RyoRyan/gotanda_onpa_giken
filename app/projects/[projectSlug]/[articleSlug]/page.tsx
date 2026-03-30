import { notFound } from "next/navigation";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import { getArticleDetail } from "@/app/_libs/microcms";

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

  return (
    <>
      <Article data={data} />
      <div className="mt-8">
        <ButtonLink href={`/projects/${projectSlug}`}>
          プロジェクト一覧へ戻る
        </ButtonLink>
      </div>
    </>
  );
}
