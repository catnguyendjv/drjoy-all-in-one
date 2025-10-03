/**
 * @file This content script injects a "Support Action" button into Dr.JOY's comment sections.
 * The button, when clicked, extracts and displays the text content of the associated comment.
 * It handles both statically loaded and dynamically rendered comment blocks.
 */
import type { PlasmoCSConfig } from "plasmo";
import React from "react";
import { createRoot } from "react-dom/client";

/**
 * @constant {PlasmoCSConfig} config
 * Configuration for the Plasmo content script.
 * This specifies which pages the script should run on and when it should be injected.
 */
export const config: PlasmoCSConfig = {
  matches: ["https://app.drjoy.jp/*"], // Restrict to the actual domain
  run_at: "document_end"
};

/**
 * Extracts the text content from the Quill editor within a given block.
 * @param {HTMLElement} fromBlock - The block element to search within.
 * @returns {string} The extracted text content, trimmed.
 */
function extractContentText(fromBlock: HTMLElement): string {
  const scope =
    fromBlock.closest<HTMLElement>(".support-body") ??
    fromBlock.closest<HTMLElement>(".support") ??
    fromBlock.parentElement ??
    fromBlock;

  const el =
    scope.querySelector<HTMLElement>(".content-quill-editor") ??
    fromBlock.querySelector<HTMLElement>(".content-quill-editor");

  return el?.textContent?.trim() ?? "";
}

/**
 * @constant {React.CSSProperties} btnStyle
 * Defines the common styling for the support action button.
 */
const btnStyle: React.CSSProperties = {
  padding: "8px 14px",
  margin: "8px 0",
  borderRadius: 8,
  border: "none",
  background: "#10b981",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};

/**
 * A button component that displays a support action.
 * @param {object} props - The component props.
 * @param {() => string} props.getContent - A function that returns the content to be displayed.
 * @returns {JSX.Element} The rendered button component.
 */
function SupportActionButton({ getContent }: { getContent: () => string }) {
  return (
    <button
      style={btnStyle}
      onClick={() => {
        const txt = getContent().trim();
        alert(txt || "(Không có nội dung)");
      }}>
      ⚡ Support Action
    </button>
  );
}

/**
 * Mounts the support action button into a specific block.
 * @param {HTMLElement} block - The block element to mount the button into.
 * @param {number} index - The index of the block.
 */
function mountIntoBlock(block: HTMLElement, index: number) {
  // Do not render in the first block
  if (index === 0) return;

  // Avoid duplicate mounting
  if (block.querySelector(":scope > .drjoy-support-host, .drjoy-support-host")) return;

  // Find a suitable insertion point: right after the content
  const contentArea =
    block.querySelector<HTMLElement>(".support-txt") ||
    block.querySelector<HTMLElement>(".support-content-txt") ||
    block;

  const host = document.createElement("div");
  host.className = "drjoy-support-host";
  contentArea.appendChild(host);

  const getContent = () => {
    const el = block.querySelector<HTMLElement>(".content-quill-editor");
    // Prioritize textContent to remove HTML formatting
    return el?.textContent ?? "";
  };

  const root = createRoot(host);
  root.render(<SupportActionButton getContent={getContent} />);
}

/**
 * Scans the document for all support blocks and mounts the support action button into them.
 */
function scanAndMountAll() {
  const blocks = document.querySelectorAll<HTMLElement>(".support-bod-bottom");
  blocks.forEach((b, idx) => mountIntoBlock(b, idx));
}

/**
 * Main execution block.
 * This IIFE (Immediately Invoked Function Expression) runs the script.
 * It performs an initial scan and sets up a MutationObserver to handle dynamic content.
 */
(function main() {
  // Initial mount: Scan and mount buttons when the script first runs.
  // This handles pages that are already loaded when the extension is installed or enabled.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scanAndMountAll);
  } else {
    scanAndMountAll();
  }

  // Observe the DOM for new blocks to handle dynamic content loading (e.g., infinite scroll).
  // A MutationObserver efficiently watches for changes in the DOM tree.
  let scheduled = 0;
  const observer = new MutationObserver(() => {
    // Debounce the scan to avoid running it too frequently during rapid DOM changes.
    if (scheduled) return;
    scheduled = window.setTimeout(() => {
      scheduled = 0;
      scanAndMountAll();
    }, 150); // A 150ms delay is a reasonable debounce time.
  });
  // Start observing the entire body for additions of new child elements.
  observer.observe(document.body, { childList: true, subtree: true });
})();