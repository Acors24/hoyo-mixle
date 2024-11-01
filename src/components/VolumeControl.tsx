import { useRef, useState } from "react";
import { FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from "react-icons/fa6";
import IconButton from "./IconButton";

export default function VolumeControl({
  initialVolume,
  onVolumeChange,
}: {
  initialVolume: number;
  onVolumeChange: (volume: number) => void;
}) {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(Number(e.target.value));
    setVolume(Number(e.target.value));
  };

  const [volume, setVolume] = useState(initialVolume);
  const previousVolume = useRef(initialVolume);

  const handleButtonClick = () => {
    if (volume > 0) {
      previousVolume.current = volume;
      setVolume(0);
      onVolumeChange(0);
    } else {
      setVolume(previousVolume.current);
      onVolumeChange(previousVolume.current);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 bg-slate-800 bg-opacity-50 rounded-full h-full">
      <input
        type="range"
        value={volume}
        onChange={handleVolumeChange}
        style={{ writingMode: "vertical-lr", direction: "rtl" }}
        className="mt-4"
      />
      <IconButton
        icon={
          volume > 50 ? (
            <FaVolumeHigh />
          ) : volume > 0 ? (
            <FaVolumeLow />
          ) : (
            <FaVolumeXmark />
          )
        }
        onClick={handleButtonClick}
      />
    </div>
  );
}
