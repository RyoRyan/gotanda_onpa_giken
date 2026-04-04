import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import ArticleList from "@/app/_components/ArticleList";
import Pagination from "@/app/_components/Pagination";
import { ARTICLES_PAGE_LIMIT } from "@/app/_constants";
import ArticleFilters from "@/app/articles/_components/ArticleFilters";
import {
  getAllArticles,
  getArticleList,
  getCategoryDetail,
} from "@/app/_libs/microcms";
import { sortCategoriesByOrder } from "@/app/_libs/utils";
import { buildSocialMetadata } from "@/app/_libs/metadata";

export const dynamic = "force-dynamic";

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

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
},
parent: ResolvingMetadata): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const categoryId = getSingleParam(resolvedSearchParams.category);
  const tagIds = getMultiParam(resolvedSearchParams.tag);
  const currentPage = Number.parseInt(
    getSingleParam(resolvedSearchParams.page) ?? "1",
    10,
  );
  const page = Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  const [category, tags] = await Promise.all([
    categoryId ? getCategoryDetail(categoryId).catch(() => null) : null,
    Promise.all(tagIds.map((tagId) => getCategoryDetail(tagId).catch(() => null))),
  ]);

  const titleParts = [
    ...(category ? [category.name] : []),
    ...tags.flatMap((tag) => (tag ? [tag.name] : [])),
  ];
  const baseTitle =
    titleParts.length > 0 ? `${titleParts.join(" / ")}の記事一覧` : "記事一覧";

  return buildSocialMetadata(
    {
      title: page > 1 ? `${baseTitle} ${page}ページ` : baseTitle,
      description: category?.description,
    },
    parent,
  );
}

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
        <ArticleFilters
          key={`${categoryId ?? ""}:${tagIds.join(",")}`}
          categories={categories}
          tags={tags}
          selectedCategoryId={categoryId}
          selectedTagIds={tagIds}
        />
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
