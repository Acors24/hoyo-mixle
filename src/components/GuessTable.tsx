import { FiChevronRight } from "react-icons/fi";
import { useAlbums } from "../AlbumsContext";
import { Game, Song } from "../types";
import { Link } from "@tanstack/react-router";

type SongWithAlbum = Song & { album: string };

type Guess = Pick<SongWithAlbum, "title" | "album" | "type" | "region">;
type CheckedGuess = { [K in keyof Guess]: boolean };

export default function GuessTable({
  chosenSong,
  guesses,
  rowAmount,
  game,
  className,
}: {
  chosenSong: Song;
  guesses: Song[];
  rowAmount: number;
  game: Game;
  className?: string;
}) {
  const albums = useAlbums();
  const chosenAlbum = albums.find((album) =>
    album.songs.some((song) => song === chosenSong)
  )!;

  const checkGuess = (guessedSong: Song): CheckedGuess => {
    const guessedAlbum = albums.find((album) =>
      album.songs.some((song) => song === guessedSong)
    )!;
    return {
      title: chosenSong.title === guessedSong.title,
      album: chosenAlbum.title === guessedAlbum.title,
      type: chosenSong.type === guessedSong.type,
      region: chosenSong.region === guessedSong.region,
    };
  };

  return (
    <table id="guess-table" className={className ?? ""}>
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
          .map((guessedSong, index) => {
            if (guessedSong === null) {
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
              album.songs.some((song) => song === guessedSong)
            )!;
            const guessedSongWithAlbum = {
              ...guessedSong,
              album: guessedAlbum.title,
            };

            const results = checkGuess(guessedSong);
            return (
              <tr key={index}>
                <td data-correct={results.title}>
                  {guessedSongWithAlbum.title}
                </td>
                <td data-correct={results.album}>
                  {guessedSongWithAlbum.album}
                </td>
                <td data-correct={results.type}>{guessedSongWithAlbum.type}</td>
                <td data-correct={results.region}>
                  {guessedSongWithAlbum.region}
                </td>
                <td
                  data-correct={Object.values(results).every(
                    (result) => result
                  )}
                >
                  {/* <div className="buttons">
                    <YouTubeButton youtubeId={guessedSong.youtubeId} />
                    <SpotifyButton spotifyId={guessedSong.spotifyId} />
                    <FandomButton
                      fandomId={guessedSong.fandomUrl}
                      game={game}
                    />
                  </div> */}
                  <Link
                    to="/index"
                    search={{ game, id: guessedSongWithAlbum.id }}
                  >
                    <FiChevronRight />
                  </Link>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
