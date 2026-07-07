import { CrownCar } from "@/components/saitama-hamburger/CrownCar";

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

      <div className="absolute bottom-[18%] left-[4%] z-10 opacity-90">
        <CrownCar variant="black" headlightsOn scale={0.85} brakeLights={intensity === "combat"} />
      </div>
      <div className="absolute bottom-[22%] right-[8%] z-10 opacity-80">
        <CrownCar variant="dark" headlightsOn={false} scale={0.75} />
      </div>
      <div className="absolute bottom-[16%] left-[38%] z-10 opacity-70">
        <CrownCar variant="silver" headlightsOn scale={0.65} />
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
