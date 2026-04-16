import { getArticleDetail } from "@/app/_libs/microcms";
import {
  createSocialImage,
  socialImageAlt,
  socialImageContentType,
  socialImageSize,
} from "@/app/_libs/social-image";

export const alt = socialImageAlt;
export const size = socialImageSize;
export const contentType = socialImageContentType;
export const runtime = "nodejs";
export const revalidate = 3600;

export default async function Image({
  params,
}: {
  params: Promise<{ projectSlug: string; articleSlug: string }>;
}) {
  const { projectSlug, articleSlug } = await params;

  const article = await getArticleDetail(articleSlug).catch(() => null);
  const articleProjectSlug = article?.project?.slug || article?.project?.id;

  return createSocialImage({
    kindLabel: "PROJECT ARTICLE",
    slugLabel:
      articleProjectSlug && articleProjectSlug === projectSlug
        ? article?.slug || article?.id || articleSlug
        : articleSlug,
    imageUrl:
      articleProjectSlug && articleProjectSlug === projectSlug
        ? article?.coverImage?.url || article?.project?.thumbnail?.url
        : null,
  });
}
