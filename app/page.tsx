import NewsList from "@/app/_components/NewsList";
import ButtonLink from "@/app/_components/ButtonLink";
import { News } from "@/app/_libs/microcms";
import Image from "next/image";

const data: {
  contents: News[];
} = {
  contents: [
    {
      id: "1",
      title: "動画を公開しました",
      category: {
        name: "更新情報",
      },
      publishedAt: "2026/04/01",
      createdAt: "2026/04/01",
    },
    {
      id: "2",
      title: "ツールを公開しました",
      category: {
        name: "更新情報",
      },
      publishedAt: "2026/04/01",
      createdAt: "2026/04/01",
    },
    {
      id: "3",
      title: "記事を公開しました",
      category: {
        name: "更新情報",
      },
      publishedAt: "2026/04/01",
      createdAt: "2026/04/01",
    },
    {
      id: "4",
      title: "五反田音波技研について",
      category: {
        name: "重要",
      },
      publishedAt: "2026/04/01",
      createdAt: "2026/04/01",
    },
  ],
};

export default function Home() {
  const sliceData = data.contents.slice(0, 4);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-6 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
      <section className="rounded-[2rem] px-8 py-10 lg:min-h-[36rem]">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
          <p className="homePFadeIn text-base tracking-[0.3em] text-zinc-800 mb-4">
            GOTANDA ACOUSTIC WAVE TECHNOLOGY <br /> RESEARCH INSTITUTE.
          </p>
          <Image
            src="/giken_logo_round.svg"
            alt="Gotanda Onpa Giken"
            className="homeLogoFadeIn mx-auto"
            width={500}
            height={500}
            priority
          />
          <p className="homePBottomFadeIn text-base text-zinc-600 md:text-base mt-4">
            ギター・エフェクター改造製作 | 音響実験 | 電子工作のための記録と研究
          </p>
        </div>
      </section>

      <section className="w-full rounded-2xl border border-zinc-200 bg-white px-6 py-8 text-center shadow-lg lg:sticky lg:top-10">
        <h2 className="mb-6 text-2xl font-bold tracking-wide text-zinc-900">
          News
        </h2>

        <NewsList news={sliceData} />

        <div className="mt-6">
          <ButtonLink href="/news">もっとみる</ButtonLink>
        </div>
      </section>
    </div>
  );
}
