import { FaSpotify, FaYoutube } from "react-icons/fa6";
import { Album, Game, Song } from "../types";
import { SiFandom } from "react-icons/si";
import { contextToList, getGameBaseWiki, getYouTubeThumbnail } from "../utils";

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
  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 bg-slate-800 bg-opacity-50 rounded-xl p-4 sm:w-auto ${
        className ?? ""
      }`}
    >
      <Thumbnail youtubeId={song.youtubeId} className="sm:w-80" />
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">{song.title}</h2>
        <h3>{album.title}</h3>
        <h4 className="text-sm text-slate-200">
          <span className="pr-4 border-r-2 border-r-[#fff4] mr-4">
            {song.type}
          </span>
          <span>{song.region}</span>
        </h4>
        <ul className="text-sm text-slate-200 list-disc pl-4 my-4">
          {song.context &&
            contextToList(song.context).map((item) => (
              <li className="text-amber-100">{item.replace(" > ", " - ")}</li>
            ))}
          {song.playedAt.map((moment, index) => (
            <Moment key={index} moment={moment} />
          ))}
        </ul>
        <div className="mt-auto flex gap-2">
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
    <ul className="list-disc pl-4">
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
    <img
      src={getYouTubeThumbnail(youtubeId)}
      alt=""
      className={`object-cover rounded pointer-events-none select-none aspect-square shadow ${className ?? ""}`}
    />
  );
}

function IconLink({
  href,
  icon,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`p-2 inline-flex rounded-full shadow ${className}`}
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
      className="bg-[#FF0000] text-white"
    />
  );
}

function SpotifyButton({ spotifyId }: { spotifyId: string }) {
  return (
    <IconLink
      href={`https://open.spotify.com/track/${spotifyId}`}
      icon={<FaSpotify />}
      className="bg-[#1ED760] text-white"
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
      className="bg-[#FA005A] text-white"
    />
  );
}

export { YouTubeButton, SpotifyButton, FandomButton };
