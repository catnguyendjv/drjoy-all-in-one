/**
 * @file This content script injects a "Dr.JOY" toolbox button into each timeline post on Dr.JOY.
 * Clicking the button extracts and displays the text content from the last editor within that post.
 * The script is designed to work with dynamically loaded content, such as infinite scrolling timelines.
 */
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { PlasmoCSConfig } from "plasmo";

/**
 * @constant {PlasmoCSConfig} config
 * Configuration for the Plasmo content script.
 * This specifies which pages the script should run on and when it should be injected.
 */
export const config: PlasmoCSConfig = {
  matches: ["https://app.drjoy.jp/*"],
  run_at: "document_end"
};

/**
 * A button component that is injected into each timeline item.
 * @param {object} props - The component props.
 * @param {HTMLElement} props.scope - The timeline item element, used to find the correct content.
 * @returns {JSX.Element} The rendered button component.
 */
function TimelineButton({ scope }: { scope: HTMLElement }) {
  const handleClick = () => {
    // Get the last editor within the current post/timeline
    const editors = scope.querySelectorAll<HTMLElement>(".content-quill-editor");
    const last = editors[editors.length - 1];
    const txt = last?.textContent?.trim() || "";
    alert(txt || "(Content not found in this post)");
  };

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
  );
}

/**
 * Scans the document for all timeline items and injects the TimelineButton into them.
 */
function mountIntoAllTimelines() {
  const timelines = document.querySelectorAll<HTMLElement>(
    ".timeLine.groupboard-timeline"
  );

  timelines.forEach((tl) => {
    // Avoid duplicate mounting
    if (tl.querySelector(":scope > .drjoy-timeline-host")) return;

    const host = document.createElement("div");
    host.className = "drjoy-timeline-host";

    // Insert the button at the end of each timeline/post
    tl.appendChild(host);

    // Use Shadow DOM to isolate styles
    const shadow = host.attachShadow({ mode: "open" });
    const mountPoint = document.createElement("div");
    const style = document.createElement("style");
    style.textContent = `:host{display:block}`;

    shadow.append(style, mountPoint);

    const root = createRoot(mountPoint);
    root.render(
      <StrictMode>
        <TimelineButton scope={tl} />
      </StrictMode>
    );
  });
}

/**
 * Main execution block.
 * This IIFE (Immediately Invoked Function Expression) initializes the script.
 * It performs an initial scan for timeline posts and sets up a MutationObserver
 * to handle posts that are loaded dynamically.
 */
(function main() {
  const run = () => mountIntoAllTimelines();

  // Initial mount: Scan and inject buttons when the script first runs.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // Observe the DOM for new posts to handle dynamic loading (e.g., infinite scroll).
  // A MutationObserver is used for efficiently detecting DOM changes.
  let t = 0; // Debounce timer
  const mo = new MutationObserver(() => {
    // Debounce the mounting function to prevent excessive calls during rapid DOM updates.
    if (t) return;
    t = window.setTimeout(() => {
      t = 0;
      mountIntoAllTimelines();
    }, 150); // A 150ms delay is a reasonable debounce interval.
  });

  // Start observing the entire document body for the addition of new child elements.
  mo.observe(document.body, { childList: true, subtree: true });
})();