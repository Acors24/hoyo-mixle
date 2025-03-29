import { createLazyFileRoute } from "@tanstack/react-router";
import { AlbumsContext } from "../AlbumsContext";
import Game from "../components/Game";
import albums from "../assets/albums/honkai-star-rail.json";
import "../assets/styles/honkai-star-rail.css";

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
