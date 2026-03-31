import Link from "next/link";
import ArticleList from "@/app/_components/ArticleList";
import Pagination from "@/app/_components/Pagination";
import { ARTICLES_PAGE_LIMIT } from "@/app/_constants";
import { getAllArticles, getArticleList } from "@/app/_libs/microcms";
import { sortCategoriesByOrder } from "@/app/_libs/utils";

type SearchParams = Promise<{
  category?: string | string[];
  tag?: string | string[];
  page?: string | string[];
}>;

const getSingleParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const getMultiParam = (value?: string | string[]) => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const buildArticleFilters = ({
  category,
  tags,
}: {
  category?: string;
  tags: string[];
}) => {
  const filters: string[] = [];

  if (category) {
    filters.push(`category[equals]${category}`);
  }

  if (tags.length === 1) {
    filters.push(`tag[contains]${tags[0]}`);
  }

  if (tags.length > 1) {
    filters.push(tags.map((tag) => `tag[contains]${tag}`).join("[or]"));
  }

  return filters.join("[and]");
};

const buildArticlesHref = ({
  category,
  tags,
}: {
  category?: string;
  tags: string[];
}) => {
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

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const categoryId = getSingleParam(resolvedSearchParams.category);
  const tagIds = getMultiParam(resolvedSearchParams.tag);
  const currentPage = Number.parseInt(
    getSingleParam(resolvedSearchParams.page) ?? "1",
    10,
  );
  const page = Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const filters = buildArticleFilters({ category: categoryId, tags: tagIds });
  const articleQueries = {
    ...(filters ? { filters } : {}),
    limit: ARTICLES_PAGE_LIMIT,
    offset: ARTICLES_PAGE_LIMIT * (page - 1),
    orders: "-publishedAt",
  };

  const [allArticles, { contents: articles, totalCount }] = await Promise.all([
    getAllArticles({ orders: "-publishedAt" }),
    getArticleList(articleQueries),
  ]);
  const categories = sortCategoriesByOrder(
    Array.from(
      new Map(
        allArticles.map((article) => [article.category.id, article.category]),
      ).values(),
    ),
  );
  const tags = sortCategoriesByOrder(
    Array.from(
      new Map(
        allArticles.flatMap((article) =>
          (article.tag ?? []).map((tag) => [tag.id, tag] as const),
        ),
      ).values(),
    ),
  );

  return (
    <section className="space-y-6 leading-relaxed text-zinc-700">
      <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white/80 p-5 md:p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Categories
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={buildArticlesHref({
                  category:
                    category.id === categoryId ? undefined : category.id,
                  tags: tagIds,
                })}
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium tracking-wide transition ${
                  category.id === categoryId
                    ? "bg-zinc-800 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Tags
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={buildArticlesHref({
                  category: categoryId,
                  tags: tagIds.includes(tag.id)
                    ? tagIds.filter((id) => id !== tag.id)
                    : [...tagIds, tag.id],
                })}
                className={`rounded-full px-3 py-1 text-xs font-medium tracking-wide transition ${
                  tagIds.includes(tag.id)
                    ? "bg-zinc-800 text-white"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="pt-1">
          <Link
            href="/articles"
            className="text-sm underline underline-offset-4 transition hover:text-zinc-900"
          >
            すべて表示
          </Link>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-6">
          <p className="text-sm text-zinc-600">
            該当する記事はまだありません。
          </p>
        </div>
      ) : (
        <>
          <ArticleList articles={articles} />
          <Pagination
            totalCount={totalCount}
            current={page}
            basePath="/articles"
            perPage={ARTICLES_PAGE_LIMIT}
            searchParams={{
              category: categoryId,
              tag: tagIds,
            }}
          />
        </>
      )}
    </section>
  );
}
