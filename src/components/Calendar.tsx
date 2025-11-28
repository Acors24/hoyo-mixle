import { FiCalendar, FiChevronRight } from "react-icons/fi";
import Dialog from "./Dialog";
import { getDay, getDayOfYear, getDaysInMonth } from "date-fns";
import { Album, DBResult, Game } from "../types";
import { useState } from "react";
import { useStorage } from "../StorageContext";
import { useHistory } from "../api";
import { CgSpinner } from "react-icons/cg";
import { Link } from "@tanstack/react-router";
import genshinImpactAlbums from "../assets/albums/genshin-impact.json";
import honkaiStarRailAlbums from "../assets/albums/honkai-star-rail.json";
import zenlessZoneZeroAlbums from "../assets/albums/zenless-zone-zero.json";

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

function CalendarCell({
  dayData,
  onClick,
  highlight,
}: {
  dayData: number;
  onClick: () => void;
  highlight: boolean;
}) {
  const won = Boolean(dayData & 0b1000);
  const guesses = dayData & 0b0111;

  const className = getCellClass(won, guesses);
  return (
    <div className={className} onClick={onClick} data-highlight={highlight}>
      {guesses}
    </div>
  );
}

const albumSets: { [k in Game]: Album[] } = {
  genshinImpact: genshinImpactAlbums,
  honkaiStarRail: honkaiStarRailAlbums,
  zenlessZoneZero: zenlessZoneZeroAlbums,
};

function idToSong(id: number, albums: Album[]) {
  for (const album of albums) {
    const song = album.songs.find((song) => song.id === id);
    if (song) {
      return { album: album.title, song };
    }
  }
}

function getSongFromHistory(game: Game, date: string, history: DBResult) {
  const dayData = history.find((row) => row.date === date);
  if (!dayData) {
    return null;
  }

  return idToSong(dayData[game], albumSets[game]) ?? null;
}

export default function Calendar() {
  const [game, setGame] = useState<Game>("genshinImpact");

  const { state } = useStorage();

  const [hasOpened, setHasOpened] = useState(false);

  const { data, pending, error } = useHistory(hasOpened);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const yearData = state.gameData[game].calendar[year];

  const handleGameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedGame = event.target.value as Game;
    setGame(selectedGame);
  };

  const selectedDaySong =
    selectedDay && data ? getSongFromHistory(game, selectedDay, data) : null;

  return (
    <Dialog
      title="Calendar"
      icon={<FiCalendar />}
      onOpen={() => setHasOpened(true)}
    >
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
            value="honkaiStarRail"
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
                .map((_, dayIndex) => {
                  const monthString = `${monthIndex + 1}`.padStart(2, "0");
                  const dayString = `${dayIndex + 1}`.padStart(2, "0");
                  const dateString = `${year}-${monthString}-${dayString}`;
                  return (
                    <CalendarCell
                      onClick={() => {
                        setSelectedDay(dateString);
                      }}
                      key={dayIndex}
                      dayData={
                        yearData[
                          getDayOfYear(
                            new Date(year, monthIndex, dayIndex + 1)
                          ) - 1
                        ]
                      }
                      highlight={dateString === selectedDay}
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      {selectedDay && (
        <div id="calendar-day-info">
          {pending && <CgSpinner className="animate-spin" />}
          {error && <span className="error">{error.message}</span>}
          {data &&
            (selectedDaySong ? (
              <>
                <Link
                  id="index-link"
                  to="/index"
                  search={{ game, id: selectedDaySong.song.id }}
                >
                  <div id="album">{selectedDaySong.album}</div>
                  <div id="title">{selectedDaySong.song.title}</div>
                  <FiChevronRight id="link-icon" />
                </Link>
              </>
            ) : (
              "No data."
            ))}
        </div>
      )}
    </Dialog>
  );
}
