import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Song } from "../types";

import albums from "../assets/albums.json";

type SongWithAlbum = Song & { album: string };

type Guess = Pick<
  SongWithAlbum,
  "title" | "album" | "type" | "region" | "version"
>;
type ComparisonResult = "correct" | "wrong" | "higher" | "lower";
type CheckedGuess = { [K in keyof Guess]: ComparisonResult };

const compare = (
  expected: string | number,
  actual: string | number
): ComparisonResult => {
  if (expected === actual) {
    return "correct";
  } else if (typeof expected === "number" && typeof actual === "number") {
    return expected > actual ? "higher" : "lower";
  } else {
    return "wrong";
  }
};

export default function GuessTable({
  chosenSongId,
  guesses,
  rowAmount,
  className,
}: {
  chosenSongId: number;
  guesses: number[];
  rowAmount: number;
  className?: string;
}) {
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
      title: compare(chosenSong.title, guessedSong.title),
      album: compare(chosenAlbum.title, guessedAlbum.title),
      type: compare(chosenSong.type, guessedSong.type),
      region: compare(chosenSong.region, guessedSong.region),
      version: compare(chosenSong.version, guessedSong.version),
    };
  };

  const Th = ({ children }: { children?: React.ReactNode }) => (
    <th className="px-2 py-2">{children}</th>
  );

  const Td = ({
    children,
    result,
  }: {
    children?: React.ReactNode;
    result?: ComparisonResult;
  }) => {
    let className = "";
    let icon;
    if (result === "correct") {
      className = "bg-emerald-700";
    } else if (result) {
      className = "bg-rose-700";
      if (result === "higher") {
        icon = <FaArrowUp />;
      } else if (result === "lower") {
        icon = <FaArrowDown />;
      }
    }
    return (
      <td className={`px-4 py-2 bg-opacity-50 w-auto ${className}`}>
        {icon ? (
          <div className="flex items-center justify-between">
            {children}
            {icon}
          </div>
        ) : (
          children
        )}
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
          <Th>Version</Th>
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
                      {typeof value === "number" ? value.toFixed(1) : value}
                    </Td>
                  );
                })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
