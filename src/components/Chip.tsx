// 분류 칩. 누르면 그 분류의 메모만 보인다.
type ChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-[36px] shrink-0 items-center rounded-full px-space-16 text-label-md ${
        selected ? "bg-primary text-text-on-primary" : "bg-surface-card text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}
