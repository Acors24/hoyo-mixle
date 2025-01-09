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
    <div className="w-4/5 bg-slate-800 bg-opacity-50 rounded-full m-2 flex items-center select-none">
      <IconButton icon={icon} onClick={handleButtonClick} disabled={disabled} />
      <span
        ref={trackBarRef}
        onClick={handleTrackBarClick}
        className="w-full h-5 py-2 mx-4 cursor-pointer"
      >
        <div className="bg-white bg-opacity-20 relative h-full rounded-full overflow-hidden">
          <span
            className="absolute bg-white bg-opacity-50 left-0 h-full duration-100 ease-linear"
            style={{
              width: `${(time / duration) * 100}%`,
            }}
          ></span>
          {starts.map((start) => (
            <span
              key={start}
              className="bg-white bg-opacity-70 absolute h-full top-0"
              style={{
                left: `${(start / duration) * 100}%`,
                width: `${(3 / duration) * 100}%`,
              }}
            ></span>
          ))}
        </div>
      </span>
    </div>
  );
}
