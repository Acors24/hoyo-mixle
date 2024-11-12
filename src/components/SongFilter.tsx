import { useState } from "react";
import { Song } from "../types";
import { useAlbums } from "../AlbumsContext";

export default function SongFilter({
  chosenSong,
  guesses,
  onSelect,
  className,
}: {
  chosenSong: Song;
  guesses: number[];
  onSelect: (id: number) => void;
  className?: string;
}) {
  const albums = useAlbums();
  const [filterInput, setFilterInput] = useState("");

  const albumsVisible = guesses.length > 0;
  const regionsVisible = guesses.length > 1;
  const playedAtVisible = guesses.length > 2;

  const allSongs = albums.flatMap(({ title, songs }) =>
    songs.map((song) => {
      return {
        ...song,
        album: title,
      };
    })
  );
  const guessedSongs = guesses.map(
    (id) => allSongs.find((song) => song.id === id)!
  );
  const chosenAlbum = albums.find((album) =>
    album.songs.some((song) => song.id === chosenSong.id)
  )!;

  const [blacklistedAlbums, whitelistedAlbum] = createBlacklistAndWhitelist(
    guessedSongs,
    (song) => song.album,
    chosenAlbum.title
  );
  const [blacklistedTypes, whitelistedType] = createBlacklistAndWhitelist(
    guessedSongs,
    (song) => song.type,
    chosenSong.type
  );
  const [blacklistedRegions, whitelistedRegion] = createBlacklistAndWhitelist(
    guessedSongs,
    (song) => song.region,
    chosenSong.region
  );

  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <input
        type="text"
        value={filterInput}
        onChange={(event) => setFilterInput(event.target.value)}
        placeholder="Filter..."
        className="px-4 py-2 bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 active:bg-slate-900 active:bg-opacity-50 rounded-xl duration-100"
      />
      <ul className="rounded-xl overflow-auto">
        {albums
          .filter(({ title }) => {
            if (!albumsVisible) {
              return true;
            }

            if (whitelistedAlbum) {
              return title === whitelistedAlbum;
            }

            return !blacklistedAlbums.has(title);
          })
          .map(({ title, songs }) => {
            return {
              title,
              songs: songs.filter((song) => {
                if (playedAtVisible) {
                  if (whitelistedType && song.type !== whitelistedType) {
                    return false;
                  } else if (blacklistedTypes.has(song.type)) {
                    return false;
                  }
                }

                if (regionsVisible) {
                  if (whitelistedRegion && song.region !== whitelistedRegion) {
                    return false;
                  } else if (blacklistedRegions.has(song.region)) {
                    return false;
                  }
                }

                if (guesses.includes(song.id)) {
                  return false;
                }

                return song.title
                  .toLowerCase()
                  .includes(filterInput.toLowerCase());
              }),
            };
          })
          .filter(({ songs }) => songs.length > 0)
          .map((album) => (
            <div key={album.title}>
              {albumsVisible && (
                <li className="px-4 pt-4 bg-slate-800 bg-opacity-50 text-slate-400 text-sm select-none sticky top-0 backdrop-blur">
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
            </div>
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

function createBlacklistAndWhitelist<T>(
  collection: T[],
  getProperty: (item: T) => string,
  chosenItem: string
) {
  return collection.reduce(
    ([blacklist, whitelist], item) => {
      const property = getProperty(item);
      if (property === chosenItem) {
        return [blacklist, property] as [Set<string>, string];
      }

      return [blacklist.add(property), whitelist] as [Set<string>, string];
    },
    [new Set<string>(), undefined] as [Set<string>, string | undefined]
  );
}
