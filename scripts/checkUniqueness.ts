import genshinAlbums from "../src/assets/albums/genshin-impact.json";
import starRailAlbums from "../src/assets/albums/honkai-star-rail.json";
import zenlessAlbums from "../src/assets/albums/zenless-zone-zero.json";
import { Album } from "../src/types";

const checkInternalIds = (gameAlbums: { [key: string]: Album[] }) => {
  let foundIssues = false;

  for (const [game, albums] of Object.entries(gameAlbums)) {
    const internalIds = new Set<number>();
    const issues: { id: number; title: string }[] = [];

    for (const album of albums) {
      for (const song of album.songs) {
        if (internalIds.has(song.id)) {
          const previousAlbum = albums.find((a) =>
            a.songs.some((s) => s.id === song.id),
          )!;
          issues.push({
            id: song.id,
            title: previousAlbum.songs.find((s) => s.id === song.id)!.title,
          });
          issues.push({ id: song.id, title: song.title });
        } else {
          internalIds.add(song.id);
        }
      }
    }

    if (issues.length > 0) {
      foundIssues = true;
      console.error(`Songs with duplicate IDs (${game}):`);
      console.table(issues, ["id", "title"]);
    }
  }

  return foundIssues;
};

const checkFandomUrls = (gameAlbums: { [key: string]: Album[] }) => {
  let foundIssues = false;

  for (const [game, albums] of Object.entries(gameAlbums)) {
    const fandomUrls = new Set<string>();
    const issues: { id: number; title: string }[] = [];

    for (const album of albums) {
      for (const song of album.songs) {
        if (song.fandomUrl !== undefined) {
          if (fandomUrls.has(song.fandomUrl)) {
            console.error(`Duplicate Fandom URL found: ${song.fandomUrl}`);
          } else {
            fandomUrls.add(song.fandomUrl);
          }
        } else {
          issues.push({ id: song.id, title: song.title });
        }
      }
    }

    if (issues.length > 0) {
      foundIssues = true;
      console.error(`Songs with missing Fandom URLs (${game}):`);
      console.table(issues, ["id", "title"]);
    }
  }

  return foundIssues;
};

const checkContext = (gameAlbums: { [key: string]: Album[] }) => {
  let foundIssues = false;

  for (const [game, albums] of Object.entries(gameAlbums)) {
    const issues: { id: number; title: string }[] = [];

    for (const album of albums) {
      for (const song of album.songs) {
        if (song.context === undefined || song.context.trim() === "") {
          issues.push({ id: song.id, title: song.title });
        }
      }
    }

    if (issues.length > 0) {
      foundIssues = true;
      console.error(`Songs with missing context (${game}):`);
      console.table(issues, ["id", "title"]);
    }
  }

  return foundIssues;
};

const checkYTAndSpotifyIDs = (gameAlbums: { [key: string]: Album[] }) => {
  let foundIssues = false;

  const issues: { game: string; title: string; what: string }[] = [];

  const youtubeIds = new Set<string>();
  const spotifyIds = new Set<string>();

  for (const [game, albums] of Object.entries(gameAlbums)) {
    for (const album of albums) {
      for (const song of album.songs) {
        if (song.youtubeId === undefined || song.youtubeId.trim() === "") {
          issues.push({ game, title: song.title, what: "Missing YouTube ID" });
        }

        if (song.youtubeId.length != 11) {
          issues.push({ game, title: song.title, what: "Invalid YouTube ID" });
        }

        if (youtubeIds.has(song.youtubeId)) {
          issues.push({
            game,
            title: song.title,
            what: "YouTube ID duplicate",
          });
        } else {
          youtubeIds.add(song.youtubeId);
        }

        if (song.spotifyId === undefined || song.spotifyId.trim() === "") {
          issues.push({ game, title: song.title, what: "Missing Spotify ID" });
        }

        if (spotifyIds.has(song.spotifyId)) {
          issues.push({
            game,
            title: song.title,
            what: "Spotify ID duplicate",
          });
        } else {
          spotifyIds.add(song.spotifyId);
        }
      }
    }
  }

  if (issues.length > 0) {
    foundIssues = true;
    console.error(`Songs with YouTube or Spotify ID issues:`);
    console.table(issues, ["game", "title", "what"]);
  }

  return foundIssues;
};

const gameAlbums: { [key: string]: Album[] } = {
  "Genshin Impact": genshinAlbums as Album[],
  "Honkai: Star Rail": starRailAlbums as Album[],
  "Zenless Zone Zero": zenlessAlbums as Album[],
};

const ok = [
  checkYTAndSpotifyIDs(gameAlbums),
  checkInternalIds(gameAlbums),
  checkFandomUrls(gameAlbums),
  checkContext(gameAlbums),
].every((result) => !result);

if (ok) {
  console.log("Everything seems ok");
}
