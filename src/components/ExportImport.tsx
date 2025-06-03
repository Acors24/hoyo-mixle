import { FiAlertTriangle, FiCopy, FiEdit, FiSave } from "react-icons/fi";
import Dialog from "./Dialog";
import { useStorage } from "../StorageContext";
import { useState } from "react";
import { LocalStorage } from "../types";

export default function ExportImport() {
  const { state, dispatch } = useStorage();
  const [copySuccessful, setCopySuccessful] = useState<boolean | undefined>(
    undefined
  );
  const [pasteSuccessful, setPasteSuccessful] = useState<boolean | undefined>(
    undefined
  );

  const copyToClipboard = async () => {
    setCopySuccessful(undefined);
    const exportString = JSON.stringify(state);

    try {
      await navigator.clipboard.writeText(exportString);
      setCopySuccessful(true);
    } catch (e) {
      console.error(e);
      setCopySuccessful(false);
    }
  };

  const pasteFromClipboard = async () => {
    setPasteSuccessful(undefined);

    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText === "") {
        throw "Invalid or missing data.";
      }

      const newState = JSON.parse(clipboardText) as LocalStorage;
      dispatch({ type: "SET_STATE", payload: newState });

      setPasteSuccessful(true);
    } catch (e) {
      console.error(e);
      setPasteSuccessful(false);
    }
  };

  return (
    <Dialog title="Export/Import" icon={<FiSave />}>
      <fieldset>
        <legend>Export</legend>

        <button onClick={copyToClipboard}>
          <FiCopy />
          Copy data to clipboard
        </button>
        {copySuccessful && <p className="ok">Data copied to clipboard.</p>}
        {copySuccessful === false && (
          <p className="error">Failed to copy to clipboard.</p>
        )}
      </fieldset>

      <fieldset>
        <legend>Import</legend>

        <div className="warning">
          <FiAlertTriangle />
          Make sure the data you most-recently copied is valid HOYO-MiXLE data.
        </div>

        <button onClick={pasteFromClipboard}>
          <FiEdit />
          Import data from clipboard
        </button>
        {pasteSuccessful && (
          <p className="ok">
            Data imported from clipboard. <br /> Refresh the page or re-enter
            the mode to see the new state.
          </p>
        )}
        {pasteSuccessful === false && (
          <p className="error">Failed to paste from clipboard.</p>
        )}
      </fieldset>
    </Dialog>
  );
}
