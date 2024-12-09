import { LocalStorage, StorageAction } from "./types";

export function StorageReducer(
  state: LocalStorage,
  action: StorageAction
): LocalStorage {
  switch (action.type) {
    case "SET_HOW_TO_PLAY_SEEN":
      return {
        ...state,
        config: {
          ...state.config,
          howToPlaySeen: action.payload,
        },
      };
    case "SET_VOLUME":
      return {
        ...state,
        config: {
          ...state.config,
          volume: action.payload,
        },
      };
    case "SET_LAST_CHANGELOG_SEEN":
      return {
        ...state,
        config: {
          ...state.config,
          lastChangelogSeen: action.payload,
        },
      };
    case "SET_GUESSES":
      return {
        ...state,
        gameData: {
          ...state.gameData,
          [action.payload.game]: {
            ...state.gameData[action.payload.game],
            validForSongs: action.payload.validForSongs,
            [action.payload.mode]: {
              ...state.gameData[action.payload.game][action.payload.mode],
              ...{
                ...(action.payload.mode === "daily"
                  ? {
                      day: new Date().toDateString(),
                    }
                  : {
                      songId: action.payload.songId,
                    }),
              },
              guesses: action.payload.guesses,
            },
          },
        },
      };
    case "LOCK_ENDLESS_SONG":
      return {
        ...state,
        gameData: {
          ...state.gameData,
          [action.payload.game]: {
            ...state.gameData[action.payload.game],
            endless: {
              ...state.gameData[action.payload.game].endless,
              songId: action.payload.songId,
            },
          },
        },
      };
    case "INCREMENT_STREAK":
      return {
        ...state,
        gameData: {
          ...state.gameData,
          [action.payload.game]: {
            ...state.gameData[action.payload.game],
            [action.payload.mode]: {
              ...state.gameData[action.payload.game][action.payload.mode],
              streak:
                state.gameData[action.payload.game][action.payload.mode]
                  .streak + 1,
            },
          },
        },
      };
    case "RESET_STREAK":
      return {
        ...state,
        gameData: {
          ...state.gameData,
          [action.payload.game]: {
            ...state.gameData[action.payload.game],
            [action.payload.mode]: {
              ...state.gameData[action.payload.game][action.payload.mode],
              streak: 0,
              highestStreak: Math.max(
                state.gameData[action.payload.game][action.payload.mode].streak,
                state.gameData[action.payload.game][action.payload.mode]
                  .highestStreak
              ),
            },
          },
        },
      };
    default:
      return state;
  }
}
