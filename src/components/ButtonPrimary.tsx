import Link from "next/link";
import { Icon } from "./Icon";

// 화면의 주 버튼. 화면마다 하나만 두고 아래쪽에 가로로 꽉 차게 둔다.
// href를 주면 다른 화면으로 가는 링크, onClick을 주면 버튼이 된다.
type ButtonPrimaryProps = { label: string; icon?: boolean } & (
  | { href: string; onClick?: never; disabled?: never }
  | { href?: never; onClick: () => void; disabled?: boolean }
);

const className =
  "flex h-[56px] w-full items-center justify-center gap-space-8 rounded-md bg-primary px-space-24 text-button-md text-text-on-primary disabled:opacity-40";

export function ButtonPrimary({ href, onClick, disabled, label, icon = false }: ButtonPrimaryProps) {
  const content = (
    <>
      {icon && <Icon name="plus" size={20} />}
      {label}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  );
}
