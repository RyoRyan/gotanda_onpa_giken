import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

type Props = {
  children: React.ReactNode;
};

export default function ProjectsLayout({ children }: Props) {
  return (
    <>
      <Hero title="プロジェクト" sub="projects" />
      <Sheet>{children}</Sheet>
    </>
  );
}
