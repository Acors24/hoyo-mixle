import { useEffect, useState } from "react";
import night from "../assets/night.png";

export default function Background({
  visible,
  dailySrc,
  endlessSrc,
}: {
  visible: "playing" | "daily" | "endless";
  dailySrc: string;
  endlessSrc: string;
}) {
  const [delayedDailySrc, setDelayedDailySrc] = useState(dailySrc);
  const [delayedEndlessSrc, setDelayedEndlessSrc] = useState(endlessSrc);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedDailySrc(dailySrc);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [dailySrc]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedEndlessSrc(endlessSrc);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [endlessSrc]);

  return (
    <>
      <img
        src={night}
        alt=""
        className={`fixed w-full h-full object-cover duration-1000 ${
          visible === "playing" ? "opacity-100" : "opacity-0"
        }`}
      />
      <img
        src={delayedDailySrc}
        alt=""
        className={`fixed w-full h-full object-cover blur-3xl duration-1000 ${
          visible === "daily" ? "opacity-100" : "opacity-0"
        }`}
      />
      <img
        src={delayedEndlessSrc}
        alt=""
        className={`fixed w-full h-full object-cover blur-3xl duration-1000 ${
          visible === "endless" ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
