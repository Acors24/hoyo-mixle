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
