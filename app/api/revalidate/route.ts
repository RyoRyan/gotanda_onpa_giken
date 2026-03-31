import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type MicroCMSWebhookBody = {
  api?: string;
  id?: string;
  contentsId?: string;
};

const getSecret = (request: NextRequest) =>
  request.nextUrl.searchParams.get("secret") ??
  request.headers.get("x-revalidate-secret");

const revalidateCommonPaths = () => {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/[projectSlug]", "page");
  revalidatePath("/projects/[projectSlug]/[articleSlug]", "page");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/articles");
};

const revalidateByApi = (api?: string) => {
  switch (api) {
    case "project":
      revalidatePath("/projects");
      revalidatePath("/projects/[projectSlug]", "page");
      revalidatePath("/articles");
      break;
    case "article":
      revalidateCommonPaths();
      break;
    case "news":
      revalidatePath("/");
      revalidatePath("/news");
      revalidatePath("/news/[slug]", "page");
      revalidatePath("/news/category/[id]", "page");
      break;
    case "categories":
      revalidatePath("/");
      revalidatePath("/news/category/[id]", "page");
      revalidateCommonPaths();
      break;
    default:
      revalidateCommonPaths();
      revalidatePath("/news");
      revalidatePath("/news/[slug]", "page");
      revalidatePath("/news/category/[id]", "page");
      break;
  }
};

const verifySecret = (request: NextRequest) => {
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, message: "REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  if (getSecret(request) !== expectedSecret) {
    return NextResponse.json(
      { ok: false, message: "Invalid secret" },
      { status: 401 },
    );
  }

  return null;
};

export async function GET(request: NextRequest) {
  const authError = verifySecret(request);

  if (authError) {
    return authError;
  }

  const api = request.nextUrl.searchParams.get("api") ?? undefined;
  revalidateByApi(api);

  return NextResponse.json({
    ok: true,
    revalidated: true,
    api: api ?? "all",
    now: Date.now(),
  });
}

export async function POST(request: NextRequest) {
  const authError = verifySecret(request);

  if (authError) {
    return authError;
  }

  const body = (await request.json().catch(() => null)) as
    | MicroCMSWebhookBody
    | null;
  const api = body?.api;

  revalidateByApi(api);

  return NextResponse.json({
    ok: true,
    revalidated: true,
    api: api ?? "all",
    id: body?.id ?? body?.contentsId ?? null,
    now: Date.now(),
  });
}
