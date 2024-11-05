import { useState } from "react";
import { FaRegCircleQuestion } from "react-icons/fa6";
import HowToPlay from "./HowToPlay";
import { useStorage } from "../StorageContext";

export default function Navbar() {
  const { state, dispatch } = useStorage();
  const [howToPlayOpen, setHowToPlayOpen] = useState(
    !state.config.howToPlaySeen
  );

  const handleHowToPlayClose = () => {
    setHowToPlayOpen(false);
    dispatch({
      type: "SET_HOW_TO_PLAY_SEEN",
      payload: true,
    });
  };

  return (
    <nav className="bg-slate-900 px-2 py-4 flex flex-col justify-end">
      <HowToPlay open={howToPlayOpen} onClose={handleHowToPlayClose} />
      <button onClick={() => setHowToPlayOpen(true)}>
        <FaRegCircleQuestion className="text-3xl" />
      </button>
    </nav>
  );
}
