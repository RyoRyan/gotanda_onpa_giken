import ButtonLink from "@/app/_components/ButtonLink";
import {
  CapacitanceConverter,
  ResistanceConverter,
} from "../electronics-tools/ElectronicsTools";

export default function ConvertersPage() {
  return (
    <section className="space-y-6 leading-relaxed text-zinc-700">
      <div>
        <h2 className="text-center text-2xl font-bold text-zinc-950">
          抵抗値・容量値コンバーター
        </h2>
        <p className="mt-3">
          抵抗値、抵抗カラーコード、コンデンサ容量、3 桁コードを相互変換します。
        </p>
      </div>

      <div className="space-y-6 text-zinc-950">
        <ResistanceConverter />
        <CapacitanceConverter />
      </div>

      <div className="flex justify-center">
        <ButtonLink href="/tools">ツール一覧に戻る</ButtonLink>
      </div>
    </section>
  );
}
