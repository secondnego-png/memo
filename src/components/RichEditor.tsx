"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { compressImage } from "@/lib/image";

// 본문 서식 막대 + 입력 칸. 굵게(B), 제목, 소제목, 목록을 지원한다.
type Format = "bold" | "heading" | "subheading" | "list";
type ActiveFormats = Record<Format, boolean>;

const formats: { key: Format; label: string }[] = [
  { key: "bold", label: "B" },
  { key: "heading", label: "제목" },
  { key: "subheading", label: "소제목" },
  { key: "list", label: "목록" },
];

const noFormats: ActiveFormats = { bold: false, heading: false, subheading: false, list: false };

function currentBlock() {
  return String(document.queryCommandValue("formatBlock")).toLowerCase().replace(/[<>]/g, "");
}

function applyFormat(format: Format) {
  switch (format) {
    case "bold":
      document.execCommand("bold");
      break;
    case "heading":
      document.execCommand("formatBlock", false, currentBlock() === "h2" ? "<p>" : "<h2>");
      break;
    case "subheading":
      document.execCommand("formatBlock", false, currentBlock() === "h3" ? "<p>" : "<h3>");
      break;
    case "list":
      document.execCommand("insertUnorderedList");
      break;
  }
}

export function isEditorEmpty(editor: HTMLElement) {
  return !editor.textContent?.trim() && !editor.querySelector("li, img");
}

type RichEditorProps = {
  editorRef: RefObject<HTMLDivElement | null>;
  initialHtml: string;
  onChange: () => void;
};

export function RichEditor({ editorRef, initialHtml, onChange }: RichEditorProps) {
  const [active, setActive] = useState<ActiveFormats>(noFormats);
  const [empty, setEmpty] = useState(!initialHtml);
  const [addingImage, setAddingImage] = useState(false);
  const initialHtmlRef = useRef(initialHtml);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 사진 고르기 창이 열리면 커서가 사라지므로, 마지막 커서 위치를 기억해 둔다.
  const lastRange = useRef<Range | null>(null);

  // 처음 한 번만 내용을 넣는다. 이후 내용은 브라우저가 직접 바꾼다.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.innerHTML = initialHtmlRef.current || "<p><br></p>";
    document.execCommand("defaultParagraphSeparator", false, "p");
  }, [editorRef]);

  // 커서가 있는 글자의 서식을 서식 버튼에 보인다.
  useEffect(() => {
    const update = () => {
      const selection = document.getSelection();
      if (!selection?.anchorNode || !editorRef.current?.contains(selection.anchorNode)) return;
      if (selection.rangeCount) lastRange.current = selection.getRangeAt(0).cloneRange();
      const block = currentBlock();
      setActive({
        bold: document.queryCommandState("bold"),
        heading: block === "h2",
        subheading: block === "h3",
        list: document.queryCommandState("insertUnorderedList"),
      });
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, [editorRef]);

  function handleInput() {
    const editor = editorRef.current;
    if (!editor) return;
    // 모두 지우면 빈 문단을 다시 넣어 서식이 이상하게 남지 않게 한다.
    if (!editor.firstChild) editor.innerHTML = "<p><br></p>";
    setEmpty(isEditorEmpty(editor));
    onChange();
  }

  async function handleImageFile(file: File | undefined) {
    const editor = editorRef.current;
    if (!file || !editor) return;
    if (!file.type.startsWith("image/")) {
      alert("사진 파일만 넣을 수 있어요.");
      return;
    }
    setAddingImage(true);
    try {
      const src = await compressImage(file);
      // 기억해 둔 커서 자리에 넣는다. 커서가 없었으면 맨 끝에 넣는다.
      editor.focus();
      const selection = document.getSelection();
      let range = lastRange.current;
      if (!range || !editor.contains(range.startContainer)) {
        range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
      }
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand("insertImage", false, src);
      handleInput();
    } catch {
      alert("이 사진은 열 수 없어요. JPG나 PNG 사진으로 다시 시도해 주세요.");
    } finally {
      setAddingImage(false);
    }
  }

  return (
    <div className="flex flex-col overflow-clip rounded-lg bg-surface-card focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary">
      <div role="toolbar" aria-label="서식" className="flex h-[52px] items-center gap-space-4 px-space-12">
        {formats.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={active[key]}
            // 버튼을 눌러도 입력 칸의 커서가 그대로 있게 한다
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              applyFormat(key);
              handleInput();
              document.dispatchEvent(new Event("selectionchange"));
            }}
            className={`flex h-[36px] shrink-0 items-center justify-center rounded-sm px-space-12 text-label-md ${
              active[key] ? "bg-label-blue-soft text-primary" : "text-text-secondary"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          disabled={addingImage}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="flex h-[36px] shrink-0 items-center justify-center rounded-sm px-space-12 text-label-md text-text-secondary disabled:opacity-40"
        >
          {addingImage ? "넣는 중…" : "사진"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            void handleImageFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      <hr className="border-border-default" />
      <div className="relative">
        {empty && (
          <p className="pointer-events-none absolute top-space-16 left-space-20 text-body-md text-text-muted">
            내용을 입력하세요
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="본문"
          onInput={handleInput}
          className="flex min-h-[200px] flex-col gap-space-8 px-space-20 py-space-16 text-body-md text-text-secondary outline-none [&_b]:font-bold [&_b]:text-text-primary [&_h2]:text-title-lg [&_h2]:text-text-primary [&_h3]:text-title-md [&_h3]:text-text-primary [&_img]:block [&_img]:w-full [&_img]:rounded-sm [&_li]:relative [&_li]:pl-space-16 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:content-['•'] [&_strong]:font-bold [&_strong]:text-text-primary [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-space-4"
        />
      </div>
    </div>
  );
}
