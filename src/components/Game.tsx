import { useState } from "react";
import songPools from "../assets/songPools.json";
import background from "../assets/night.png";
import GuessIndicatorBar from "./GuessIndicatorBar";
import { Song, SongPool } from "../types";
import GuessTable from "./GuessTable";
import SamplePlayer from "./SamplePlayer";
import SongPoolFilter from "./SongPoolFilter";
import { Random } from "random";
import SongCard from "./SongCard";

export default function Game() {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const rng = new Random(today.toDateString());

  const [chosenPool] = useState<SongPool>(rng.choice(songPools)!);
  const [chosenSong] = useState<Song>(rng.choice(chosenPool.songs)!);

  const [guesses, setGuesses] = useState<number[]>(() => {
    localStorage.removeItem(yesterday.toDateString());
    const storedGuesses = localStorage.getItem(today.toDateString());
    return storedGuesses ? JSON.parse(storedGuesses) : [];
  });

  const maxAttempts = 5;
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">(() => {
    if (guesses.includes(chosenPool.id)) {
      return "won";
    } else if (guesses.length >= maxAttempts) {
      return "lost";
    } else {
      return "playing";
    }
  });

  const takeAGuess = (id: number) => {
    if (gameState !== "playing") {
      return;
    }

    if (id === chosenPool.id) {
      setGameState("won");
      const currentStreak = Number(localStorage.getItem("streak") ?? 0);
      const newStreak = currentStreak + 1;
      localStorage.setItem("streak", newStreak.toString());
    } else if (guesses.length === maxAttempts - 1) {
      setGameState("lost");
      localStorage.setItem("streak", "0");
    }

    setGuesses([...guesses, id]);
    localStorage.setItem(
      today.toDateString(),
      JSON.stringify([...guesses, id])
    );
  };

  const albumImage = `https://img.youtube.com/vi/${chosenSong.youtubeId}/maxresdefault.jpg`;

  // TODO: Remove this eventually
  const restartGameButton = (
    <button
      onClick={() => {
        setGameState("playing");
        setGuesses([]);
        localStorage.removeItem(today.toDateString());
      }}
      className="rounded-full bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 active:bg-slate-900 active:bg-opacity-50 duration-100 px-4 py-2"
    >
      Restart
    </button>
  );

  const currentStreak = localStorage.getItem("streak") ?? 0;

  const stats = (
    <div className="flex items-center gap-2 select-none">
      <GuessIndicatorBar
        chosenSongPoolId={chosenPool.id}
        guesses={guesses}
        maxGuesses={maxAttempts}
      />
      <div className="rounded-full bg-slate-800 bg-opacity-50 px-4 py-2">
        Streak: {currentStreak}
      </div>
      {restartGameButton}
    </div>
  );

  return (
    <>
      <img
        src={background}
        alt="background"
        className={`fixed w-full h-full object-cover duration-1000 -z-10 ${
          gameState !== "playing" ? "opacity-0" : ""
        }`}
      />
      <img
        src={albumImage}
        alt="Album image"
        className={`fixed w-full h-full object-cover duration-1000 blur-3xl -z-10 ${
          gameState === "playing" ? "opacity-0" : ""
        }`}
      />
      <div className="w-full max-w-[1200px] h-full max-h-[900px] flex flex-col gap-2 px-10 py-2">
        {gameState === "playing" ? (
          <div className="flex-1 flex flex-col sm:flex-row h-0 sm:*:flex-1 gap-2">
            <div className="flex flex-col items-center justify-center">
              <SamplePlayer song={chosenSong} />
              {stats}
            </div>
            <SongPoolFilter pools={songPools} onSelect={takeAGuess} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 flex-1">
            <SongCard song={chosenSong} songPool={chosenPool} />
            {stats}
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          <GuessTable
            chosenSongPoolId={chosenPool.id}
            guesses={guesses}
            rowAmount={maxAttempts}
          />
        </div>
      </div>
    </>
  );
}
