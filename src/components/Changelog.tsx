import { useStorage } from "../StorageContext";
import { FiFileText } from "react-icons/fi";
import Dialog from "./Dialog";

const history = [
  {
    date: "2025-05-04",
    changes: [
      "Added missing Fandom links for some songs",
      'Added "Experience the Paths Vol. 4" album (Honkai: Star Rail)',
      "Adjusted context for some Honkai: Star Rail songs",
      "Added context for Zenless Zone Zero songs",
      "Adjusted some Zenless Zone Zero album data",
    ],
  },
  {
    date: "2025-05-01",
    changes: ["Optimized calendar logic"],
  },
  {
    date: "2025-04-30",
    changes: ["Added a calendar to track your progress"],
  },
  {
    date: "2025-04-29",
    changes: [
      "Fixed certain styling issues",
      "Added an entry/exit transition for dialogs",
      "Added some missing About text",
    ],
  },
  {
    date: "2025-04-28",
    changes: ["Added unique styling for each mode", "Adjusted general styling"],
  },
  {
    date: "2025-04-23",
    changes: ["Fixed the YouTube ID of a song"],
  },
  {
    date: "2025-04-16",
    changes: ["Fixed some Fandom URLs"],
  },
  {
    date: "2025-04-06",
    changes: [
      "Possibly fixed the midnight DST bug",
      "Added album stats dialog",
    ],
  },
  {
    date: "2025-04-03",
    changes: ['Added "Zenless Zone Zero" mode'],
  },
  {
    date: "2025-03-29",
    changes: [
      'Added "Allegory of the Cave (Part 1)" album (Honkai: Star Rail) (missing some Fandom links)',
    ],
  },
  {
    date: "2025-02-15",
    changes: ['Added "Azure Lantern, Jade Inkstone" album (Genshin Impact)'],
  },
  {
    date: "2025-02-01",
    changes: ["Added context for Honkai: Star Rail songs"],
  },
  {
    date: "2025-01-30",
    changes: [
      "Improved guess table styling on narrow screens",
      "Possibly improved the navbar layout on mobile",
    ],
  },
  {
    date: "2025-01-28",
    changes: [
      "Added a missing Genshin Impact song",
      "Albums are now always visible in the song filter",
      "Added context for Genshin Impact songs (thanks to Lugunium), revealed after 3 incorrect guesses",
    ],
  },
  {
    date: "2025-01-26",
    changes: ['Added "The Stellar Moments Vol. 5" album (Genshin Impact)'],
  },
  {
    date: "2025-01-25",
    changes: ["Possibly drastically improved the RNG"],
  },
  {
    date: "2025-01-12",
    changes: [
      'Added "Land of Tleyaoyotl" album (Genshin Impact)',
      'Added "Eternal Sun, Eternal Want" album (Genshin Impact)',
      'Added "Blazing Heart" album (Genshin Impact)',
      "Fixed About dialog not opening under certain conditions",
    ],
  },
  {
    date: "2025-01-10",
    changes: ["Improved the appearance of the trackbar"],
  },
  {
    date: "2025-01-06",
    changes: [
      "Adjusted HSR album data",
      "Adjusted song card styling",
      "Added a button for clearing the song filter input",
      "Improved navbar and dialog styling",
      "Split How to Play and About into separate dialogs",
      "Replaced Endless Mode checkbox with a switch",
      "Adjusted the appearance of the volume slider",
    ],
  },
  {
    date: "2025-01-05",
    changes: [
      "Adjusted indicator styling",
      'Added "WHITE NIGHT" album (Honkai: Star Rail)',
      'Added "Experience the Paths Vol. 2" album (Honkai: Star Rail)',
      'Added "INSIDE" album (Honkai: Star Rail)',
      'Added "The Flapper Sinthome (Part 1)" album (Honkai: Star Rail)',
      "Adjusted song card styling",
      'Added "Had I Not Seen The Sun" album (Honkai: Star Rail)',
      'Added "The Flapper Sinthome (Part 2)" album (Honkai: Star Rail)',
      'Added "Experience the Paths Vol. 3" album (Honkai: Star Rail)',
      'Added "No Dazzle, No Break" album (Honkai: Star Rail)',
      'Added "Astral Theater Vol. 2" album (Honkai: Star Rail)',
      'Added "Nameless Faces" album (Honkai: Star Rail)',
    ],
  },
  {
    date: "2025-01-04",
    changes: [
      "Added type and region to the song card",
      "Improved the trackbar",
    ],
  },
  {
    date: "2025-01-02",
    changes: [
      "Improved the appearance of the scrollbars and the guess table",
      "Optimized the song list (maybe)",
    ],
  },
  {
    date: "2025-01-01",
    changes: ["Fix incorrect song selection on the 5th guess"],
  },
  {
    date: "2024-12-31",
    changes: [
      `Added "The Shimmering Voyage Vol. 2" album (Genshin Impact)`,
      `Added "Footprints of the Traveler" album (Genshin Impact)`,
      `Added "Forest of Jnana and Vidya" album (Genshin Impact)`,
      `Added "The Stellar Moments Vol. 3" album (Genshin Impact)`,
      `Added "The Unfathomable Sand Dunes" album (Genshin Impact)`,
      `Added "Footprints of the Traveler Vol. 2" album (Genshin Impact)`,
      `Added "The Shimmering Voyage Vol. 3" album (Genshin Impact)`,
      `Added "Fountain of Belleau" album (Genshin Impact)`,
      `Added "La vaguelette" album (Genshin Impact)`,
      `Added "The Stellar Moments Vol. 4" album (Genshin Impact)`,
      `Added "Pelagic Primaevality" album (Genshin Impact)`,
      `Added "Jadeite Redolence" album (Genshin Impact)`,
      `Added "Emberfire" album (Genshin Impact)`,
      `Added "Cantus Aeternus" album (Genshin Impact)`,
      `Added "The Road Not Taken" album (Genshin Impact)`,
      `Added "The Shimmering Voyage Vol. 4" album (Genshin Impact)`,
      `Added "Footprints of the Traveler Vol. 3" album (Genshin Impact)`,
      `Added "Passing Memories" album (Genshin Impact)`,
      "Added song info buttons for the guessed songs",
      "Added song filtering without knowing all attributes",
    ],
  },
  {
    date: "2024-12-29",
    changes: [
      `Added "Millelith's Watch" album (Genshin Impact)`,
      'Adjusted "Honkai: Star Rail" album data',
      'Added "Astral Theater" album (Honkai: Star Rail)',
      "Improved changelog logic",
    ],
  },
  {
    date: "2024-12-24",
    changes: [
      "Improved the appearance of the song list",
      "Improved changelog logic and appearance",
    ],
  },
  {
    date: "2024-12-22",
    changes: [
      'Added "Islands of the Lost and Forgotten" album (Genshin Impact)',
      'Replaced "Ambient" category name with "Open-World"',
    ],
  },
  {
    date: "2024-12-10",
    changes: [
      'Added "Fleeting Colors in Flight" album (Genshin Impact)',
      'Added "The Stellar Moments Vol. 2" album (Genshin Impact)',
    ],
  },
  {
    date: "2024-12-09",
    changes: ["Added changelog"],
  },
  {
    date: "2024-11-24",
    changes: ['Added "Realm of Tranquil Eternity" album (Genshin Impact)'],
  },
  {
    date: "2024-11-23",
    changes: ['Added "Experience the Paths Vol. 1" album (Honkai: Star Rail)'],
  },
  {
    date: "2024-11-21",
    changes: ["Fixed control icon display"],
  },
  {
    date: "2024-11-16",
    changes: [
      'Added "The Shimmering Voyage" album (Genshin Impact)',
      "Songs are now sorted by their title",
      "Song choice is now severely limited after 4 incorrect guesses",
    ],
  },
  {
    date: "2024-11-15",
    changes: ['Added "Interstellar Journey" album (Honkai: Star Rail)'],
  },
  {
    date: "2024-11-14",
    changes: ['Added "Svah Sanishyu" album (Honkai: Star Rail)'],
  },
  {
    date: "2024-11-13",
    changes: ['Added "Vortex of Legends" album (Genshin Impact)'],
  },
  {
    date: "2024-11-12",
    changes: ["Guessed songs are no longer available for selection"],
  },
  {
    date: "2024-11-10",
    changes: [
      "After finishing a round, a trackbar will be shown, indicating sample locations and enabling seeking",
    ],
  },
  {
    date: "2024-11-08",
    changes: [
      'Added "Out of Control" album (Honkai: Star Rail)',
      'Added "Honkai: Star Rail" mode',
    ],
  },
  {
    date: "2024-11-07",
    changes: [
      'Added "The Stellar Moments" album (Genshin Impact)',
      "Adjusted styling",
      "Adjusted sampling for very short songs",
    ],
  },
  {
    date: "2024-11-05",
    changes: [
      "Added an ad warning",
      '"Fixed" the sample player breaking occasionally',
      `Added "Jade Moon Upon a Sea of Clouds" album (Genshin Impact)`,
      "Improved styling",
      "Improved sampling",
    ],
  },
  {
    date: "2024-11-04",
    changes: [
      "Songs known to be incorrect are now automatically removed from the song list",
      "Adjusted album data yet again",
      "Adjusted How-To-Play dialog yet again",
    ],
  },
  {
    date: "2024-11-03",
    changes: [
      "Improved player control logic",
      'Added "City of Winds and Idylls" album (Genshin Impact)',
      "Adjusted How-To-Play dialog again",
      "Adjusted album data again",
    ],
  },
  {
    date: "2024-11-02",
    changes: [
      "Adjusted UI layout",
      "Added a navbar and How-To-Play dialog",
      "Improved daily song selection logic",
      "Added endless mode",
      "Adjusted How-To-Play dialog",
      "Adjusted album data",
    ],
  },
  {
    date: "2024-11-01",
    changes: [
      "Initial release",
      "Changed the album data structure - replaced the song pools with individual songs",
      "Added hints appearing after incorrect guesses",
    ],
  },
];

