import { FiExternalLink, FiInfo } from "react-icons/fi";
import Dialog from "./Dialog";
import { FaDiscord, FaGithub } from "react-icons/fa6";

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
          <li>
            <a
              href="https://zenless-zone-zero.fandom.com/wiki/Zenless_Zone_Zero_Wiki"
              target="_blank"
              rel="noreferrer"
              className="text-amber-200 hover:underline"
            >
              Zenless Zone Zero Fandom Wiki
              <FiExternalLink className="ml-1 inline text-xs align-baseline" />
            </a>
          </li>
        </ul>
      </div>
      <p>
        <span className="text-amber-100">Track context</span> has been provided
        by{" "}
        <span className="bg-clip-text text-transparent font-bold bg-gradient-to-r from-sky-200 to-blue-400">
          Lugunium
        </span>
        .
      </p>
      <p className="bg-gradient-to-r from-amber-500/15 border-amber-500 border-l-2 p-2">
        Track types and regions are decided by me and may not be accurate.
      </p>
      <p className="bg-gradient-to-r from-rose-500/15 border-rose-500 border-l-2 p-2">
        An ad blocker is strongly recommended to prevent YouTube ads from
        playing while listening to the samples.
      </p>
      <div className="bg-gradient-to-r from-sky-500/15 border-sky-500 border-l-2 p-2">
        <p>
          If you'd like to report a problem or suggest a feature/improvement,
          you can:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li className="">
            <a
              href="https://github.com/Acors24/hoyo-mixle/issues/new"
              target="_blank"
              className="text-sky-200 hover:underline"
            >
              create an issue
              <FiExternalLink className="ml-1 inline text-xs align-baseline" />
            </a>{" "}
            on{" "}
            <span className="text-nowrap">
              GitHub <FaGithub className="inline relative bottom-0.5" />
            </span>
          </li>
          <li>
            message{" "}
            <span className="bg-clip-text text-transparent font-bold bg-gradient-to-br from-green-200 to-sky-400">
              acors
            </span>{" "}
            on{" "}
            <span className="text-nowrap">
              Discord <FaDiscord className="inline relative bottom-0.5" />
            </span>
          </li>
        </ul>
      </div>
    </Dialog>
  );
}
