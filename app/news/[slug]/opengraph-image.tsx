import { getNewsDetail } from "@/app/_libs/microcms";
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getNewsDetail(slug).catch(() => null);

  return createSocialImage({
    kindLabel: "NEWS",
    slugLabel: article?.slug || article?.id || slug,
    imageUrl: article?.coverImage?.url,
  });
}
