"use client";

import { Phone } from "lucide-react";
import type { CallPhase } from "@/lib/saitama-hamburger/types";
import { KATSUMI, SUZUKI_BOSS } from "@/lib/saitama-hamburger/types";

interface PhoneCallUIProps {
  phase: CallPhase;
  activeLine: string | null;
  callDuration: number;
  signalBars?: number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function getCaller(phase: CallPhase) {
  if (phase.includes("katsumi")) return KATSUMI;
  if (phase.includes("boss")) return SUZUKI_BOSS;
  return null;
}

function getStatus(phase: CallPhase): string {
  if (phase === "dialing-katsumi") return "接続中 — 呼び出し音なし";
  if (phase.startsWith("dialing")) return "発信中……";
  if (phase === "gunfight") return "通話中 — 交戦";
  return "通話中";
}

export function PhoneCallUI({
  phase,
  activeLine,
  callDuration,
  signalBars = 4,
}: PhoneCallUIProps) {
  const caller = getCaller(phase);
  const isDialing = phase.startsWith("dialing");

  return (
    <div className="game-phone mx-auto w-full max-w-sm">
      <div className="game-phone-bezel rounded-[2.2rem] border border-zinc-700 bg-zinc-950 p-3 shadow-2xl shadow-black/80">
        <div className="rounded-[1.6rem] border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black px-5 py-6">
          <div className="mb-5 flex items-center justify-between text-[10px] text-zinc-500">
            <span>NTT DOCOMO</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-1 rounded-sm ${
                    i < signalBars ? "bg-emerald-500" : "bg-zinc-700"
                  }`}
                />
              ))}
              <span className="ml-2">🔋</span>
            </div>
          </div>

          <div className="mb-6 flex flex-col items-center text-center">
            <div
              className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full border ${
                isDialing
                  ? "border-amber-500/50 bg-amber-500/10 animate-pulse"
                  : phase === "gunfight"
                    ? "border-red-500/60 bg-red-500/10"
                    : "border-emerald-500/40 bg-emerald-500/10"
              }`}
            >
              <Phone
                className={`h-7 w-7 ${
                  phase === "gunfight" ? "text-red-400" : "text-emerald-400"
                }`}
              />
            </div>

            {caller ? (
              <>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {getStatus(phase)}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-wide text-white">
                  {caller.name}
                </h3>
                <p className="mt-1 text-sm text-red-400">{caller.title}</p>
                <p className="mt-2 font-mono text-xs text-zinc-500">{caller.phone}</p>
              </>
            ) : (
              <h3 className="text-xl font-bold text-white">通話終了</h3>
            )}

            {!isDialing && (
              <p className="mt-4 font-mono text-lg text-emerald-300">
                {formatDuration(callDuration)}
              </p>
            )}
          </div>

          {activeLine && (
            <div className="game-phone-subtitle rounded-xl border border-zinc-800 bg-black/60 px-4 py-3">
              <p className="text-sm leading-relaxed text-zinc-200">{activeLine}</p>
            </div>
          )}

          {phase === "dialing-katsumi" && (
            <p className="mt-3 text-center text-xs text-amber-400/90">
              かつみの電話は鳴らない。置きっぱなしで繋ぐ。
            </p>
          )}

          {phase === "gunfight" && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="game-rec-dot h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-medium uppercase tracking-wider text-red-400">
                通話を維持したまま交戦中
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
