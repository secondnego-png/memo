import Link from "next/link";
import { countBodyChars, type Memo } from "@/lib/memos";
import { Badge } from "./Badge";
import { ButtonPrimary } from "./ButtonPrimary";
import { MemoBody } from "./MemoBody";
import { PageEnter } from "./PageEnter";

// 상세 화면의 메모 카드와 수정하기 버튼. 메모가 없으면 안내를 보인다.
export function MemoDetailView({ memo }: { memo?: Memo }) {
  if (!memo) {
    return (
      <div className="flex flex-col items-center gap-space-12 rounded-xl bg-surface-card px-space-20 py-space-48">
        <p className="text-body-md text-text-secondary">메모를 찾을 수 없어요</p>
        <Link href="/" className="text-label-md text-primary">
          홈으로 가기
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageEnter className="flex-1">
        <article className="flex flex-col gap-space-12 rounded-xl bg-surface-card px-space-20 py-space-24">
          <div className="flex items-center gap-space-8">
            <Badge label={memo.category} color={memo.label} />
            <span className="text-caption-sm text-text-muted">{memo.createdAt}</span>
          </div>
          <h1 className="text-heading-lg text-text-primary">{memo.title}</h1>
          <hr className="border-border-default" />
          <MemoBody blocks={memo.body} />
          <p className="text-caption-sm text-text-muted">
            {countBodyChars(memo.body)}자 · {memo.updatedAt} 수정
          </p>
        </article>
      </PageEnter>

      {/* 내용이 길어 스크롤돼도 주 버튼은 화면 아래에 붙어 있다 */}
      <div className="sticky bottom-0 -mx-space-16 bg-surface-page px-space-16 pb-space-34">
        <ButtonPrimary href={`/memos/${memo.id}/edit`} label="수정하기" />
      </div>
    </>
  );
}
