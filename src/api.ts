import { useState } from "react";
import { DBResult } from "./types";
import { getTodayDateString } from "./utils";

const localApiUrl = "http://localhost:8787/";
const prodApiUrl = "https://hoyo-mixle-server.acors.workers.dev/";

const isDev = import.meta.env?.DEV ?? process.env?.NODE_ENV === "development";
const apiUrl = isDev ? localApiUrl : prodApiUrl;

export async function fetchDailySongs() {
  const todayDateString = getTodayDateString();
  const fetchUrl = new URL(apiUrl);
  fetchUrl.searchParams.append("date", todayDateString);

  try {
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      console.error("Failed to fetch daily songs");
      return null;
    }

    const data = (await response.json()) as DBResult;

    if (data.length === 0) {
      console.error("No daily songs available");
      return null;
    }

    return data[0];
  } catch {
    return null;
  }
}

export function useHistory(doFetch: boolean): {
  data: DBResult | null;
  pending: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<DBResult | null>(null);
  const [pending, setPending] = useState<boolean>(doFetch);
  const [error, setError] = useState<Error | null>(null);

  if (data !== null || !doFetch) {
    return { data, pending, error };
  }

  async function fetchHistory() {
    const fetchUrl = new URL(apiUrl);
    fetchUrl.searchParams.append("all", "true");

    setError(null);
    try {
      const promise = fetch(fetchUrl);
      setPending(true);
      const response = await promise;
      if (!response.ok) {
        throw new Error();
      }
      const fetchedData = (await response.json()) as DBResult;
      setData(fetchedData);
    } catch {
      setError(new Error("Failed to fetch history. Try again later."));
    } finally {
      setPending(false);
    }
  }

  if (!pending && !error) {
    fetchHistory();
  }
  return { data, pending, error };
}
