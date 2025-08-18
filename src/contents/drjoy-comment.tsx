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

// ===== Mount React vào từng .support-bod-bottom =====
function mountIntoAllSupportBlocks() {
  const blocks = document.querySelectorAll<HTMLElement>(".support-bod-bottom")
  blocks.forEach((block, idx) => {
    // Bỏ qua block đầu tiên
    if (idx === 0) return

    // Tránh chèn trùng
    if (block.querySelector(":scope > .drjoy-support-host")) return

    // Tạo host + shadow root
    const host = document.createElement("div")
    host.className = "drjoy-support-host"
    const shadow = host.attachShadow({ mode: "open" })

    const style = document.createElement("style")
    style.textContent = `:host{display:block}`

    const mountPoint = document.createElement("div")
    shadow.append(style, mountPoint)
    block.appendChild(host)

    const getContent = () => extractContentText(block)

    const root = createRoot(mountPoint)
    root.render(
      <StrictMode>
        <SupportButton getContent={getContent} />
      </StrictMode>
    )
  })
}

// ===== Mount ban đầu + theo dõi DOM mới =====
mountIntoAllSupportBlocks()

const observer = new MutationObserver(() => {
  mountIntoAllSupportBlocks()
})
observer.observe(document.body, { childList: true, subtree: true })