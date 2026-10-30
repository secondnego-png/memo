import Link from "next/link";
import type { LabelColor, Memo } from "@/lib/memos";
import { Icon } from "./Icon";

// 왼쪽 칸 색은 메모의 색 라벨이다.
const tileColors: Record<LabelColor, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};

// 메모 목록의 한 줄. 누르면 메모 상세로 이동한다.
export function MemoItem({ memo }: { memo: Memo }) {
  return (
    // prefetch: 누르기 전에 상세 내용까지 미리 받아 둔다
    <Link href={`/memos/${memo.id}`} prefetch className="flex h-[72px] items-center gap-space-16 px-space-20 py-space-12">
      <span className={`flex size-[44px] shrink-0 items-center justify-center rounded-sm ${tileColors[memo.label]}`}>
        <Icon name="note" size={22} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-space-4">
        <span className="text-title-md text-text-primary">{memo.title}</span>
        {/* 미리보기는 1줄까지, 넘치면 말줄임 */}
        <span className="truncate text-body-sm text-text-secondary">{memo.preview}</span>
      </span>
      <span className="shrink-0 text-caption-sm text-text-muted">{memo.date}</span>
    </Link>
  );
}
