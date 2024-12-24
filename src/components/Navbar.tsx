import { useState } from "react";
import { FaRegCircleQuestion } from "react-icons/fa6";
import HowToPlay from "./HowToPlay";
import { useStorage } from "../StorageContext";
import { Link } from "@tanstack/react-router";
import genshinIcon from "../assets/Genshin_Impact.png";
import starRailIcon from "../assets/Honkai_Star_Rail_App.png";
import Changelog from "./Changelog";

export default function Navbar() {
  const { state, dispatch } = useStorage();
  const [howToPlayOpen, setHowToPlayOpen] = useState(
    !state.config.howToPlaySeen
  );

  const handleHowToPlayClose = () => {
    setHowToPlayOpen(false);
    dispatch({
      type: "SET_HOW_TO_PLAY_SEEN",
      payload: true,
    });
  };

  return (
    <nav className="bg-slate-900 px-2 py-4 flex flex-col justify-between w-12">
      <div className="flex flex-col gap-4 *:opacity-50 *:duration-300">
        <Link
          to="/genshin-impact"
          className="[&.active]:opacity-100 [&.active]:shadow-glow [&.active]:shadow-white rounded"
        >
          <img src={genshinIcon} alt="Genshin Impact" className="rounded" />
        </Link>
        <Link
          to="/star-rail"
          className="[&.active]:opacity-100 [&.active]:shadow-glow [&.active]:shadow-white rounded"
        >
          <img src={starRailIcon} alt="Honkai Star Rail" className="rounded" />
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Changelog />
        <HowToPlay open={howToPlayOpen} onClose={handleHowToPlayClose} />
        <button onClick={() => setHowToPlayOpen(true)}>
          <FaRegCircleQuestion className="text-3xl" />
        </button>
      </div>
    </nav>
  );
}
