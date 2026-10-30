import type { LabelColor } from "@/lib/memos";

const dotColors: Record<LabelColor, string> = {
  blue: "bg-label-blue",
  green: "bg-label-green",
  orange: "bg-label-orange",
  pink: "bg-label-pink",
};

// 색 라벨 고르기. 고른 색은 바깥에 파란 테두리(2px)가 생긴다.
type LabelDotProps = {
  color: LabelColor;
  name: string;
  selected: boolean;
  onClick: () => void;
};

export function LabelDot({ color, name, selected, onClick }: LabelDotProps) {
  return (
    <button
      type="button"
      aria-label={name}
      aria-pressed={selected}
      onClick={onClick}
      className={`flex size-[32px] shrink-0 items-center justify-center rounded-full border-2 ${
        selected ? "border-primary" : "border-transparent"
      }`}
    >
      <span className={`size-[22px] rounded-full ${dotColors[color]}`} />
    </button>
  );
}
