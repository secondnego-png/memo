// Supabase 접속. 주소와 공개 키는 .env.local에 둔다.
// 교육용이라 로그인 없이 누구나 memos 표를 읽고 쓰고 지울 수 있다 (표의 RLS 정책).
import { createClient } from "@supabase/supabase-js";
import type { LabelColor, MemoBlock } from "./memos";

// memos 표 한 줄
export type MemoRow = {
  id: string;
  title: string;
  body: MemoBlock[];
  category: string;
  label: LabelColor;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  throw new Error(".env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 넣어 주세요.");
}

export const supabase = createClient(url, key, { auth: { persistSession: false } });

export const MEMO_COLUMNS = "id, title, body, category, label, pinned, created_at, updated_at";
