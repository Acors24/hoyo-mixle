import { useRef, useState } from "react";
import { FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from "react-icons/fa6";
import IconButton from "./IconButton";
import * as Slider from "@radix-ui/react-slider";

export default function VolumeControl({
  initialVolume,
  onVolumeChange,
}: {
  initialVolume: number;
  onVolumeChange: (volume: number) => void;
}) {
  const handleVolumeChange = (value: number) => {
    onVolumeChange(Number(value));
    setVolume(Number(value));
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
    <div id="volume-control">
      <Slider.Root
        className="slider-root"
        value={[volume]}
        onValueChange={(vs) => handleVolumeChange(vs[0])}
        orientation="vertical"
      >
        <Slider.Track className="slider-track">
          <Slider.Range className="slider-range" />
        </Slider.Track>
        <Slider.Thumb className="slider-thumb" />
      </Slider.Root>
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
