import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { cache } from "react";

/* eslint-disable @next/next/no-img-element */

const MICROCMS_IMAGE_HOSTNAME = "images.microcms-assets.io";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export const socialImageContentType = "image/png";
export const socialImageAlt = "五反田音響波動技術研究所のソーシャル共有画像";

type SocialImageCardInput = {
  kindLabel: string;
  slugLabel: string;
  imageUrl?: string | null;
};

const readAssetAsDataUrl = cache(async (assetPath: string, mimeType: string) => {
  const file = await readFile(join(process.cwd(), assetPath));
  return `data:${mimeType};base64,${file.toString("base64")}`;
});

const getFallbackBackground = () =>
  readAssetAsDataUrl("public/social-share-default.png", "image/png");

const getLogoImage = () =>
  readAssetAsDataUrl("public/giken_logo_round.svg", "image/svg+xml");

const formatSlugLabel = (slug: string) =>
  slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

const isSvgImage = (url: string) => {
  try {
    return new URL(url).pathname.toLowerCase().endsWith(".svg");
  } catch {
    return url.toLowerCase().includes(".svg");
  }
};

const buildRenderableImageUrl = (url: string) => {
  try {
    const resolvedUrl = new URL(url);

    if (resolvedUrl.hostname !== MICROCMS_IMAGE_HOSTNAME) {
      return resolvedUrl.toString();
    }

    if (isSvgImage(resolvedUrl.toString())) {
      return resolvedUrl.toString();
    }

    resolvedUrl.searchParams.set("fit", "crop");
    resolvedUrl.searchParams.set("fm", "jpg");
    resolvedUrl.searchParams.set("q", "85");
    resolvedUrl.searchParams.set("w", "1200");
    resolvedUrl.searchParams.set("h", "630");

    return resolvedUrl.toString();
  } catch {
    return url;
  }
};

const resolveHeroImageSource = async (imageUrl?: string | null) => {
  if (!imageUrl) {
    return getFallbackBackground();
  }

  if (!isSvgImage(imageUrl)) {
    return buildRenderableImageUrl(imageUrl);
  }

  try {
    const response = await fetch(imageUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return getFallbackBackground();
    }

    const svg = await response.text();
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  } catch {
    return getFallbackBackground();
  }
};

export async function createSocialImage({
  kindLabel,
  slugLabel,
  imageUrl,
}: SocialImageCardInput) {
  const [heroImageSrc, logoSrc] = await Promise.all([
    resolveHeroImageSource(imageUrl),
    getLogoImage(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0b0d10",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={heroImageSrc}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(7,8,10,0.94) 0%, rgba(7,8,10,0.88) 40%, rgba(7,8,10,0.35) 78%, rgba(7,8,10,0.12) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            padding: "54px 58px",
            color: "#f4f4f5",
          }}
        >
          <div
            style={{
              width: "56%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <img
                  src={logoSrc}
                  alt=""
                  style={{
                    width: 64,
                    height: 64,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      letterSpacing: "0.26em",
                      opacity: 0.72,
                    }}
                  >
                    GOTANDA ONPA GIKEN
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      letterSpacing: "0.16em",
                      opacity: 0.5,
                    }}
                  >
                    ACOUSTIC WAVE TECHNOLOGY RESEARCH INSTITUTE
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 999,
                  padding: "10px 18px",
                  fontSize: 18,
                  letterSpacing: "0.18em",
                }}
              >
                {kindLabel}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 54,
                  lineHeight: 1.05,
                  letterSpacing: "0.04em",
                  maxWidth: "100%",
                  textWrap: "balance",
                }}
              >
                {formatSlugLabel(slugLabel)}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: 18,
                letterSpacing: "0.14em",
                opacity: 0.62,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "rgba(255,255,255,0.35)",
                }}
              />
              www.gotanda-onpa.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...socialImageSize,
    },
  );
}
