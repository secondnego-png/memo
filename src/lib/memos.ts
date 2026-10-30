// 메모의 모양과 분류, 색. 메모는 Supabase의 memos 표에 있다 (읽기: memoData.ts, 저장: WriteScreen).
import { plainText, type RichText } from "./richText";

export type LabelColor = "blue" | "green" | "orange" | "pink";

// 본문 한 덩어리. heading은 title/lg, subheading은 title/md, paragraph와 list는 body/md로 보인다.
export type MemoBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: RichText }
  | { type: "list"; items: RichText[] }
  | { type: "image"; src: string };

export type Memo = {
  id: string;
  title: string;
  preview: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  label: LabelColor;
  category: string;
  pinned: boolean;
  body: MemoBlock[];
};

export const ALL_CATEGORY = "전체";
export const categories = [ALL_CATEGORY, "업무", "개인", "아이디어", "가족"];
export const memoCategories = categories.slice(1);
export const labelColors: { value: LabelColor; name: string }[] = [
  { value: "blue", name: "파랑" },
  { value: "green", name: "초록" },
  { value: "orange", name: "주황" },
  { value: "pink", name: "분홍" },
];

function blockText(block: MemoBlock, separator = ", ") {
  if (block.type === "image") return "";
  return block.type === "list" ? block.items.map(plainText).join(separator) : plainText(block.text);
}

// 목록에 보일 미리보기: 첫 문단이나 목록, 없으면 글이 있는 첫 덩어리, 사진뿐이면 "사진"
export function previewOf(body: MemoBlock[]) {
  const main =
    body.find((block) => block.type === "paragraph" || block.type === "list") ??
    body.find((block) => block.type !== "image");
  if (main) return blockText(main);
  return body.length ? "사진" : "";
}

// 본문 글자 수 (줄바꿈, 목록 앞 점, 사진은 세지 않는다)
export function countBodyChars(body: MemoBlock[]) {
  return body
    .map((block) => blockText(block, ""))
    .join("")
    .replace(/\n/g, "").length;
}
