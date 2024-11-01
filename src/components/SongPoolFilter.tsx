import { useState } from "react";
import { SongPool } from "../types";

function formatPlayedAt(playedAt: SongPool["playedAt"]) {
  return (
    <>
      {playedAt.main}
      {playedAt.sub?.map((sub) => (
        <div key={sub} className="text-slate-300 text-sm">
          {sub}
        </div>
      ))}
    </>
  );
}

export default function SongPoolFilter({
  pools,
  onSelect,
  className,
}: {
  pools: SongPool[];
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
        {pools
          .filter(
            ({ playedAt }) =>
              playedAt.main
                ?.toLowerCase()
                .includes(filterInput.toLowerCase()) ||
              playedAt.sub?.some((sub) =>
                sub.toLowerCase().includes(filterInput.toLowerCase())
              )
          )
          .map((pool, index) => (
            <li key={index}>
              <button
                className="px-4 py-2 w-full text-left bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 active:bg-slate-900 active:bg-opacity-50 duration-100"
                onClick={() => onSelect(pool.id)}
              >
                {formatPlayedAt(pool.playedAt)}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
