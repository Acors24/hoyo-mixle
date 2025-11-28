import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";

export default function Dialog({
  title,
  icon,
  children,
  initialOpen = false,
  onOpen,
  onClose,
  showIndicator,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  initialOpen?: boolean;
  onOpen?: () => void;
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

  const _onOpen = () => {
    setOpen(true);
    onOpen?.();
  };

  const _onClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <>
      <button onClick={_onOpen} className="relative">
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
        className="bg-neutral-900/50 border-white/10 border backdrop-blur text-white rounded-xl max-w-[min(80vw,800px)] backdrop:bg-black/80"
      >
        <div className="flex justify-between sticky top-0 p-4">
          <h2 className="text-3xl font-bold">{title}</h2>
          <button autoFocus onClick={_onClose}>
            <FiX className="text-2xl" />
          </button>
        </div>
        <div className="overflow-auto max-h-[80vh] first:*:mt-0 *:mt-4 px-4 pb-4">
          {children}
        </div>
      </dialog>
    </>
  );
}
