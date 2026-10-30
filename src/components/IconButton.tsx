import Link from "next/link";
import type { ComponentProps } from "react";
import { Icon } from "./Icon";

// 아이콘 버튼. 40×40 누르는 영역 가운데에 24px 아이콘을 둔다.
type IconName = ComponentProps<typeof Icon>["name"];

const className = "flex size-[40px] shrink-0 items-center justify-center rounded-sm text-text-primary";

type IconButtonProps = { icon: IconName; label: string } & (
  | { href: string; onClick?: never }
  | { href?: never; onClick?: () => void }
);

export function IconButton({ icon, label, href, onClick }: IconButtonProps) {
  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        <Icon name={icon} size={24} />
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} onClick={onClick} className={className}>
      <Icon name={icon} size={24} />
    </button>
  );
}
