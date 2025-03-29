import { createLazyFileRoute } from "@tanstack/react-router";
import Game from "../components/Game";
import { AlbumsContext } from "../AlbumsContext";
import albums from "../assets/albums/genshin-impact.json";
import "../assets/styles/genshin-impact.css";

export const Route = createLazyFileRoute("/genshin-impact")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AlbumsContext.Provider value={albums}>
      <Game currentGame="genshinImpact" />
    </AlbumsContext.Provider>
  );
}
