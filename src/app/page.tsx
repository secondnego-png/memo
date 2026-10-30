import { Suspense } from "react";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { HomeMemoList } from "@/components/HomeMemoList";
import { TodayDate } from "@/components/TodayDate";
import { getMemos } from "@/lib/memoData";

// 홈 화면 (Figma: Mobile/Home)
// 메모 개수와 목록은 Supabase에서 요청마다 읽어 Suspense 안에서 채운다.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-space-16 pt-space-64">
      <div className="flex flex-1 flex-col gap-space-16">
        <header className="flex flex-col gap-space-8 px-space-8">
          <p className="h-[22px] text-caption-md text-text-muted">
            <Suspense>
              <TodayDate />
            </Suspense>
          </p>
          <h1 className="text-heading-xl text-text-primary">
            오늘까지 메모를
            <br />
            <span className="text-primary">
              <Suspense fallback="…개">
                <MemoCount />
              </Suspense>
            </span>{" "}
            남겼어요
          </h1>
        </header>

        <Suspense fallback={<div className="h-[320px] rounded-xl bg-surface-card" />}>
          <HomeMemos />
        </Suspense>
      </div>

      {/* 내용이 길어 스크롤돼도 주 버튼은 화면 아래에 붙어 있다 */}
      <div className="sticky bottom-0 -mx-space-16 bg-surface-page px-space-16 pt-space-16 pb-space-34">
        <ButtonPrimary href="/memos/new" label="새 메모 쓰기" icon />
      </div>
    </main>
  );
}

async function MemoCount() {
  const memos = await getMemos();
  return <>{memos.length}개</>;
}

async function HomeMemos() {
  return <HomeMemoList memos={await getMemos()} />;
}
