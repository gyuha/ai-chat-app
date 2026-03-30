# AGENTS.md
Repository guidance for agentic coding agents working in this repository.
<!-- GSD:project-start source:PROMPT.md -->
## Project
- This repository is currently a **planning/workflow workspace**, not a scaffolded app codebase.
- The checked-in sources are mainly:
  - `PROMPT.md` — the product and workflow brief
  - `.opencode/` — OpenCode config plus vendored `get-shit-done`
  - `README.md` — placeholder only
- The intended product is **OpenRouter Chat**: a ChatGPT-style web chat app that calls OpenRouter directly from the browser.
- The app is explicitly **frontend-only**. Do not assume a backend, server routes, or server-side secrets.
- Treat `PROMPT.md` as the main source of truth until the actual app is scaffolded.
- If the user asks for app implementation, first verify whether the app has been initialized or whether you need to scaffold it.
<!-- GSD:project-end -->
<!-- GSD:stack-start source:PROMPT.md + .opencode/package.json -->
## Technology Stack
### Current repo state
- Verified package manifest: `.opencode/package.json`
- Verified dependency there: `@opencode-ai/plugin`
- Verified OpenCode config: `.opencode/opencode.json`
- Verified settings file: `.opencode/settings.json`
### Planned application stack
- Language: TypeScript (**strict mode**)
- Framework: React 19 + Vite
- Package manager: pnpm
- Linter/formatter: Biome
- UI: shadcn/ui + Tailwind CSS v4
- Client state: Zustand
- Server-state/cache: TanStack Query v5
- Routing: TanStack Router
- Persistence: Dexie.js v4 over IndexedDB
- Markdown rendering: `react-markdown`, `remark-gfm`, `rehype-highlight`
- HTTP: built-in `fetch`
### Important limitation
- There is currently **no root `package.json`**, **no `tsconfig.json`**, **no `biome.json`**, and **no test runner config** in the checked-in repo root.
- Do not present planned stack choices as if they are already wired and runnable.
<!-- GSD:stack-end -->
<!-- GSD:conventions-start source:PROMPT.md + GSD references -->
## Conventions
### Commands
#### Verified now
- Bootstrap command from `PROMPT.md`:
  - `pnpm create vite@latest openrouter-chat --template react-ts`
- Verified GSD command files exist in `.opencode/command/`:
  - `/gsd-new-project`
  - `/gsd-quick`
  - `/gsd-debug`
  - `/gsd-execute-phase`
#### Not yet repo-authoritative
- There is **no checked-in root script** yet for any of the following:
  - build
  - lint
  - typecheck
  - test
  - single-test execution
- Until the app is scaffolded and a root manifest exists, do **not** claim commands like `pnpm build` or `pnpm test` are already available.
- After scaffold, read the real root `package.json` and update this file with exact commands.
#### Single-test guidance
- A single-test command is **not yet defined in this repo**.
- Once the app is initialized, add and prefer an explicit single-file test command in the root manifest.
- Until then, treat single-test execution as **pending project setup**, not as an established workflow.
### Language and documentation rules
- UI labels, helper text, onboarding copy, and user-facing guidance should be written in **Korean**.
- GSD-related guidance, questions, summaries, and generated planning documents should be written in **Korean**.
- When using `ui-ux-pro-max`, explanations, design rationale, recommendations, and generated docs should also be written in **Korean**.
- Keep code, commands, file paths, API names, library names, route params, and identifiers in their original English form.
### Skill-routing rules
- When a GSD task touches UI/UX, screen design, design systems, component composition, or UI review, also use `ui-ux-pro-max`.
- Do not treat `ui-ux-pro-max` as optional for GSD-driven UI work in this repo.
### Formatting and linting
- Biome is the intended formatter/linter. Prefer a **single-tool** setup; do not introduce ESLint/Prettier unless the user explicitly changes the stack.
- Until `biome.json` exists, do not invent custom formatting rules. Use the eventual project config as source of truth.
### TypeScript and types
- Code must remain compatible with **TypeScript strict mode**.
- Prefer changing type models over weakening checks.
- Do not introduce server-only assumptions into a frontend-only browser app.
### Imports and module boundaries
- No path aliases are verified yet.
- Do not assume `@/` or other aliases until `tsconfig.json` and Vite config actually define them.
- Keep imports simple and local until the scaffold establishes aliases or folder conventions.
### Naming conventions
- File and symbol naming conventions are **not established by checked-in app code yet**.
- When the first real source files appear, follow the dominant local pattern and then update this file.
- Do not claim repo-wide naming rules that are not backed by code or config.
### Error handling
- API failures should surface as clear **Korean** user messages.
- Streaming chat must support cancellation via `AbortController`.
- API key validation should use the OpenRouter models endpoint, as specified in `PROMPT.md`.
- Keep error handling appropriate for a browser app; do not add backend-only error patterns unless the project scope changes.
### Testing guidance
- Follow the vendored GSD TDD guidance for behavior-heavy logic.
- Prefer TDD for:
  - business logic
  - validation
  - parsing/formatting
  - utility functions
  - state workflows with clear input/output behavior
