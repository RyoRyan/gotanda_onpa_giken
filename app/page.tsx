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
      title: "動画を公開しました",
      category: {
        name: "更新情報",
      },
      publishedAt: "2026/04/01",
      createdAt: "2026/04/01",
    },
  ],
};

export default function Home() {
  const sliceData = data.contents.slice(0, 2);

  return (
    <>
      <section className="bg-radial from-zinc-200 to-zinc-50 py-32">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="mb-3 text-sm tracking-[0.3em] text-zinc-800">
            GOTANDA ACOUSTIC WAVE TECHNOLOGY RESEARCH INSTITUTE.
          </p>
          <Image
            src="/giken_logo_horizontal.svg"
            alt="Gotanda Onpa Giken"
            className="mx-auto"
            width={800}
            height={200}
            priority
          />
          <p className="mt-4 text-sm text-zinc-600 md:text-base">
            ギター・エフェクター改造製作：音響実験：電子工作のための記録と研究
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-8 w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white px-6 py-8 text-center shadow-lg">
        <h2 className="mb-6 text-2xl font-bold tracking-wide text-zinc-900">
          News
        </h2>

        <NewsList news={sliceData} />

        <div className="mt-6">
          <ButtonLink href="/news">もっとみる</ButtonLink>
        </div>
      </section>
    </>
  );
}
