import { Song } from "../types";

export default function GuessIndicatorBar({
  chosenSong,
  guesses,
  maxGuesses,
}: {
  chosenSong: Song;
  guesses: Song[];
  maxGuesses: number;
}) {
  return (
    <div id="indicator-bar">
      {guesses
        .concat(Array(maxGuesses - guesses.length).fill(null))
        .map((guess, index) => {
          const status =
            guess === null
              ? "unknown"
              : guess === chosenSong
                ? "correct"
                : "wrong";

          return (
            <span key={index} className="indicator" data-status={status} />
          );
        })}
    </div>
  );
}
