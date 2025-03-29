import { CgSpinner } from "react-icons/cg";
import YouTube from "react-youtube";
import IconButton from "./IconButton";
import { FaPlay, FaStop } from "react-icons/fa6";
import { getSimplePlayerState } from "../utils";

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

  const state = getSimplePlayerState(playerState);

  const icon =
    state === "loading" ? (
      <CgSpinner className="animate-spin" />
    ) : state === "playing" && id === playingId ? (
      <FaStop />
    ) : (
      <FaPlay />
    );
  const disabled = state === "loading";

  return (
    <span className="sample-control">
      <IconButton
        icon={icon}
        onClick={handleButtonClick}
        className="z-10"
        disabled={disabled}
      />
      <span className="progress-bar-container">
        <span className="sample-label">{label}</span>
        <span
          className="progress-bar"
          data-playing={playerState === 1 && id === playingId}
        ></span>
      </span>
    </span>
  );
}
