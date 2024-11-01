export default function IconButton({
  icon,
  onClick,
  className,
  disabled,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2 bg-slate-700 bg-opacity-50 hover:bg-slate-600 hover:bg-opacity-50 active:bg-slate-800 active:bg-opacity-50 duration-100 rounded-full ${
        className ?? ""
      }`}
      disabled={disabled}
    >
      {icon}
    </button>
  );
}
