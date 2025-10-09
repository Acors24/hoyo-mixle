import {
  FiAlertTriangle,
  FiCheckCircle,
  FiDownload,
  FiSave,
  FiUpload,
} from "react-icons/fi";
import Dialog from "./Dialog";
import { useStorage } from "../StorageContext";
import { useRef, useState } from "react";
import { LocalStorage } from "../types";

const defaultFileInputMessage = "No files selected.";

export default function ExportImport() {
  const { state, dispatch } = useStorage();
  const [isDownloadSuccessful, setDownloadSuccessful] = useState(true);
  const [isImportSuccessful, setUploadSuccessful] = useState<
    boolean | undefined
  >();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileInputMessage, setFileInputMessage] = useState(
    defaultFileInputMessage
  );

  const download = async () => {
    setDownloadSuccessful(true);
    const exportString = JSON.stringify(state);

    try {
      const blob = new Blob([exportString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "hoyo-mixle.data";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadSuccessful(false);
    }
  };

  const upload = async () => {
    if (
      !fileInputRef.current ||
      !fileInputRef.current.files ||
      fileInputRef.current.files.length === 0
    )
      return;

    setUploadSuccessful(undefined);
    try {
      const file = fileInputRef.current.files[0];
      const newData = JSON.parse(await file.text()) as LocalStorage;
      dispatch({ type: "SET_STATE", payload: newData });
      setUploadSuccessful(true);
    } catch {
      setUploadSuccessful(false);
    }
  };

  return (
    <Dialog title="Export/Import" icon={<FiSave />}>
      <fieldset>
        <legend>Export</legend>

        <div className="flex items-center gap-2">
          <button onClick={download}>
            <FiDownload />
            Download your data
          </button>
          {!isDownloadSuccessful && <p className="error">Download failed.</p>}
        </div>
      </fieldset>

      <fieldset>
        <legend>Import</legend>

        <div className="warning">
          <FiAlertTriangle />
          Make sure your file is valid HOYO-MiXLE data.
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={() => {
              if (
                !fileInputRef.current ||
                !fileInputRef.current.files ||
                fileInputRef.current.files.length === 0
              ) {
                setFileInputMessage(defaultFileInputMessage);
                return;
              }

              setFileInputMessage(fileInputRef.current.files[0].name);
            }}
          />
          <button
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <FiUpload />
            Select a file
          </button>
          <span
            className="max-w-40 overflow-hidden text-nowrap overflow-ellipsis"
            title={fileInputMessage}
          >
            {fileInputMessage}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={upload}
            disabled={
              !fileInputRef.current ||
              !fileInputRef.current.files ||
              fileInputRef.current.files.length === 0
            }
          >
            <FiCheckCircle />
            Confirm
          </button>
          {isImportSuccessful && <p className="ok">Import successful.</p>}
          {isImportSuccessful === false && (
            <p className="error">Import failed.</p>
          )}
        </div>
      </fieldset>
    </Dialog>
  );
}
