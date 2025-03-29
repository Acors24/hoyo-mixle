import { useCallback, useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { FaPlay, FaStop } from "react-icons/fa6";
import YouTube from "react-youtube";
import { CgSpinner } from "react-icons/cg";
import { getSimplePlayerState } from "../utils";

export default function TrackBar({
  duration,
  starts,
  playerRef,
  playerState,
}: {
  duration: number;
  starts: number[];
  playerRef: React.MutableRefObject<YouTube | null>;
  playerState: YT.PlayerState;
}) {
  const trackBarRef = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  const intervalId = useRef<NodeJS.Timeout>();
  const [time, setTime] = useState(0);

  const startPainting = useCallback(() => {
    intervalId.current = setInterval(async () => {
      const time =
        (await playerRef.current?.internalPlayer?.getCurrentTime()) ?? 0;
      setTime(time);
    }, 100);
  }, [playerRef]);

  const stopPainting = () => {
    clearInterval(intervalId.current!);
  };

  useEffect(() => {
    switch (playerState) {
      case YT.PlayerState.PLAYING:
        setPlaying(true);
        startPainting();
        break;
      case YT.PlayerState.PAUSED:
      case YT.PlayerState.ENDED:
      case YT.PlayerState.CUED:
        setPlaying(false);
        setTime(0);
        stopPainting();
        break;
      case YT.PlayerState.BUFFERING:
        setPlaying(false);
        stopPainting();
        break;
    }
  }, [playerState, startPainting]);

  const handleButtonClick = () => {
    if (!playerRef.current || !playerRef.current.internalPlayer) {
      return;
    }

    if (playing) {
      playerRef.current.internalPlayer.pauseVideo();
      playerRef.current.internalPlayer.seekTo(0, true);
    } else {
      playerRef.current.internalPlayer.playVideo();
    }
  };

  const handleTrackBarClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!playerRef.current || !playerRef.current.internalPlayer) {
      return;
    }

    const rect = trackBarRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = duration * percentage;
    playerRef.current.internalPlayer.seekTo(time, true);
    setTime(time);
  };

  const state = getSimplePlayerState(playerState);

  const icon =
    state === "playing" ? (
      <FaStop />
    ) : state === "idle" ? (
      <FaPlay />
    ) : (
      <CgSpinner className="animate-spin" />
    );
  const disabled = state === "loading";

  return (
    <div id="trackbar-container">
      <IconButton icon={icon} onClick={handleButtonClick} disabled={disabled} />
      <span ref={trackBarRef} onClick={handleTrackBarClick} id="trackbar-track">
        <span
          id="trackbar-range"
          style={{
            width: `${(time / duration) * 100}%`,
          }}
        ></span>
        {starts.map((start) => (
          <span
            key={start}
            className="trackbar-sample"
            style={{
              left: `${(start / duration) * 100}%`,
              width: `${(3 / duration) * 100}%`,
            }}
          ></span>
        ))}
      </span>
    </div>
  );
}