- Do not force TDD-first for:
  - UI layout
  - styling
  - pure configuration changes
  - glue code around existing libraries
- Tests should focus on observable behavior, not internal implementation details.
### Cursor / Copilot rules
- No `.cursor/rules/` directory is present.
- No `.cursorrules` file is present.
- No `.github/copilot-instructions.md` file is present.
- Do not claim extra IDE-specific rules unless those files are later added.
<!-- GSD:conventions-end -->
<!-- GSD:architecture-start source:PROMPT.md -->
## Architecture
### Target application architecture
- Browser-only React application built with Vite.
- OpenRouter is called directly from the browser using `fetch`.
- All persistent data lives in IndexedDB through Dexie.
- Primary tables specified in `PROMPT.md`:
  - `settings`
  - `conversations`
  - `messages`
### State responsibilities
- Use Zustand for client-global UI/app state.
- Use TanStack Query for cached remote data such as models and API-key validation results.
- Use TanStack Router for route structure.
### Route shape
- `/` — main screen / empty state
- `/chat/$conversationId` — specific conversation
- `/settings` — API key, default model, system prompt, theme
### UI shape
- ChatGPT-like layout is required:
  - left sidebar for conversation list and actions
  - right chat pane for messages and composer
- Mobile layout should collapse the sidebar into a toggleable sheet/drawer.
### Architecture caution
- The actual app structure does not exist yet.
- Before adding architecture claims about folders, aliases, or component boundaries, verify them against scaffolded code.
<!-- GSD:architecture-end -->
<!-- GSD:workflow-start source:.opencode/command/* + GSD template -->
## Workflow Enforcement
- For file-changing work, prefer entering through a GSD workflow instead of editing ad hoc.
- Use these verified entry points when they match the task:
  - `/gsd-new-project` — initialize planning artifacts
  - `/gsd-quick` — small scoped tasks
  - `/gsd-debug` — investigation and debugging
  - `/gsd-execute-phase` — execute planned phase work
- The repo currently looks like a pre-implementation workspace, so agents should often start with planning or scaffold confirmation rather than direct feature coding.
- If the user wants real app code, first verify whether you should:
  1. scaffold the Vite app,
  2. run `/gsd-new-project`,
  3. or work only in planning docs.
- After the app is scaffolded, immediately re-scan commands, config files, and source layout, then refresh this `AGENTS.md`.
- Do not treat template examples from vendored GSD docs as live project conventions unless the scaffolded repo actually adopts them.
<!-- GSD:workflow-end -->
<!-- GSD:profile-start -->
## Developer Profile
> Profile not yet configured.
> If this repo begins active GSD usage, generate the profile with `/gsd-profile-user` and keep this section tool-managed.
<!-- GSD:profile-end -->
