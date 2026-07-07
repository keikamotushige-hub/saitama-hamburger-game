"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ParkingLotScene } from "@/components/saitama-hamburger/ParkingLotScene";
import { PhoneCallUI } from "@/components/saitama-hamburger/PhoneCallUI";
import { useGameAudio } from "@/components/saitama-hamburger/useGameAudio";
import type {
  CallPhase,
  Fighter,
} from "@/lib/saitama-hamburger/types";
import {
  BOSS_LINES,
  KATSUMI_LINES,
} from "@/lib/saitama-hamburger/types";

type BattleOutcome = "ongoing" | "victory" | "defeat";

interface AutoBattleProps {
  party: Fighter[];
  enemies: Fighter[];
  onFinish: (outcome: "victory" | "defeat") => void;
}

interface BattleState {
  allies: Fighter[];
  foes: Fighter[];
  turn: number;
}

function cloneFighters(fighters: Fighter[]): Fighter[] {
  return fighters.map((f) => ({ ...f }));
}

function living(fighters: Fighter[]): Fighter[] {
  return fighters.filter((f) => f.hp > 0);
}

function pickTarget(targets: Fighter[]): Fighter | null {
  const alive = living(targets);
  if (alive.length === 0) return null;
  return alive[Math.floor(Math.random() * alive.length)];
}

function gunfightLine(attacker: Fighter, target: Fighter, damage: number): string {
  if (attacker.weapon.includes("拳銃") || attacker.weapon.includes("ガン")) {
    return `【銃声】${attacker.name}——${target.name}に${damage}発命中`;
  }
  return `【${attacker.weapon}】${attacker.name} → ${target.name}（${damage}ダメージ）`;
}

