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
          // .map((album) => toTitles(album, onSelect))}
          .map((album) => (
            <React.Fragment key={album.title}>
              {guessCount > 0 && (
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
                    {guessCount > 1 && (
                      <span className="text-slate-400 text-xs">
                        {" "}
                        ({region})
                      </span>
                    )}
                    {guessCount > 2 && (
                      <ul className="list-disc pl-4 text-slate-300 text-xs sm:text-sm">
                        {playedAt.map((moment, index) =>
                          typeof moment === "string" ? (
                            <li key={index}>{moment}</li>
                          ) : (
                            <ul key={index} className="list-disc pl-4">
                              {moment.map((moment, index) => (
                                <li key={index}>{moment}</li>
                              ))}
                            </ul>
                          )
                        )}
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
