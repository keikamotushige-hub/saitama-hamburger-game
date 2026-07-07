"use client";

import { useState } from "react";
import { Lock, LogIn, Skull } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { parseApiResponse } from "@/lib/utils";

export function LoginForm({ redirectTo = "/play" }: { redirectTo?: string }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: loginId.trim(),
          password: password.trim(),
        }),
      });

      const data = await parseApiResponse<{ role: string; name: string }>(response);
      if (!data) throw new Error("ログインに失敗しました。");
      window.location.assign(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました。");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-4 py-8 font-mono">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-900 bg-red-950/40">
            <Skull className="h-7 w-7 text-red-500" />
          </div>
          <h1 className="text-2xl font-black italic text-red-600">
            埼玉ハンバーグ殺人事件
          </h1>
          <p className="mt-2 text-sm text-zinc-500">IDを知っている人だけ入場可</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-red-900/40 bg-zinc-950/80 p-6 shadow-xl"
        >
          <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
            <Lock className="h-4 w-4" />
            認証が必要です
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <label className="mb-2 block text-sm text-zinc-400">
            メールアドレス / ID
          </label>
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
            placeholder="keikamotushige@gmail.com"
            autoComplete="username"
            required
          />

          <label className="mb-2 block text-sm text-zinc-400">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
            placeholder="111111"
            autoComplete="current-password"
            required
          />
          <p className="mb-6 text-xs text-zinc-500">
            オーナーパスワード：<span className="text-red-400">111111</span>（6つの1）
          </p>

          <Button type="submit" isLoading={isLoading} className="w-full">
            <LogIn className="h-4 w-4" />
            ログイン
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-600">
          <a href="/" className="hover:text-zinc-400">
            ← トップへ戻る
          </a>
        </p>
      </div>
    </div>
  );
}
