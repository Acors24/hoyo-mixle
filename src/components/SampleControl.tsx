import { CgSpinner } from "react-icons/cg";
import YouTube from "react-youtube";
import IconButton from "./IconButton";
import { FaPlay, FaStop } from "react-icons/fa6";

export default function SampleControl({
  id,
  playingId,
  setPlayingId,
  label,
  playerRef,
  startAt,
  playerState,
}: {
  id: number;
  playingId: number;
  setPlayingId: (id: number) => void;
  label: string;
  playerRef: React.MutableRefObject<YouTube | null>;
  startAt: number;
  playerState: YT.PlayerState;
}) {
  const handleButtonClick = () => {
    if (!playerRef.current || !playerRef.current.internalPlayer) {
      return;
    }

    if (playerState === YT.PlayerState.PLAYING && id === playingId) {
      playerRef.current.internalPlayer.pauseVideo();
      setPlayingId(-1);
    } else if (playerState !== YT.PlayerState.BUFFERING) {
      playerRef.current.internalPlayer.pauseVideo();
      playerRef.current.internalPlayer.seekTo(startAt, true);
      playerRef.current.internalPlayer.playVideo();
      setPlayingId(id);
    }
  };

  const disabled = playerState === 3 || playerState === -1;

  const icon =
    playerState === 1 && id === playingId ? (
      <FaStop />
    ) : (playerState === 1 && id !== playingId) ||
      playerState === -1 ||
      playerState === 0 ||
      playerState === 5 ||
      playerState === 2 ? (
      <FaPlay />
    ) : (
      <CgSpinner className="animate-spin" />
    );

  return (
    <span
      className={`w-max flex items-center bg-slate-800 bg-opacity-50 rounded-full relative before:absolute before:bg-gradient-to-r before:from-transparent before:to-[#fff3] before:rounded-full before:left-0 before:top-0 before:bottom-0 before:right-full ${
        playerState === 1 && id === playingId ? "before:animate-fill" : ""
      }`}
    >
      <IconButton
        icon={icon}
        onClick={handleButtonClick}
        className="z-10"
        disabled={disabled}
      />
      <span className="px-10 select-none">{label}</span>
    </span>
  );
}
