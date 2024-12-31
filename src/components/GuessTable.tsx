import { useAlbums } from "../AlbumsContext";
import { Game, Song } from "../types";
import { FandomButton, SpotifyButton, YouTubeButton } from "./SongCard";

type SongWithAlbum = Song & { album: string };

type Guess = Pick<SongWithAlbum, "title" | "album" | "type" | "region">;
type CheckedGuess = { [K in keyof Guess]: boolean };

export default function GuessTable({
  chosenSongId,
  guesses,
  rowAmount,
  game,
  className,
}: {
  chosenSongId: number;
  guesses: number[];
  rowAmount: number;
  game: Game;
  className?: string;
}) {
  const albums = useAlbums();
  const [chosenAlbum, chosenSong] = (() => {
    const chosenSong = albums
      .flatMap((album) => album.songs)
      .find((song) => song.id === chosenSongId)!;
    const chosenAlbum = albums.find((album) =>
      album.songs.some((song) => song.id === chosenSongId)
    )!;
    return [chosenAlbum, chosenSong];
  })();

  const checkGuess = (guessedSongPoolId: number): CheckedGuess => {
    const guessedAlbum = albums.find((album) =>
      album.songs.some((song) => song.id === guessedSongPoolId)
    )!;
    const guessedSong = guessedAlbum.songs.find(
      (song) => song.id === guessedSongPoolId
    )!;
    return {
      title: chosenSong.title === guessedSong.title,
      album: chosenAlbum.title === guessedAlbum.title,
      type: chosenSong.type === guessedSong.type,
      region: chosenSong.region === guessedSong.region,
    };
  };

  const Th = ({ children }: { children?: React.ReactNode }) => (
    <th className="px-2 py-2">{children}</th>
  );

  const Td = ({
    children,
    result,
    className,
  }: {
    children?: React.ReactNode;
    result?: boolean;
    className?: string;
  }) => {
    let bgClassName = "";
    if (result !== undefined) {
      bgClassName = result ? "bg-emerald-700" : "bg-rose-700";
    }
    return (
      <td
        className={`px-4 py-2 bg-opacity-50 w-auto ${bgClassName} ${className}`}
      >
        {children}
      </td>
    );
  };

  return (
    <table
      className={`rounded-xl overflow-hidden w-full bg-slate-800 bg-opacity-50 select-none ${
        className ?? ""
      }`}
    >
      <thead>
        <tr>
          <Th>Title</Th>
          <Th>Album</Th>
          <Th>Type</Th>
          <Th>Region</Th>
          <th className="w-0"></th>
        </tr>
      </thead>
      <tbody>
        {guesses
          .concat(Array(rowAmount - guesses.length).fill(null))
          .map((guessedSongId, index) => {
            if (guessedSongId === null) {
              return (
                <tr key={index} className="odd:bg-black odd:bg-opacity-10">
                  <Td>&nbsp;</Td>
                  <Td>&nbsp;</Td>
                  <Td>&nbsp;</Td>
                  <Td>&nbsp;</Td>
                  <Td>&nbsp;</Td>
                </tr>
              );
            }

            const guessedAlbum = albums.find((album) =>
              album.songs.some((song) => song.id === guessedSongId)
            )!;
            const guessedSong = guessedAlbum.songs.find(
              (song) => song.id === guessedSongId
            )!;
            const guessedSongWithAlbum = {
              ...guessedSong,
              album: guessedAlbum.title,
            };

            const results = checkGuess(guessedSongId);
            return (
              <tr key={index} className="odd:bg-black odd:bg-opacity-10">
                {Object.entries(results).map(([category, result], index) => {
                  const value = guessedSongWithAlbum[category as keyof Guess];

                  return (
                    <Td key={index} result={result}>
                      {value}
                    </Td>
                  );
                })}
                <Td
                  result={Object.values(results).every((result) => result)}
                  className="flex gap-2"
                >
                  <YouTubeButton youtubeId={guessedSong.youtubeId} />
                  <SpotifyButton spotifyId={guessedSong.spotifyId} />
                  <FandomButton fandomId={guessedSong.fandomUrl} game={game} />
                </Td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
