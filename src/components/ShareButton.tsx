"use client";

import { IconButton } from "./IconButton";

// 공유 버튼. 공유 시트가 있으면 열고, 없으면 주소를 복사한다.
export function ShareButton({ title }: { title: string }) {
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("메모 주소를 복사했어요");
      }
    } catch {
      // 사용자가 공유를 취소한 경우
    }
  }

  return <IconButton icon="share" label="공유" onClick={share} />;
}
