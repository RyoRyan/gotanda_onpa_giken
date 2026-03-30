import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
    current: string;
  }>;
};

export default async function Page({ params }: Props) {
  const routeParams = await params;
  redirect(`/article-list/category/${routeParams.id}/p/${routeParams.current}`);
}
