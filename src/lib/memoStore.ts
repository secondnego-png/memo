"use client";

// 작성 중인 임시 저장본을 이 브라우저(localStorage)에 둔다. 저장한 메모는 Supabase에 있다.
// 저장소를 못 쓰는 환경(사생활 보호 창 등)에서도 화면은 그대로 동작하고, 임시 저장만 안 된다.
import { useSyncExternalStore } from "react";
import type { LabelColor } from "./memos";

const DRAFT_PREFIX = "memo-app:draft:";

export type Draft = {
  title: string;
  category: string;
  label: LabelColor;
  html: string;
};

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function readDraft(key: string): Draft | null {
  try {
    return JSON.parse(read(DRAFT_PREFIX + key) ?? "null");
  } catch {
    return null;
  }
}

export function writeDraft(key: string, draft: Draft) {
  return write(DRAFT_PREFIX + key, JSON.stringify(draft));
}

export function clearDraft(key: string) {
  write(DRAFT_PREFIX + key, null);
}

// 브라우저에서 깨어난 뒤에만 true. 임시 저장본을 읽는 화면을 이 뒤에 그린다.
const noopSubscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
