import { Suspense } from "react";
import { notFound } from "next/navigation";
import { WriteScreen } from "@/components/WriteScreen";
import { getMemo } from "@/lib/memoData";

type Params = Pick<PageProps<"/memos/[id]/edit">, "params">;

// 메모 수정: 상세 화면의 "수정하기"에서 온다. 메모는 Supabase에서 읽는다.
export default function EditMemo({ params }: PageProps<"/memos/[id]/edit">) {
  return (
    <Suspense>
      <EditMemoContent params={params} />
    </Suspense>
  );
}

async function EditMemoContent({ params }: Params) {
  const { id } = await params;
  const memo = await getMemo(id);
  if (!memo) notFound();
  return <WriteScreen memoId={id} baseMemo={memo} />;
}
