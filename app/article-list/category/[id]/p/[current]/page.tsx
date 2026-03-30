import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
    current: string;
  }>;
};

export default async function Page({ params }: Props) {
  const routeParams = await params;
  redirect(`/articles?category=${routeParams.id}&page=${routeParams.current}`);
}
