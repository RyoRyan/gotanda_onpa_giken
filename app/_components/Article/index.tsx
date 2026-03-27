import Link from "next/link";
import Image from "next/image";
import type { News } from "@/app/_libs/microcms";
import Date from "../Date";
import Category from "../Category";

type Props = {
  data: News;
};

export default function Article({ data }: Props) {
  return (
    <article>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <div>
        <Link href={`/news/category/${data.category.id}`} className="">
          <Category category={data.category} />
        </Link>
        <Date date={data.publishedAt ?? data.createdAt} />
      </div>
      {data.thumbnail && (
        <Image
          src={data.thumbnail.url}
          alt=""
          className=""
          width={data.thumbnail.width}
          height={data.thumbnail.height}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </article>
  );
}
