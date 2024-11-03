import { useState } from "react";
import albums from "../assets/albums.json";
import background from "../assets/night.png";
import GuessIndicatorBar from "./GuessIndicatorBar";
import { Song } from "../types";
import GuessTable from "./GuessTable";
import SamplePlayer from "./SamplePlayer";
import SongFilter from "./SongFilter";
import random from "random";
import SongCard from "./SongCard";
import {
  getStreak,
  getTodaysGuesses,
  getTodaysSong,
  getYouTubeThumbnail,
  handleStreakChange,
  saveTodaysGuesses,
} from "../utils";

export default function Game() {
  const getRandomSong: () => Song = () => {
    return random.choice(albums.flatMap((album) => album.songs))!;
  };

  const [chosenSong, setChosenSong] = useState<Song>(getTodaysSong);
  const [guesses, setGuesses] = useState<number[]>(getTodaysGuesses);
  const [endlessMode, setEndlessMode] = useState(false);

  const handleEndlessModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndlessMode(e.target.checked);

    if (e.target.checked) {
      setChosenSong(getRandomSong());
      setGuesses([]);
    } else {
      setChosenSong(getTodaysSong());
      setGuesses(getTodaysGuesses());
    }
  };

  const maxAttempts = 5;
  const gameState = (() => {
    if (guesses.includes(chosenSong.id)) {
      return "won";
    } else if (guesses.length >= maxAttempts) {
      return "lost";
    } else {
      return "playing";
    }
  })();

  const takeAGuess = (id: number) => {
    if (gameState !== "playing") {
      return;
    }

    const newGuesses = [...guesses, id];
    setGuesses(newGuesses);

    if (id === chosenSong.id) {
      handleStreakChange(true, endlessMode);
    } else if (guesses.length === maxAttempts - 1) {
      handleStreakChange(false, endlessMode);
    }

    if (endlessMode) {
      return;
    }

    saveTodaysGuesses(newGuesses);
  };

  const albumImage = getYouTubeThumbnail(chosenSong.youtubeId);

  // // TODO: Remove this eventually
  // const restartGameButton = (
  //   <button
  //     onClick={() => {
  //       setGuesses([]);

  //       const data: Record<string, number[]> = {};
  //       data[new Date().toDateString()] = [];
  //       localStorage.setItem("data", JSON.stringify(data));
  //     }}
  //     className="rounded-full bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 active:bg-slate-900 active:bg-opacity-50 duration-100 px-4 py-2"
  //   >
  //     Restart
  //   </button>
  // );

  const stats = (
    <div className="flex items-center justify-center gap-2 select-none flex-wrap">
      <GuessIndicatorBar
        chosenSongId={chosenSong.id}
        guesses={guesses}
        maxGuesses={maxAttempts}
      />
      <div className="rounded-full bg-slate-800 bg-opacity-50 px-4 py-2">
        Streak: {getStreak(endlessMode)}
      </div>
      <label className="rounded-full bg-slate-800 bg-opacity-50 px-4 py-2">
        <input
          type="checkbox"
          className="mr-2"
          checked={endlessMode}
          onChange={handleEndlessModeChange}
        />
        Endless mode
      </label>
      {gameState !== "playing" && endlessMode && (
        <button
          className="rounded-full bg-slate-800 bg-opacity-50 px-4 py-2"
          onClick={() => {
            setChosenSong(getRandomSong());
            setGuesses([]);
          }}
        >
          Next
        </button>
      )}
      {/* {!endlessMode && gameState !== "playing" && restartGameButton} */}
    </div>
  );

  return (
    <>
      <div className="absolute -z-10">
        <img
          src={background}
          alt="background"
          className={`fixed w-full h-full object-cover duration-1000 ${
            gameState !== "playing" ? "opacity-0" : ""
          }`}
        />
        <img
          src={albumImage}
          alt="Album image"
          className={`fixed w-full h-full object-cover duration-1000 blur-3xl ${
            gameState === "playing" ? "opacity-0" : ""
          }`}
        />
      </div>
      <div className="overflow-auto">
        <div className="max-w-[1200px] mx-auto p-2">
          {gameState === "playing" ? (
            <div className="flex flex-col sm:flex-row *:flex-1 gap-2">
              <div className="flex flex-col items-center justify-center">
                <SamplePlayer song={chosenSong} endlessMode={endlessMode} />
                {stats}
              </div>
              <SongFilter
                albums={albums}
                guessCount={guesses.length}
                onSelect={takeAGuess}
                className="max-h-[400px] sm:max-h-[600px]"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 flex-1">
              <SongCard
                album={
                  albums.find((album) => album.songs.includes(chosenSong))!
                }
                song={chosenSong}
              />
              {stats}
            </div>
          )}
          <GuessTable
            chosenSongId={chosenSong.id}
            guesses={guesses}
            rowAmount={maxAttempts}
            className="mt-2"
          />
        </div>
      </div>
    </>
  );
}
