import { useEffect, useRef, useState } from "react";
import VolumeControl from "./VolumeControl";
import { Song } from "../types";
import YouTube, { YouTubeEvent } from "react-youtube";
import SampleControl from "./SampleControl";
import { CgSpinner } from "react-icons/cg";
import { getStarts } from "../utils";
import { useStorage } from "../StorageContext";
import TrackBar from "./TrackBar";

export default function SamplePlayer({
  song,
  endlessMode,
  gameState,
}: {
  song: Song;
  endlessMode: boolean;
  gameState: "playing" | "won" | "lost";
}) {
  const { state, dispatch } = useStorage();

  const playerRef = useRef<YouTube>(null);
  const timeoutHandle = useRef<NodeJS.Timeout>();
  const [playerState, setPlayerState] = useState(3);
  const [playingId, setPlayingId] = useState(-1);

  const durationRef = useRef<number>();
  const [starts, setStarts] = useState<number[]>([]);

  useEffect(() => {
    setStarts([]);
  }, [song]);

  const volume = state.config.volume;
  const setVolume = (volume: number) => {
    playerRef.current?.internalPlayer?.setVolume(volume);
    dispatch({ type: "SET_VOLUME", payload: volume });
  };

  const handleStateChange = ({ data, target }: YouTubeEvent<number>) => {
    setPlayerState(data);
    if (gameState !== "playing") {
      return;
    }

    if (data === YT.PlayerState.PLAYING) {
      timeoutHandle.current = setTimeout(() => {
        target.pauseVideo();
      }, 3000);
    } else if (
      data === YT.PlayerState.PAUSED ||
      data === YT.PlayerState.ENDED ||
      data === YT.PlayerState.CUED
    ) {
      if (timeoutHandle.current) {
        clearTimeout(timeoutHandle.current);
        timeoutHandle.current = undefined;
      }
    }
  };

  const onReady = async () => {
    setPlayerState(
      (await playerRef.current?.internalPlayer?.getPlayerState()) ??
        YT.PlayerState.UNSTARTED
    );
    setVolume(volume);
    const player = playerRef.current;
    if (!player) {
      console.error("Failed to get player");
      return;
    }
    const internalPlayer = player.internalPlayer;
    if (!internalPlayer) {
      console.error("Failed to get internal player");
      return;
    }

    let duration = await internalPlayer.getDuration();
    // Workaround for getDuration returning `undefined`
    // Try to get the duration only thrice to prevent infinite loops from creating while quickly switching modes
    for (let i = 0; i < 3 && duration === undefined; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      duration = await internalPlayer.getDuration();
    }
    if (duration === undefined) {
      console.error("Failed to get duration");
      return;
    }

    durationRef.current = duration;
    const starts = getStarts(duration, endlessMode);
    setStarts(starts);
  };

  return (
    <>
      <YouTube
        ref={playerRef}
        videoId={song.youtubeId}
        opts={{
          width: "0",
          height: "0",
          playerVars: {
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            origin: window.location.origin,
            playsinline: 1,
          },
        }}
        onReady={onReady}
        onStateChange={handleStateChange}
        className="hidden"
      />
      {starts.length === 0 && (
        <CgSpinner className="my-2 w-8 h-8 animate-spin" />
      )}
      {starts.length !== 0 && gameState === "playing" && (
        <>
          <div className="flex items-center gap-4 m-2">
            <VolumeControl initialVolume={volume} onVolumeChange={setVolume} />
            <div className="flex flex-col gap-4">
              {starts.map((startAt, index) => (
                <SampleControl
                  key={index}
                  id={index}
                  playingId={playingId}
                  setPlayingId={setPlayingId}
                  label={`Sample ${index + 1}`}
                  playerRef={playerRef}
                  startAt={startAt}
                  playerState={playerState}
                />
              ))}
            </div>
          </div>
        </>
      )}
      {starts.length !== 0 && gameState !== "playing" && (
        <TrackBar
          duration={durationRef.current ?? 1}
          starts={starts}
          playerRef={playerRef}
          playerState={playerState}
        />
      )}
    </>
  );
}
