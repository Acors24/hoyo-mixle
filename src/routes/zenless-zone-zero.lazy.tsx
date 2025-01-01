import { createLazyFileRoute } from "@tanstack/react-router";
import { AlbumsContext } from "../AlbumsContext";
import Game from "../components/Game";
import albums from "../assets/albums/zenless-zone-zero.json";

export const Route = createLazyFileRoute("/zenless-zone-zero")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AlbumsContext.Provider value={albums}>
      <Game currentGame="zenlessZoneZero" />
    </AlbumsContext.Provider>
  );
}
