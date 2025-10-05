import genshinAlbums from "../src/assets/albums/genshin-impact.json";
import starRailAlbums from "../src/assets/albums/honkai-star-rail.json";
import zenlessAlbums from "../src/assets/albums/zenless-zone-zero.json";
import { Album } from "../src/types";

const checkInternalIds = (albums: Album[]) => {
  const internalIds = new Set<number>();

  for (const album of albums) {
    for (const song of album.songs) {
      if (internalIds.has(song.id)) {
        console.error(`Duplicate song found: ${song.id}`);
      } else {
        internalIds.add(song.id);
      }
    }
  }
};

const checkFandomUrls = (albums: Album[], game: string) => {
  const fandomUrls = new Set<string>();

  for (const album of albums) {
    for (const song of album.songs) {
      if (song.fandomUrl !== undefined) {
        if (fandomUrls.has(song.fandomUrl)) {
          console.error(`Duplicate Fandom URL found: ${song.fandomUrl}`);
        } else {
          fandomUrls.add(song.fandomUrl);
        }
      } else {
        console.error(
          `Song "${song.title}" (${song.id}) in ${game} is missing a Fandom URL.`
        );
      }
    }
  }
};

const checkContext = (albums: Album[], game: string) => {
  for (const album of albums) {
    for (const song of album.songs) {
      if (song.context === undefined || song.context.trim() === "") {
        console.error(
          `Song "${song.title}" (${song.id}) in ${game} is missing context.`
        );
      }
    }
  }
};

const youtubeIds = new Set<string>();
const spotifyIds = new Set<string>();

const allAlbums = [
  ...(genshinAlbums as Album[]),
  ...(starRailAlbums as Album[]),
  ...(zenlessAlbums as Album[]),
];
for (const album of allAlbums) {
  for (const song of album.songs) {
    if (youtubeIds.has(song.youtubeId)) {
      console.error(`Duplicate YouTube ID found: ${song.youtubeId}`);
    } else {
      youtubeIds.add(song.youtubeId);
    }

    if (spotifyIds.has(song.spotifyId)) {
      console.error(`Duplicate Spotify ID found: ${song.spotifyId}`);
    } else {
      spotifyIds.add(song.spotifyId);
    }
  }
}

checkInternalIds(genshinAlbums as Album[]);
checkInternalIds(starRailAlbums as Album[]);
checkInternalIds(zenlessAlbums as Album[]);

checkFandomUrls(genshinAlbums as Album[], "Genshin Impact");
checkFandomUrls(starRailAlbums as Album[], "Honkai: Star Rail");
checkFandomUrls(zenlessAlbums as Album[], "Zenless Zone Zero");

checkContext(genshinAlbums as Album[], "Genshin Impact");
checkContext(starRailAlbums as Album[], "Honkai: Star Rail");
checkContext(zenlessAlbums as Album[], "Zenless Zone Zero");
