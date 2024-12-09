import { useEffect, useRef } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";

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
      className="bg-slate-800 bg-opacity-50 backdrop-blur text-white p-4 rounded-xl max-w-[min(80vw,800px)] max-h-[min(80vh,600px)] backdrop:bg-black backdrop:bg-opacity-80 shadow *:mt-2 first:*:mt-0"
    >
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-bold">Changelog</h2>
        <button autoFocus onClick={onClose}>
          <FaRegCircleXmark className="text-2xl" />
        </button>
      </div>

      <p>2024-12-09: Added changelog.</p>
    </dialog>
  );
}
