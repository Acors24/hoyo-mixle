import HowToPlay from "../HowToPlay";
import { Link } from "@tanstack/react-router";
import genshinIcon from "../../assets/icons/genshin-impact.png";
import starRailIcon from "../../assets/icons/honkai-star-rail.png";
import zenlessZoneZeroIcon from "../../assets/icons/zenless-zone-zero.png";
import Changelog from "../Changelog";
import classes from "./style.module.css";
import About from "../About";
import AlbumStats from "../AlbumStats";

export default function Navbar() {
  return (
    <nav className={classes.Navbar}>
      <div className={classes.NavbarContent}>
        <div className={classes.GameIcons}>
          <Link to="/genshin-impact" className={classes.GameIcon}>
            <img src={genshinIcon} alt="Genshin Impact" />
          </Link>
          <Link to="/star-rail" className={classes.GameIcon}>
            <img src={starRailIcon} alt="Honkai Star Rail" />
          </Link>
          <Link to="/zenless-zone-zero" className={classes.GameIcon}>
            <img src={zenlessZoneZeroIcon} alt="Zenless Zone Zero" />
          </Link>
        </div>
        <div className={classes.UtilityIcons}>
          <AlbumStats />
          <About />
          <Changelog />
          <HowToPlay />
        </div>
      </div>
    </nav>
  );
}
