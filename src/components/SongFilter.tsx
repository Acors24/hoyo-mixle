import { useState } from "react";
import { Album } from "../types";

export default function SongFilter({
  albums,
  onSelect,
  className,
}: {
  albums: Album[];
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
      <ul className="rounded-xl overflow-auto max-h-none">
        {albums
          .flatMap((album) => album.songs)
          .filter(({ title }) =>
            title.toLowerCase().includes(filterInput.toLowerCase())
          )
          .map((song, index) => (
            <li key={index}>
              <button
                className="px-4 py-2 w-full text-left bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 active:bg-slate-900 active:bg-opacity-50 duration-100"
                onClick={() => onSelect(song.id)}
              >
                {song.title}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
