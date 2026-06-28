import Link from "next/link";
import ButtonLink from "@/app/_components/ButtonLink";

const tools = [
  {
    title: "抵抗値・容量値コンバーター",
    description: "抵抗値、抵抗カラーコード、コンデンサ容量、3 桁コードを相互変換します。",
    href: "/tools/converters",
  },
  {
    title: "RCフィルタ カットオフ周波数",
    description: "抵抗値と容量値から RC フィルターのカットオフ周波数を計算します。",
    href: "/tools/rc-filter-cutoff",
  },
];

export default function Page() {
  return (
    <section className="space-y-6 leading-relaxed text-zinc-700">
      <div>
        <h2 className="text-center text-2xl font-bold text-zinc-950">
          電子工作補助ツール
        </h2>
        <p className="mt-3">
          電子工作で使う値の変換と RC フィルター計算を分けて利用できます。
        </p>
      </div>

      <div className="grid gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-zinc-700"
          >
            <h3 className="text-center text-lg font-bold text-zinc-950">
              {tool.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-600">{tool.description}</p>
            <span className="mt-4 inline-flex text-sm font-semibold text-zinc-950">
              開く
            </span>
          </Link>
        ))}
      </div>

      <div className="flex justify-center">
        <ButtonLink href="/tools">ツール一覧に戻る</ButtonLink>
      </div>
    </section>
  );
}
