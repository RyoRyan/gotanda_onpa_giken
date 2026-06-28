import ButtonLink from "@/app/_components/ButtonLink";
import { RcFilterCutoff } from "../electronics-tools/ElectronicsTools";

export default function RcFilterCutoffPage() {
  return (
    <section className="space-y-6 leading-relaxed text-zinc-700">
      <div>
        <h2 className="text-center text-2xl font-bold text-zinc-950">
          RCフィルタ カットオフ周波数
        </h2>
        <p className="mt-3">
          抵抗値と容量値から RC フィルターのカットオフ周波数を計算します。
        </p>
      </div>

      <div className="text-zinc-950">
        <RcFilterCutoff />
      </div>

      <div className="flex justify-center">
        <ButtonLink href="/tools">ツール一覧に戻る</ButtonLink>
      </div>
    </section>
  );
}
