import { createClient } from "microcms-js-sdk";
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSListContent,
} from "microcms-js-sdk";

export type Project = {
  title: string;
  slug: string;
  summary: string;
  thumbnail?: MicroCMSImage;
  sortOrder?: number;
} & MicroCMSListContent;

export type Category = {
  name: string;
  contentType: "news" | "project" | "blog";
  description?: string;
  sortOrder?: number;
} & MicroCMSListContent;

export type News = {
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  coverImage?: MicroCMSImage;
  category: Category;
} & MicroCMSListContent;

export type Article = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage?: MicroCMSImage;
  category: Category;
  tag?: Category[];
  project?: Project;
} & MicroCMSListContent;

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is required");
}

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

const getDetailByIdOrSlug = async <T extends MicroCMSListContent>(
  endpoint: string,
  contentIdOrSlug: string,
  queries?: MicroCMSQueries,
) => {
  try {
    const detailData = await client.getListDetail<T>({
      endpoint,
      contentId: contentIdOrSlug,
      queries,
    });

    return detailData;
  } catch {
    const listData = await client.getList<T>({
      endpoint,
      queries: {
        ...queries,
        filters: `slug[equals]${contentIdOrSlug}`,
        limit: 1,
      },
    });

    if (listData.contents.length === 0) {
      throw new Error(`${endpoint} content not found`);
    }

    return listData.contents[0];
  }
};

export const getProjectList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<Project>({
    endpoint: "project",
    queries,
  });
  return listData;
};

export const getProjectDetail = async (
  contentIdOrSlug: string,
  queries?: MicroCMSQueries,
) => {
  return getDetailByIdOrSlug<Project>("project", contentIdOrSlug, queries);
};

export const getNewsList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<News>({
    endpoint: "news",
    queries,
  });
  return listData;
};

export const getNewsDetail = async (
  contentIdOrSlug: string,
  queries?: MicroCMSQueries,
) => {
  return getDetailByIdOrSlug<News>("news", contentIdOrSlug, queries);
};

export const getArticleList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<Article>({
    endpoint: "article",
    queries,
  });
  return listData;
};

export const getArticlesByProjectId = async (
  projectId: string,
  queries?: MicroCMSQueries,
) => {
  const articles = await client.getAllContents<Article>({
    endpoint: "article",
    queries: {
      ...queries,
      filters: `project[equals]${projectId}`,
    },
  });

  return articles;
};

export const getArticleDetail = async (
  contentIdOrSlug: string,
  queries?: MicroCMSQueries,
) => {
  return getDetailByIdOrSlug<Article>("article", contentIdOrSlug, queries);
};

export const getCategoryDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) => {
  const detailData = await client.getListDetail<Category>({
    endpoint: "categories",
    contentId,
    queries,
  });
  return detailData;
};
