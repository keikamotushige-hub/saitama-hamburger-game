import Link from "next/link";
import { LogIn, Shield } from "lucide-react";
import { PRODUCTION_URL } from "@/lib/auth-types";
import { KATSUMI_LEADER, SUZUKI_LEADER } from "@/lib/game-meta";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center border-t-8 border-red-800 bg-black p-6 font-mono text-white">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-red-500">
        Private Game — Not VoxCanvas
      </p>
      <h1 className="mb-6 text-center text-5xl font-black italic tracking-widest text-red-600 sm:text-7xl">
        埼玉ハンバーグ殺人事件
      </h1>
      <p className="mb-2 max-w-lg text-center text-sm text-zinc-400">
        ひろしげ君一家（組長：{KATSUMI_LEADER.name}）vs 敵対組織・鈴木組（組長：{SUZUKI_LEADER.name}）
      </p>
      <p className="mb-10 flex items-center gap-2 text-xs text-zinc-500">
        <Shield className="h-3 w-3" />
        知っている人だけログインできます
      </p>

      <Link
        href="/login?redirect=/play"
        className="inline-flex items-center gap-2 bg-white px-10 py-4 font-bold text-black transition hover:bg-red-700 hover:text-white"
      >
        <LogIn className="h-5 w-5" />
        ログインしてプレイ
      </Link>

      <p className="mt-10 text-center text-xs text-zinc-600">
        公開URL：
        <a
          href={PRODUCTION_URL}
          className="ml-1 text-zinc-400 underline hover:text-white"
        >
          {PRODUCTION_URL}
        </a>
      </p>
      <p className="mt-2 text-center text-[10px] text-zinc-700">
        ※ Voice AI Image Studio（VoxCanvas）とは別プロジェクトです
      </p>
    </div>
  );
}
