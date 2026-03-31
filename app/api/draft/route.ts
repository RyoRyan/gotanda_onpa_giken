import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  getArticleDetail,
  getNewsDetail,
  getProjectDetail,
} from "@/app/_libs/microcms";

type DraftContentType = "news" | "article" | "project";

const getPreviewSecret = () =>
  process.env.PREVIEW_SECRET ?? process.env.REVALIDATE_SECRET;

const isDraftContentType = (value: string | null): value is DraftContentType =>
  value === "news" || value === "article" || value === "project";

const buildPreviewPath = async ({
  contentType,
  slug,
  draftKey,
}: {
  contentType: DraftContentType;
  slug: string;
  draftKey: string;
}) => {
  switch (contentType) {
    case "news": {
      const news = await getNewsDetail(slug, { draftKey });
      return `/news/${news.slug || news.id}`;
    }
    case "project": {
      const project = await getProjectDetail(slug, { draftKey });
      return `/projects/${project.slug || project.id}`;
    }
    case "article": {
      const article = await getArticleDetail(slug, { draftKey });

      if (article.project) {
        return `/projects/${article.project.slug}/${article.slug || article.id}`;
      }

      return `/blog/${article.slug || article.id}`;
    }
  }
};

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const contentType = request.nextUrl.searchParams.get("contentType");
  const slug = request.nextUrl.searchParams.get("slug");
  const draftKey = request.nextUrl.searchParams.get("dk");
  const expectedSecret = getPreviewSecret();

  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, message: "PREVIEW_SECRET or REVALIDATE_SECRET is required" },
      { status: 500 },
    );
  }

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { ok: false, message: "Invalid secret" },
      { status: 401 },
    );
  }

  if (!isDraftContentType(contentType) || !slug || !draftKey) {
    return NextResponse.json(
      {
        ok: false,
        message: "contentType, slug, and dk query parameters are required",
      },
      { status: 400 },
    );
  }

  try {
    const pathname = await buildPreviewPath({
      contentType,
      slug,
      draftKey,
    });
    const previewUrl = new URL(pathname, request.url);
    previewUrl.searchParams.set("dk", draftKey);

    const draft = await draftMode();
    draft.enable();

    return NextResponse.redirect(previewUrl);
  } catch {
    return NextResponse.json(
      { ok: false, message: "Preview content not found" },
      { status: 404 },
    );
  }
}
