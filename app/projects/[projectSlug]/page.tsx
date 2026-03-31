import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ButtonLink from "@/app/_components/ButtonLink";
import Category from "@/app/_components/Category";
import Date from "@/app/_components/Date";
import {
  getArticlesByProjectId,
  getProjectDetail,
} from "@/app/_libs/microcms";

type Props = {
  params: Promise<{
    projectSlug: string;
  }>;
  searchParams: Promise<{
    dk?: string;
  }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { projectSlug } = await params;
  const { dk } = await searchParams;
  const project = await getProjectDetail(projectSlug, {
    draftKey: dk,
  }).catch(notFound);
  const articles = await getArticlesByProjectId(project.id, {
    orders: "-publishedAt",
  });
  const uniqueCategories = Array.from(
    new Map(
      articles.map((article) => [article.category.id, article.category]),
    ).values(),
  );
  const uniqueTags = Array.from(
    new Map(
      articles.flatMap((article) =>
        (article.tag ?? []).map((tag) => [tag.id, tag] as const),
      ),
    ).values(),
  );

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-zinc-950">{project.title}</h2>
        <p className="leading-7 text-zinc-600">{project.summary}</p>
        {uniqueCategories.length > 0 || uniqueTags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {uniqueCategories.map((category) => (
              <Category key={category.id} category={category} />
            ))}
            {uniqueTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/articles?tag=${tag.id}`}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        ) : null}
        {project.thumbnail ? (
          <Image
            src={project.thumbnail.url}
            alt=""
            width={project.thumbnail.width}
            height={project.thumbnail.height}
            className="h-auto w-full rounded-2xl object-cover"
          />
        ) : (
          <Image
            src="/giken_logo_simple.svg"
            alt={`${project.title} thumbnail placeholder`}
            width={800}
            height={600}
            className="h-auto w-full rounded-2xl bg-white p-8 object-contain"
          />
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-zinc-900">Articles</h3>
        {articles.length === 0 ? (
          <p className="text-zinc-500">このプロジェクトの記事はまだありません。</p>
        ) : (
          <ul className="space-y-3">
            {articles.map((article) => (
              <li key={article.id} className="rounded-2xl border border-zinc-200 p-4">
                <Link
                  href={`/projects/${project.slug}/${article.slug}`}
                  className="text-lg font-semibold text-zinc-900 underline underline-offset-4"
                >
                  {article.title}
                </Link>
                <div className="mt-2">
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600">
                    <Date date={article.publishedAt ?? article.createdAt} />
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {article.excerpt}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-center">
        <ButtonLink href="/projects">プロジェクト一覧に戻る</ButtonLink>
      </div>
    </section>
  );
}
