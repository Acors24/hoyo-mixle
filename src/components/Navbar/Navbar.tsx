import HowToPlay from "../HowToPlay";
import { Link } from "@tanstack/react-router";
import genshinIcon from "../../assets/Genshin_Impact.png";
import starRailIcon from "../../assets/Honkai_Star_Rail_App.png";
import Changelog from "../Changelog";
import classes from "./style.module.css";

export default function Navbar() {
  return (
    <nav className={classes.Navbar}>
      <div className={classes.GameIcons}>
        <Link to="/genshin-impact" className={classes.GameIcon}>
          <img src={genshinIcon} alt="Genshin Impact" />
        </Link>
        <Link to="/star-rail" className={classes.GameIcon}>
          <img src={starRailIcon} alt="Honkai Star Rail" />
        </Link>
      </div>
      <div className={classes.UtilityIcons}>
        <Changelog />
        <HowToPlay />
      </div>
    </nav>
  );
}
