import { useEffect, useState } from "react";
import GuessIndicatorBar from "./GuessIndicatorBar";
import { Album, Game as hoyoGame, Song } from "../types";
import GuessTable from "./GuessTable";
import SamplePlayer from "./SamplePlayer";
import SongFilter from "./SongFilter";
import random from "random";
import SongCard from "./SongCard";
import { getTodaysSong, getYouTubeThumbnail } from "../utils";
import { useStorage } from "../StorageContext";
import Background from "./Background";
import { useAlbums } from "../AlbumsContext";
import * as Switch from "@radix-ui/react-switch";
import { CgSpinner } from "react-icons/cg";
import ResetCountdown from "./ResetCountdown";

function idsToSongs(ids: number[], albums: Album[]): Song[] {
  return ids.map(
    (id) =>
      albums.flatMap((album) => album.songs).find((song) => song.id === id)!
  );
}

export default function Game({ currentGame }: { currentGame: hoyoGame }) {
  const albums = useAlbums();
  const [todaysSong, setTodaysSong] = useState<Song | null>(null);

  const { state, dispatch } = useStorage();

  const getRandomSong: () => Song = () => {
    return random.choice(albums.flatMap((album) => album.songs))!;
  };

  const [chosenSong, setChosenSong] = useState<Song | null>(todaysSong);
  const [guesses, setGuesses] = useState<Song[]>(
    idsToSongs(state.gameData[currentGame].daily.guesses, albums)
  );
  const [endlessMode, setEndlessMode] = useState(false);
  const [endlessToggleDisabled, setEndlessToggleDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      const todaysSong = await getTodaysSong(albums, currentGame);
      setTodaysSong(todaysSong);
      setChosenSong(todaysSong);
    })();
  }, [albums, currentGame]);

  if (todaysSong === null || chosenSong === null) {
    return (
      <>
        <div className="absolute -z-10">
          <Background game={currentGame} visible={"playing"} />
        </div>
        <div
          data-game={currentGame}
          className="flex items-center justify-center"
        >
          <CgSpinner className="animate-spin w-16 h-16" />
        </div>
      </>
    );
  }

  const dailyBg = getYouTubeThumbnail(chosenSong.youtubeId);
  const endlessBg = getYouTubeThumbnail(chosenSong.youtubeId);

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
      // setEndlessBg(getYouTubeThumbnail(song.youtubeId));
    } else {
      setChosenSong(todaysSong);
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
    <div
      id="stats"
      className="flex items-center justify-center gap-x-6 gap-y-4 select-none flex-wrap"
    >
      <GuessIndicatorBar
        chosenSong={chosenSong}
        guesses={guesses}
        maxGuesses={maxAttempts}
      />
      <div id="streaks">
        <span id="streak-label">Streak: </span>
        <span id="streak-value">
          {
            state.gameData[currentGame][endlessMode ? "endless" : "daily"]
              .streak
          }
        </span>
        <span id="highest-streak-label">Highest: </span>
        <span id="highest-streak-value">
          {
            state.gameData[currentGame][endlessMode ? "endless" : "daily"]
              .highestStreak
          }
        </span>
      </div>
      <label id="endless-label">
        Endless mode
        <Switch.Root
          checked={endlessMode}
          onCheckedChange={handleEndlessModeChange}
          disabled={endlessToggleDisabled}
          className="switch-root"
        >
          <Switch.Thumb className="switch-thumb" />
        </Switch.Root>
      </label>
      {gameState !== "playing" && endlessMode && (
        <button
          id="next-button"
          className="button"
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
            // setEndlessBg(getYouTubeThumbnail(newSong.youtubeId));
          }}
        >
          Next
        </button>
      )}
      {gameState !== "playing" && !endlessMode && <ResetCountdown />}
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
        className="overflow-auto select-none"
        style={{ scrollbarGutter: "stable both-sides" }}
        data-game={currentGame}
      >
        <div className="max-w-[1200px] mx-auto px-2 pb-2">
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
              <div id="controls">
                <SamplePlayer
                  song={chosenSong}
                  endlessMode={endlessMode}
                  gameState={gameState}
                />
                {stats}
              </div>
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
          <div id="guess-table-container">
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
