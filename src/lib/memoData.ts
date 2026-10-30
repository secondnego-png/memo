// 서버에서 Supabase의 메모를 읽는다. 늘 최신 메모를 보여야 해서 요청마다 새로 읽는다.
// 이 함수를 쓰는 화면은 <Suspense> 안에 둔다.
import { cache } from "react";
import { connection } from "next/server";
import { previewOf, type Memo } from "./memos";
import { MEMO_COLUMNS, supabase, type MemoRow } from "./supabase";

const TIME_ZONE = "Asia/Seoul";
const timeFormat = new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE });
const dateFormat = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", timeZone: TIME_ZONE });
const dayKeyFormat = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }); // 2026-10-30

// 한국 시간으로 오늘이면 "오늘", 하루 전이면 "어제", 그 밖에는 "10월 28일"
function dayLabel(ts: number, now: number) {
  const key = dayKeyFormat.format(ts);
  if (key === dayKeyFormat.format(now)) return "오늘";
  if (key === dayKeyFormat.format(now - 86_400_000)) return "어제";
  return dateFormat.format(ts);
}

function toMemo(row: MemoRow, now: number): Memo {
  const created = Date.parse(row.created_at);
  const updated = Date.parse(row.updated_at);
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    label: row.label,
    pinned: row.pinned,
    body: row.body,
    preview: previewOf(row.body),
    date: dayLabel(updated, now),
    createdAt: `${dateFormat.format(created)} ${timeFormat.format(created)}`,
    updatedAt: `${dayLabel(updated, now)} ${timeFormat.format(updated)}`,
  };
}

// 모든 메모 (최근 수정 순). 같은 요청 안에서는 한 번만 읽는다.
export const getMemos = cache(async (): Promise<Memo[]> => {
  await connection();
  const { data, error } = await supabase
    .from("memos")
    .select(MEMO_COLUMNS)
    .order("updated_at", { ascending: false })
    .returns<MemoRow[]>();
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  const now = Date.now();
  return data.map((row) => toMemo(row, now));
});

// 메모 하나. 없으면 undefined.
export const getMemo = cache(async (id: string): Promise<Memo | undefined> => {
  await connection();
  const { data, error } = await supabase
    .from("memos")
    .select(MEMO_COLUMNS)
    .eq("id", id)
    .returns<MemoRow[]>()
    .maybeSingle();
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  return data ? toMemo(data, Date.now()) : undefined;
});
