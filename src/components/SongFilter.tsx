import React, { useState } from "react";
import { Album } from "../types";

export default function SongFilter({
  albums,
  guessCount,
  onSelect,
  className,
}: {
  albums: Album[];
  guessCount: number;
  onSelect: (id: number) => void;
  className?: string;
}) {
  const [filterInput, setFilterInput] = useState("");

  const albumsVisible = guessCount > 0;
  const regionsVisible = guessCount > 1;
  const playedAtVisible = guessCount > 2;

  return (
    <div className={`flex flex-col gap-2 overflow-auto ${className ?? ""}`}>
      <input
        type="text"
        value={filterInput}
        onChange={(event) => setFilterInput(event.target.value)}
        placeholder="Filter..."
        className="px-4 py-2 bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 active:bg-slate-900 active:bg-opacity-50 rounded-xl duration-100"
      />
      <ul className="rounded-xl overflow-auto">
        {albums
          .map(({ title, songs }) => {
            return {
              title,
              songs: songs.filter(({ title }) =>
                title.toLowerCase().includes(filterInput.toLowerCase())
              ),
            };
          })
          .filter(({ songs }) => songs.length > 0)
          .map((album) => (
            <React.Fragment key={album.title}>
              {albumsVisible && (
                <li className="px-4 pt-4 bg-slate-800 bg-opacity-50 text-slate-400 text-sm select-none">
                  {album.title}
                </li>
              )}

              {album.songs.map(({ id, title, playedAt, region }) => (
                <li key={id}>
                  <button
                    className="px-4 py-2 w-full text-left bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 active:bg-slate-900 active:bg-opacity-50 duration-100"
                    onClick={() => onSelect(id)}
                  >
                    {title}{" "}
                    {regionsVisible && (
                      <span className="text-slate-400 text-xs">
                        {" "}
                        ({region})
                      </span>
                    )}
                    {playedAtVisible && (
                      <ul className="list-disc pl-4 text-slate-300 text-xs sm:text-sm">
                        {playedAt.map((moment, index) => (
                          <Moment key={index} moment={moment} />
                        ))}
                      </ul>
                    )}
                  </button>
                </li>
              ))}
            </React.Fragment>
          ))}
      </ul>
    </div>
  );
}

function Moment({ moment }: { moment: string | string[] }) {
  if (typeof moment === "string") {
    return <li>{moment}</li>;
  }

  return (
    <ul className="list-disc pl-4">
      {moment.map((subMoment, index) => (
        <li key={index}>{subMoment}</li>
      ))}
    </ul>
  );
}
