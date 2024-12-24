import HowToPlay from "./HowToPlay";
import { Link } from "@tanstack/react-router";
import genshinIcon from "../assets/Genshin_Impact.png";
import starRailIcon from "../assets/Honkai_Star_Rail_App.png";
import Changelog from "./Changelog";

export default function Navbar() {
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
        <HowToPlay />
      </div>
    </nav>
  );
}
