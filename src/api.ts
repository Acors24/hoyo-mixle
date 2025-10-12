import { DBResult } from "./types";
import { getTodayDateString } from "./utils";

const localApiUrl = "http://localhost:8787/";
const prodApiUrl = "https://hoyo-mixle-server.acors.workers.dev/";

const isDev = import.meta?.env?.DEV ?? process.env?.NODE_ENV === "development";
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
