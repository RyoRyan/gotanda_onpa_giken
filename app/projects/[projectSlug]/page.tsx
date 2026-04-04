import type { Metadata, ResolvingMetadata } from "next";
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
import { sortCategoriesByOrder } from "@/app/_libs/utils";
import { buildSocialMetadata } from "@/app/_libs/metadata";

type Props = {
  params: Promise<{
    projectSlug: string;
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
  const { projectSlug } = await params;
  const { dk } = await searchParams;
  const project = await getProjectDetail(projectSlug, {
    draftKey: dk,
  }).catch(notFound);

  return buildSocialMetadata(
    {
      title: project.title,
      description: project.summary,
      image: project.thumbnail
        ? {
            url: project.thumbnail.url,
            width: project.thumbnail.width,
            height: project.thumbnail.height,
          }
        : null,
    },
    parent,
  );
}

export default async function Page({ params, searchParams }: Props) {
  const { projectSlug } = await params;
  const { dk } = await searchParams;
  const isDraftPreview = Boolean(dk);
  const project = await getProjectDetail(projectSlug, {
    draftKey: dk,
  }).catch(notFound);
  const articles = await getArticlesByProjectId(project.id, {
    orders: "publishedAt",
  });
  const uniqueCategories = sortCategoriesByOrder(
    Array.from(
      new Map(
        articles.map((article) => [article.category.id, article.category]),
      ).values(),
    ),
  );
  const uniqueTags = sortCategoriesByOrder(
    Array.from(
      new Map(
        articles.flatMap((article) =>
          (article.tag ?? []).map((tag) => [tag.id, tag] as const),
        ),
      ).values(),
    ),
  );

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-zinc-950">{project.title}</h2>
        <p className="leading-7 text-zinc-600">{project.summary}</p>
        {uniqueCategories.length > 0 || uniqueTags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {uniqueCategories.map((category) => (
              // Project preview uses the project's draft key only. Category, tag,
              // and related-article links would leave draft context, so render
              // them as plain labels while previewing.
              isDraftPreview ? (
                <span
                  key={category.id}
                  className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium tracking-wide text-zinc-700"
                >
                  {category.name}
                </span>
              ) : (
                <Category key={category.id} category={category} />
              )
            ))}
            {uniqueTags.map((tag) => (
              isDraftPreview ? (
                <span
                  key={tag.id}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600"
                >
                  {tag.name}
                </span>
              ) : (
                <Link
                  key={tag.id}
                  href={`/articles?tag=${tag.id}`}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600"
                >
                  {tag.name}
                </Link>
              )
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
        ) : null}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-zinc-900">Articles</h3>
        {articles.length === 0 ? (
          <p className="text-zinc-500">このプロジェクトの記事はまだありません。</p>
        ) : (
          <ul className="space-y-3">
            {articles.map((article) => (
              <li key={article.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px] sm:items-start sm:gap-4">
                  <div className="min-w-0">
                    {isDraftPreview ? (
                      <span className="text-lg font-semibold text-zinc-900">
                        {article.title}
                      </span>
                    ) : (
                      <Link
                        href={`/projects/${project.slug || project.id}/${article.slug || article.id}`}
                        className="text-lg font-semibold text-zinc-900 underline underline-offset-4"
                      >
                        {article.title}
                      </Link>
                    )}
                    <div className="mt-2">
                      <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600">
                        <Date date={article.publishedAt ?? article.createdAt} />
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      {article.excerpt}
                    </p>
                  </div>
                  {article.coverImage ? (
                    isDraftPreview ? (
                      <div className="w-full sm:w-[140px] sm:justify-self-end">
                        <Image
                          src={article.coverImage.url}
                          alt=""
                          width={200}
                          height={150}
                          className="aspect-[4/3] h-auto w-full rounded-2xl object-cover"
                        />
                      </div>
                    ) : (
                      <Link
                        href={`/projects/${project.slug || project.id}/${article.slug || article.id}`}
                        className="block w-full transition hover:opacity-90 sm:w-[140px] sm:justify-self-end"
                      >
                        <Image
                          src={article.coverImage.url}
                          alt=""
                          width={200}
                          height={150}
                          className="aspect-[4/3] h-auto w-full rounded-2xl object-cover"
                        />
                      </Link>
                    )
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-center">
        <ButtonLink href="/projects">一覧に戻る</ButtonLink>
      </div>
    </section>
  );
}
