import Sheet from "@/app/_components/Sheet";
import Hero from "@/app/_components/Hero";

type Props = {
  children: React.ReactNode;
};

export default function AboutLayout({ children }: Props) {
  return (
    <>
      <Hero title="技研について" sub="about" />
      <Sheet>{children}</Sheet>
    </>
  );
}
