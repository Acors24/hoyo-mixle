import { createLazyFileRoute } from "@tanstack/react-router";
import { AlbumsContext } from "../AlbumsContext";
import Game from "../components/Game";
import albums from "../assets/albums/honkai-star-rail.json";

export const Route = createLazyFileRoute("/star-rail")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AlbumsContext.Provider value={albums}>
      <Game currentGame="starRail" />
    </AlbumsContext.Provider>
  );
}
