"use client";

import { MotionConfig } from "motion/react";
import { BlurFade } from "./ui/blur-fade";

// 홈에서 상세로 넘어올 때 내용이 오른쪽에서 살짝 밀려 들어오며 또렷해진다.
// 기기에서 "동작 줄이기"를 켠 사람에게는 움직임 없이 보인다.
export function PageEnter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <BlurFade direction="left" offset={24} duration={0.3} className={className}>
        {children}
      </BlurFade>
    </MotionConfig>
  );
}
