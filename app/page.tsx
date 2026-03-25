import Image from "next/image";

export default function Home() {
  return (
    <section>
      <div>
        <h1>五反田音響波動技術研究所</h1>;
      </div>
      <Image
        src="/Screenshot 2026-02-16 at 3.49.03 PM.png"
        alt=""
        width={4000}
        height={1200}
      />
    </section>
  );
}
