import { useState } from "react";
import albums from "../assets/albums.json";
import background from "../assets/night.png";
import GuessIndicatorBar from "./GuessIndicatorBar";
import { Game as hoyoGame, Song } from "../types";
import GuessTable from "./GuessTable";
import SamplePlayer from "./SamplePlayer";
import SongFilter from "./SongFilter";
import random from "random";
import SongCard from "./SongCard";
import { getTodaysSong, getYouTubeThumbnail } from "../utils";
import { useStorage } from "../StorageContext";

export default function Game() {
  const { state, dispatch } = useStorage();
  const currentGame: hoyoGame = "genshinImpact";

  const getRandomSong: () => Song = () => {
    return random.choice(albums.flatMap((album) => album.songs))!;
  };

  const [chosenSong, setChosenSong] = useState<Song>(getTodaysSong);
  const [guesses, setGuesses] = useState<number[]>(
    state.gameData[currentGame].daily.guesses
  );
  const [endlessMode, setEndlessMode] = useState(false);

  const handleEndlessModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndlessMode(e.target.checked);

    if (e.target.checked) {
      const alreadyPlaying = state.gameData[currentGame].endless.songId;
      const song =
        alreadyPlaying !== null
          ? albums
              .flatMap((album) => album.songs)
              .find((song) => song.id === alreadyPlaying)!
          : getRandomSong();
      if (alreadyPlaying === null) {
        dispatch({
          type: "LOCK_ENDLESS_SONG",
          payload: { game: currentGame, songId: song.id },
        });
      }
      setChosenSong(song);
      setGuesses(state.gameData[currentGame].endless.guesses);
    } else {
      setChosenSong(getTodaysSong());
      setGuesses(state.gameData[currentGame].daily.guesses);
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

    dispatch({
      type: "SET_GUESSES",
      payload: {
        game: currentGame,
        guesses: newGuesses,
        mode: endlessMode ? "endless" : "daily",
        songId: chosenSong.id,
        validForSongs: albums.reduce(
          (acc, album) => acc + album.songs.length,
          0
        ),
      },
    });

    if (id === chosenSong.id) {
      dispatch({
        type: "INCREMENT_STREAK",
        payload: {
          game: currentGame,
          mode: endlessMode ? "endless" : "daily",
        },
      });
    } else if (newGuesses.length >= maxAttempts) {
      dispatch({
        type: "RESET_STREAK",
        payload: {
          game: currentGame,
          mode: endlessMode ? "endless" : "daily",
        },
      });
    }
  };

  const albumImage = getYouTubeThumbnail(chosenSong.youtubeId);

  const stats = (
    <div className="flex items-center justify-center gap-2 select-none flex-wrap">
      <GuessIndicatorBar
        chosenSongId={chosenSong.id}
        guesses={guesses}
        maxGuesses={maxAttempts}
      />
      <div className="rounded-full bg-slate-800 bg-opacity-50 px-4 py-2">
        Streak:{" "}
        {state.gameData[currentGame][endlessMode ? "endless" : "daily"].streak}{" "}
        | Highest streak:{" "}
        {
          state.gameData[currentGame][endlessMode ? "endless" : "daily"]
            .highestStreak
        }
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
            const newSong = getRandomSong();
            dispatch({
              type: "SET_GUESSES",
              payload: {
                game: currentGame,
                mode: "endless",
                guesses: [],
                songId: newSong.id,
                validForSongs: albums.reduce(
                  (acc, album) => acc + album.songs.length,
                  0
                ),
              },
            });
            setChosenSong(newSong);
            setGuesses([]);
          }}
        >
          Next
        </button>
      )}
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
                chosenSong={chosenSong}
                guesses={guesses}
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
