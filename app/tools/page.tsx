import Link from "next/link";

const tools = [
  {
    title: "抵抗値・容量値コンバーター",
    href: "/tools/electronics-tools/converters",
  },
  {
    title: "RCフィルタ カットオフ周波数",
    href: "/tools/electronics-tools/rc-filter-cutoff",
  },
];

export default function ToolsPage() {
  return (
    <section className="space-y-6 leading-relaxed text-zinc-700">
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
          </Link>
        ))}
      </div>
    </section>
  );
}
