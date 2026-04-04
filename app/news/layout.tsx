import type { Metadata, ResolvingMetadata } from "next";
import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";
import { buildSocialMetadata } from "@/app/_libs/metadata";

type Props = {
  children: React.ReactNode;
};

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildSocialMetadata(
    {
      title: "最新情報",
      description: "五反田音響波動技術研究所の最新情報とお知らせ。",
    },
    parent,
  );
}

export default function NewsLayout({ children }: Props) {
  return (
    <>
      <Hero title="最新情報" sub="news" />
      <Sheet>{children}</Sheet>
    </>
  );
}
