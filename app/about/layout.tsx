import type { Metadata, ResolvingMetadata } from "next";
import Sheet from "@/app/_components/Sheet";
import Hero from "@/app/_components/Hero";
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
      title: "技研について",
      description: "五反田音響波動技術研究所の理念と研究方針。",
    },
    parent,
  );
}

export default function AboutLayout({ children }: Props) {
  return (
    <>
      <Hero title="技研について" sub="about" />
      <Sheet>{children}</Sheet>
    </>
  );
}
