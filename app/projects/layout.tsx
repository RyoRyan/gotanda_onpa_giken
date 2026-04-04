import type { Metadata, ResolvingMetadata } from "next";
import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";
import { buildSocialMetadata } from "@/app/_libs/metadata";

type Props = {
  children: React.ReactNode;
};

export const dynamic = "force-dynamic";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildSocialMetadata(
    {
      title: "試作開発",
      description: "試作・研究開発プロジェクトの一覧。",
    },
    parent,
  );
}

export default function ProjectsLayout({ children }: Props) {
  return (
    <>
      <Hero title="試作開発" sub="projects" />
      <Sheet>{children}</Sheet>
    </>
  );
}
