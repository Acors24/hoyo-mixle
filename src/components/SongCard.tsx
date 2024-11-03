import { FaSpotify, FaYoutube } from "react-icons/fa6";
import { Album, Song } from "../types";
import { SiFandom } from "react-icons/si";
import { getYouTubeThumbnail } from "../utils";

export default function SongCard({
  album,
  song,
  className,
}: {
  album: Album;
  song: Song;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 bg-slate-800 bg-opacity-50 rounded-xl p-4 w-min sm:w-auto ${
        className ?? ""
      }`}
    >
      <Thumbnail
        youtubeId={song.youtubeId}
        className="flex-none w-60 h-60 sm:w-52 sm:h-52"
      />
      <div className="flex flex-col">
        <div>
          <h2 className="text-2xl font-bold">{song.title}</h2>
          <p>{album.title}</p>
        </div>
        <ul className="*:text-sm text-slate-200 list-disc pl-4 my-4">
          {song.playedAt.map((moment, index) => (
            <Moment key={index} moment={moment} />
          ))}
        </ul>
        <div className="mt-auto flex gap-2">
          <YouTubeButton youtubeId={song.youtubeId} />
          <SpotifyButton spotifyId={song.spotifyId} />
          <FandomButton fandomId={song.fandomUrl} />
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
    <div
      className={`rounded select-none overflow-hidden shadow ${
        className ?? ""
      }`}
    >
      <img
        src={getYouTubeThumbnail(youtubeId)}
        alt="YouTube thumbnail"
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
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

function FandomButton({ fandomId }: { fandomId: string }) {
  return (
    <IconLink
      href={`https://genshin-impact.fandom.com/wiki/${fandomId}`}
      icon={<SiFandom />}
      className="bg-[#FA005A] text-white"
    />
  );
}
