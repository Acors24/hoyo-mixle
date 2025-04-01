import random, { Random } from "random";
import { Album, Game, Song } from "./types";

const baseDate = new Date(2025, 0, 1);
const today = new Date();

function getRng(): Random {
  const rng = new Random(0);
  const days = Math.floor((today.getTime() - baseDate.getTime()) / 86400000);
  for (let i = 0; i < days; i++) {
    rng.int();
  }
  return rng;
}

function getTodaysSong(albums: Album[]): Song {
  if (today.getMonth() === 3 && today.getDate() === 1) {
    if (albums.length === 34) {
      return albums.flatMap((album) => album.songs)[1149];
    } else if (albums.length === 17) {
      return albums.flatMap((album) => album.songs)[300];
    }
  }

  return getRng().choice(albums.flatMap((album) => album.songs))!;
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
  const rng = endlessMode ? random : getRng();
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

function contextToList(context: string): string[] {
  return context.split(" / ");
}

export {
  getTodaysSong,
  getYouTubeThumbnail,
  getStarts,
  getGameBaseWiki,
  getSimplePlayerState,
  contextToList,
};
