import { Suspense } from "react";
import { IconButton } from "@/components/IconButton";
import { MemoDetailView } from "@/components/MemoDetailView";
import { ShareButton } from "@/components/ShareButton";
import { getMemo } from "@/lib/memoData";

type Params = Pick<PageProps<"/memos/[id]">, "params">;

// 메모 상세 화면 (Figma: Mobile/Detail)
// 메모마다 다른 부분만 Suspense 안에 두고, 나머지 틀은 모든 메모가 함께 쓴다.
export default function MemoDetail({ params }: PageProps<"/memos/[id]">) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48">
      <nav className="flex items-center justify-between">
        <IconButton icon="chevron-left" label="홈으로" href="/" />
        <Suspense>
          <DetailActions params={params} />
        </Suspense>
      </nav>
      <Suspense fallback={<div className="h-[320px] rounded-xl bg-surface-card" />}>
        <DetailContent params={params} />
      </Suspense>
    </main>
  );
}

async function DetailActions({ params }: Params) {
  const { id } = await params;
  const memo = await getMemo(id);
  return (
    <div className="flex">
      {/* 고정, 더보기는 아직 연결하지 않았다 */}
      <IconButton icon="pin" label="고정" />
      <ShareButton title={memo?.title ?? "메모"} />
      <IconButton icon="more" label="더보기" />
    </div>
  );
}

// 메모는 Supabase에서 읽는다. 같은 요청 안에서는 한 번만 읽는다.
async function DetailContent({ params }: Params) {
  const { id } = await params;
  return <MemoDetailView memo={await getMemo(id)} />;
}
