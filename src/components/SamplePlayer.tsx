import { useRef, useState } from "react";
import VolumeControl from "./VolumeControl";
import { Song } from "../types";
import YouTube, { YouTubeEvent } from "react-youtube";
import SampleControl from "./SampleControl";
import { Random } from "random";
import { CgSpinner } from "react-icons/cg";

export default function SamplePlayer({ song }: { song: Song }) {
  const playerRef = useRef<YouTube>(null);
  const timeoutHandle = useRef<NodeJS.Timeout>();
  const [playerState, setPlayerState] = useState(3);
  const [playingId, setPlayingId] = useState(-1);

  const [starts, setStarts] = useState<number[]>([]);

  const initialVolume = Number(localStorage.getItem("volume") ?? 50);
  const setVolume = (volume: number) => {
    playerRef.current?.internalPlayer?.setVolume(volume);
    localStorage.setItem("volume", volume.toString());
  };

  const handleStateChange = ({ data, target }: YouTubeEvent<number>) => {
    setPlayerState(data);
    if (data === YT.PlayerState.PLAYING) {
      timeoutHandle.current = setTimeout(() => {
        target.pauseVideo();
      }, 3000);
    } else if (
      data === YT.PlayerState.PAUSED ||
      data === YT.PlayerState.ENDED
    ) {
      if (timeoutHandle.current) {
        clearTimeout(timeoutHandle.current);
        timeoutHandle.current = undefined;
      }
    }
  };

  const onReady = async () => {
    setPlayerState(YT.PlayerState.PAUSED);
    setVolume(initialVolume);
    const duration = await playerRef.current?.internalPlayer?.getDuration();
    if (!duration) {
      alert("Failed to get duration");
      return;
    }

    const today = new Date().toDateString();
    const rng = new Random(today).uniformInt(0, duration - 10);
    const starts = Array(3).fill(0).map(rng);
    setStarts(starts);
  };

  return (
    <div className="flex items-center gap-4 p-4">
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
      {starts.length === 0 && <CgSpinner className="w-20 h-20 animate-spin" />}
      {starts.length !== 0 && (
        <>
          <VolumeControl
            initialVolume={initialVolume}
            onVolumeChange={setVolume}
          />
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
        </>
      )}
    </div>
  );
}
