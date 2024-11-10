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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const intervalId = useRef<NodeJS.Timeout>();

  const resetCanvas = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#FFFFFF3F";
      ctx.fillRect(0, 0, width, height);

      const sampleLength = 3;
      const highlightLength = (width / duration) * sampleLength;

      ctx.fillStyle = "#FFFFFF7F";
      starts.forEach((start) => {
        const x = (start / duration) * width;
        ctx.fillRect(x, 0, highlightLength, height);
      });
    }
  }, [duration, starts]);

  useEffect(() => {
    resetCanvas();
  }, [resetCanvas]);

  const startPainting = useCallback(() => {
    const ctx = canvasRef.current!.getContext("2d")!;
    const width = canvasRef.current!.width;
    const height = canvasRef.current!.height;
    intervalId.current = setInterval(async () => {
      const time =
        (await playerRef.current?.internalPlayer?.getCurrentTime()) ?? 0;
      paintProgress(ctx, width, height, time / duration);
    }, 50);
  }, [duration, playerRef]);

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
        clearInterval(intervalId.current!);
        resetCanvas();
        break;
      case YT.PlayerState.BUFFERING:
        clearInterval(intervalId.current!);
        break;
    }
  }, [playerState, startPainting, resetCanvas]);

  const handleButtonClick = () => {
    if (!playerRef.current || !playerRef.current.internalPlayer) {
      return;
    }

    if (playing) {
      playerRef.current.internalPlayer.pauseVideo();
      playerRef.current.internalPlayer.seekTo(0, true);
    } else {
      resetCanvas();
      playerRef.current.internalPlayer.playVideo();
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!playerRef.current || !playerRef.current.internalPlayer) {
      return;
    }

    resetCanvas();
    const ctx = canvasRef.current!.getContext("2d")!;
    const canvasWidth = canvasRef.current!.width;
    const canvasHeight = canvasRef.current!.height;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = duration * percentage;
    playerRef.current.internalPlayer.seekTo(time, true);
    paintProgress(ctx, canvasWidth, canvasHeight, percentage);
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
    <div className="w-4/5 bg-slate-800 bg-opacity-50 rounded-full m-2 flex items-center">
      <IconButton icon={icon} onClick={handleButtonClick} disabled={disabled} />
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-5 py-2 mx-4 rounded-full cursor-pointer"
      />
    </div>
  );
}

const paintProgress = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  percentage: number
) => {
  ctx.fillStyle = "#FFFFFF";
  const x = percentage * canvasWidth;
  ctx.fillRect(0, 0, x, canvasHeight);
};
