import { useState } from "react";
import { Album, Song } from "../../types";
import { useAlbums } from "../../AlbumsContext";
import { Random } from "random";
import * as Accordion from "@radix-ui/react-accordion";
import classes from "./style.module.css";
import { FaChevronDown } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

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
      // if (!albumsVisible) {
      //   return true;
      // }

      if (whitelistedAlbum) {
        return title === whitelistedAlbum;
      }

      return !blacklistedAlbums.has(title);
    })
    .map(({ title, songs }) => {
      return {
        title,
        songs: songs.filter((song) => {
          // if (playedAtVisible) {
          if (whitelistedType && song.type !== whitelistedType) {
            return false;
          } else if (blacklistedTypes.has(song.type)) {
            return false;
          }
          // }

          // if (regionsVisible) {
          if (whitelistedRegion && song.region !== whitelistedRegion) {
            return false;
          } else if (blacklistedRegions.has(song.region)) {
            return false;
          }
          // }

          if (guesses.includes(song)) {
            return false;
          }

          return song.title.toLowerCase().includes(filterInput.toLowerCase());
        }),
      };
    })
    .filter(({ songs }) => songs.length > 0)
    .map((album) =>
      guesses.length < 4 ? album : limitAlbumTo4(album, chosenSong)
    );

  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <div className="relative">
        <input
          type="text"
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}
          placeholder="Filter..."
          className={classes.FilterInput}
        />
        <RxCross1
          onClick={() => setFilterInput("")}
          className={classes.ClearButton}
        />
      </div>
      {!albumsVisible ? (
        <ul className={classes.AccordionRoot}>
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
                />
              </li>
            ))}
        </ul>
      ) : (
        <Accordion.Root
          type="multiple"
          defaultValue={albums.map((album) => album.title)}
          className={classes.AccordionRoot}
        >
          {albumsVisible &&
            filteredAlbums.map((album) => (
              <Accordion.Item
                key={album.title}
                value={album.title}
                className={classes.AccordionItem}
              >
                <Accordion.Header asChild>
                  <Accordion.Trigger className={classes.AccordionTrigger}>
                    {album.title}
                    <FaChevronDown className={classes.AccordionTriggerIcon} />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className={classes.AccordionContent} asChild>
                  <ul>
                    {album.songs
                      .sort((a, b) => a.title.localeCompare(b.title))
                      .map((song) => (
                        <li key={song.id}>
                          <SongButton
                            song={song}
                            onSelect={onSelect}
                            regionsVisible={regionsVisible}
                            playedAtVisible={playedAtVisible}
                          />
                        </li>
                      ))}
                  </ul>
                </Accordion.Content>
              </Accordion.Item>
            ))}
        </Accordion.Root>
      )}
    </div>
  );
}

function SongButton({
  song,
  onSelect,
  regionsVisible,
  playedAtVisible,
}: {
  song: Song;
  onSelect: (id: number) => void;
  regionsVisible: boolean;
  playedAtVisible: boolean;
}) {
  const { id, title, playedAt, region } = song;

  return (
    <button className={classes.SongButton} onClick={() => onSelect(id)}>
      {title} {regionsVisible && <span>({region})</span>}
      {playedAtVisible && (
        <ul>
          {playedAt.map((moment, index) => (
            <Moment key={index} moment={moment} />
          ))}
        </ul>
      )}
    </button>
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
