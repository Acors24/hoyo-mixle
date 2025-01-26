import { useStorage } from "../StorageContext";
import { FiExternalLink, FiHelpCircle } from "react-icons/fi";
import Dialog from "./Dialog";

export default function HowToPlay() {
  const { state, dispatch } = useStorage();

  const onClose = () => {
    dispatch({
      type: "SET_HOW_TO_PLAY_SEEN",
      payload: true,
    });
  };

  return (
    <Dialog
      title="How to play"
      icon={<FiHelpCircle />}
      onClose={onClose}
      initialOpen={!state.config.howToPlaySeen}
    >
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
        Listen to the samples and select the corresponding song from the list of
        all currently available songs.
      </p>

      <p>
        Each guess will appear in the table below. Additional song information
        such as album title, region and type will be included to help you find
        the correct song.
      </p>

      <p>
        Additionally, based on known song attributes, the list of songs will be
        automatically filtered.
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
    </Dialog>
  );
}
