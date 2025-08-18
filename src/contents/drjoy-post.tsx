// React inline: mount 1 nút vào MỖI ".timeLine.groupboard-timeline"
import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://app.drjoy.jp/*"],
  run_at: "document_end"
}

function TimelineButton({ scope }: { scope: HTMLElement }) {
  const handleClick = () => {
    // Lấy editor cuối cùng TRONG post/timeline hiện tại
    const editors = scope.querySelectorAll<HTMLElement>(".content-quill-editor")
    const last = editors[editors.length - 1]
    const txt = last?.textContent?.trim() || ""
    alert(txt || "(Không tìm thấy nội dung trong post này)")
  }

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "10px 14px",
        margin: "8px 0",
        border: "none",
        borderRadius: 10,
        background: "#2563eb",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(0,0,0,.18)"
      }}>
      🧰 Dr.JOY
    </button>
  )
}

function mountIntoAllTimelines() {
  // Nếu mỗi “post” có container riêng, selector này sẽ trả về N phần tử
  const timelines = document.querySelectorAll<HTMLElement>(".timeLine.groupboard-timeline")

  timelines.forEach((tl, idx) => {
    // Tránh mount trùng
    if (tl.querySelector(":scope > .drjoy-timeline-host")) return

    // Tùy bố cục thực tế, bạn có thể đổi điểm gắn nút ở đây:
    const host = document.createElement("div")
    host.className = "drjoy-timeline-host"

    // Chèn nút vào CUỐI mỗi timeline/post
    tl.appendChild(host)

    // Shadow DOM để cô lập style
    const shadow = host.attachShadow({ mode: "open" })
    const mountPoint = document.createElement("div")
    const style = document.createElement("style")
    style.textContent = `:host{display:block}`

    shadow.append(style, mountPoint)

    const root = createRoot(mountPoint)
    root.render(
      <StrictMode>
        <TimelineButton scope={tl} />
      </StrictMode>
    )
  })
}

(function main() {
  const run = () => mountIntoAllTimelines()
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run)
  } else {
    run()
  }
  // Bắt post render thêm (SPA / infinite scroll)
  let t = 0
  const mo = new MutationObserver(() => {
    if (t) return
    t = window.setTimeout(() => {
      t = 0
      mountIntoAllTimelines()
    }, 150)
  })
  mo.observe(document.body, { childList: true, subtree: true })
})()
