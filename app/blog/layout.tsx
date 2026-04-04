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
      title: "雑記",
      description: "研究メモ、製作記録、実験ログをまとめた雑記一覧。",
    },
    parent,
  );
}

export default function BlogLayout({ children }: Props) {
  return (
    <>
      <Hero title="雑記" sub="blog" />
      <Sheet>{children}</Sheet>
    </>
  );
}
