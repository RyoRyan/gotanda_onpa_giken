import type { MetadataRoute } from "next";
import { getAllArticles, getAllNews, getAllProjects } from "@/app/_libs/microcms";

const siteUrl = "https://www.gotanda-onpa.com";

const buildOpenGraphImageUrl = (pathname: string) =>
  new URL(`${pathname.replace(/\/$/, "")}/opengraph-image`, siteUrl).toString();

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: siteUrl,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${siteUrl}/about`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${siteUrl}/news`,
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${siteUrl}/blog`,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${siteUrl}/projects`,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${siteUrl}/articles`,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${siteUrl}/tools`,
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${siteUrl}/contact`,
    changeFrequency: "monthly",
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, projects, articles] = await Promise.all([
    getAllNews({ orders: "-publishedAt" }),
    getAllProjects({ orders: "-sortOrder" }),
    getAllArticles({ orders: "-publishedAt" }),
  ]);

  const newsRoutes: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${siteUrl}/news/${item.slug || item.id}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
    images: [buildOpenGraphImageUrl(`/news/${item.slug || item.id}`)],
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug || project.id}`,
    lastModified: project.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
    images: [buildOpenGraphImageUrl(`/projects/${project.slug || project.id}`)],
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => {
    const isProjectArticle = Boolean(article.project);
    const articlePath = isProjectArticle
      ? `/projects/${article.project?.slug || article.project?.id}/${article.slug || article.id}`
      : `/blog/${article.slug || article.id}`;

    return {
      url: `${siteUrl}${articlePath}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: isProjectArticle ? 0.7 : 0.6,
      images: [buildOpenGraphImageUrl(articlePath)],
    };
  });

  return [...staticRoutes, ...newsRoutes, ...projectRoutes, ...articleRoutes];
}
