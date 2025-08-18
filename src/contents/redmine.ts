import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://redmine.famishare.jp/*"]
}

window.addEventListener("load", () => {
  console.log("content redmine script loaded")

  document.body.style.background = "pink"
})
