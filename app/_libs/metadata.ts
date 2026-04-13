import type { Metadata, ResolvingMetadata } from "next";

type SocialImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export const siteName = "五反田音響波動技術研究所";
export const siteUrl = new URL("https://www.gotanda-onpa.com");
export const fallbackDescription =
  "ギター・エフェクター改造製作、音響実験、電子回路の研究記録を発信する五反田音響波動技術研究所の公式サイト。";
export const fallbackImage = "/social-share-default.png";
export const fallbackImageAlt = "五反田音響波動技術研究所のロゴと名称";
export const siteIcons: NonNullable<Metadata["icons"]> = {
  icon: "/favicon.ico",
  shortcut: ["/favicon.ico"],
  apple: [
    {
      url: "/apple-touch-icon.png",
      type: "image/png",
      sizes: "180x180",
    },
  ],
  other: [
    {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  ],
};

const MICROCMS_IMAGE_HOSTNAME = "images.microcms-assets.io";
const SOCIAL_IMAGE_WIDTH = 1200;

const normalizeSocialImage = (image: SocialImage): SocialImage => {
  try {
    const resolvedUrl = new URL(image.url, siteUrl);

    if (resolvedUrl.hostname !== MICROCMS_IMAGE_HOSTNAME) {
      return image;
    }

    // Re-encode remote cover images into a crawler-friendly JPG at a
    // share-card width so X can fetch a stable preview image.
    resolvedUrl.searchParams.set("fm", "jpg");
    resolvedUrl.searchParams.set("q", "85");
    resolvedUrl.searchParams.set("w", String(SOCIAL_IMAGE_WIDTH));

    const width = image.width
      ? Math.min(image.width, SOCIAL_IMAGE_WIDTH)
      : undefined;
    const height =
      image.width && image.height && width
        ? Math.round((width / image.width) * image.height)
        : undefined;

    return {
      ...image,
      url: resolvedUrl.toString(),
      width,
      height,
    };
  } catch {
    return image;
  }
};

export async function buildSocialMetadata(
  {
    title,
    description,
    image,
    pathname,
  }: {
    title: string;
    description?: string | null;
    image?: SocialImage | null;
    pathname?: string;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = await parent;
  const resolvedDescription = description?.trim() || fallbackDescription;
  const socialTitle = `${title} | ${siteName}`;
  const canonicalPath = pathname?.trim();
  const resolvedImage = image?.url
    ? [
        {
          ...normalizeSocialImage(image),
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
    title: {
      absolute: socialTitle,
    },
    description: resolvedDescription,
    icons: siteIcons,
    ...(canonicalPath
      ? {
          alternates: {
            canonical: canonicalPath,
          },
        }
      : {}),
    openGraph: {
      ...(parentMetadata.openGraph ?? {}),
      title: socialTitle,
      description: resolvedDescription,
      ...(canonicalPath ? { url: canonicalPath } : {}),
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
