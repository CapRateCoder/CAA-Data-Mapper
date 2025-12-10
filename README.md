<div align="center">
  <h1 align="center">RESO Data Field Harmonizer</h1>
  <h3 align="center">MLS Data Standardization Tool</h3>
</div>

<p align="center">
  An intelligent React application that maps disparate CSV/Excel column headers to the RESO Data Dictionary standard using Fuzzy Matching and Gemini AI.
</p>

## Features

*   **Universal File Support**: Drag and drop CSV, TXT, XLSX, or XLS files.
*   **Smart Mapping Engine**:
    *   **Exact Match**: Instant recognition of standard RESO fields.
    *   **Fuzzy Logic**: `fuse.js` powers fuzzy matching for typos and common variations.
    *   **AI Auto-Map**: Uses **Google Gemini 2.5 Flash** to intelligently deduce mappings for obscure or non-standard headers based on sample data.
*   **Data Harmonization**: Exports a clean, standardized CSV ready for MLS import.
*   **Modern UI**:
    *   Dark Mode / Light Mode support.
    *   Interactive Mapping Table with confidence scoring.
    *   Built with Tailwind CSS and Lucide Icons.

## Setup & Running Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

3.  **Get a Gemini API Key** (for testing AI features):
    - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
    - Create a free account and generate an API key
    - Enter the key in the "API Key Settings" section in the app

4.  **Build for Production**:
    ```bash
    npm run build
    ```

## Deploying to Netlify

This app is ready to deploy to Netlify with **zero configuration**! No API keys or environment variables needed on the server. Users provide their own Gemini API keys through the web interface.

**Quick Start:**
1. Build the app: `npm run build`
2. Deploy to Netlify (drag and drop the `dist` folder, or connect your Git repo)
3. Done! 🎉 No environment variables to configure
4. Users enter their own API keys when they use the app

See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for detailed instructions.

## How It Works

- **Client-side API key management**: Users enter their own Gemini API keys
- **Browser-only storage**: Keys are stored in localStorage, never sent to any server
- **No usage costs for you**: Each user pays for their own API usage
- **Privacy-first**: Keys never leave the user's browser

## Version
**2.0.0** - User-provided API keys (Stable Checkpoint)