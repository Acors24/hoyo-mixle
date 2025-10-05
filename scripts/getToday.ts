import { getTodaysSong } from "../src/utils";

import genshinAlbums from "../src/assets/albums/genshin-impact.json";
import starRailAlbums from "../src/assets/albums/honkai-star-rail.json";
import zenlessAlbums from "../src/assets/albums/zenless-zone-zero.json";

const today = new Date().toISOString().split("T")[0];
const genshinSong = getTodaysSong(genshinAlbums);
const starRailSong = getTodaysSong(starRailAlbums);
const zenlessSong = getTodaysSong(zenlessAlbums);

console.log(`${today} ${genshinSong.id} ${starRailSong.id} ${zenlessSong.id}`);
