import Image from "next/image";

type News = {
  id: string;
  title: string;
  category: {
    name: string;
  };
  publishedAt: string;
  createdAt: string;
};

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
        <ul>
          {sliceData.map((article) => (
            <li key={article.id}>
              <dl>
                <dt className="newsItemTitle">{article.title}</dt>
                <dd className="meta">
                  <span className="tag">{article.category.name}</span>
                  <span className="date">{article.publishedAt}</span>
                </dd>
              </dl>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
