import Game from "./components/Game";
import Navbar from "./components/Navbar";
import StorageProvider from "./StorageProvider";

export default function App() {
  return (
    <StorageProvider>
      <div className="w-screen h-screen grid grid-cols-[auto_1fr] overflow-auto">
        <Navbar />
        <Game />
      </div>
    </StorageProvider>
  );
}
