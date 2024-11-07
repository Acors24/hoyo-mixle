export default function GuessIndicatorBar({
  chosenSongId,
  guesses,
  maxGuesses,
}: {
  chosenSongId: number;
  guesses: number[];
  maxGuesses: number;
}) {
  return (
    <div className="w-max bg-slate-800 bg-opacity-50 rounded-full p-2 shadow flex items-center gap-2">
      {guesses
        .concat(Array(maxGuesses - guesses.length).fill(null))
        .map((guess, index) => {
          if (guess === null) {
            return <GuessIndicator key={index} variant="unknown" />;
          }

          return (
            <GuessIndicator
              key={index}
              variant={guess === chosenSongId ? "correct" : "wrong"}
            />
          );
        })}
    </div>
  );
}

function GuessIndicator({
  variant,
}: {
  variant: "unknown" | "wrong" | "correct";
}) {
  let className;
  switch (variant) {
    case "unknown":
      className = "bg-slate-500";
      break;
    case "wrong":
      className = "bg-rose-500 shadow-rose-500";
      break;
    case "correct":
      className = "bg-emerald-500 shadow-emerald-500";
      break;
  }

  return (
    <span
      className={`w-3 h-3 rounded-full inline-block shadow-glow duration-200 ${className}`}
    ></span>
  );
}
