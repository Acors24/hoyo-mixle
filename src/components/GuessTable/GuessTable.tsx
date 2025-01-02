import { useAlbums } from "../../AlbumsContext";
import { Game, Song } from "../../types";
import { FandomButton, SpotifyButton, YouTubeButton } from "../SongCard";
import classes from "./style.module.css";

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

  return (
    <table className={`${classes.GuessTable} ${className ?? ""}`}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Album</th>
          <th>Type</th>
          <th>Region</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {guesses
          .concat(Array(rowAmount - guesses.length).fill(null))
          .map((guessedSongId, index) => {
            if (guessedSongId === null) {
              return (
                <tr key={index}>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
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
              <tr key={index}>
                <td className={results.title ? classes.correct : classes.wrong}>
                  {guessedSongWithAlbum.title}
                </td>
                <td className={results.album ? classes.correct : classes.wrong}>
                  {guessedSongWithAlbum.album}
                </td>
                <td className={results.type ? classes.correct : classes.wrong}>
                  {guessedSongWithAlbum.type}
                </td>
                <td
                  className={results.region ? classes.correct : classes.wrong}
                >
                  {guessedSongWithAlbum.region}
                </td>
                <td
                  className={
                    Object.values(results).every((result) => result)
                      ? classes.correct
                      : classes.wrong
                  }
                >
                  <div className={classes.buttons}>
                    <YouTubeButton youtubeId={guessedSong.youtubeId} />
                    <SpotifyButton spotifyId={guessedSong.spotifyId} />
                    <FandomButton
                      fandomId={guessedSong.fandomUrl}
                      game={game}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
