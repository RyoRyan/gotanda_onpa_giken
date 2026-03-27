import Image from "next/image";
import { getNewsList } from "@/app/_libs/microcms";
import { TOP_NEWS_LIMIT } from "@/app/_constants";
import NewsList from "@/app/_components/NewsList";
import ButtonLink from "@/app/_components/ButtonLink";

export default async function Home() {
  const data = await getNewsList({
    limit: TOP_NEWS_LIMIT,
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-6 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-center">
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

      <section className="w-full self-center rounded-2xl border border-zinc-200 bg-white px-6 py-8 text-center shadow-lg">
        <h2 className="mb-6 text-2xl font-bold tracking-wide text-zinc-900">
          News
        </h2>

        <NewsList news={data.contents} />

        <div className="mt-6">
          <ButtonLink href="/news">もっとみる</ButtonLink>
        </div>
      </section>
    </div>
  );
}
