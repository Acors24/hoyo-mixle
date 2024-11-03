import { useState } from "react";
import { FaRegCircleQuestion } from "react-icons/fa6";
import HowToPlay from "./HowToPlay";
import { howToPlaySeen, setHowToPlaySeen } from "../utils";

export default function Navbar() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(!howToPlaySeen());

  const handleHowToPlayClose = () => {
    setHowToPlayOpen(false);
    setHowToPlaySeen();
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
