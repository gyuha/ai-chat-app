# Phase 1 바로 착수 가능한 작업 목록

## 목표

보안 프록시와 모노레포 기반을 먼저 구축해 이후 UI 작업이 흔들리지 않게 한다.

## 작업 목록

1. 루트 `pnpm workspace` 구조 생성
2. `apps/web`, `apps/server`, `packages/contracts`, `packages/config` 디렉터리 생성
3. 루트 `package.json`, `pnpm-workspace.yaml`, `biome.json`, 공통 `tsconfig` 추가
4. `apps/server`에 NestJS 앱 스캐폴드 및 `health`, `models`, `chats` 모듈 생성
5. 서버 env schema와 `OPENROUTER_MODEL_ALLOWLIST` 파싱 유틸 작성
6. OpenRouter client 골격과 upstream abort 가능한 fetch wrapper 작성
7. `GET /api/v1/health`, `GET /api/v1/models` 구현
8. repository interface와 `memory` / `file` adapter 골격 생성
9. `packages/contracts`에 `ModelOption`, `ChatSummary`, `StreamEvent` 타입 정의
10. `apps/web`에 Vite React 앱 스캐폴드와 health/models fetch client 연결
11. 루트 `pnpm dev`와 `pnpm build`, `pnpm lint`, `pnpm typecheck` 스크립트 정리
12. `.env.example`에 서버 필수 env 샘플 추가

## Definition of Done

- `pnpm dev`로 web/server가 동시에 실행된다
- 브라우저에서 `/api/v1/models` 응답을 확인할 수 있다
- OpenRouter key 없이 web이 동작한다
- 이후 Phase 2에서 바로 shell UI를 얹을 수 있는 contracts와 API 골격이 존재한다
