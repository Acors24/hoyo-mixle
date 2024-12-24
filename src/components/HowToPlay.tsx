import { useEffect, useRef, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaRegCircleQuestion, FaRegCircleXmark } from "react-icons/fa6";
import { useStorage } from "../StorageContext";

export default function HowToPlay() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { state, dispatch } = useStorage();
  const [open, setOpen] = useState(!state.config.howToPlaySeen);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const onClose = () => {
    setOpen(false);
    dispatch({
      type: "SET_HOW_TO_PLAY_SEEN",
      payload: true,
    });
  };

  return (
    <>
      <dialog
        ref={dialogRef}
        onClose={onClose}
        className="bg-slate-800 bg-opacity-50 backdrop-blur text-white p-4 rounded-xl max-w-[min(80vw,800px)] max-h-[min(80vh,600px)] backdrop:bg-black backdrop:bg-opacity-80 shadow *:mt-2 first:*:mt-0"
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-3xl font-bold">How to play</h2>
          <button autoFocus onClick={onClose}>
            <FaRegCircleXmark className="text-2xl" />
          </button>
        </div>

        <p>
          Each day, a random{" "}
          <a
            href="https://en.wikipedia.org/wiki/HOYO-MiX"
            target="_blank"
            rel="noreferrer"
            className="text-amber-200 hover:underline"
          >
            HOYO-MiX
            <FaExternalLinkAlt className="ml-1 inline text-xs align-baseline" />
          </a>{" "}
          song is chosen. 3 short samples are randomly selected for this song.
        </p>
        <p>
          Listen to the samples and select the corresponding song from the list
          of all currently available songs.
        </p>

        <p>
          Each guess will appear in the table below. Additional song information
          such as album title, region and type will be included to help you find
          the correct song.
        </p>

        <p>
          Additionally, based on known song attributes, the list of songs will
          be automatically filtered.
        </p>

        <p className="font-bold">
          You have 5 attempts to guess the correct song.
        </p>
        <ul className="list-disc list-inside">
          <li>After 1 incorrect guess, the album titles will be revealed.</li>
          <li>After 2 incorrect guesses, the regions will be revealed.</li>
          <li>
            After 3 incorrect guesses, the moments at which the songs are played
            will be revealed.
          </li>
          <li>
            After 4 incorrect guesses, the amount of songs per album will be
            limited to 4.
          </li>
        </ul>
        <p>
          Track titles, album titles and game parts are taken from the{" "}
          <a
            href="https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki"
            target="_blank"
            rel="noreferrer"
            className="text-amber-200 hover:underline"
          >
            Genshin Impact Fandom Wiki
            <FaExternalLinkAlt className="ml-1 inline text-xs align-baseline" />
          </a>{" "}
          and{" "}
          <a
            href="https://honkai-star-rail.fandom.com/wiki/Honkai:_Star_Rail_Wiki"
            target="_blank"
            rel="noreferrer"
            className="text-amber-200 hover:underline"
          >
            Honkai: Star Rail Fandom Wiki
            <FaExternalLinkAlt className="ml-1 inline text-xs align-baseline" />
          </a>
          . Track types and regions are decided by me and may not be accurate.
        </p>

        <div className="bg-rose-500 bg-opacity-10 border-rose-500 border rounded-xl p-2">
          <p>
            An ad blocker is strongly recommended to prevent YouTube ads from
            playing while listening to the samples.
          </p>
        </div>

        <div className="bg-amber-500 bg-opacity-10 border-amber-500 border rounded-xl p-2">
          <p>
            This is currently a work in progress. More features and
            improvements, including more albums, will be added in the future.
          </p>
          <p className="mt-2">
            You can report any issues or suggest improvements by messaging{" "}
            <span className="font-bold text-sky-200">acors</span> on Discord.
          </p>
        </div>
      </dialog>
      <button onClick={() => setOpen(true)}>
        <FaRegCircleQuestion className="text-3xl" />
      </button>
    </>
  );
}
