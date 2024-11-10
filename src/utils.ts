import random, { Random } from "random";
import { Album, Game, Song } from "./types";

const today = new Date();

function getTodaysSong(albums: Album[]): Song {
  return new Random(today.toDateString()).choice(
    albums.flatMap((album) => album.songs)
  )!;
}

function getYouTubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

function getSilencePadding(duration: number): number {
  return Math.ceil(Math.min(20, Math.max(0, (duration - 30) / 3)));
}

function getMinimumInterval(duration: number): number {
  const padding = getSilencePadding(duration);
  return Math.ceil((duration - 2 * padding) / 6);
}

function getStarts(duration: number, endlessMode: boolean): number[] {
  const silencePadding = getSilencePadding(duration);
  const minimumInterval = getMinimumInterval(duration);
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
    case "starRail":
      return "https://honkai-star-rail.fandom.com/wiki/";
  }
}

function getSimplePlayerState(
  playerState: YT.PlayerState
): "playing" | "idle" | "loading" {
  if (playerState === 1) {
    return "playing";
  }

  if (
    playerState === -1 ||
    playerState === 0 ||
    playerState === 5 ||
    playerState === 2
  ) {
    return "idle";
  }

  return "loading";
}

export {
  getTodaysSong,
  getYouTubeThumbnail,
  getStarts,
  getGameBaseWiki,
  getSimplePlayerState,
};
