;
// src/contents/drjoy-support.tsx
import type { PlasmoCSConfig } from "plasmo";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";





export const config: PlasmoCSConfig = {
  matches: ["https://app.drjoy.jp/*"], // Thu hẹp domain thực tế của bạn
  run_at: "document_end"
}

// ===== Component SupportButton =====
function SupportButton({ getContent }: { getContent: () => string }) {
  const handleClick = () => {
    const text = getContent()
    alert(text && text.trim().length > 0 ? text : "(Nội dung rỗng)")
  }

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "8px 14px",
        margin: "8px 0",
        borderRadius: "8px",
        border: "none",
        background: "#10b981",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer"
      }}>
      ⚡ Support Action
    </button>
  )
}

// ===== Helper: lấy nội dung text trong .content-quill-editor =====
function extractContentText(fromBlock: HTMLElement): string {
  const scope =
    fromBlock.closest<HTMLElement>(".support-body") ??
    fromBlock.closest<HTMLElement>(".support") ??
    fromBlock.parentElement ??
    fromBlock

  const el =
    scope.querySelector<HTMLElement>(".content-quill-editor") ??
    fromBlock.querySelector<HTMLElement>(".content-quill-editor")

  return el?.textContent?.trim() ?? ""
}

const btnStyle: React.CSSProperties = {
  padding: "8px 14px",
  margin: "8px 0",
  borderRadius: 8,
  border: "none",
  background: "#10b981",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
}

function SupportActionButton({ getContent }: { getContent: () => string }) {
  return (
    <button
      style={btnStyle}
      onClick={() => {
        const txt = getContent().trim()
        alert(txt || "(Không có nội dung)")
      }}
    >
      ⚡ Support Action
    </button>
  )
}

function mountIntoBlock(block: HTMLElement, index: number) {
  // Không render ở block đầu tiên
  if (index === 0) return

  // Tránh mount trùng
  if (block.querySelector(":scope > .drjoy-support-host, .drjoy-support-host")) return

  // Tìm vị trí chèn hợp lý: ngay sau phần nội dung
  const contentArea =
    block.querySelector<HTMLElement>(".support-txt") ||
    block.querySelector<HTMLElement>(".support-content-txt") ||
    block

  const host = document.createElement("div")
  host.className = "drjoy-support-host"
  contentArea.appendChild(host)

  const getContent = () => {
    const el = block.querySelector<HTMLElement>(".content-quill-editor")
    // Ưu tiên textContent để loại bỏ HTML formatting
    return el?.textContent ?? ""
  }

  const root = createRoot(host)
  root.render(<SupportActionButton getContent={getContent} />)
}

function scanAndMountAll() {
  const blocks = document.querySelectorAll<HTMLElement>(".support-bod-bottom")
  blocks.forEach((b, idx) => mountIntoBlock(b, idx))
}

(function main() {
  // Mount lần đầu
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scanAndMountAll)
  } else {
    scanAndMountAll()
  }

  // Theo dõi DOM để mount các block mới (vì trang có infinite scroll / dynamic render)
  let scheduled = 0
  const observer = new MutationObserver(() => {
    if (scheduled) return
    scheduled = window.setTimeout(() => {
      scheduled = 0
      scanAndMountAll()
    }, 150)
  })
  observer.observe(document.body, { childList: true, subtree: true })
})()