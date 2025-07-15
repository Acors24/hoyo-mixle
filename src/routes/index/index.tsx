import { createFileRoute } from "@tanstack/react-router";
import { Vibrant } from "node-vibrant/browser";
import genshinImpactAlbums from "../../assets/albums/genshin-impact.json";
import honkaiStarRailAlbums from "../../assets/albums/honkai-star-rail.json";
import zenlessZoneZeroAlbums from "../../assets/albums/zenless-zone-zero.json";
import { getYouTubeThumbnail } from "../../utils";
import { Album, Game, Song } from "../../types";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Select from "../../components/Select";
import {
  FandomButton,
  SpotifyButton,
  YouTubeButton,
} from "../../components/SongCard";

interface Search {
  game?: Game;
  id?: number;
}

const games = [
  "genshinImpact",
  "starRail",
  "zenlessZoneZero",
] as const satisfies readonly Game[];

function isGame(game: unknown): game is Game {
  return typeof game === "string" && games.includes(game as Game);
}

export const Route = createFileRoute("/index/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): Search => ({
    game: isGame(search["game"]) ? search["game"] : undefined,
    id: typeof search["id"] === "number" ? search["id"] : undefined,
  }),
});

function getAttributeFilters(
  albums: Album[],
  allLabel: string,
  attributeGetter: (song: Song) => string
) {
  const attributes = new Set(
    albums.flatMap(({ songs }) => songs.map(attributeGetter))
  );
  const allAttributesFilter: [string, (song: Song) => boolean] = [
    allLabel,
    () => true,
  ];
  const otherAttributeFilters: [string, (song: Song) => boolean][] = Array.from(
    attributes
  ).map((attribute) => [
    attribute,
    (song: Song) => attributeGetter(song) === attribute,
  ]);
  return new Map<string, (song: Song) => boolean>(
    [allAttributesFilter].concat(otherAttributeFilters)
  );
}

const colors = [
  "DarkMuted",
  "Muted",
  "LightMuted",
  "DarkVibrant",
  "Vibrant",
  "LightVibrant",
] as const;
type Color = (typeof colors)[number];
type Palette = { [K in Color]: string };
const emptyPalette = Object.fromEntries(
  colors.map((color) => [color, "#fff2"])
) as Palette;

const gameObjects: { [K in Game]: { label: string; albums: Album[] } } = {
  genshinImpact: { label: "Genshin Impact", albums: genshinImpactAlbums },
  starRail: { label: "Honkai: Star Rail", albums: honkaiStarRailAlbums },
  zenlessZoneZero: {
    label: "Zenless Zone Zero",
    albums: zenlessZoneZeroAlbums,
  },
};

