import "./globals.css";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import { Zen_Old_Mincho } from "next/font/google";

const zenOldMincho = Zen_Old_Mincho({
  weight: ["400", "700", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${zenOldMincho.className} flex min-h-screen flex-col overflow-x-hidden bg-radial from-zinc-200 to-zinc-50`}
      >
        <Header />
        <main className="flex-1 pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
