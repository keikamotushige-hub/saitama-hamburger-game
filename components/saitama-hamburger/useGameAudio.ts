"use client";

import { useCallback, useRef } from "react";

const ACTION_BGM_URL =
  "https://actions.google.com/sounds/v1/emergency/police_siren_long.ogg";

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function useGameAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playGunshot = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;

    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 0.08);

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 900 + Math.random() * 400;
    bandpass.Q.value = 0.7;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.1);

    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = "sine";
    thump.frequency.setValueAtTime(180, now);
    thump.frequency.exponentialRampToValueAtTime(40, now + 0.08);
    thumpGain.gain.setValueAtTime(0.5, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    thump.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thump.start(now);
    thump.stop(now + 0.15);
  }, [getContext]);

  const playGunBurst = useCallback(
    (count = 3) => {
      for (let i = 0; i < count; i++) {
        window.setTimeout(() => playGunshot(), i * (70 + Math.random() * 90));
      }
    },
    [playGunshot],
  );

  const playPhoneRing = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;

    for (let ring = 0; ring < 2; ring++) {
      const offset = ring * 0.9;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now + offset);
      osc.frequency.setValueAtTime(480, now + offset + 0.2);
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.12, now + offset + 0.02);
      gain.gain.linearRampToValueAtTime(0, now + offset + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.45);
    }
  }, [getContext]);

  const playDialTone = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 350;
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);
  }, [getContext]);

  const playCallConnect = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }, [getContext]);

  const startActionBgm = useCallback(() => {
    if (!bgmRef.current) {
      bgmRef.current = new Audio(ACTION_BGM_URL);
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.35;
    }
    bgmRef.current.currentTime = 0;
    void bgmRef.current.play().catch(() => {
      // ブラウザの自動再生制限
    });
  }, []);

  const stopBgm = useCallback(() => {
    if (!bgmRef.current) return;
    bgmRef.current.pause();
    bgmRef.current.currentTime = 0;
  }, []);

  return {
    playGunshot,
    playGunBurst,
    playPhoneRing,
    playDialTone,
    playCallConnect,
    startActionBgm,
    stopBgm,
  };
}
