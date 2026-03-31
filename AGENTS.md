# AGENTS.md
This repository is a prompt-and-skills workspace, not the actual React app described in `PROMPT.md`.
Most edits here touch Markdown instruction files under `.agents/skills/`, `.claude/skills/`, `PROMPT.md`, and `README.md`.

## Repository facts
- Root files present: `PROMPT.md`, `README.md`, `skills-lock.json`, `.agents/`, `.claude/`
- There is currently **no** `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.cursorrules`, `.cursor/rules/`, or `.github/copilot-instructions.md`
- There is currently **no** application source tree such as `src/`, `apps/`, or `packages/`
- Mirrored skill docs live under both `.agents/skills/*` and `.claude/skills/*`

## Source files that define conventions
- `PROMPT.md`
- `.agents/skills/frontend-design/SKILL.md`
- `.agents/skills/teach-impeccable/SKILL.md`
- `.agents/skills/polish/SKILL.md`
- `.claude/skills/frontend-design/SKILL.md`
- `skills-lock.json`
Read those first before changing repo-wide guidance.

## Build, lint, test, and validation
### Repo-local commands
There are currently no repo-local build, lint, format, typecheck, or test commands configured.
- Build: not configured
- Lint: not configured
- Format: not configured
- Typecheck: not configured
- Test: not configured
- Single test: not applicable

### Practical rules
- Do **not** invent `pnpm`, `npm`, `yarn`, `turbo`, `vitest`, or `biome` commands for this repo
- Do **not** claim tests passed unless a real test command is added later
- Validation is manual in this repo: check paths, mirrored docs, frontmatter, headings, code fences, wording, and internal consistency
- Treat commands in `PROMPT.md` as generated-project examples, not runnable commands for this repo

### Example of a prompt-only command
- `pnpm create vite@latest openrouter-chat --template react-ts`
That command belongs to the future app described in `PROMPT.md`, not to this repository.

## What agents usually edit here
- Prompt/spec text in `PROMPT.md`
- Mirrored skill docs in `.agents/skills/*` and `.claude/skills/*`
- `skills-lock.json` when the skill set itself changes
- Root guidance docs such as `README.md` and `AGENTS.md`

## Documentation and Markdown style
This repo is documentation-first. Favor precise operational guidance over marketing copy.

### Writing style
- Be explicit, directive, and concrete
- Prefer imperative wording for instructions
- Keep prose dense with signal; avoid filler
- Distinguish clearly between repo facts and future-project examples
- Do not speculate about missing files, commands, or configs
- When something is absent, say so directly

### Markdown rules
- Preserve existing structure unless there is a good reason to change it
- Use `#`, `##`, and `###` headings consistently
- Use fenced code blocks for prompts and commands
- Use bullets for rules and checklists
- Use numbered lists when order matters
- Wrap file paths, commands, env vars, API names, skill names, and identifiers in backticks

### `SKILL.md` frontmatter rules
- Preserve YAML frontmatter at the top of each skill file
- Keep existing fields such as `name`, `description`, `license`, `user-invocable`, and `argument-hint` when present
- Do not rename a skill unless the user explicitly asks for it
- Keep descriptions concise and trigger-oriented

## Mirrored skill file policy
When updating a skill under one mirror:
- Check whether the counterpart exists under the other mirror
- Keep both copies synchronized unless the user explicitly wants divergence
- Keep reference docs aligned as well when relevant
- Do not update one mirror and silently leave the other stale

## Naming conventions
- Skill names: kebab-case
- Markdown doc names: preserve existing names exactly
- GSD document names: keep canonical names such as `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `UI-SPEC.md`, `PLAN.md`, and `SUMMARY.md`
- Keep API names, library names, REQ-ID values, phase numbers, and file paths in original spelling

## Code snippets and future-app guidance
This repo has little or no live application code, but prompt/spec files may contain code snippets.
When editing snippets for the future app described in `PROMPT.md`:
- Assume TypeScript strict mode
- Match the declared stack: React 19, Vite, pnpm, Biome, shadcn/ui, Zustand, TanStack Query, TanStack Router, Dexie
- Prefer explicit types over implicit assumptions
- Do not use `any`, `@ts-ignore`, or error-suppression shortcuts
- Use descriptive variable and function names
- Keep components focused and composable
- Prefer accessible HTML and UI patterns
- Show realistic error handling rather than happy-path-only snippets

### Imports and module guidance for snippets
- Group imports logically: external packages first, then internal modules
- Avoid unused imports
- Prefer named imports when they improve clarity
- Keep import paths explicit and stable
- Do not invent aliases or folders that are not described in the prompt/spec

### Error-handling guidance
- Describe expected failure modes clearly
- Prefer actionable messages over vague statements
- Include recovery guidance when relevant
- Separate user-facing explanations from implementation details
- Do not hide uncertainty; call it out plainly

## UI and design guidance already established here
The Impeccable-derived skills in this repo consistently require agents to:
- gather design context before doing UI work
- avoid generic AI-looking interfaces
- maintain strong typography, spacing, contrast, and interaction quality
- finish with a polish pass once functionality is complete
Keep UI-related instruction edits compatible with `frontend-design`, `teach-impeccable`, and `polish`.

## Korean language policy for GSD and UI skills
The root `PROMPT.md` already establishes a Korean-language requirement. Preserve and enforce it.

### Mandatory language rule
When using `gsd` workflows or the `ui-ux-pro-max` skill:
- Write 안내 메시지, 질문, 요약, 설명, 디자인 근거, 추천안, 리뷰, and generated documents in Korean
- Keep code, commands, file paths, REQ-ID, phase numbers, API names, and library names in original notation
- Do not translate technical identifiers unless the user explicitly asks for translated aliases

### Required GSD document language
Write the following in Korean when generated through GSD-style workflows:
- `PROJECT.md`
- `REQUIREMENTS.md`
- `ROADMAP.md`
- `UI-SPEC.md`
- `PLAN.md`
- `SUMMARY.md`

## Required workflow for GSD UI work
When GSD is doing UI-related work such as UI/UX planning, screen design, design systems, component composition, or UI review, use this order:
1. Use `ui-ux-pro-max` to create the first draft
2. Refine that draft with the Impeccable-based workflow in this repo
3. If design context is missing, run `teach-impeccable` first
4. Use `frontend-design` for design direction and implementation guidance
5. Use `polish` for the final refinement pass once the draft is functionally complete
In short: **`ui-ux-pro-max`로 초안 생성 → Impeccable 계열 스킬로 다듬기**.

## Cursor and Copilot rule files
As of the current repo state:
- `.cursorrules`: absent
- `.cursor/rules/`: absent
- `.github/copilot-instructions.md`: absent
If any of those files are added later, update this document and treat them as first-class instruction sources.

## Things to avoid
- Do not pretend this repo already contains the app described in `PROMPT.md`
- Do not add fake build or test instructions
- Do not let mirrored skill docs drift out of sync
- Do not remove required frontmatter fields from skill docs
- Do not convert Korean guidance into English when policy says it should remain Korean
- Do not overwrite technical identifiers with translated equivalents

## Practical default behavior for agents
Before editing:
1. Read the target file and its mirrored counterpart if one exists
2. Check `PROMPT.md` for top-level policy that affects the change
3. Verify whether the change is repo-internal guidance or future-app specification

After editing:
1. Re-read the touched file
2. Re-read the mirrored counterpart if applicable
3. Confirm the new text is internally consistent and does not invent unsupported repo facts
