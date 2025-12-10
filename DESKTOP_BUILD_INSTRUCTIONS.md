# How to Build the Desktop App (.exe / .dmg)

This project is configured to be built as a standalone desktop application using **Electron**.

## Prerequisites
1.  **Node.js**: Ensure you have Node.js installed on your computer.
2.  **Code Editor**: VS Code or similar.

## Steps

1.  **Download the Source Code**: Download all files from this project to a local folder on your computer.

2.  **Clean up `index.html`**:
    *   Open `index.html`.
    *   **Remove** the `<script type="importmap">...</script>` section completely.
    *   **Remove** `<script src="https://cdn.tailwindcss.com"></script>` (Tailwind is now handled by the build process).
    *   Ensure the script tag is: `<script type="module" src="/index.tsx"></script>`.

3.  **Install Dependencies**:
    Open your terminal in the project folder and run:
    ```bash
    npm install
    ```

4.  **Test in Dev Mode**:
    Run the following to start the desktop app in development mode:
    ```bash
    npm run electron:dev
    ```

5.  **Build the Executable**:
    To create the `.exe` (Windows) or `.dmg` (Mac), run:
    ```bash
    npm run dist
    ```

6.  **Locate your App**:
    After the build finishes, check the `release/` (or `dist/`) folder. Your standalone installer will be there!
