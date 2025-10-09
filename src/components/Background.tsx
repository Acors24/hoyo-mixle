import { useEffect, useState } from "react";
import genshinImpactBg from "../assets/backgrounds/genshin-impact.png";
import honkaiStarRailBg from "../assets/backgrounds/honkai-star-rail.png";
import zenlessZoneZeroBg from "../assets/backgrounds/zenless-zone-zero.png";
import { Game } from "../types";

function getDefaultBackground(game: Game) {
  switch (game) {
    case "genshinImpact":
      return genshinImpactBg;
    case "honkaiStarRail":
      return honkaiStarRailBg;
    case "zenlessZoneZero":
      return zenlessZoneZeroBg;
  }
}

export default function Background({
  game,
  visible,
  dailySrc,
  endlessSrc,
}: {
  game: Game;
  visible: "playing" | "daily" | "endless";
  dailySrc: string;
  endlessSrc: string;
}) {
  const defaultBackground = getDefaultBackground(game);
  const [delayedDailySrc, setDelayedDailySrc] = useState(dailySrc);
  const [delayedEndlessSrc, setDelayedEndlessSrc] = useState(endlessSrc);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedDailySrc(dailySrc);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [dailySrc]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedEndlessSrc(endlessSrc);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [endlessSrc]);

  return (
    <>
      <img
        src={defaultBackground}
        alt=""
        className={`fixed w-full h-full object-cover duration-1000 ${
          visible === "playing" ? "opacity-100" : "opacity-0"
        }`}
      />
      <img
        src={delayedDailySrc}
        alt=""
        className={`fixed w-full h-full object-cover blur-3xl duration-1000 ${
          visible === "daily" ? "opacity-100" : "opacity-0"
        }`}
      />
      <img
        src={delayedEndlessSrc}
        alt=""
        className={`fixed w-full h-full object-cover blur-3xl duration-1000 ${
          visible === "endless" ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
