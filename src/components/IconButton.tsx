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
      className={`icon-button ${className ?? ""}`}
      disabled={disabled}
    >
      {icon}
    </button>
  );
}
