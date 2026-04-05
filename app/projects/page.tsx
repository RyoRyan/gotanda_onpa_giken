import Image from "next/image";
import Link from "next/link";
import Category from "@/app/_components/Category";
import Date from "@/app/_components/Date";
import Pagination from "@/app/_components/Pagination";
import {
  type Article,
  getArticlesByProjectId,
  getProjectList,
} from "@/app/_libs/microcms";
import { PROJECTS_PAGE_LIMIT } from "@/app/_constants";
import { sortCategoriesByOrder } from "@/app/_libs/utils";

export default async function Page() {
  const { contents: projects, totalCount } = await getProjectList({
    limit: PROJECTS_PAGE_LIMIT,
    orders: "-sortOrder",
  });

  const projectArticlesEntries: Array<[string, Article[]]> = await Promise.all(
    projects.map(async (project) => [
      project.id,
      await getArticlesByProjectId(project.id, { orders: "publishedAt" }),
    ]),
  );
  const articlesByProject = new Map<string, Article[]>(projectArticlesEntries);

  return (
    <div className="space-y-6">
      {projects.length === 0 ? (
        <p>プロジェクトが登録されていません</p>
      ) : (
        <>
          <ul className="space-y-6">
            {projects.map((project) => {
              const projectArticles = articlesByProject.get(project.id) ?? [];
              const uniqueCategories = sortCategoriesByOrder(
                Array.from(
                  new Map(
                    projectArticles.map((article) => [
                      article.category.id,
                      article.category,
                    ]),
                  ).values(),
                ),
              );
              const uniqueTags = sortCategoriesByOrder(
                Array.from(
                  new Map(
                    projectArticles.flatMap((article) =>
                      (article.tag ?? []).map((tag) => [tag.id, tag] as const),
                    ),
                  ).values(),
                ),
              );

              return (
                <li
                  key={project.id}
                  className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/80"
                >
                  <div className="grid gap-5 p-5 md:grid-cols-[200px_minmax(0,1fr)] md:p-6">
                    {project.thumbnail ? (
                      <Link href={`/projects/${project.slug || project.id}`}>
                        <Image
                          src={project.thumbnail.url}
                          alt=""
                          width={project.thumbnail.width}
                          height={project.thumbnail.height}
                          className="aspect-[4/3] h-auto w-full rounded-2xl object-cover"
                        />
                      </Link>
                    ) : (
                      <Link href={`/projects/${project.slug || project.id}`}>
                        <Image
                          src="/giken_logo_simple.svg"
                          alt={`${project.title} thumbnail placeholder`}
                          width={200}
                          height={150}
                          className="hidden aspect-[4/3] h-auto w-full rounded-2xl bg-white p-4 object-contain md:block"
                        />
                      </Link>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-zinc-950">
                          <Link
                            href={`/projects/${project.slug || project.id}`}
                            className="transition hover:opacity-70"
                          >
                            {project.title}
                          </Link>
                        </h2>
                        <p className="leading-7 text-zinc-600">
                          {project.summary}
                        </p>
                        {uniqueCategories.length > 0 ||
                        uniqueTags.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-2 pt-2">
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
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
                          Articles
                        </p>
                        {projectArticles.length === 0 ? (
                          <p className="text-sm text-zinc-500">
                            まだ記事はありません。
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {projectArticles.map((article) => (
                              <li
                                key={article.id}
                                className="rounded-2xl bg-zinc-50 px-4 py-3"
                              >
                                <div
                                  className={
                                    article.coverImage
                                      ? "grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px] sm:items-start sm:gap-4"
                                      : "grid gap-3"
                                  }
                                >
                                  <div className="min-w-0">
                                    <Link
                                      href={`/projects/${project.slug || project.id}/${article.slug || article.id}`}
                                      className="inline-flex items-center text-sm font-semibold text-zinc-800 underline underline-offset-4 transition hover:text-zinc-500"
                                    >
                                      {article.title}
                                    </Link>

                                    <div className="mt-2">
                                      <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600">
                                        <Date
                                          date={
                                            article.publishedAt ??
                                            article.createdAt
                                          }
                                        />
                                      </span>
                                    </div>
                                  </div>

                                  {article.coverImage ? (
                                    <Link
                                      href={`/projects/${project.slug || project.id}/${article.slug || article.id}`}
                                      className="block w-full transition hover:opacity-90 sm:w-[120px] sm:justify-self-end"
                                    >
                                      <Image
                                        src={article.coverImage.url}
                                        alt=""
                                        width={200}
                                        height={150}
                                        className="aspect-[4/3] h-auto w-full rounded-2xl object-cover"
                                      />
                                    </Link>
                                  ) : null}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <Pagination
            totalCount={totalCount}
            basePath="/projects"
            perPage={PROJECTS_PAGE_LIMIT}
          />
        </>
      )}
    </div>
  );
}
