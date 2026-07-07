"use client";

import "./game.css";
import { useCallback, useMemo, useState } from "react";
import { CrownCar } from "@/components/saitama-hamburger/CrownCar";
import { AutoBattle } from "@/components/saitama-hamburger/AutoBattle";
import { ParkingLotScene } from "@/components/saitama-hamburger/ParkingLotScene";
import {
  buildEnemies,
  buildParty,
  CHARACTERS,
  KATSUMI,
  type Scene,
} from "@/lib/saitama-hamburger/types";

export function SaitamaHamburgerGame() {
  const [scene, setScene] = useState<Scene>("title");
  const [selectedChars, setSelectedChars] = useState<number[]>([]);
  const [battleResult, setBattleResult] = useState<"victory" | "defeat" | null>(
    null,
  );

  const party = useMemo(() => buildParty(selectedChars), [selectedChars]);
  const enemies = useMemo(() => buildEnemies(), []);

  const toggleCharacter = (id: number) => {
    setSelectedChars((prev) => {
      if (prev.includes(id)) return prev.filter((charId) => charId !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleBattleFinish = useCallback((outcome: "victory" | "defeat") => {
    setBattleResult(outcome);
    setScene("result");
  }, []);

  const resetGame = () => {
    setScene("title");
    setSelectedChars([]);
    setBattleResult(null);
  };

  return (
    <div className="game-root min-h-dvh overflow-hidden bg-black font-sans text-white">
      {scene === "title" && (
        <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
          <div className="game-title-bg absolute inset-0" />
          <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 opacity-60">
            <CrownCar variant="black" headlightsOn scale={1.1} />
          </div>
          <div className="relative z-10 px-6 text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-red-500/80">
              Saitama Incident File
            </p>
            <h1 className="game-title-text mb-3 text-4xl font-black italic sm:text-7xl">
              埼玉ハンバーグ
              <br />
              殺人事件
            </h1>
            <p className="mb-12 text-sm tracking-widest text-zinc-400">
              ひろしげ一家 — 復讐の記録
            </p>
            <button
              type="button"
              onClick={() => setScene("prologue")}
              className="game-btn-primary px-10 py-4 text-lg font-bold"
            >
              復讐を開始する
            </button>
          </div>
        </div>
      )}

      {scene === "prologue" && (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-black px-6">
          <div className="game-dialog-box max-w-2xl px-8 py-10 text-center">
            <p className="game-dialog-line">とべ君：「ひろしげはどうした？」</p>
            <p className="game-dialog-line mt-6">
              しげる君：「ひろしげは殺されちゃったよ……さっき警察が来たんだ」
            </p>
            <p className="game-dialog-line mt-6">
              とべ君：「わかった。まず
              <span className="text-red-400">かつみ</span>
              に連絡する。それから鈴木のボスに掛ける」
            </p>
            <p className="mt-6 text-sm text-zinc-500">
              ひろしげ一家・当主 {KATSUMI.name}（{KATSUMI.title}）
            </p>
          </div>
          <button
            type="button"
            onClick={() => setScene("select")}
            className="game-btn-ghost mt-10 px-8 py-3"
          >
            クラウンに乗り込む
          </button>
        </div>
      )}

      {scene === "select" && (
        <div className="mx-auto min-h-dvh max-w-4xl px-4 py-10">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-red-500">
              Crew Selection
            </p>
            <h2 className="mt-2 text-3xl font-bold">乗車メンバーを選べ</h2>
            <p className="mt-2 text-sm text-zinc-400">
              3人を選んでください（{selectedChars.length}/3）— 車内から電話・銃撃
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CHARACTERS.map((char) => {
              const selected = selectedChars.includes(char.id);
              const disabled = !selected && selectedChars.length >= 3;

              return (
                <button
                  key={char.id}
                  type="button"
                  disabled={disabled}
                  className={`game-char-card p-6 text-left ${
                    selected ? "game-char-card-selected" : ""
                  } ${disabled ? "opacity-40" : ""}`}
                  onClick={() => toggleCharacter(char.id)}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-2xl font-bold">{char.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                      {char.role}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-red-300">{char.weapon}</p>
                  <p className="mt-1 text-xs text-zinc-500">{char.style}</p>
                </button>
              );
            })}
          </div>
          {selectedChars.length === 3 && (
            <button
              type="button"
              onClick={() => setScene("approach")}
              className="game-btn-primary mt-10 w-full py-4 text-lg font-bold"
            >
              駐車場へ向かう
            </button>
          )}
        </div>
      )}

      {scene === "approach" && (
        <ParkingLotScene intensity="calm">
          <div className="max-w-xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              03:17 AM — 埼玉・某駐車場
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              クラウン三台、到着。
            </h2>
            <p className="mt-6 leading-relaxed text-zinc-300">
              ヘッドライトがアスファルトを切り裂く。
              対面には鈴木組の車列。窓は開かない。誰も降りない。
            </p>
            <p className="mt-4 text-sm text-red-400">
              手順：① 一家の当主・かつみに連絡 → ② 鈴木組長に連絡 → ③ 通話を切らずに銃撃
            </p>
            <button
              type="button"
              onClick={() => setScene("battle")}
              className="game-btn-primary mt-10 px-10 py-4 text-lg font-bold"
            >
              かつみに電話を掛ける
            </button>
          </div>
        </ParkingLotScene>
      )}

      {scene === "battle" && (
        <AutoBattle
          party={party}
          enemies={enemies}
          onFinish={handleBattleFinish}
        />
      )}

      {scene === "result" && (
        <ParkingLotScene intensity={battleResult === "victory" ? "calm" : "combat"}>
          <div className="max-w-lg text-center">
            <h2
              className={`text-4xl font-black sm:text-5xl ${
                battleResult === "victory" ? "text-red-500" : "text-zinc-500"
              }`}
            >
              {battleResult === "victory" ? "復讐成功" : "全滅……"}
            </h2>
            <p className="mt-8 leading-relaxed text-zinc-300">
              {battleResult === "victory"
                ? "通話はまだ繋がっている。かつみの声が静かに響く——「……終わったのか」。クラウンのヘッドライトが夜明け前の空を照らした。"
                : "電話が切れた。駐車場に銃声だけが残る。だが、とべ君の復讐心に火は消えない。"}
            </p>
            <button
              type="button"
              onClick={resetGame}
              className="game-btn-ghost mt-10 px-8 py-3"
            >
              タイトルへ戻る
            </button>
          </div>
        </ParkingLotScene>
      )}
    </div>
  );
}
