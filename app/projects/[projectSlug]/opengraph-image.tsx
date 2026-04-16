import { getProjectDetail } from "@/app/_libs/microcms";
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
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;

  const project = await getProjectDetail(projectSlug).catch(() => null);

  return createSocialImage({
    kindLabel: "PROJECT",
    slugLabel: project?.slug || project?.id || projectSlug,
    imageUrl: project?.thumbnail?.url,
  });
}
