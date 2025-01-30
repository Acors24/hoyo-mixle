import { useState } from "react";
import GuessIndicatorBar from "./GuessIndicatorBar/GuessIndicatorBar";
import { Album, Game as hoyoGame, Song } from "../types";
import GuessTable from "./GuessTable/GuessTable";
import SamplePlayer from "./SamplePlayer";
import SongFilter from "./SongFilter/SongFilter";
import random from "random";
import SongCard from "./SongCard";
import { getTodaysSong, getYouTubeThumbnail } from "../utils";
import { useStorage } from "../StorageContext";
import Background from "./Background";
import { useAlbums } from "../AlbumsContext";
import * as Switch from "@radix-ui/react-switch";

function idsToSongs(ids: number[], albums: Album[]): Song[] {
  return ids.map(
    (id) =>
      albums.flatMap((album) => album.songs).find((song) => song.id === id)!
  );
}

export default function Game({ currentGame }: { currentGame: hoyoGame }) {
  const albums = useAlbums();

  const { state, dispatch } = useStorage();

  const getRandomSong: () => Song = () => {
    return random.choice(albums.flatMap((album) => album.songs))!;
  };

  const [chosenSong, setChosenSong] = useState<Song>(getTodaysSong(albums));
  const [guesses, setGuesses] = useState<Song[]>(
    idsToSongs(state.gameData[currentGame].daily.guesses, albums)
  );
  const [endlessMode, setEndlessMode] = useState(false);
  const [endlessToggleDisabled, setEndlessToggleDisabled] = useState(false);

  const [dailyBg] = useState(getYouTubeThumbnail(chosenSong.youtubeId));
  const [endlessBg, setEndlessBg] = useState(
    getYouTubeThumbnail(chosenSong.youtubeId)
  );

  const handleEndlessModeChange = (checked: boolean) => {
    setEndlessMode(checked);

    setEndlessToggleDisabled(true);
    setTimeout(() => {
      setEndlessToggleDisabled(false);
    }, 2000);

    if (checked) {
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
      setGuesses(
        idsToSongs(state.gameData[currentGame].endless.guesses, albums)
      );
      setEndlessBg(getYouTubeThumbnail(song.youtubeId));
    } else {
      setChosenSong(getTodaysSong(albums));
      setGuesses(idsToSongs(state.gameData[currentGame].daily.guesses, albums));
    }
  };

  const maxAttempts = 5;
  const gameState = (() => {
    if (guesses.includes(chosenSong)) {
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

    const newGuesses = [...guesses, idsToSongs([id], albums)[0]];
    setGuesses(newGuesses);

    dispatch({
      type: "SET_GUESSES",
      payload: {
        game: currentGame,
        guesses: newGuesses.map((song) => song.id),
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

  const stats = (
    <div className="flex items-center justify-center gap-2 select-none flex-wrap">
      <GuessIndicatorBar
        chosenSong={chosenSong}
        guesses={guesses}
        maxGuesses={maxAttempts}
      />
      <div className="flex gap-1 *:bg-slate-800 *:bg-opacity-50 *:px-4 *:py-2">
        <span className="rounded-l-full">
          Streak:{" "}
          {
            state.gameData[currentGame][endlessMode ? "endless" : "daily"]
              .streak
          }
        </span>
        <span className="rounded-r-full">
          Highest:{" "}
          {
            state.gameData[currentGame][endlessMode ? "endless" : "daily"]
              .highestStreak
          }
        </span>
      </div>
      <label className="rounded-full bg-slate-800 bg-opacity-50 px-4 py-2 flex items-center gap-2">
        Endless mode
        <Switch.Root
          checked={endlessMode}
          onCheckedChange={handleEndlessModeChange}
          disabled={endlessToggleDisabled}
          className="SwitchRoot"
        >
          <Switch.Thumb className="SwitchThumb" />
        </Switch.Root>
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
            setEndlessBg(getYouTubeThumbnail(newSong.youtubeId));
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
        <Background
          game={currentGame}
          visible={
            gameState === "playing"
              ? "playing"
              : endlessMode
                ? "endless"
                : "daily"
          }
          dailySrc={dailyBg}
          endlessSrc={endlessBg}
        />
      </div>
      <div
        className="overflow-auto"
        style={{ scrollbarGutter: "stable both-sides" }}
      >
        <div className="max-w-[1200px] mx-auto p-2">
          <div className="flex flex-col sm:flex-row sm:*:flex-1 gap-2">
            <div className="flex flex-col items-center justify-center">
              {gameState !== "playing" && (
                <SongCard
                  album={
                    albums.find((album) => album.songs.includes(chosenSong))!
                  }
                  song={chosenSong}
                  game={currentGame}
                />
              )}
              <SamplePlayer
                song={chosenSong}
                endlessMode={endlessMode}
                gameState={gameState}
              />
              {stats}
            </div>
            {gameState === "playing" && (
              <SongFilter
                chosenSong={chosenSong}
                guesses={guesses}
                onSelect={takeAGuess}
                className="h-[400px] sm:h-[600px]"
              />
            )}
          </div>
          <div className="overflow-auto mt-2">
            <GuessTable
              chosenSong={chosenSong}
              guesses={guesses}
              rowAmount={maxAttempts}
              game={currentGame}
            />
          </div>
        </div>
      </div>
    </>
  );
}
