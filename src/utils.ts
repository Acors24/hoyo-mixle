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
  const silencePadding = duration < 60 ? 0 : 5;
  const minimumInterval = duration < 60 ? 5 : 10;
  const rng = endlessMode ? random : new Random(today.toDateString());
  const uniform = rng.uniformInt(silencePadding, duration - 3 - silencePadding);
  const starts: number[] = [];
  while (starts.length < 3) {
    const start = uniform();
    if (starts.some((s) => Math.abs(s - start) < minimumInterval)) {
      continue;
    }
    starts.push(start);
  }
  return starts;
}

function getGameBaseWiki(game: Game): string {
  switch (game) {
    case "genshinImpact":
      return "https://genshin-impact.fandom.com/wiki/";
  }
}

export { getTodaysSong, getYouTubeThumbnail, getStarts, getGameBaseWiki };
