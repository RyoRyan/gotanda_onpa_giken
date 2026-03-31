import ButtonLink from "@/app/_components/ButtonLink";

export default function ToolsPage() {
  return (
    <section className="space-y-6 leading-relaxed text-zinc-700">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-zinc-950">Tools</h2>
        <p>
          設計補助機能のセクションは現在準備中です。
          <br />
          回路設計や実験の補助に使えるツールを今後ここに追加していきます。
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-6">
        <p className="text-sm font-medium text-zinc-700">Under Construction</p>
        <p className="mt-2 text-sm text-zinc-600">
          まだ公開できる機能はありません。準備が整い次第、このページから利用できるようになります。
        </p>
      </div>

      <div className="flex justify-center">
        <ButtonLink href="/">トップに戻る</ButtonLink>
      </div>
    </section>
  );
}
