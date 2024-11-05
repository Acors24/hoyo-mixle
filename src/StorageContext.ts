import { createContext, useContext } from "react";
import { StorageContextType } from "./types";

export const StorageContext = createContext<StorageContextType | undefined>(
  undefined
);

export function useStorage() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
}
