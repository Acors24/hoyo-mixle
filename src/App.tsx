import Game from "./components/Game";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="w-screen h-screen grid grid-cols-[auto_1fr] overflow-auto">
      <Navbar />
      <Game />
    </div>
  );
}
