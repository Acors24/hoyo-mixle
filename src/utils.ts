import random, { Random } from "random";
import { Album, Game, Song } from "./types";
import { getDayOfYear } from "date-fns";

const baseDate = new Date(2025, 0, 1);
const today = new Date();

function getDifferenceInFullDays(date1: Date, date2: Date): number {
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return (utc2 - utc1) / (1000 * 60 * 60 * 24);
}

function getRng(): Random {
  const rng = new Random(0);
  const days = getDifferenceInFullDays(baseDate, today);
  for (let i = 0; i < days; i++) {
    rng.int();
  }
  return rng;
}

function getSongById(albums: Album[], id?: number): Song | undefined {
  if (id === undefined) {
    return;
  }

  return albums.flatMap((album) => album.songs).find((song) => song.id === id);
}

function getAprilFoolsSongId(albums: Album[]): number | undefined {
  if (albums[0].title === "The Wind and The Star Traveler") {
    return 1150;
  } else if (albums[0].title === "Out of Control") {
    return 301;
  } else if (albums[0].title === "Loading...") {
    return 16;
  }
}

function getAprilFoolsSong(albums: Album[]): Song | undefined {
  const id = getAprilFoolsSongId(albums);
  if (id !== undefined) {
    return getSongById(albums, id);
  }
}

function getLBirthdaySongId(albums: Album[]): number | undefined {
  if (albums[0].title === "The Wind and The Star Traveler") {
    return 319;
  } else if (albums[0].title === "Out of Control") {
    return 258;
  } else if (albums[0].title === "Loading...") {
    return 233;
  }
}

function getLBirthdaySong(albums: Album[]): Song | undefined {
  const id = getLBirthdaySongId(albums);
  if (id !== undefined) {
    return getSongById(albums, id);
  }
}

function getTodaysSong(albums: Album[]): Song {
  if (today.getMonth() === 3 && today.getDate() === 1) {
    const song = getAprilFoolsSong(albums);
    if (song) {
      return song;
    }
  } else if (today.getMonth() === 3 && today.getDate() === 17) {
    const song = getLBirthdaySong(albums);
    if (song) {
      return song;
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
    case "zenlessZoneZero":
      return "https://zenless-zone-zero.fandom.com/wiki/";
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

function updateCalendar(
  calendar: { [key: string]: number[] },
  won: boolean,
  guessAmount?: number
) {
  const today = new Date();
  const year = today.getFullYear();
  const dayOfYear = getDayOfYear(today) - 1;

  if (guessAmount !== undefined) {
    calendar[year][dayOfYear] = guessAmount;
  }

  if (won) {
    calendar[year][dayOfYear] |= 0b1000;
  }

  return calendar;
}

export {
  getTodaysSong,
  getYouTubeThumbnail,
  getStarts,
  getGameBaseWiki,
  getSimplePlayerState,
  contextToList,
  updateCalendar,
};
