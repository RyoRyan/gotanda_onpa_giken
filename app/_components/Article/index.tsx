import Link from "next/link";
import type { Article as ArticleData } from "@/app/_libs/microcms";
import Date from "../Date";
import Category from "../Category";

type Props = {
  data: ArticleData;
};

export default function Article({ data }: Props) {
  return (
    <article className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 md:text-3xl">
          {data.title}
        </h1>
        <p className="text-base leading-7 text-zinc-600 md:text-lg">
          {data.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <Category category={data.category} />
          <Date date={data.publishedAt ?? data.createdAt} />
          {data.project ? (
            <Link
              href={`/projects/${data.project.slug}`}
              className="text-zinc-700 underline underline-offset-4"
            >
              {data.project.title}
            </Link>
          ) : null}
        </div>
      </header>
      <div
        className="space-y-4 text-base leading-8 text-zinc-800 [&_a]:text-zinc-900 [&_a]:underline [&_a]:underline-offset-4 [&_h1]:mt-12 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-zinc-950 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-zinc-950 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-zinc-900 [&_h4]:mt-6 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-zinc-900 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_p]:leading-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-2 [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-600"
        dangerouslySetInnerHTML={{ __html: data.body }}
      />
    </article>
  );
}
