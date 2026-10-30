"use client";

import { useState } from "react";
import { ALL_CATEGORY, categories, type Memo } from "@/lib/memos";
import { CardHeader } from "./CardHeader";
import { Chip } from "./Chip";
import { MemoItem } from "./MemoItem";

// 분류 칩과 고정한 메모, 최근 메모 카드. 칩을 고르면 두 카드 모두 그 분류만 보인다.
// 메모는 Supabase에서 최근 수정 순으로 받는다 (새 메모는 최근 메모 맨 위).
export function HomeMemoList({ memos }: { memos: Memo[] }) {
  const [category, setCategory] = useState(ALL_CATEGORY);

  const visible = category === ALL_CATEGORY ? memos : memos.filter((memo) => memo.category === category);
  const pinned = visible.filter((memo) => memo.pinned);
  const recent = visible.filter((memo) => !memo.pinned);

  return (
    <>
      <div className="-mx-space-16 flex gap-space-8 overflow-x-auto px-space-20 [scrollbar-width:none]">
        {categories.map((name) => (
          <Chip key={name} label={name} selected={name === category} onClick={() => setCategory(name)} />
        ))}
      </div>

      {pinned.length > 0 && (
        <section className="flex flex-col rounded-xl bg-surface-card py-space-8">
          <CardHeader title="고정한 메모" pin />
          {pinned.map((memo) => (
            <MemoItem key={memo.id} memo={memo} />
          ))}
        </section>
      )}

      <section className="flex flex-col rounded-xl bg-surface-card py-space-8">
        <CardHeader title="최근 메모" actionHref="/memos" />
        {recent.map((memo) => (
          <MemoItem key={memo.id} memo={memo} />
        ))}
        {visible.length === 0 && (
          <p className="px-space-20 py-space-24 text-center text-body-sm text-text-muted">
            이 분류에는 아직 메모가 없어요
          </p>
        )}
      </section>
    </>
  );
}
