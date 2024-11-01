import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { SongPool } from "../types";
import { useRef } from "react";

import songPools from "../assets/songPools.json";

function getLabel(playedAt: SongPool["playedAt"]) {
  return playedAt.main ?? playedAt.sub!.join("; ");
}

function playedAtToTdContent(playedAt: SongPool["playedAt"]) {
  return (
    playedAt.main ?? playedAt.sub!.map((sub, index) => <p key={index}>{sub}</p>)
  );
}

export default function GuessTable({
  chosenSongPoolId,
  guesses,
  rowAmount,
  className,
}: {
  chosenSongPoolId: number;
  guesses: number[];
  rowAmount: number;
  className?: string;
}) {
  const chosenSong = useRef(
    songPools.find((songPool) => songPool.id === chosenSongPoolId)!
  );

  type Guess = Pick<SongPool, "playedAt" | "type" | "region" | "version">;
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

  const checkGuess = (guessedSongPoolId: number): CheckedGuess => {
    const guessedSong = songPools.find(
      (songPool) => songPool.id === guessedSongPoolId
    )!;
    return {
      playedAt: compare(
        getLabel(chosenSong.current.playedAt),
        getLabel(guessedSong.playedAt)
      ),
      type: compare(chosenSong.current.type, guessedSong.type),
      region: compare(chosenSong.current.region, guessedSong.region),
      version: compare(chosenSong.current.version, guessedSong.version),
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
          <Th></Th>
          <Th>Type</Th>
          <Th>Region</Th>
          <Th>Version</Th>
        </tr>
      </thead>
      <tbody>
        {guesses
          .concat(Array(rowAmount - guesses.length).fill(null))
          .map((guessedSongPoolId, index) => {
            if (guessedSongPoolId === null) {
              return (
                <tr key={index} className="odd:bg-black odd:bg-opacity-10">
                  <Td>&nbsp;</Td>
                  <Td>&nbsp;</Td>
                  <Td>&nbsp;</Td>
                  <Td>&nbsp;</Td>
                </tr>
              );
            }

            const guessedSongPool = songPools.find(
              (songPool) => songPool.id === guessedSongPoolId
            )!;

            const results = checkGuess(guessedSongPoolId);
            return (
              <tr key={index} className="odd:bg-black odd:bg-opacity-10">
                {Object.entries(results).map(([category, result], index) => {
                  const value = guessedSongPool[category as keyof Guess];

                  return (
                    <Td key={index} result={result}>
                      {typeof value === "number"
                        ? value.toFixed(1)
                        : typeof value === "string"
                        ? value
                        : playedAtToTdContent(value)}
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
