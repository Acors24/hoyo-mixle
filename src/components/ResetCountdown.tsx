import { useEffect, useState } from "react";
import { getToday, getTodayDateString } from "../utils";

function getResetTime() {
  const nextReset = new Date(getTodayDateString());
  nextReset.setDate(getToday().getUTCDate() + 1);
  return nextReset;
}

const resetTime = getResetTime().valueOf();

function getSecondsLeft() {
  return Math.floor((resetTime - Date.now()) / 1000);
}

export default function ResetCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft());
  const minutesLeft = Math.floor(secondsLeft / 60);
  const hoursLeft = Math.floor(minutesLeft / 60);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 0) {
          setReady(true);
          clearInterval(interval);
          return 0;
        }

        if (s % 5 === 0) {
          return getSecondsLeft();
        }

        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const secondsString = (secondsLeft % 60).toString().padStart(2, "0");
  const minutesString = (minutesLeft % 60).toString().padStart(2, "0");
  const timeString = `${hoursLeft}:${minutesString}:${secondsString}`;

  return ready ? (
    <button
      id="next-button"
      className="button"
      onClick={() => location.reload()}
    >
      Refresh
    </button>
  ) : (
    <span id="time-left">Next round in {timeString}</span>
  );
}