function getChangelogVersion() {
  const latestEntry = history[0];
  return `${latestEntry.date}+${latestEntry.changes.length}`;
}

export default function Changelog() {
  const { state, dispatch } = useStorage();

  const onClose = () => {
    dispatch({
      type: "SET_LAST_CHANGELOG_SEEN",
      payload: getChangelogVersion(),
    });
  };

  return (
    <Dialog
      title="Changelog"
      icon={<FiFileText />}
      onClose={onClose}
      showIndicator={getChangelogVersion() !== state.config.lastChangelogSeen}
    >
      <div>
        {history.map(({ date, changes }) => {
          const lastChangelogDateSeen =
            state.config.lastChangelogSeen.split("+")[0] ?? "";
          const lastChangelogChangesSeen = parseInt(
            state.config.lastChangelogSeen.split("+")[1] ?? "0"
          );
          const highlight =
            date > lastChangelogDateSeen ||
            (date === lastChangelogDateSeen &&
              changes.length !== lastChangelogChangesSeen);

          return (
            <ChangeGroup
              key={date}
              title={date}
              changes={changes}
              highlight={highlight}
            />
          );
        })}
      </div>
    </Dialog>
  );
}

function ChangeGroup({
  title,
  changes,
  highlight,
}: {
  title: string;
  changes: string[];
  highlight: boolean;
}) {
  return (
    <div
      className={`p-4 border-l-2 ${highlight ? "border-l-sky-300 bg-gradient-to-r from-[#7dd3fc20] to-transparent" : "border-l-transparent"}`}
    >
      <h2 className="font-bold text-xl">{title}</h2>
      <ul className="list-disc list-inside">
        {changes.map((change) => (
          <li key={change}>{change}</li>
        ))}
      </ul>
    </div>
  );
}
