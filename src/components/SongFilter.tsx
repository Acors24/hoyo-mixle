import { useState } from "react";
import { Album, Song } from "../types";
import { useAlbums } from "../AlbumsContext";
import { Random } from "random";
import * as Accordion from "@radix-ui/react-accordion";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { FiX } from "react-icons/fi";
import { contextToList } from "../utils";

export default function SongFilter({
  chosenSong,
  guesses,
  onSelect,
  className,
}: {
  chosenSong: Song;
  guesses: Song[];
  onSelect: (id: number) => void;
  className?: string;
}) {
  const albums = useAlbums();
  const [filterInput, setFilterInput] = useState("");

  const albumsVisible = guesses.length > -1;
  const regionsVisible = guesses.length > 0;
  const playedAtVisible = guesses.length > 1;
  const contextVisible = guesses.length > 2;
  const limitTo4 = guesses.length > 3;

  const allSongs = albums.flatMap(({ title, songs }) =>
    songs.map((song) => {
      return {
        ...song,
        album: title,
      };
    })
  );
  const guessedSongs = guesses.map(
    (guess) => allSongs.find((song) => song.id === guess.id)!
  );
  const chosenAlbum = albums.find((album) =>
    album.songs.some((song) => song === chosenSong)
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

  const filteredAlbums = albums
    .filter(({ title }) => {
      if (whitelistedAlbum) {
        return title === whitelistedAlbum;
      }

      return !blacklistedAlbums.has(title);
    })
    .map(({ title, songs }) => {
      return {
        title,
        songs: songs.filter((song) => {
          if (whitelistedType && song.type !== whitelistedType) {
            return false;
          } else if (blacklistedTypes.has(song.type)) {
            return false;
          }

          if (whitelistedRegion && song.region !== whitelistedRegion) {
            return false;
          } else if (blacklistedRegions.has(song.region)) {
            return false;
          }

          if (guesses.includes(song)) {
            return false;
          }

          return song.title.toLowerCase().includes(filterInput.toLowerCase());
        }),
      };
    })
    .filter(({ songs }) => songs.length > 0)
    .map((album) => (limitTo4 ? limitAlbumTo4(album, chosenSong) : album));

  return (
    <div id="song-filter" className={className ?? ""}>
      <div className="relative">
        <input
          type="text"
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}
          placeholder="Filter..."
        />
        <button
          onClick={() => setFilterInput("")}
          id="clear-button"
          className="icon-button"
        >
          <FiX />
        </button>
      </div>
      <ScrollArea.Root id="scroll-area-root" type="auto">
        <ScrollArea.Viewport id="scroll-area-viewport">
          {!albumsVisible ? (
            <ul>
              {allSongs
                .filter((song) =>
                  song.title.toLowerCase().includes(filterInput.toLowerCase())
                )
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((song) => (
                  <li key={song.id}>
                    <SongButton
                      song={song}
                      onSelect={onSelect}
                      regionsVisible={regionsVisible}
                      playedAtVisible={playedAtVisible}
                      contextVisible={contextVisible}
                    />
                  </li>
                ))}
            </ul>
          ) : (
            <Accordion.Root
              type="multiple"
              defaultValue={albums.map((album) => album.title)}
            >
              {albumsVisible &&
                filteredAlbums.map((album) => (
                  <Accordion.Item
                    key={album.title}
                    value={album.title}
                    className="album"
                  >
                    <Accordion.Header asChild>
                      <Accordion.Trigger className="album-header">
                        {album.title}
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="album-songs" asChild>
                      <ul>
                        {album.songs
                          .sort((a, b) => a.title.localeCompare(b.title))
                          .map((song) => (
                            <SongButton
                              key={song.id}
                              song={song}
                              onSelect={onSelect}
                              regionsVisible={regionsVisible}
                              playedAtVisible={playedAtVisible}
                              contextVisible={contextVisible}
                            />
                          ))}
                      </ul>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
            </Accordion.Root>
          )}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar id="scroll-area-scrollbar">
          <ScrollArea.Thumb id="scroll-area-scrollbar-thumb" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}

function SongButton({
  song,
  onSelect,
  regionsVisible,
  playedAtVisible,
  contextVisible,
}: {
  song: Song;
  onSelect: (id: number) => void;
  regionsVisible: boolean;
  playedAtVisible: boolean;
  contextVisible: boolean;
}) {
  const { id, title, playedAt, region, context } = song;

  return (
    <li>
      <button className="song" onClick={() => onSelect(id)}>
        {title} {regionsVisible && <span>({region})</span>}
        {playedAtVisible && (
          <ul className="usage-list">
            {contextVisible &&
              context &&
              contextToList(getShortContext(context)).map((item) => (
                <li key={item} className="context">
                  {item}
                </li>
              ))}
            {playedAt.map((moment, index) => (
              <Moment key={index} moment={moment} />
            ))}
          </ul>
        )}
      </button>
    </li>
  );
}

function Moment({ moment }: { moment: string | string[] }) {
  if (typeof moment === "string") {
    return <li>{moment}</li>;
  }

  return (
    <ul>
      {moment.map((subMoment, index) => (
        <li key={index}>{subMoment}</li>
      ))}
    </ul>
  );
}

function getShortContext(context: string) {
  return context
    .split(" / ")
    .map((part) => {
      const parts = part.split(" > ");
      return parts[parts.length - 1];
    })
    .join(" / ");
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

function limitAlbumTo4(album: Album, chosenSong: Song): Album {
  if (album.songs.length <= 4) {
    return album;
  }

  const rng = new Random(
    `${new Date().toDateString()}${album.title}${chosenSong.title}`
  );
  const result: Album = {
    title: album.title,
    songs: album.songs.includes(chosenSong) ? [chosenSong] : [],
  };
  while (result.songs.length < 4) {
    const song = rng.choice(album.songs)!;
    if (!result.songs.includes(song)) {
      result.songs.push(song);
    }
  }
  result.songs.sort((a, b) => a.id - b.id);

  return result;
}
