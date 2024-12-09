import { useState } from "react";
import { FaRegCircleQuestion, FaRegFileLines } from "react-icons/fa6";
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

  const [changelogOpen, setChangelogOpen] = useState(false);

  const handleHowToPlayClose = () => {
    setHowToPlayOpen(false);
    dispatch({
      type: "SET_HOW_TO_PLAY_SEEN",
      payload: true,
    });
  };

  const changelogVersion = 1;
  const handleChangelogClose = () => {
    setChangelogOpen(false);
    dispatch({
      type: "SET_LAST_CHANGELOG_SEEN",
      payload: changelogVersion,
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
        <Changelog open={changelogOpen} onClose={handleChangelogClose} />
        <button onClick={() => setChangelogOpen(true)} className="relative">
          {changelogVersion !== state.config.lastChangelogSeen && (
            <>
              <span className="absolute -top-1 -right-1 bg-rose-500 rounded-full w-4 h-4"></span>
              <span className="absolute -top-1 -right-1 bg-rose-500 rounded-full w-4 h-4 animate-ping"></span>
            </>
          )}
          <FaRegFileLines className="text-3xl" />
        </button>
        <HowToPlay open={howToPlayOpen} onClose={handleHowToPlayClose} />
        <button onClick={() => setHowToPlayOpen(true)}>
          <FaRegCircleQuestion className="text-3xl" />
        </button>
      </div>
    </nav>
  );
}
