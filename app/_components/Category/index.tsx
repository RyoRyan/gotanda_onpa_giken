import type { Category } from "@/app/_libs/microcms";

type Props = {
  category: Category;
};

export default function Category({ category }: Props) {
  return (
    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium tracking-wide text-zinc-700">
      {category.name}
    </span>
  );
}
