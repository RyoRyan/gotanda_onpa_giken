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
      title: "記事一覧",
      description: "五反田音響波動技術研究所の記事一覧。",
      pathname: "/articles",
    },
    parent,
  );
}

export default function ArticlesLayout({ children }: Props) {
  return (
    <>
      <Hero title="記事一覧" sub="articles" />
      <Sheet>{children}</Sheet>
    </>
  );
}
