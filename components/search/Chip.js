export default function Chip({ label, active, onClick, onMouseDown, className = "" }) {
  return (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      className={`px-3 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
        active
          ? "bg-dbu-header text-dbu-bg border-dbu-header font-semibold"
          : "bg-transparent text-dbu-text/70 border-dbu-line hover:border-dbu-text/50"
      } ${className}`}
    >
      {label}
    </button>
  );
}
