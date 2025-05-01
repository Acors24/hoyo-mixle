import { FiCalendar } from "react-icons/fi";
import Dialog from "./Dialog";
import { getDay, getDayOfYear, getDaysInMonth } from "date-fns";
import { Game } from "../types";
import { useState } from "react";
import { useStorage } from "../StorageContext";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const year = 2025;

function getCellClass(won: boolean, guesses: number) {
  if (won) {
    return "day won";
  }

  if (guesses === 5) {
    return "day lost";
  }

  if (guesses > 0) {
    return "day attempted";
  }

  return "day";
}

function CalendarCell({ dayData }: { dayData: number }) {
  const won = Boolean(dayData & 0b1000);
  const guesses = dayData & 0b0111;

  const className = getCellClass(won, guesses);
  return <div className={className}>{guesses}</div>;
}

export default function Calendar() {
  const [game, setGame] = useState<Game>("genshinImpact");

  const { state } = useStorage();

  const yearData = state.gameData[game].calendar[year];

  const handleGameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedGame = event.target.value as Game;
    setGame(selectedGame);
  };

  return (
    <Dialog title="Calendar" icon={<FiCalendar />}>
      <fieldset id="calendar-game-selector">
        <label>
          <input
            type="radio"
            name="game"
            value="genshinImpact"
            onChange={handleGameChange}
            defaultChecked
          />
          Genshin Impact
        </label>
        <label>
          <input
            type="radio"
            name="game"
            value="starRail"
            onChange={handleGameChange}
          />
          Honkai: Star Rail
        </label>
        <label>
          <input
            type="radio"
            name="game"
            value="zenlessZoneZero"
            onChange={handleGameChange}
          />
          Zenless Zone Zero
        </label>
      </fieldset>
      {/* <h2 className="year">{year}</h2> */}
      <div id="calendar">
        {monthNames.map((month, monthIndex) => (
          <div key={month} className="month">
            <h3>{month}</h3>
            <div className="days">
              {Array.from(
                { length: (getDay(new Date(year, monthIndex)) + 6) % 7 },
                (_, i) => (
                  <div key={i} className="empty day"></div>
                )
              )}

              {Array(getDaysInMonth(new Date(year, monthIndex)))
                .fill(0)
                .map((_, dayIndex) => (
                  <CalendarCell
                    key={dayIndex}
                    dayData={
                      yearData[
                        getDayOfYear(new Date(year, monthIndex, dayIndex + 1)) -
                          1
                      ]
                    }
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
