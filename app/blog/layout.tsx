import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

type Props = {
  children: React.ReactNode;
};

export default function BlogLayout({ children }: Props) {
  return (
    <>
      <Hero title="雑記" sub="blog" />
      <Sheet>{children}</Sheet>
    </>
  );
}
