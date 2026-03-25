import { News } from "@/app/_libs/microcms";
import Link from "next/link";

type Props = {
  news: News[];
};

export default function NewsList({ news }: Props) {
  if (news.length === 0) {
    return <p>記事がありません</p>;
  }
  return (
    <ul>
      {news.map((article) => (
        <li key={article.id}>
          <Link href={`/news/${article.id}`}>
            <dl>
              <dt className="newsItemTitle">{article.title}</dt>
              <dd className="meta">
                <span className="tag">{article.category.name}</span>
                <span className="date">{article.publishedAt}</span>
              </dd>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
