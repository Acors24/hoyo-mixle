import { createLazyFileRoute } from "@tanstack/react-router";
import Game from "../components/Game";
import { AlbumsContext } from "../AlbumsContext";
import albums from "../assets/genshin-impact-albums.json";

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
