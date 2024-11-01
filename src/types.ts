export type Album = {
  title: string;
  songs: Song[];
};

export type Song = {
  id: number;
  title: string;
  playedAt: string[];
  type: string;
  region: string;
  version: number;
  youtubeId: string;
  spotifyId: string;
  fandomUrl: string;
};
