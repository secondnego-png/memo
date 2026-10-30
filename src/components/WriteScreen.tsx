"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { labelColors, memoCategories, type LabelColor, type Memo } from "@/lib/memos";
import { clearDraft, readDraft, useHydrated, writeDraft } from "@/lib/memoStore";
import { blocksToHtml, htmlToBlocks } from "@/lib/richText";
import { supabase } from "@/lib/supabase";
import { ButtonPrimary } from "./ButtonPrimary";
import { Chip } from "./Chip";
import { IconButton } from "./IconButton";
import { LabelDot } from "./LabelDot";
import { isEditorEmpty, RichEditor } from "./RichEditor";

// 메모 작성 화면 (Figma: Write). memoId가 있으면 그 메모를 고친다.
type WriteScreenProps = { memoId?: string; baseMemo?: Memo };

export function WriteScreen({ memoId, baseMemo }: WriteScreenProps) {
  const hydrated = useHydrated();
  const backHref = memoId ? `/memos/${memoId}` : "/";

  // 임시 저장본은 브라우저에서만 읽을 수 있다.
  if (!hydrated) {
    return (
      <Layout backHref={backHref} status="">
        <div className="h-[78px] rounded-lg bg-surface-card" />
      </Layout>
    );
  }
  return <WriteForm memoId={memoId} baseMemo={baseMemo} backHref={backHref} />;
}

function Layout({ backHref, status, children }: { backHref: string; status: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48">
      <nav className="flex items-center justify-between">
        <IconButton icon="chevron-left" label="뒤로" href={backHref} />
        <p className="text-caption-sm text-text-muted" aria-live="polite">
          {status}
        </p>
      </nav>
      {children}
    </main>
  );
}

const AUTOSAVE_DELAY = 600;

// 새 메모 id: 시각 + 무작위 글자. 여러 기기에서 동시에 써도 겹치지 않게 한다.
function newMemoId() {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function WriteForm({ memoId, baseMemo, backHref }: WriteScreenProps & { backHref: string }) {
  const router = useRouter();
  const draftKey = memoId ?? "new";
  const editorRef = useRef<HTMLDivElement>(null);

  // 처음 값: 이 브라우저의 임시 저장본 → Supabase에서 읽은 메모 → 빈 메모
  const [initial] = useState(() => {
    const draft = readDraft(draftKey);
    const source = baseMemo;
    return {
      fromDraft: Boolean(draft),
      title: draft?.title ?? source?.title ?? "",
      category: draft?.category ?? source?.category ?? memoCategories[0],
      label: draft?.label ?? source?.label ?? ("blue" as LabelColor),
      html: draft?.html ?? (source ? blocksToHtml(source.body) : ""),
    };
  });

  const [title, setTitle] = useState(initial.title);
  const [category, setCategory] = useState(initial.category);
  const [label, setLabel] = useState<LabelColor>(initial.label);
  const [bodyEmpty, setBodyEmpty] = useState(!initial.html);
  const [autoSaved, setAutoSaved] = useState(initial.fromDraft);
  const [saving, setSaving] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const saved = useRef(false);
  const latest = useRef({ title, category, label });
  useEffect(() => {
    latest.current = { title, category, label };
  }, [title, category, label]);

  function saveDraftNow() {
    clearTimeout(timer.current);
    timer.current = undefined;
    if (saved.current) return;
    const ok = writeDraft(draftKey, { ...latest.current, html: editorRef.current?.innerHTML ?? "" });
    if (ok) setAutoSaved(true);
  }

  function scheduleDraft() {
    clearTimeout(timer.current);
    timer.current = setTimeout(saveDraftNow, AUTOSAVE_DELAY);
  }

  // 고칠 때마다 잠시 뒤 임시 저장한다. 화면을 떠날 때 남은 저장도 마친다.
  useEffect(() => {
    return () => {
      if (timer.current) saveDraftNow();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function change<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      scheduleDraft();
    };
  }

  function handleBodyChange() {
    const editor = editorRef.current;
    setBodyEmpty(!editor || isEditorEmpty(editor));
    scheduleDraft();
  }

  // Supabase에 저장한다. 새 메모는 새 줄을 넣고, 고친 메모는 그 줄을 바꾼다 (고정, 만든 날짜는 그대로).
  async function handleSave() {
    const editor = editorRef.current;
    if (!editor || saving) return;
    setSaving(true);
    const fields = {
      title: title.trim() || "제목 없음",
      category,
      label,
      body: htmlToBlocks(editor),
      updated_at: new Date().toISOString(),
    };
    const { error } = memoId
      ? await supabase.from("memos").update(fields).eq("id", memoId)
      : await supabase.from("memos").insert({ id: newMemoId(), ...fields });
    if (error) {
      setSaving(false);
      alert(`메모를 저장하지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.\n(${error.message})`);
      return;
    }
    saved.current = true;
    clearTimeout(timer.current);
    clearDraft(draftKey);
    router.replace(memoId ? `/memos/${memoId}` : "/");
    router.refresh();
  }

  return (
    <Layout backHref={backHref} status={saving ? "저장 중…" : autoSaved ? "자동 저장됨" : ""}>
      <div className="flex flex-1 flex-col gap-space-12">
        {/* 제목 입력 칸: 입력 중에는 파란 테두리 */}
        <label className="flex flex-col gap-space-4 rounded-lg bg-surface-card px-space-20 py-space-16 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary">
          <span className="text-caption-sm text-text-muted">제목</span>
          <input
            value={title}
            onChange={(event) => change(setTitle)(event.target.value)}
            placeholder="제목을 입력하세요"
            autoFocus={!initial.title}
            className="w-full bg-transparent text-title-md text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>

        <div className="flex flex-col gap-space-12 px-space-8 py-space-4">
          <div role="group" aria-label="분류" className="flex items-center gap-space-8">
            <span className="text-caption-sm text-text-muted">분류</span>
            {memoCategories.map((name) => (
              <Chip key={name} label={name} selected={name === category} onClick={() => change(setCategory)(name)} />
            ))}
          </div>
          <div role="group" aria-label="색" className="flex items-center gap-space-8">
            <span className="text-caption-sm text-text-muted">색</span>
            {labelColors.map(({ value, name }) => (
              <LabelDot key={value} color={value} name={name} selected={value === label} onClick={() => change(setLabel)(value)} />
            ))}
          </div>
        </div>

        <RichEditor editorRef={editorRef} initialHtml={initial.html} onChange={handleBodyChange} />
      </div>

      {/* 내용이 길어 스크롤돼도 주 버튼은 화면 아래에 붙어 있다 */}
      <div className="sticky bottom-0 -mx-space-16 bg-surface-page px-space-16 pb-space-34">
        <ButtonPrimary label="저장하기" onClick={handleSave} disabled={saving || (!title.trim() && bodyEmpty)} />
      </div>
    </Layout>
  );
}
