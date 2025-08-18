import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://app.drjoy.jp/*"]
}

window.addEventListener("load", () => {
  console.log("content drjoy script loaded")

  // document.body.style.background = "pink"
})
