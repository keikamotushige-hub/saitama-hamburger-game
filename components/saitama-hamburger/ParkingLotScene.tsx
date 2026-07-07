import { CenturyCar } from "@/components/saitama-hamburger/CenturyCar";
import { HiAceVan } from "@/components/saitama-hamburger/HiAceVan";

interface ParkingLotSceneProps {
  children?: React.ReactNode;
  intensity?: "calm" | "combat";
}

export function ParkingLotScene({
  children,
  intensity = "calm",
}: ParkingLotSceneProps) {
  return (
    <div className="game-parking-lot relative min-h-[calc(100dvh-2rem)] overflow-hidden">
      <div className="game-parking-sky absolute inset-0" />
      <div className="game-parking-moon absolute" />
      <div className="game-parking-fog absolute inset-0" />

      <div className="absolute inset-x-0 bottom-0 h-[55%]">
        <div className="game-parking-ground absolute inset-0" />
        <div className="game-parking-lines absolute inset-0" />
        <div className="game-parking-wetshine absolute inset-0" />
      </div>

      {/* とべ君 — 銀のハイエース */}
      <div className="absolute bottom-[16%] left-[2%] z-10">
        <p className="mb-1 text-center text-[9px] text-zinc-400">とべ君</p>
        <HiAceVan headlightsOn scale={0.9} />
      </div>

      {/* かつみ組長 — 黒のセンチュリー */}
      <div className="absolute bottom-[20%] right-[4%] z-10">
        <p className="mb-1 text-center text-[9px] text-red-400/80">かつみ組長</p>
        <CenturyCar headlightsOn scale={0.85} />
      </div>

      {intensity === "combat" && (
        <>
          <div className="game-muzzle-flash game-muzzle-flash-1" />
          <div className="game-muzzle-flash game-muzzle-flash-2" />
          <div className="game-muzzle-flash game-muzzle-flash-3" />
        </>
      )}

      <div className="relative z-20 flex min-h-[calc(100dvh-2rem)] flex-col items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
