import Image from "next/image";
import type { News } from "@/app/_libs/microcms";
import { articleBodyClassName } from "../articleBodyClassName";
import Date from "../Date";
import Category from "../Category";

type Props = {
  data: News;
};

export default function NewsArticle({ data }: Props) {
  const newsCategory = data.category;

  return (
    <article className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 md:text-3xl">
          {data.title}
        </h1>
        {data.excerpt ? (
          <p className="text-base leading-7 text-zinc-600 md:text-lg">
            {data.excerpt}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <Category
            category={newsCategory}
            href={`/news/category/${newsCategory.id}`}
          />
          <Date date={data.publishedAt ?? data.createdAt} />
        </div>
      </header>
      {data.coverImage && (
        <Image
          src={data.coverImage.url}
          alt=""
          className="h-auto w-full rounded-2xl object-cover"
          width={data.coverImage.width}
          height={data.coverImage.height}
        />
      )}
      <div
        className={articleBodyClassName}
        dangerouslySetInnerHTML={{ __html: data.body }}
      />
    </article>
  );
}
