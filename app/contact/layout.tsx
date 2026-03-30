import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

type Props = {
  children: React.ReactNode;
};

export default function ContactLayout({ children }: Props) {
  return (
    <>
      <Hero title="お問い合わせ" sub="contact" />
      <Sheet>{children}</Sheet>
    </>
  );
}
