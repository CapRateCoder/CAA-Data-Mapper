<!-- Copilot / AI agent guidance for contributors working on CAA-Data-Mapper -->

# Purpose
Short, actionable guidance so an AI assistant can be productive in this repository.

**Big picture**
- Frontend-only React app (Vite + Tailwind) that harmonizes MLS CSV/XLS(X) exports to the RESO Data Dictionary.
- Optional Electron wrapper in `electron/` that loads the Vite dev server in development and `dist/index.html` in production.
- No backend: AI calls to Google Gemini are made directly from the browser using a user-provided API key.

**Key files / responsibilities**
- `App.tsx` — main flow: upload -> generate initial mappings -> review -> (optional) AI-assisted remap -> export CSV.
- `components/FileUpload.tsx` — parses CSV/XLSX and emits `(headers, rows)` to the app.
- `services/mappingService.ts` — generates initial mappings using `fuse.js` and heuristic aliases.
- `services/geminiService.ts` — prepares prompts and calls `@google/genai` (model: `gemini-2.5-flash`) to resolve unmapped/low-confidence fields.
- `constants.ts` — contains the full RESO field list as `RESO_STANDARD_FIELDS` (parsed from an embedded CSV). This is large (~1700 entries).
- `components/MappingTable.tsx` — UI for reviewing and editing mappings; includes the `ResoCombobox` for selecting a RESO field, custom values, or skipping.
- `components/ApiKeySettings.tsx` — stores the Gemini API key in `localStorage` under `gemini_api_key` and exposes it to the app.
- `types.ts` — canonical enums and interfaces (`MappingConfidence`, `MappingSource`, `FieldMapping`) used everywhere.
- `electron/main.js`, `electron/preload.js` — Electron packaging and secure renderer/main IPC surface (whitelisted channels).

**Data flow / runtime patterns**
- User uploads file -> `FileUpload` returns `headers` and `rows` -> `generateInitialMappings(headers, rows)` creates `FieldMapping[]`.
- `FieldMapping` objects include `originalHeader`, `targetField`, `confidence`, `source`, and `sampleValues` (see `types.ts`).
- UI edits update `mappings` and may call `resolveUnmappedFieldsWithAI(mappings, apiKey)` which:
  - Filters low-confidence mappings, builds a JSON prompt, calls `GoogleGenAI.generateContent(...)`, and merges suggestions back into `mappings`.
- Export uses `papaparse` (`Papa.unparse`) in `App.tsx` to produce the harmonized CSV.

**Important implementation details an AI should keep in mind**
- AI integration: `services/geminiService.ts` uses `@google/genai` and expects the caller to provide an API key (no server-side key). Keep `responseSchema` and JSON parsing behavior intact when editing prompts.
- Local storage: the API key is saved under `localStorage['gemini_api_key']` via `ApiKeySettings`. Never hardcode keys in the codebase.
- RESO field list: `constants.ts` defines `RESO_STANDARD_FIELDS` by parsing a large embedded CSV using `papaparse`. Avoid re-parsing many times; prefer referencing this single source where possible to prevent performance issues.
- Fuzzy matching: `mappingService` constructs a `Fuse` instance with `threshold: 0.3` and interprets `score` ranges as confidence bands (<0.2 High, <0.4 Medium, <0.6 Low). If you change thresholds, update UI language and tests.
- UI affordances: `ResoCombobox` provides actions — Keep Original, Use Custom, Skip. Preserve these options when refactoring to avoid breaking user workflows.
- Electron dev mode expects Vite at `http://localhost:5173` (see `electron/main.js`). In production Electron loads `../dist/index.html` (output of `npm run build`).

**Developer workflows**
- Install: `npm install`
- Dev (frontend only): `npm run dev` (Vite, serves at `http://localhost:5173`)
- Build: `npm run build` (produces `dist` used by Netlify or Electron production)
- Preview built site: `npm run preview`
- Note: there is no `npm start` script in `package.json` — do not assume it exists.

**Performance & safety notes**
- `RESO_STANDARD_FIELDS` is large — avoid reloading/duplicating it. Heavy operations (Fuse index creation, merging) should run only on upload or in web workers if you add them.
- AI calls are user-costly and can fail; `geminiService` currently catches and falls back to original mappings. Preserve that defensive behavior.
- `electron/preload.js` exposes a minimal IPC surface (`toMain`, `fromMain`). Do not broaden it without security review.

**Places to change for common tasks**
- Add/change fuzzy-match rules: `services/mappingService.ts` (also update thresholds and confidence mapping in UI).
- Improve AI prompt or schema: `services/geminiService.ts` (keep `responseSchema` structure to avoid brittle parsing).
- Update RESO list: `constants.ts` (embedded CSV block). After edits verify UI `ResoCombobox` behavior.

If anything above is unclear or you want more examples (prompts, Fuse tuning, or an Electron run script), tell me which area to expand and I will update this file.
