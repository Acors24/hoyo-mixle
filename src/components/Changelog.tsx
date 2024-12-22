import { useEffect, useRef } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";

const history = [
  {
    date: "2024-12-22",
    changes: [
      'Added "Islands of the Lost and Forgotten" album (Genshin Impact)',
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
    date: "2024-11-15",
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
];

export default function Changelog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="bg-slate-800 bg-opacity-50 backdrop-blur text-white p-4 rounded-xl max-w-[min(80vw,800px)] max-h-[min(80vh,600px)] backdrop:bg-black backdrop:bg-opacity-80 shadow *:mt-8 first:*:mt-0"
    >
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Changelog</h1>
        <button autoFocus onClick={onClose}>
          <FaRegCircleXmark className="text-2xl" />
        </button>
      </div>

      {history.map(({ date, changes }) => (
        <ChangeGroup key={date} title={date} changes={changes} />
      ))}
    </dialog>
  );
}

function ChangeGroup({ title, changes }: { title: string; changes: string[] }) {
  return (
    <div>
      <h2 className="font-bold text-xl">{title}</h2>
      <ul className="list-disc list-inside">
        {changes.map((change) => (
          <li key={change}>{change}</li>
        ))}
      </ul>
    </div>
  );
}
