import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getArticlesByProjectId,
  getProjectDetail,
} from "@/app/_libs/microcms";

type Props = {
  params: Promise<{
    projectSlug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { projectSlug } = await params;
  const project = await getProjectDetail(projectSlug).catch(notFound);
  const articles = await getArticlesByProjectId(project.id, {
    orders: "-publishedAt",
  });

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-zinc-950">{project.title}</h2>
        <p className="leading-7 text-zinc-600">{project.summary}</p>
        {project.thumbnail ? (
          <Image
            src={project.thumbnail.url}
            alt=""
            width={project.thumbnail.width}
            height={project.thumbnail.height}
            className="h-auto w-full rounded-2xl object-cover"
          />
        ) : (
          <Image
            src="/giken_logo_simple.svg"
            alt={`${project.title} thumbnail placeholder`}
            width={800}
            height={600}
            className="h-auto w-full rounded-2xl bg-white p-8 object-contain"
          />
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-zinc-900">Articles</h3>
        {articles.length === 0 ? (
          <p className="text-zinc-500">このプロジェクトの記事はまだありません。</p>
        ) : (
          <ul className="space-y-3">
            {articles.map((article) => (
              <li key={article.id} className="rounded-2xl border border-zinc-200 p-4">
                <Link
                  href={`/projects/${project.slug}/${article.slug}`}
                  className="text-lg font-semibold text-zinc-900 underline underline-offset-4"
                >
                  {article.title}
                </Link>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {article.excerpt}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
