export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100svh-12rem)] items-center justify-center px-6 py-16">
      <dl className="text-center">
        <dt className="text-2xl font-bold">ページが見つかりませんでした</dt>
        <dd className="mt-4 leading-7">
          あなたがアクセスしようとしたページは存在しません。
          <br />
          URLを再度ご確認ください。
        </dd>
      </dl>
    </div>
  );
}
