export type SongPool = {
  id: number;
  songs: Song[];
  playedAt: {
    main?: string;
    sub?: string[];
  };
  type: string;
  region: string;
  version: number;
};

export type Song = {
  album: string;
  title: string;
  youtubeId: string;
  spotifyId: string;
  fandomUrl: string;
};
