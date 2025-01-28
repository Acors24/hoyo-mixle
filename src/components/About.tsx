import { FiExternalLink, FiInfo } from "react-icons/fi";
import Dialog from "./Dialog";

export default function About() {
  return (
    <Dialog title="About" icon={<FiInfo />}>
      <div>
        <p>Track titles, album titles and game parts are taken from:</p>
        <ul className="list-disc list-inside ml-4">
          <li>
            <a
              href="https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki"
              target="_blank"
              rel="noreferrer"
              className="text-amber-200 hover:underline"
            >
              Genshin Impact Fandom Wiki
              <FiExternalLink className="ml-1 inline text-xs align-baseline" />
            </a>
          </li>
          <li>
            <a
              href="https://honkai-star-rail.fandom.com/wiki/Honkai:_Star_Rail_Wiki"
              target="_blank"
              rel="noreferrer"
              className="text-amber-200 hover:underline"
            >
              Honkai: Star Rail Fandom Wiki
              <FiExternalLink className="ml-1 inline text-xs align-baseline" />
            </a>
          </li>
        </ul>
      </div>
      <p>
        <span className="text-amber-100">Track context</span> provided by{" "}
        <span className="bg-clip-text text-transparent font-bold bg-gradient-to-r from-sky-200 to-blue-400">
          Lugunium
        </span>
        .
      </p>
      <p>Track types and regions are decided by me and may not be accurate.</p>
      <div className="bg-rose-500 bg-opacity-10 border-rose-500 border rounded-xl p-2">
        <p>
          An ad blocker is strongly recommended to prevent YouTube ads from
          playing while listening to the samples.
        </p>
      </div>
      <div className="bg-amber-500 bg-opacity-10 border-amber-500 border rounded-xl p-2">
        <p>
          This is currently a work in progress. More features and improvements,
          including more albums, will be added in the future.
        </p>
        <p className="mt-2">
          You can report any issues or suggest improvements by messaging{" "}
          <span className="font-bold text-sky-200">acors</span> on Discord.
        </p>
      </div>
    </Dialog>
  );
}
