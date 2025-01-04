import { Song } from "../../types";
import classes from "./style.module.css";

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
    <div className={classes.IndicatorBar}>
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
            <span
              key={index}
              className={classes.Indicator}
              data-status={status}
            />
          );
        })}
    </div>
  );
}
