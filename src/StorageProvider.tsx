import { useEffect, useReducer } from "react";
import { StorageReducer } from "./StorageReducer";
import { StorageContext } from "./StorageContext";
import { Game, LocalStorage } from "./types";

import { getToday, getTodayDateString } from "./utils";

// const allAlbums: {
//   [k in Game]: Album[];
// } = {
//   genshinImpact: genshinImpactAlbums,
//   honkaiStarRail: honkaiStarRailAlbums,
//   zenlessZoneZero: zenlessZoneZeroAlbums,
// };

const getDefaultGameState = () => ({
  validForSongs: 0,
  calendar: {} as Record<string, number[]>,
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
});

const initialState: LocalStorage = {
  gameData: {
    genshinImpact: getDefaultGameState(),
    honkaiStarRail: getDefaultGameState(),
    zenlessZoneZero: getDefaultGameState(),
  },
  config: {
    volume: 50,
    howToPlaySeen: false,
    lastChangelogSeen: "",
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
    const today = getTodayDateString();
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
  const today = getTodayDateString();
  Object.values(state.gameData).forEach((data) => {
    if (data.daily.day !== today) {
      data.daily.day = today;
      data.daily.guesses = [];
    }
  });
}

// function validateSongAmounts(state: LocalStorage) {
//   for (const game in state.gameData) {
//     const data = state.gameData[game as Game];
//     const gameAlbums = allAlbums[game as Game];
//     if (gameAlbums === undefined) {
//       continue;
//     }

//     const totalSongs = gameAlbums.reduce(
//       (acc, album) => acc + album.songs.length,
//       0
//     );
//     if (data.validForSongs !== totalSongs) {
//       data.validForSongs = totalSongs;
//       data.daily.day = getTodayDateString();
//       data.daily.guesses = [];
//       data.endless.guesses = [];
//       data.endless.songId = null;
//     }
//   }
// }

const storageKey = "hoyo-mixle";

export default function StorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(StorageReducer, initialState, () => {
    const saved = localStorage.getItem(storageKey);
    const playerData: LocalStorage = saved ? JSON.parse(saved) : initialState;

    // Migrate old data
    migrateVolume(playerData);
    migrateHowToPlaySeen(playerData);
    migrateDailyGuesses(playerData);
    migrateDailyStreak(playerData);
    migrateEndlessStreak(playerData);

    // Initialize missing data
    playerData.gameData.honkaiStarRail ??= initialState.gameData.honkaiStarRail;
    playerData.gameData.zenlessZoneZero ??=
      initialState.gameData.zenlessZoneZero;
    playerData.config.lastChangelogSeen ??=
      initialState.config.lastChangelogSeen;

    // Initialize calendar data or migrate from old storage
    const currentYear = getToday().getUTCFullYear();
    for (const game in playerData.gameData) {
      playerData.gameData[game as Game].calendar ??= {};

      const oldCalendarStorage = localStorage.getItem("hoyo-mixle-calendar");
      if (oldCalendarStorage !== null) {
        const oldCalendar = JSON.parse(oldCalendarStorage) as Record<
          string,
          Record<string, number[]>
        >;
        const gameOldCalendar = oldCalendar[game as Game];

        if (gameOldCalendar === undefined) {
          continue;
        }

        playerData.gameData[game as Game].calendar = { ...gameOldCalendar };
      } else {
        playerData.gameData[game as Game].calendar[currentYear] ??=
          Array(366).fill(0);
      }
    }
    localStorage.removeItem("hoyo-mixle-calendar");

    // Migrate from old HSR key to the new one
    const gameData = playerData.gameData as unknown as Record<string, unknown>;
    if ("starRail" in gameData) {
      gameData.honkaiStarRail = gameData.starRail;
      delete gameData.starRail;
    }

    // Check for the new day
    updateDailies(playerData);

    // Relevant when songs were drawn client-side and when IDs would disappear
    // validateSongAmounts(playerData);

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