function RouteComponent() {
  const search = Route.useSearch();

  const [game, setGame] = useState<Game>(search.game ?? "genshinImpact");
  const [type, setType] = useState("All types");
  const [region, setRegion] = useState("All regions");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (search.id) {
      const selectedSong = document.querySelector(`[data-id="${search.id}"]`);
      selectedSong?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [search.id]);

  const albums = gameObjects[game].albums;

  const emptyPalettes = useMemo(
    () => Object.fromEntries(albums.map(({ title }) => [title, emptyPalette])),
    [albums]
  );
  const palettes = useRef(emptyPalettes);

  const typeFilterMap = getAttributeFilters(
    albums,
    "All types",
    ({ type }) => type
  );
  const regionFilterMap = getAttributeFilters(
    albums,
    "All regions",
    ({ region }) => region
  );

  const filters: ((song: Song) => boolean)[] = useMemo(
    () => [
      typeFilterMap.get(type) ?? (() => true),
      regionFilterMap.get(region) ?? (() => true),
      (song: Song) => song.title.toLowerCase().includes(query.toLowerCase()),
    ],
    [query, region, regionFilterMap, type, typeFilterMap]
  );

  const songAmount = albums.reduce(
    (acc, { songs }) =>
      acc +
      songs.filter((song) => filters.every((filter) => filter(song))).length,
    0
  );

  const getMainAlbum = useCallback(
    (albumElements: NodeListOf<Element>, mid: number) =>
      Array.from(albumElements)
        .reverse()
        .reduce((bestEntry, currentEntry) => {
          const { bottom } = currentEntry.getBoundingClientRect();
          return mid <= bottom ? currentEntry : bestEntry;
        }),
    []
  );

  const bgRef = useRef<HTMLDivElement>(null);

  const setBgPalette = useCallback(
    (albumTitle: string) => {
      const palette = palettes.current[albumTitle];
      if (!bgRef.current || !palette) return;

      [
        ["--DM", palette.DarkMuted],
        ["--M", palette.Muted],
        ["--LM", palette.LightMuted],
        ["--DV", palette.DarkVibrant],
        ["--V", palette.Vibrant],
        ["--LV", palette.LightVibrant],
      ].forEach(([name, color]) =>
        bgRef.current?.style.setProperty(name, color)
      );
    },
    [palettes]
  );

  useEffect(() => {
    Promise.allSettled(
      albums.map(async ({ title, songs }) => {
        const palette = await Vibrant.from(
          getYouTubeThumbnail(songs[0].youtubeId)
        ).getPalette();

        const albumPalette = Object.fromEntries(
          Object.entries(palette).map(([color, swatch]) => [
            color as Color,
            swatch?.hex ?? "transparent",
          ])
        ) as Palette;
        palettes.current[title] = albumPalette;
      })
    ).then(() => {
      const albumElements = document.querySelectorAll(`li[data-album]`);
      if (albumElements.length === 0) return;
      const parent = albumElements.item(0).parentElement;
      const parentHeight = parent?.offsetHeight ?? innerHeight;
      const mid = innerHeight - parentHeight / 2;
      const mainAlbum = getMainAlbum(albumElements, mid);
      if (!mainAlbum) return;

      const mainAlbumTitle = mainAlbum.getAttribute("data-album")!;
      setBgPalette(mainAlbumTitle);
    });
  }, [albums, emptyPalettes, getMainAlbum, setBgPalette]);

  useEffect(() => {
    const albumElements = document.querySelectorAll(`li[data-album]`);
    if (albumElements.length === 0) return;
    const parent = albumElements.item(0).parentElement;
    const parentHeight = parent?.offsetHeight ?? innerHeight;
    const mid = innerHeight - parentHeight / 2;
    const observer = new IntersectionObserver(
      () => {
        const mainAlbum = getMainAlbum(albumElements, mid);
        if (!mainAlbum) return;

        const mainAlbumTitle = mainAlbum.getAttribute("data-album")!;
        setBgPalette(mainAlbumTitle);
      },
      { rootMargin: `${-mid * 0.8}px`, root: parent }
    );

    if (albumElements) {
      albumElements.forEach((albumElement) => observer.observe(albumElement));
      return () => observer.disconnect();
    }
  }, [albums, filters, setBgPalette, getMainAlbum]);

  return (
    <div className="max-w-[1200px] w-full mx-auto grid grid-rows-[auto_1fr] h-full overflow-auto z-0">
      <div
        id="index-background"
        className="fixed w-screen h-screen top-0 left-0 -z-10"
        style={{
          background: `radial-gradient(circle farthest-corner at top left, var(--DV), transparent),
            radial-gradient(circle farthest-corner at bottom right, var(--V), transparent)`,
          maskImage: "radial-gradient(black, transparent 200%)",
        }}
        ref={bgRef}
      ></div>
      <fieldset className="flex gap-2 p-2 items-stretch sm:items-center flex-col sm:flex-row">
        <Select
          items={Object.entries(gameObjects).map(([game, { label }]) => ({
            value: game,
            label,
          }))}
          value={game}
          onSelect={(game) => {
            setGame(game as Game);
            setType("All types");
            setRegion("All regions");
          }}
        />
        <Select
          items={Array.from(typeFilterMap).map(([type]) => ({
            value: type,
            label: type,
          }))}
          value={type}
          onSelect={setType}
        />
        <Select
          items={Array.from(regionFilterMap).map(([type]) => ({
            value: type,
            label: type,
          }))}
          value={region}
          onSelect={setRegion}
        />

        <input
          type="search"
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
          placeholder="Search…"
        />

        <span className="ml-auto">
          {songAmount} song{songAmount !== 1 && "s"}
        </span>
      </fieldset>
      <ol className="overflow-auto">
        {albums.map(({ title, songs }) => (
          <AlbumComponent
            key={title}
            title={title}
            songs={songs}
            filters={filters}
            game={game}
            expandedId={search.id}
          />
        ))}
      </ol>
    </div>
  );
}

