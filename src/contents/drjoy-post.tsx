import type { PlasmoCSConfig } from "plasmo";
import React from "react";





export const config: PlasmoCSConfig = {
  matches: ["https://app.drjoy.jp/*"],
  run_at: "document_end"
}

export const getInlineAnchor = () =>
  document.querySelector(".timeLine.groupboard-timeline")

export const getShadowHostId = () => "drjoy-timeline-btn-root"

// --- Hàm lấy nội dung từ .content-quill-editor ---
function extractContentText(): string {
  // lấy toàn bộ, nếu muốn lấy cụ thể bạn có thể chỉnh query
  const el = document.querySelector<HTMLElement>(".content-quill-editor")
  return el?.textContent?.trim() || "(Không tìm thấy nội dung)"
}

export default function DrjoyTimelineButton() {
  const handleClick = () => {
    const text = extractContentText()
    alert(text)
  }

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "8px 14px",
        margin: "8px",
        borderRadius: "8px",
        border: "none",
        background: "#1e88e5",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer"
      }}>
      + DrJOY Action
    </button>
  )
}
