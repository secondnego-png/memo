import type { MemoBlock } from "@/lib/memos";
import { isSafeImageSrc, type RichText } from "@/lib/richText";

// 굵은 글자는 text/primary로 보인다.
function Rich({ text }: { text: RichText }) {
  if (typeof text === "string") return text;
  return text.map((run, index) =>
    run.bold ? (
      <strong key={index} className="font-bold text-text-primary">
        {run.text}
      </strong>
    ) : (
      <span key={index}>{run.text}</span>
    ),
  );
}

// 메모 본문. 목록 한 줄은 앞에 점이 붙고, 글이 길면 다음 줄로 이어진다.
export function MemoBody({ blocks }: { blocks: MemoBlock[] }) {
  return (
    <div className="flex flex-col gap-space-12">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return <h2 key={index} className="text-title-lg text-text-primary">{block.text}</h2>;
          case "subheading":
            return <h3 key={index} className="text-title-md text-text-primary">{block.text}</h3>;
          case "paragraph":
            return (
              <p key={index} className="whitespace-pre-line text-body-md text-text-secondary">
                <Rich text={block.text} />
              </p>
            );
          case "list":
            return (
              <ul key={index} className="flex flex-col gap-space-4 text-body-md text-text-secondary">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-space-8">
                    <span aria-hidden="true">•</span>
                    <span className="min-w-0 flex-1 whitespace-pre-line">
                      <Rich text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "image":
            // 사진은 이 브라우저에 저장한 data: 주소라 next/image 최적화를 쓸 수 없다
            // eslint-disable-next-line @next/next/no-img-element
            return isSafeImageSrc(block.src) ? <img key={index} src={block.src} alt="" className="block w-full rounded-sm" /> : null;
        }
      })}
    </div>
  );
}
