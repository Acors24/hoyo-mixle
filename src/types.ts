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
  fandomUrl: string;
};

type Game = "genshinImpact";

export type LocalStorage = {
  gameData: {
    [K in Game]: {
      validForSongs: number;
      daily: {
        day: string;
        guesses: number[];
        streak: number;
        highestStreak: number;
      };
      endless: {
        guesses: number[];
        streak: number;
        highestStreak: number;
      };
    };
  };
  config: {
    volume: number;
    howToPlaySeen: boolean;
  };
};
