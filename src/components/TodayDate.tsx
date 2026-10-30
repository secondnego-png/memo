"use client";

import { use } from "react";
import { io } from "next/cache";

// 오늘 날짜(예: 10월 30일 금요일). io()로 미리 렌더한 화면에 날짜가 굳지 않게 한다.
export function TodayDate() {
  use(io());
  const text = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
  return <span suppressHydrationWarning>{text}</span>;
}