export function AutoBattle({ party, enemies, onFinish }: AutoBattleProps) {
  const audio = useGameAudio();
  const [phase, setPhase] = useState<CallPhase>("dialing-katsumi");
  const [lineIndex, setLineIndex] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [battle, setBattle] = useState<BattleState>(() => ({
    allies: cloneFighters(party),
    foes: cloneFighters(enemies),
    turn: 0,
  }));
  const [log, setLog] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<BattleOutcome>("ongoing");
  const finishedRef = useRef(false);
  const phaseStartedRef = useRef(false);

  const currentLines = phase.includes("katsumi") ? KATSUMI_LINES : BOSS_LINES;
  const activeLine =
    phase === "gunfight"
      ? log[0] ?? "銀のハイエースがエンジン音を轟かせ、駐車場へ突入——"
      : phase.startsWith("dialing")
        ? null
        : `${currentLines[lineIndex]?.speaker}：「${currentLines[lineIndex]?.text}」`;

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [line, ...prev].slice(0, 14));
  }, []);

  useEffect(() => {
    if (phase === "gunfight" || phase.startsWith("dialing")) return;
    const timer = window.setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phaseStartedRef.current) return;
    phaseStartedRef.current = true;

    if (phase === "dialing-katsumi") {
      // かつみの電話は鳴らない — 着信音なしで静かに接続
      const timer = window.setTimeout(() => {
        setPhase("katsumi");
        setLineIndex(0);
        phaseStartedRef.current = false;
      }, 1800);
      return () => window.clearTimeout(timer);
    }

    if (phase === "dialing-boss") {
      audio.playDialTone();
      const timer = window.setTimeout(() => {
        audio.playCallConnect();
        setPhase("boss");
        setLineIndex(0);
        phaseStartedRef.current = false;
      }, 2000);
      return () => window.clearTimeout(timer);
    }
  }, [phase, audio]);

  useEffect(() => {
    if (phase !== "katsumi" && phase !== "boss") return;

    const timer = window.setTimeout(() => {
      if (lineIndex < currentLines.length - 1) {
        setLineIndex((i) => i + 1);
        return;
      }

      if (phase === "katsumi") {
        setPhase("dialing-boss");
        setCallDuration(0);
        phaseStartedRef.current = false;
        return;
      }

      setPhase("gunfight");
      pushLog("鈴木組・組長との通話を維持したまま、駐車場で銃撃戦が始まる——");
      audio.playGunBurst(2);
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [phase, lineIndex, currentLines.length, pushLog, audio]);

  useEffect(() => {
    if (phase !== "gunfight" || outcome !== "ongoing") return;

    const timer = window.setTimeout(() => {
      setBattle((current) => {
        const allies = cloneFighters(current.allies);
        const foes = cloneFighters(current.foes);
        const aliveAllies = living(allies);
        const aliveFoes = living(foes);

        if (aliveAllies.length === 0) {
          setOutcome("defeat");
          pushLog("【通話切断】全滅……復讐は果たせなかった");
          return current;
        }

        if (aliveFoes.length === 0) {
          setOutcome("victory");
          pushLog("【通話維持】鈴木組長を撃破。かつみへの報告が通る");
          return current;
        }

        const actorPool = [...aliveAllies, ...aliveFoes];
        const actor = actorPool[current.turn % actorPool.length];
        const isGun =
          actor.weapon.includes("拳銃") ||
          actor.weapon.includes("ガン") ||
          actor.weapon.includes("ミサイル");

        if (actor.isEnemy) {
          const target = pickTarget(allies);
          if (target) {
            const damage = Math.max(8, actor.atk + Math.floor(Math.random() * 6) - 2);
            const idx = allies.findIndex((f) => f.id === target.id);
            allies[idx] = { ...target, hp: Math.max(0, target.hp - damage) };
            pushLog(gunfightLine(actor, target, damage));
            if (isGun) audio.playGunBurst(1 + Math.floor(Math.random() * 2));
          }
        } else {
          const target = pickTarget(foes);
          if (target) {
            const damage = Math.max(10, actor.atk + Math.floor(Math.random() * 8) - 2);
            const idx = foes.findIndex((f) => f.id === target.id);
            foes[idx] = { ...target, hp: Math.max(0, target.hp - damage) };
            pushLog(gunfightLine(actor, target, damage));
            if (isGun) audio.playGunBurst(1 + Math.floor(Math.random() * 3));
          }
        }

        return { allies, foes, turn: current.turn + 1 };
      });
    }, 850);

    return () => window.clearTimeout(timer);
  }, [phase, outcome, battle.turn, pushLog, audio]);

  useEffect(() => {
    if (outcome === "ongoing" || finishedRef.current) return;
    finishedRef.current = true;
    const timer = window.setTimeout(() => onFinish(outcome), 2200);
    return () => window.clearTimeout(timer);
  }, [outcome, onFinish]);

  const inGunfight = phase === "gunfight";

  return (
    <ParkingLotScene intensity={inGunfight ? "combat" : "calm"}>
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_1.1fr]">
        <PhoneCallUI
          phase={phase}
          activeLine={activeLine}
          callDuration={callDuration}
          signalBars={inGunfight ? 2 : 4}
        />

        <div className="game-combat-panel rounded-2xl border border-red-900/40 bg-black/75 p-4 backdrop-blur-md">
          <h2 className="mb-4 text-center text-2xl font-bold text-red-500 sm:text-4xl">
            {inGunfight ? "戦闘中: 埼玉の夜" : "戦闘準備: 埼玉の夜"}
          </h2>
          {!inGunfight && (
            <p className="mb-4 text-center italic text-gray-400">
              [銀のハイエースが突入… かつみの黒センチュリーへ電話を置きっぱなし]
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <section>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-red-300">
                復讐チーム（銀ハイエース内）
              </h3>
              <ul className="space-y-2">
                {battle.allies.map((ally) => (
                  <li
                    key={ally.id}
                    className="rounded-lg border border-red-900/50 bg-black/50 px-3 py-2"
                  >
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">{ally.name}</span>
                      <span>
                        {ally.hp}/{ally.maxHp}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded bg-zinc-800">
                      <div
                        className="h-full bg-red-600 transition-all duration-300"
                        style={{ width: `${(ally.hp / ally.maxHp) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                敵対組織・鈴木組（対面車列）
              </h3>
              <ul className="space-y-2">
                {battle.foes.map((foe) => (
                  <li
                    key={foe.id}
                    className={`rounded-lg border px-3 py-2 ${
                      foe.hp > 0
                        ? "border-zinc-600 bg-black/50"
                        : "border-zinc-800 opacity-40"
                    }`}
                  >
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">
                        {foe.name}
                        {foe.title ? (
                          <span className="ml-1 text-[10px] text-zinc-500">
                            ({foe.title})
                          </span>
                        ) : null}
                      </span>
                      <span>
                        {foe.hp}/{foe.maxHp}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded bg-zinc-800">
                      <div
                        className="h-full bg-zinc-500 transition-all duration-300"
                        style={{ width: `${(foe.hp / foe.maxHp) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-4 rounded-lg border border-zinc-800 bg-black/50 p-3">
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-red-400">
              通話ログ / 銃撃記録
            </h3>
            <ul className="max-h-36 space-y-1 overflow-y-auto text-xs leading-relaxed text-zinc-300">
              {(log.length > 0
                ? log
                : ["銀ハイエース到着。かつみの電話に置きっぱなし——鳴らずに繋ぐ——"]
              ).map((line, index) => (
                <li key={`${line}-${index}`}>{line}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </ParkingLotScene>
  );
}
