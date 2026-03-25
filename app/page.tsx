import Image from "next/image";

import NewsList from "@/app/_components/NewsList";
import ButtonLink from "@/app/_components/ButtonLink";
import { News } from "@/app/_libs/microcms";

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
      <section>
        <div className="font-bold text-center p-4">
          <h1>五反田音響波動技術研究所</h1>
        </div>
      </section>
      <section className="news">
        <h2>News</h2>
        <NewsList news={sliceData} />
        <div className="newsLink">
          <ButtonLink href="/news">もっとみる</ButtonLink>
        </div>
      </section>
    </>
  );
}
