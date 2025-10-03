# Dr.JOY All-in-One Extension

This is a browser extension built with [Plasmo](https://docs.plasmo.com/) designed to enhance the user experience on the Dr.JOY web application.

## 🚀 Purpose

The primary goal of this extension is to inject helpful tools and actions directly into the Dr.JOY interface, streamlining workflows and providing quick access to common functionalities.

## ✨ Features

Currently, the extension provides the following features:

-   **Support Action Button**: A "⚡ Support Action" button is added to comment threads to quickly extract and process comment content.
-   **Timeline Toolbox**: A "🧰 Dr.JOY" button is added to each timeline post for accessing post-specific actions.

## 🔧 Getting Started (for Developers)

To get started with developing this extension, follow these steps:

1.  **Get the code:**
    Obtain the source code for the extension, for example by cloning the repository.
    ```bash
    cd drjoy-all-in-one
    ```

2.  **Install dependencies:**
    Using `pnpm` is recommended.
    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```

4.  **Load the extension in your browser:**
    -   Open your browser's extension management page (e.g., `chrome://extensions`).
    -   Enable "Developer mode".
    -   Click "Load unpacked".
    -   Select the `build/chrome-mv3-dev` directory (or the appropriate build for your browser).

The extension will automatically reload as you make changes to the source code. The popup can be edited by modifying `popup.tsx`, and content scripts are located in the `src/contents` directory.

## 📦 Building for Production

To create a production-ready build of the extension, run the following command:

```bash
pnpm build
```

This will generate a production bundle in the `build` directory, which can be zipped and published to the respective browser web stores.

## ⬆️ Submitting to Webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Before using this action, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) for automated submissions.