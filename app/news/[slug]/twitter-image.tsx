import OpenGraphImage from "./opengraph-image";

export const alt = "五反田音響波動技術研究所のソーシャル共有画像";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "nodejs";
export const revalidate = 3600;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return OpenGraphImage({ params });
}
