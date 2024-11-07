import { createContext, useContext } from "react";
import { Album } from "./types";

export const AlbumsContext = createContext<Album[] | undefined>(undefined);

export function useAlbums() {
  const context = useContext(AlbumsContext);
  if (context === undefined) {
    throw new Error("useAlbums must be used within a AlbumsProvider");
  }
  return context;
}
