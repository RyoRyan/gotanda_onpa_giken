import Link from "next/link";
import type { Article as ArticleData } from "@/app/_libs/microcms";
import { sortCategoriesByOrder } from "@/app/_libs/utils";
import MathJaxArticleBody from "../MathJaxArticleBody";
import { articleBodyClassName } from "../articleBodyClassName";
import Date from "../Date";
import Category from "../Category";

type Props = {
  data: ArticleData;
  showExcerpt?: boolean;
};

export default function Article({ data, showExcerpt = true }: Props) {
  const sortedTags = sortCategoriesByOrder(data.tag ?? []);

  return (
    <article className="space-y-6">
      <header className="space-y-5">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 md:text-3xl">
          {data.title}
        </h1>
        {showExcerpt ? (
          <p className="text-base leading-7 text-zinc-600 md:text-lg">
            {data.excerpt}
          </p>
        ) : null}
        <div className="grid gap-3 text-sm text-zinc-500">
          <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
            {data.project ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-zinc-600">Project:</span>
                <Link
                  href={`/projects/${data.project.slug || data.project.id}`}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
                >
                  {data.project.title}
                </Link>
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-zinc-600">Category:</span>
              <Category category={data.category} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-zinc-600">Date:</span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600">
                <Date date={data.publishedAt ?? data.createdAt} />
              </span>
            </div>
          </div>
          {sortedTags.length > 0 ? (
            <div className="flex flex-wrap items-start gap-2">
              <span className="pt-1 font-medium text-zinc-600">Tags:</span>
              <div className="flex flex-wrap items-center gap-3">
                {sortedTags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/articles?tag=${tag.id}`}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </header>
      <MathJaxArticleBody
        html={data.body}
        className={articleBodyClassName}
      />
    </article>
  );
}
