import Link from "next/link";
import type { Category } from "@/app/_libs/microcms";

type Props = {
  category: Category;
};

export default function Category({ category }: Props) {
  const href =
    category.contentType === "news"
      ? `/news/category/${category.id}`
      : `/articles?category=${category.id}`;

  return (
    <Link
      href={href}
      className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium tracking-wide text-zinc-700 transition hover:bg-zinc-200"
    >
      {category.name}
    </Link>
  );
}
