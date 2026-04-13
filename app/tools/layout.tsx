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
      title: "設計補助機能",
      description: "回路設計や実験の補助ツール一覧。",
      pathname: "/tools",
    },
    parent,
  );
}

export default function ToolsLayout({ children }: Props) {
  return (
    <>
      <Hero title="設計補助機能" sub="tools" />
      <Sheet>{children}</Sheet>
    </>
  );
}
