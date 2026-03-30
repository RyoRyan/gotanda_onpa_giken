import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

type Props = {
  children: React.ReactNode;
};

export default function ArticlesLayout({ children }: Props) {
  return (
    <>
      <Hero title="記事一覧" sub="articles" />
      <Sheet>{children}</Sheet>
    </>
  );
}
