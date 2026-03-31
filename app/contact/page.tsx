import ButtonLink from "@/app/_components/ButtonLink";

export default function ContactPage() {
  return (
    <section className="space-y-6 leading-relaxed text-zinc-700">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-zinc-950">Contact</h2>
        <p>お問い合わせページは現在準備中です。</p>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-6">
        <p className="text-sm font-medium text-zinc-700">Under Construction</p>
        <p className="mt-2 text-sm text-zinc-600">
          連絡方法の案内やフォームは、準備が整い次第ここに追加します。
        </p>
      </div>

      <div className="flex justify-center">
        <ButtonLink href="/">トップに戻る</ButtonLink>
      </div>
    </section>
  );
}