function AlbumComponent({
  title,
  songs,
  filters,
  game,
  expandedId,
}: Album & {
  filters: ((song: Song) => boolean)[];
  game: Game;
  expandedId?: number;
}) {
  const numberedSongs = songs.map((song, index) => ({
    index: index + 1,
    ...song,
  }));

  const filteredSongs = numberedSongs.filter((song) =>
    filters.every((filter) => filter(song))
  );

  if (filteredSongs.length === 0) {
    return null;
  }

  return (
    <li className="p-2" data-album={title}>
      <div className="p-2 flex gap-2 sticky top-0 bg-gradient-to-r from-black/10 to-transparent backdrop-blur">
        <img
          src={getYouTubeThumbnail(songs[0].youtubeId)}
          alt=""
          className="aspect-square h-20 object-cover rounded"
        />

        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <table className="w-full">
        <thead className="hidden sm:table-header-group">
          <tr>
            <th className="w-0 sm:w-[6ch]"></th>
            <th className="px-2 sm:px-4 py-1">Title</th>
            <th className="px-4 py-1 w-[15ch] hidden sm:table-cell">Type</th>
            <th className="px-4 py-1 w-[15ch] hidden sm:table-cell">Region</th>
          </tr>
        </thead>
        <tbody>
          {filteredSongs.map((song) => (
            <XRow
              key={song.youtubeId}
              song={song}
              game={game}
              initiallyExpanded={song.id === expandedId}
            />
          ))}
        </tbody>
      </table>
    </li>
  );
}

function XRow({
  song,
  game,
  initiallyExpanded,
}: {
  song: Song & { index: number };
  game: Game;
  initiallyExpanded: boolean;
}) {
  const {
    id,
    index,
    title,
    type,
    region,
    context,
    youtubeId,
    spotifyId,
    fandomUrl,
    playedAt,
  } = song;
  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <Fragment>
      <tr
        onClick={() => setExpanded(!expanded)}
        data-expanded={expanded}
        data-id={id}
      >
        <td className="text-right text-xs">{index}</td>
        <td>{title}</td>
        <td className="max-w-0 hidden sm:table-cell overflow-hidden text-ellipsis text-nowrap">
          {type}
        </td>
        <td className="max-w-0 hidden sm:table-cell overflow-hidden text-ellipsis text-nowrap">
          {region}
        </td>
      </tr>
      {expanded && (
        <tr className="details">
          <td></td>
          <td colSpan={3}>
            <div className="sm:grid sm:grid-cols-[1fr_auto]">
              <div>
                <table className="sm:hidden w-full text-sm mb-2">
                  <tbody>
                    <tr className="border-t-0">
                      <td className="text-neutral-400">Type</td>
                      <td>{type}</td>
                    </tr>
                    <tr>
                      <td className="text-neutral-400">Region</td>
                      <td>{region}</td>
                    </tr>
                  </tbody>
                </table>
                {context && (
                  <p className="text-slate-200 text-pretty">
                    {context.replace(" > ", " - ")}
                  </p>
                )}
                <div className="flex gap-1 flex-wrap p-1">
                  {playedAt
                    .filter((p) => typeof p === "string")
                    .map((p) => (
                      <span
                        key={p}
                        className="rounded-full text-xs bg-black/10 px-4 py-2 text-nowrap"
                      >
                        {p}
                      </span>
                    ))}
                </div>
              </div>
              <div className="flex gap-2 items-center p-2">
                <YouTubeButton youtubeId={youtubeId} />
                <SpotifyButton spotifyId={spotifyId} />
                <FandomButton fandomId={fandomUrl} game={game} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}
