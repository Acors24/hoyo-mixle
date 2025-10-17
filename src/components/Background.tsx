import { useEffect, useRef, useState } from "react";
import genshinImpactBg from "../assets/backgrounds/genshin-impact.png";
import honkaiStarRailBg from "../assets/backgrounds/honkai-star-rail.png";
import zenlessZoneZeroBg from "../assets/backgrounds/zenless-zone-zero.png";
import { Game, GameList } from "../types";

function getGameBackground(game: Game) {
  switch (game) {
    case "genshinImpact":
      return genshinImpactBg;
    case "honkaiStarRail":
      return honkaiStarRailBg;
    case "zenlessZoneZero":
      return zenlessZoneZeroBg;
  }
}

function Image({
  background,
  popFn,
}: {
  background: string;
  popFn: () => void;
}) {
  const src = GameList.includes(background as Game)
    ? getGameBackground(background as Game)
    : background;

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black duration-1000"
      style={{ opacity: 0 }}
    >
      <img
        src={src}
        alt=""
        className="fixed w-full h-full object-cover blur-[5vh]"
        onLoad={() => {
          if (containerRef.current) {
            containerRef.current.style.opacity = "1";
            setTimeout(popFn, 1000);
          }
        }}
      />
    </div>
  );
}

export default function Background({
  background,
}: {
  background: Game | string;
}) {
  const [backgrounds, setBackgrounds] = useState<string[]>([]);

  const pop = () => {
    setBackgrounds((bgs) => {
      return bgs.length > 1 ? bgs.slice(1) : bgs;
    });
  };

  useEffect(() => {
    setBackgrounds((bgs) => [
      ...bgs.filter((bg) => bg !== background),
      background,
    ]);
  }, [background]);

  return (
    <div className="absolute -z-10">
      {backgrounds.map((bg) => (
        <Image key={bg} background={bg} popFn={pop} />
      ))}
    </div>
  );
}
