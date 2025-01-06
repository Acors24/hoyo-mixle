import { useEffect, useRef, useState } from "react";
import { useStorage } from "../StorageContext";
import { FiExternalLink, FiHelpCircle, FiX } from "react-icons/fi";

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
      <button onClick={() => setOpen(true)}>
        <FiHelpCircle />
      </button>
      <dialog ref={dialogRef} onClose={onClose} className="*:mt-2 first:*:mt-0">
        <div className="flex justify-between mb-4">
          <h2 className="text-3xl font-bold">How to play</h2>
          <button autoFocus onClick={onClose}>
            <FiX className="text-2xl" />
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
            <FiExternalLink className="ml-1 inline text-xs align-baseline" />
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

        <div className="bg-rose-500 bg-opacity-10 border-rose-500 border rounded-xl p-2">
          <p>
            An ad blocker is strongly recommended to prevent YouTube ads from
            playing while listening to the samples.
          </p>
        </div>
      </dialog>
    </>
  );
}
