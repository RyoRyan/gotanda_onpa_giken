import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { buildSocialMetadata } from "@/app/_libs/metadata";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildSocialMetadata(
    {
      title: "RC Filter Calculator",
      description:
        "抵抗値とコンデンサ容量から RC フィルターのカットオフ周波数と時定数を計算するツール。",
      pathname: "/tools/rc-filter-calculator",
    },
    parent,
  );
}

export default function RCFilterCalculatorPage() {
  return (
    <section className="space-y-6 leading-relaxed text-zinc-700">
      <UnderConstruction title="RC Filter Calculator" />
    </section>
  );
}

function UnderConstruction({ title }: { title: string }) {
  return (
    <>
      <Link
        href="/tools"
        className="inline-flex w-fit items-center justify-center rounded-sm border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors duration-300 hover:border-zinc-700 hover:text-zinc-950"
      >
        ツール一覧に戻る
      </Link>

      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Under Construction
        </p>
        <h2 className="mt-3 text-2xl font-bold text-zinc-950">{title}</h2>
        <p className="mt-3">
          このツールは現在準備中です。公開までしばらくお待ちください。
        </p>
      </div>
    </>
  );
}
