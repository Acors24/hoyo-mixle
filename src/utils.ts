import random, { Random } from "random";
import albums from "./assets/albums.json";
import { Game, Song } from "./types";

const today = new Date();

function getTodaysSong(): Song {
  return new Random(today.toDateString()).choice(
    albums.flatMap((album) => album.songs)
  )!;
}

function getYouTubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

function getStarts(duration: number, endlessMode: boolean): number[] {
  const rng = endlessMode ? random : new Random(today.toDateString());
  const uniform = rng.uniformInt(0, duration - 10);
  return Array(3).fill(0).map(uniform);
}

function getGameBaseWiki(game: Game): string {
  switch (game) {
    case "genshinImpact":
      return "https://genshin-impact.fandom.com/wiki/";
  }
}

export { getTodaysSong, getYouTubeThumbnail, getStarts, getGameBaseWiki };
