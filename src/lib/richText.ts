import type { MemoBlock } from "./memos";

// 본문 글. 그냥 글자이거나, 굵은 글자가 섞인 조각 목록이다.
export type Run = { text: string; bold?: boolean };
export type RichText = string | Run[];

export function plainText(text: RichText) {
  return typeof text === "string" ? text : text.map((run) => run.text).join("");
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
}

function richToHtml(text: RichText) {
  if (typeof text === "string") return escapeHtml(text);
  return text.map((run) => (run.bold ? `<b>${escapeHtml(run.text)}</b>` : escapeHtml(run.text))).join("");
}

// 저장된 본문 → 편집기에 넣을 HTML
export function blocksToHtml(blocks: MemoBlock[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h2>${escapeHtml(block.text)}</h2>`;
        case "subheading":
          return `<h3>${escapeHtml(block.text)}</h3>`;
        case "paragraph":
          return `<p>${richToHtml(block.text)}</p>`;
        case "list":
          return `<ul>${block.items.map((item) => `<li>${richToHtml(item)}</li>`).join("")}</ul>`;
        case "image":
          return isSafeImageSrc(block.src) ? `<p><img src="${block.src.replace(/"/g, "&quot;")}" alt=""></p>` : "";
      }
    })
    .join("");
}

// 사진 주소는 이 앱이 만든 사진(data:image/…)과 https 주소만 받는다.
export function isSafeImageSrc(src: string) {
  return src.startsWith("data:image/") || src.startsWith("https://");
}

function isBold(element: HTMLElement) {
  const weight = element.style.fontWeight;
  return element.tagName === "B" || element.tagName === "STRONG" || weight === "bold" || Number(weight) >= 600;
}

// 글자 조각을 모은다. 굵기가 같은 이웃 조각은 하나로 합친다.
function runsOf(nodes: Node[]): RichText {
  const runs: Run[] = [];
  const add = (text: string, bold: boolean) => {
    if (!text) return;
    const last = runs[runs.length - 1];
    if (last && Boolean(last.bold) === bold) last.text += text;
    else runs.push(bold ? { text, bold } : { text });
  };
  const walk = (node: Node, bold: boolean) => {
    if (node.nodeType === Node.TEXT_NODE) add(node.textContent ?? "", bold);
    else if (node instanceof HTMLElement) {
      if (node.tagName === "BR") add("\n", bold);
      else node.childNodes.forEach((child) => walk(child, bold || isBold(node)));
    }
  };
  nodes.forEach((node) => walk(node, false));

  // 끝에 붙은 줄바꿈은 지운다 (빈 줄을 위해 브라우저가 넣는 <br>)
  while (runs.length) {
    const last = runs[runs.length - 1];
    last.text = last.text.replace(/\n+$/, "");
    if (last.text) break;
    runs.pop();
  }
  return runs.some((run) => run.bold) ? runs : runs.map((run) => run.text).join("");
}

const BLOCK_TAGS = "h1,h2,h3,h4,ul,ol,p,div,img";

// 편집기 HTML → 저장할 본문
export function htmlToBlocks(root: HTMLElement): MemoBlock[] {
  const blocks: MemoBlock[] = [];
  let inline: Node[] = [];
  const flush = () => {
    const text = runsOf(inline);
    if (plainText(text).trim()) blocks.push({ type: "paragraph", text });
    inline = [];
  };

  // 브라우저가 목록이나 제목을 문단 안에 넣기도 해서, 안쪽 덩어리까지 차례로 살핀다.
  const visit = (node: ChildNode) => {
    if (!(node instanceof HTMLElement)) {
      if (node.nodeType === Node.TEXT_NODE) inline.push(node);
      return;
    }
    const text = node.textContent?.trim() ?? "";
    switch (node.tagName) {
      case "H1":
      case "H2":
        flush();
        if (text) blocks.push({ type: "heading", text });
        break;
      case "H3":
      case "H4":
        flush();
        if (text) blocks.push({ type: "subheading", text });
        break;
      case "UL":
      case "OL": {
        flush();
        const items = [...node.querySelectorAll("li")].map((li) => runsOf([li])).filter((item) => plainText(item).trim());
        if (items.length) blocks.push({ type: "list", items });
        break;
      }
      case "BR":
        flush();
        break;
      case "IMG": {
        // 사진은 글 사이에 있어도 따로 한 덩어리로 저장한다
        flush();
        const src = (node as HTMLImageElement).getAttribute("src") ?? "";
        if (isSafeImageSrc(src)) blocks.push({ type: "image", src });
        break;
      }
      case "P":
      case "DIV":
        flush();
        if (node.querySelector(BLOCK_TAGS)) {
          node.childNodes.forEach(visit);
        } else {
          inline = [node];
        }
        flush();
        break;
      default:
        inline.push(node);
    }
  };
  root.childNodes.forEach(visit);
  flush();
  return blocks;
}
