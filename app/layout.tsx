import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "埼玉ハンバーグ殺人事件",
  description: "ひろしげへの復讐——鈴木組との死闘",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-dvh overflow-x-hidden bg-black text-white">
        {children}
      </body>
    </html>
  );
}
