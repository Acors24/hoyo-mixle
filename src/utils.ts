import random, { Random } from "random";
import albums from "./assets/albums.json";
import { Song } from "./types";

const today = new Date();

function getTodaysGuesses(): number[] {
  const storedData = localStorage.getItem("data");
  if (!storedData) {
    return [];
  }

  const storedGuesses = JSON.parse(storedData) as Record<string, number[]>;
  const storedGuessesToday = storedGuesses[today.toDateString()];
  if (storedGuessesToday) {
    return storedGuessesToday;
  }

  return [];
}

function saveTodaysGuesses(guesses: number[]) {
  const data: Record<string, number[]> = {};
  data[new Date().toDateString()] = guesses;
  localStorage.setItem("data", JSON.stringify(data));
}

function getTodaysSong(): Song {
  return new Random(today.toDateString()).choice(
    albums.flatMap((album) => album.songs)
  )!;
}

function handleStreakChange(gameWon: boolean, endless: boolean) {
  const keyName = endless ? "endlessStreak" : "streak";
  const currentStreak = Number(localStorage.getItem(keyName) ?? 0);

  const newStreak = gameWon ? currentStreak + 1 : 0;
  localStorage.setItem(keyName, newStreak.toString());
}

function getStreak(endless: boolean): number {
  const keyName = endless ? "endlessStreak" : "streak";
  return Number(localStorage.getItem(keyName) ?? 0);
}

function getYouTubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

function getVolume(): number {
  return Number(localStorage.getItem("volume") ?? 50);
}

function saveVolume(volume: number) {
  localStorage.setItem("volume", volume.toString());
}

function getStarts(duration: number, endlessMode: boolean): number[] {
  const rng = endlessMode ? random : new Random(today.toDateString());
  const uniform = rng.uniformInt(0, duration - 10);
  return Array(3).fill(0).map(uniform);
}

function howToPlaySeen(): boolean {
  return Boolean(localStorage.getItem("howToPlaySeen") ?? false);
}

function setHowToPlaySeen() {
  localStorage.setItem("howToPlaySeen", "true");
}

export {
  getTodaysGuesses,
  saveTodaysGuesses,
  getTodaysSong,
  handleStreakChange,
  getStreak,
  getYouTubeThumbnail,
  getStarts,
  getVolume,
  saveVolume,
  howToPlaySeen,
  setHowToPlaySeen,
};
