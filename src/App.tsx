import Game from "./components/Game";
import Navbar from "./components/Navbar";
import StorageProvider from "./StorageProvider";
import albums from "./assets/genshin-impact-albums.json";
import { AlbumsContext } from "./AlbumsContext";

export default function App() {
  return (
    <StorageProvider>
      <div className="w-screen h-screen grid grid-cols-[auto_1fr] overflow-auto">
        <Navbar />
        <AlbumsContext.Provider value={albums}>
          <Game />
        </AlbumsContext.Provider>
      </div>
    </StorageProvider>
  );
}
