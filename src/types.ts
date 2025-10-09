export type Album = {
  title: string;
  songs: Song[];
};

export type Song = {
  id: number;
  title: string;
  playedAt: (string | string[])[];
  type: string;
  region: string;
  youtubeId: string;
  spotifyId: string;
  fandomUrl?: string;
  context?: string;
};

export type Game = "genshinImpact" | "honkaiStarRail" | "zenlessZoneZero";

export type Mode = "daily" | "endless";

export type LocalStorage = {
  gameData: {
    [K in Game]: {
      validForSongs: number;
      calendar: {
        [key: string]: number[];
      };
      daily: {
        day: string;
        guesses: number[];
        streak: number;
        highestStreak: number;
      };
      endless: {
        songId: number | null;
        guesses: number[];
        streak: number;
        highestStreak: number;
      };
    };
  };
  config: {
    volume: number;
    howToPlaySeen: boolean;
    lastChangelogSeen: string;
  };
};

export type StorageAction =
  | {
      type: "SET_HOW_TO_PLAY_SEEN";
      payload: boolean;
    }
  | {
      type: "SET_VOLUME";
      payload: number;
    }
  | {
      type: "SET_LAST_CHANGELOG_SEEN";
      payload: string;
    }
  | {
      type: "SET_GUESSES";
      payload: {
        game: Game;
        guesses: number[];
        validForSongs: number;
      } & (
        | {
            mode: "daily";
          }
        | {
            mode: "endless";
            songId: number;
          }
      );
    }
  | {
      type: "LOCK_ENDLESS_SONG";
      payload: {
        game: Game;
        songId: number;
      };
    }
  | {
      type: "INCREMENT_STREAK";
      payload: {
        game: Game;
        mode: Mode;
      };
    }
  | {
      type: "RESET_STREAK";
      payload: {
        game: Game;
        mode: Mode;
      };
    }
  | {
      type: "SET_STATE";
      payload: LocalStorage;
    };

export type StorageContextType = {
  state: LocalStorage;
  dispatch: React.Dispatch<StorageAction>;
};
