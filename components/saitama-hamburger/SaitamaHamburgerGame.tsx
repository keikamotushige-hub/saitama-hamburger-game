"use client";

import "./game.css";
import { useCallback, useMemo, useState } from "react";
import { AutoBattle } from "@/components/saitama-hamburger/AutoBattle";
import { ParkingLotScene } from "@/components/saitama-hamburger/ParkingLotScene";
import { useGameAudio } from "@/components/saitama-hamburger/useGameAudio";
import {
  buildEnemies,
  buildParty,
  CHARACTERS,
  type Scene,
} from "@/lib/saitama-hamburger/types";

export function SaitamaHamburgerGame() {
  const audio = useGameAudio();
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
    audio.stopBgm();
    setScene("title");
    setSelectedChars([]);
    setBattleResult(null);
  };

  const startAction = (nextScene: Scene) => {
    audio.startActionBgm();
    setScene(nextScene);
  };

  return (
    <div className="game-root min-h-dvh overflow-hidden border-t-8 border-red-800 bg-black p-6 font-mono text-white">
      {scene === "title" && (
        <div className="flex h-[calc(100dvh-3rem)] flex-col items-center justify-center animate-pulse">
          <h1 className="mb-10 text-center text-5xl font-black italic tracking-widest text-red-600 sm:text-7xl">
            埼玉ハンバーグ殺人事件
          </h1>
          <button
            type="button"
            onClick={() => startAction("prologue")}
            className="game-btn-primary px-10 py-4 font-bold transition-all"
          >
            復讐を開始する
          </button>
        </div>
      )}

      {scene === "prologue" && (
        <div className="game-white-cima-prologue flex h-[calc(100dvh-3rem)] flex-col items-center justify-center bg-center bg-no-repeat">
          <div className="border border-white bg-black/80 p-8">
            <p className="mb-4 text-xl">とべ君：「ひろしげはどうした？」</p>
            <p className="mb-4 text-xl">
              しげる君：「ひろしげは白のシーマで殺されちゃったよ……さっき警察が来たんだ」
            </p>
            <p className="text-2xl font-bold text-red-500">
              とべ君：「わかった。必ず報復してやる。」
            </p>
            <button
              type="button"
              onClick={() => setScene("select")}
              className="game-btn-ghost mt-8 border px-6 py-2"
            >
              銀のハイエースに乗る
            </button>
          </div>
        </div>
      )}

      {scene === "select" && (
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 text-center text-sm text-gray-400">
            銀ハイエースに乗るメンバーを3人選べ（{selectedChars.length}/3）
          </p>
          <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 sm:p-10">
            {CHARACTERS.map((char) => {
              const selected = selectedChars.includes(char.id);
              const disabled = !selected && selectedChars.length >= 3;

              return (
                <button
                  key={char.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleCharacter(char.id)}
                  className={`border-2 p-8 text-left transition ${
                    selected
                      ? "border-red-500 bg-red-950/20"
                      : disabled
                        ? "cursor-not-allowed border-gray-800 opacity-40"
                        : "border-gray-500 hover:border-red-700"
                  }`}
                >
                  <h2 className="text-3xl font-bold">{char.name}</h2>
                  <p className="mt-2">{char.weapon}</p>
                  <p className="mt-1 text-sm text-gray-400">{char.style}</p>
                </button>
              );
            })}
            {selectedChars.length >= 3 && (
              <button
                type="button"
                onClick={() => setScene("battle")}
                className="col-span-1 bg-red-900 py-6 text-2xl font-black shadow-2xl transition hover:bg-red-800 sm:col-span-2"
              >
                鈴木組へ突撃
              </button>
            )}
          </div>
        </div>
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
                battleResult === "victory" ? "text-red-500" : "text-gray-500"
              }`}
            >
              {battleResult === "victory" ? "復讐成功" : "全滅……"}
            </h2>
            <p className="mt-8 italic leading-relaxed text-gray-300">
              {battleResult === "victory"
                ? "銀のハイエースが夜明けへ消える。かつみの電話は、まだ繋がったままだった——"
                : "電話が切れた。黒センチュリーの灯りだけが、夜に残った。"}
            </p>
            <button
              type="button"
              onClick={resetGame}
              className="game-btn-ghost mt-10 border px-8 py-3"
            >
              タイトルへ戻る
            </button>
          </div>
        </ParkingLotScene>
      )}
    </div>
  );
}
