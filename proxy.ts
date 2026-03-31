import { createNextAuthMiddleware } from "nextjs-basic-auth-middleware";

export const proxy = createNextAuthMiddleware();

export const config = {
  matcher: [
    "/((?!api/revalidate|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
