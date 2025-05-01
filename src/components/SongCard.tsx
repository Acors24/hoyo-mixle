import { FaSpotify, FaYoutube } from "react-icons/fa6";
import { Album, Game, Song } from "../types";
import { SiFandom } from "react-icons/si";
import { contextToList, getGameBaseWiki, getYouTubeThumbnail } from "../utils";
import { Vibrant } from "node-vibrant/browser";

export default function SongCard({
  album,
  song,
  game,
  className,
}: {
  album: Album;
  song: Song;
  game: Game;
  className?: string;
}) {
  const thumbnailSrc = getYouTubeThumbnail(song.youtubeId);
  Vibrant.from(thumbnailSrc)
    .getPalette()
    .then((palette) => {
      for (const swatch in palette) {
        if (palette[swatch]) {
          const color = palette[swatch].hex;
          document.documentElement.style.setProperty(
            `--${swatch}-color`,
            color
          );
        }
      }
    });
  return (
    <div id="song-card" className={className ?? ""}>
      <Thumbnail youtubeId={song.youtubeId} />
      <div id="song-details">
        <h2 className="card-title">{song.title}</h2>
        <h3 className="card-album">{album.title}</h3>
        <h4 className="card-type-region">
          <span id="card-type">{song.type}</span>
          <span id="card-region">{song.region}</span>
        </h4>
        <ul className="usage-list">
          {song.context &&
            contextToList(song.context).map((item) => (
              <li key={item} className="context">
                {item.replace(" > ", " - ")}
              </li>
            ))}
          {song.playedAt.map((moment, index) => (
            <Moment key={index} moment={moment} />
          ))}
        </ul>
        <div className="mt-auto flex gap-2 links">
          <YouTubeButton youtubeId={song.youtubeId} />
          <SpotifyButton spotifyId={song.spotifyId} />
          <FandomButton fandomId={song.fandomUrl} game={game} />
        </div>
      </div>
    </div>
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

function Thumbnail({
  youtubeId,
  className,
}: {
  youtubeId: string;
  className?: string;
}) {
  return (
    <div id="thumbnail-container">
      <img
        src={getYouTubeThumbnail(youtubeId)}
        alt=""
        id="thumbnail"
        className={className ?? ""}
      />
    </div>
  );
}

function IconLink({
  href,
  icon,
  className,
}: {
  icon: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`p-2 inline-flex rounded-full shadow ${className} icon-link`}
    >
      {icon}
    </a>
  );
}

function YouTubeButton({ youtubeId }: { youtubeId: string }) {
  return (
    <IconLink
      href={`https://www.youtube.com/watch?v=${youtubeId}`}
      icon={<FaYoutube />}
      className="bg-[#FF0000] text-white youtube-button"
    />
  );
}

function SpotifyButton({ spotifyId }: { spotifyId: string }) {
  return (
    <IconLink
      href={`https://open.spotify.com/track/${spotifyId}`}
      icon={<FaSpotify />}
      className="bg-[#1ED760] text-white spotify-button"
    />
  );
}

function FandomButton({ game, fandomId }: { game: Game; fandomId?: string }) {
  if (!fandomId) return null;

  const baseUrl = getGameBaseWiki(game);

  return (
    <IconLink
      href={`${baseUrl}${fandomId}`}
      icon={<SiFandom />}
      className="bg-[#FA005A] text-white fandom-button"
    />
  );
}

export { YouTubeButton, SpotifyButton, FandomButton };
