// Figma에서 받은 SVG를 마스크로 써서 아이콘 색이 글자색(currentColor)을 따르게 한다.
const icons = {
  plus: "/icons/plus.svg",
  note: "/icons/note.svg",
  pin: "/icons/pin.svg",
  "chevron-right": "/icons/chevron-right.svg",
  "chevron-left": "/icons/chevron-left.svg",
  share: "/icons/share.svg",
  more: "/icons/more.svg",
};

type IconProps = {
  name: keyof typeof icons;
  size: number;
};

export function Icon({ name, size }: IconProps) {
  const url = `url(${icons[name]})`;
  return (
    <span
      aria-hidden="true"
      className="block shrink-0 bg-current"
      style={{
        width: size,
        height: size,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
      }}
    />
  );
}
