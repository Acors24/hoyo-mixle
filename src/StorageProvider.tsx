import { useEffect, useReducer } from "react";
import { StorageReducer } from "./StorageReducer";
import { StorageContext } from "./StorageContext";
import { Album, LocalStorage } from "./types";

const initialState: LocalStorage = {
  gameData: {
    genshinImpact: {
      validForSongs: 0,
      daily: {
        day: "",
        guesses: [],
        streak: 0,
        highestStreak: 0,
      },
      endless: {
        songId: null,
        guesses: [],
        streak: 0,
        highestStreak: 0,
      },
    },
  },
  config: {
    volume: 50,
    howToPlaySeen: false,
  },
};

function migrateVolume(state: LocalStorage) {
  const old = localStorage.getItem("volume");
  if (old !== null) {
    state.config.volume = JSON.parse(old) as number;
    localStorage.removeItem("volume");
  }
}

function migrateHowToPlaySeen(state: LocalStorage) {
  const old = localStorage.getItem("howToPlaySeen");
  if (old !== null) {
    state.config.howToPlaySeen = JSON.parse(old) as boolean;
    localStorage.removeItem("howToPlaySeen");
  }
}

function migrateDailyGuesses(state: LocalStorage) {
  const old = localStorage.getItem("data");
  if (old !== null) {
    const guesses = JSON.parse(old) as Record<string, number[]>;
    const today = new Date().toDateString();
    state.gameData.genshinImpact.daily.day = today;
    state.gameData.genshinImpact.daily.guesses = guesses[today] ?? [];
    localStorage.removeItem("data");
  }
}

function migrateDailyStreak(state: LocalStorage) {
  const old = localStorage.getItem("streak");
  if (old !== null) {
    state.gameData.genshinImpact.daily.streak = JSON.parse(old) as number;
    localStorage.removeItem("streak");
  }
}

function migrateEndlessStreak(state: LocalStorage) {
  const old = localStorage.getItem("endlessStreak");
  if (old !== null) {
    state.gameData.genshinImpact.endless.streak = JSON.parse(old) as number;
    localStorage.removeItem("endlessStreak");
  }
}

function updateDailies(state: LocalStorage) {
  const today = new Date().toDateString();
  Object.values(state.gameData).forEach((data) => {
    if (data.daily.day !== today) {
      data.daily.day = today;
      data.daily.guesses = [];
    }
  });
}

function validateSongAmount(state: LocalStorage, albums: Album[]) {
  const totalSongs = albums.reduce((acc, album) => acc + album.songs.length, 0);
  const validForSongs = state.gameData.genshinImpact.validForSongs;

  if (validForSongs !== totalSongs) {
    state.gameData.genshinImpact.validForSongs = totalSongs;
    state.gameData.genshinImpact.daily.day = "";
    state.gameData.genshinImpact.daily.guesses = [];
    state.gameData.genshinImpact.endless.guesses = [];
    state.gameData.genshinImpact.endless.songId = null;
  }
}

const storageKey = "hoyo-mixle";

export default function StorageProvider({
  // albums,
  children,
}: {
  // albums: Album[];
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(StorageReducer, initialState, () => {
    const saved = localStorage.getItem(storageKey);
    const playerData = saved ? JSON.parse(saved) : initialState;

    migrateVolume(playerData);
    migrateHowToPlaySeen(playerData);
    migrateDailyGuesses(playerData);
    migrateDailyStreak(playerData);
    migrateEndlessStreak(playerData);

    updateDailies(playerData);
    // validateSongAmount(playerData, albums);

    return playerData;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  return (
    <StorageContext.Provider value={{ state, dispatch }}>
      {children}
    </StorageContext.Provider>
  );
}
