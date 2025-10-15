import { useEffect, useState } from "react";
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

  return (
    <img
      src={src}
      alt=""
      className="fixed w-full h-full bg-bottom object-cover blur-[5vw] duration-1000"
      style={{ opacity: 0 }}
      onLoad={(a) => {
        a.currentTarget.style.opacity = "1";
        setTimeout(popFn, 1000);
      }}
    />
  );
}

export default function Background({
  background,
}: {
  background: Game | string;
}) {
  const [backgrounds, setBackgrounds] = useState<string[]>([]);

  useEffect(() => {
    setBackgrounds((backgrounds) =>
      backgrounds.includes(background)
        ? backgrounds
        : [...backgrounds, background]
    );
    console.log("added");
  }, [background]);

  return (
    <div className="absolute -z-10">
      {backgrounds.map((bg) => (
        <Image
          key={bg}
          background={bg}
          popFn={() => {
            console.log("popping");
            if (backgrounds.length > 1) setBackgrounds((bgs) => bgs.slice(1));
          }}
        />
      ))}
    </div>
  );
}
