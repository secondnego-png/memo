import Link from "next/link";
import { Icon } from "./Icon";

// 카드 머리글. pin을 켜면 고정 표시, actionHref를 주면 오른쪽에 전체 보기가 붙는다.
type CardHeaderProps = {
  title: string;
  pin?: boolean;
  actionHref?: string;
};

export function CardHeader({ title, pin = false, actionHref }: CardHeaderProps) {
  return (
    <div className="flex h-[40px] items-center gap-space-4 pt-space-12 pb-space-4 pl-space-20 pr-space-16">
      {pin && (
        <span className="text-primary">
          <Icon name="pin" size={16} />
        </span>
      )}
      <h2 className="min-w-0 flex-1 text-label-md text-text-primary">{title}</h2>
      {actionHref && (
        <Link href={actionHref} className="flex items-center gap-space-4 text-caption-md text-text-muted">
          전체 보기
          <Icon name="chevron-right" size={16} />
        </Link>
      )}
    </div>
  );
}
