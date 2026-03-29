# Repository Guidelines

## Project Structure & Module Organization
This repository is currently a thin project seed: [`README.md`](/Users/gyuha/workspace/ai-chat-app.worktrees/codex/README.md) names the project and [`PROMPT.md`](/Users/gyuha/workspace/ai-chat-app.worktrees/codex/PROMPT.md) defines the intended stack. Follow that prompt when scaffolding code.

Recommended layout for new work:
- `apps/web/`: React + TypeScript frontend
- `apps/server/`: NestJS + TypeScript backend
- `packages/ui/`: shared UI primitives if components are reused
- `packages/config/`: shared Biome, TypeScript, and lint settings
- `docs/`: architecture notes, API contracts, and setup guides

Keep assets close to the feature that owns them. Prefer feature-based folders over large generic `utils/` dumps.

## Build, Test, and Development Commands
Use `pnpm` as the package manager. This repo does not yet include runnable scripts, so contributors should standardize on these names when scaffolding:

- `pnpm install`: install workspace dependencies
- `pnpm dev`: run web and server in development
- `pnpm build`: build all packages/apps
- `pnpm test`: run unit and integration tests
- `pnpm lint`: run Biome checks
- `pnpm format`: apply Biome formatting

If separate app scripts are needed, expose them as `pnpm --filter web dev` and `pnpm --filter server dev`.

## Coding Style & Naming Conventions
Use TypeScript throughout. Prefer 2-space indentation, single-responsibility modules, and explicit exports for public APIs. Use:

- `PascalCase` for React components and NestJS classes
- `camelCase` for variables, functions, and Zustand stores
- `kebab-case` for folders and non-component file names

Use Biome for formatting and linting. Avoid mixing Korean and English identifiers in code; pick English for source and keep user-facing copy localized separately.

## Testing Guidelines
Add tests alongside the code they cover or under `tests/` when cross-cutting. Name unit tests `*.test.ts` or `*.test.tsx`. For backend routes and frontend flows, add integration coverage before merging larger features. Do not lower coverage for touched modules.

## Commit & Pull Request Guidelines
Current history is minimal and inconsistent (`reset`, `프로젝트 시작 프롬프트`, `first commit`). Use a stricter convention going forward: short imperative subjects such as `feat: scaffold NestJS server` or `fix: validate OpenRouter key handling`.

PRs should include:
- a brief problem/solution summary
- linked issue or task when available
- screenshots or API examples for user-visible changes
- notes on new env vars, migrations, or setup steps

## Security & Configuration Tips
Do not commit real API keys. Keep OpenRouter secrets on the server only, expose them through backend endpoints, and document required env vars in `.env.example`.
