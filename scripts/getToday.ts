import { getTodayDateString, getTodaysSong } from "../src/utils";

import genshinAlbums from "../src/assets/albums/genshin-impact.json";
import starRailAlbums from "../src/assets/albums/honkai-star-rail.json";
import zenlessAlbums from "../src/assets/albums/zenless-zone-zero.json";

const today = getTodayDateString();
const genshinSong = await getTodaysSong(genshinAlbums, "genshinImpact");
const starRailSong = await getTodaysSong(starRailAlbums, "honkaiStarRail");
const zenlessSong = await getTodaysSong(zenlessAlbums, "zenlessZoneZero");

console.log(`${today} ${genshinSong.id} ${starRailSong.id} ${zenlessSong.id}`);
