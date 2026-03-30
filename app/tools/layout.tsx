import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

type Props = {
  children: React.ReactNode;
};

export default function ToolsLayout({ children }: Props) {
  return (
    <>
      <Hero title="設計補助機能" sub="tools" />
      <Sheet>{children}</Sheet>
    </>
  );
}
