import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";

export default function Dialog({
  title,
  icon,
  children,
  initialOpen = false,
  onClose,
  showIndicator,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  initialOpen?: boolean;
  onClose?: () => void;
  showIndicator?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const _onClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative">
        {showIndicator && (
          <span className="absolute -top-1 -right-1 flex size-4">
            <span className="absolute inline-flex size-4 animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex size-4 rounded-full bg-rose-500"></span>
          </span>
        )}
        {icon}
      </button>
      <dialog
        ref={dialogRef}
        onClose={_onClose}
        className="bg-neutral-800/50 backdrop-blur text-white p-4 rounded-xl max-w-[min(80vw,800px)] max-h-[min(80vh,600px)] backdrop:bg-black backdrop:bg-opacity-80 shadow first:*:mt-0 *:mt-4"
      >
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{title}</h2>
          <button autoFocus onClick={_onClose}>
            <FiX className="text-2xl" />
          </button>
        </div>
        {children}
      </dialog>
    </>
  );
}
