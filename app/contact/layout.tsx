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
      title: "お問い合わせ",
      description: "五反田音響波動技術研究所へのお問い合わせ案内。",
    },
    parent,
  );
}

export default function ContactLayout({ children }: Props) {
  return (
    <>
      <Hero title="お問い合わせ" sub="contact" />
      <Sheet>{children}</Sheet>
    </>
  );
}
