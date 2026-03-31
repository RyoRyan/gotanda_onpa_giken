"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/app/_libs/microcms";

type FilterState = {
  category?: string;
  tags: string[];
};

type Props = {
  categories: Category[];
  tags: Category[];
  selectedCategoryId?: string;
  selectedTagIds: string[];
};

const buildArticlesHref = ({ category, tags }: FilterState) => {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  tags.forEach((tag) => {
    params.append("tag", tag);
  });

  const query = params.toString();

  return query ? `/articles?${query}` : "/articles";
};

export default function ArticleFilters({
  categories,
  tags,
  selectedCategoryId,
  selectedTagIds,
}: Props) {
  const router = useRouter();
  const [pendingFilters, setPendingFilters] = useState<FilterState | null>(null);
  const activeFilters = pendingFilters ?? {
    category: selectedCategoryId,
    tags: selectedTagIds,
  };

  const navigateTo = (nextFilters: FilterState) => {
    setPendingFilters(nextFilters);
    const href = buildArticlesHref(nextFilters);
    router.push(href);
    router.refresh();
  };

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Categories
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const isSelected = category.id === activeFilters.category;
            const nextFilters = {
              category: isSelected ? undefined : category.id,
              tags: activeFilters.tags,
            };

            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => navigateTo(nextFilters)}
                className={`inline-flex cursor-pointer rounded-full px-3 py-1 text-xs font-medium tracking-wide transition ${
                  isSelected
                    ? "bg-zinc-800 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Tags
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => {
            const isSelected = activeFilters.tags.includes(tag.id);
            const nextFilters = {
              category: activeFilters.category,
              tags: isSelected
                ? activeFilters.tags.filter((id) => id !== tag.id)
                : [...activeFilters.tags, tag.id],
            };

            return (
              <button
                key={tag.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => navigateTo(nextFilters)}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium tracking-wide transition ${
                  isSelected
                    ? "bg-zinc-800 text-white"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
