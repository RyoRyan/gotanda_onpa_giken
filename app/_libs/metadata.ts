import type { Metadata, ResolvingMetadata } from "next";

const siteName = "五反田音響波動技術研究所";
const fallbackDescription =
  "ギター・エフェクター改造製作、音響実験、電子回路の研究記録を発信する五反田音響波動技術研究所の公式サイト。";
const fallbackImage = "/social-share-default.png";
const fallbackImageAlt = "五反田音響波動技術研究所のロゴと名称";

export async function buildSocialMetadata(
  {
    title,
    description,
    image,
  }: {
    title: string;
    description?: string | null;
    image?: {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    } | null;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = await parent;
  const resolvedDescription = description?.trim() || fallbackDescription;
  const socialTitle = `${title} | ${siteName}`;
  const resolvedImage = image?.url
    ? [
        {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: image.alt ?? title,
        },
      ]
    : [
        {
          url: fallbackImage,
          alt: fallbackImageAlt,
        },
      ];

  return {
    title,
    description: resolvedDescription,
    openGraph: {
      ...(parentMetadata.openGraph ?? {}),
      title: socialTitle,
      description: resolvedDescription,
      images: resolvedImage,
    },
    twitter: {
      ...(parentMetadata.twitter ?? {}),
      title: socialTitle,
      description: resolvedDescription,
      images: resolvedImage.map((item) => item.url),
    },
  };
}
