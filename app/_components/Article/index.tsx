import Link from "next/link";
import type { Article as ArticleData } from "@/app/_libs/microcms";
import { sortCategoriesByOrder } from "@/app/_libs/utils";
import MathJaxArticleBody from "../MathJaxArticleBody";
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
        className="space-y-4 text-base leading-8 text-zinc-800 [&_a]:text-zinc-900 [&_a]:underline [&_a]:underline-offset-4 [&_h1]:mt-12 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-zinc-950 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-zinc-950 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-zinc-900 [&_h4]:mt-6 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-zinc-900 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_p]:leading-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-2 [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-600 [&_mjx-container]:max-w-full [&_mjx-container]:overflow-x-auto [&_mjx-container]:overflow-y-hidden"
      />
    </article>
  );
}
