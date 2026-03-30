---
phase: 01-데이터-상태-기반
plan: 01
subsystem: infra
tags: [vite, react-19, typescript-6, tailwind-v4, dexie-v4, zustand, tanstack-query, tanstack-router, shadcn-ui]

# Dependency graph
requires: []
provides:
  - Vite + React 19 + TypeScript (strict) 프로젝트 기반
  - Dexie.js v4 IndexedDB 데이터베이스 스키마 (settings, conversations, messages)
  - Zustand UI 상태 스토어 (sidebarOpen)
  - TanStack Query Provider 설정 (staleTime 5분, gcTime 30분)
  - TanStack Router 파일 기반 라우팅 (/, /chat/$id, /settings)
  - shadcn/ui + Tailwind CSS v4 다크모드 기본 테마
  - Biome linter/formatter, Vitest 테스트 프레임워크
affects: [02-채팅-핵심, 03-대화-관리-설정, 04-사용자-경험-개선]

# Tech tracking
tech-stack:
  added: [react@19.2.4, react-dom@19.2.4, typescript@6.0.2, vite@6.4.1, @vitejs/plugin-react@5.2.0, tailwindcss@4.2.2, @tailwindcss/vite@4.2.2, dexie@4.4.1, dexie-react-hooks@4.4.0, @tanstack/react-query@5.95.2, @tanstack/react-router@1.168.8, @tanstack/router-plugin@1.167.9, zustand@5.0.12, lucide-react@1.7.0, clsx@2.1.1, tailwind-merge@3.5.0, class-variance-authority@0.7.1, @biomejs/biome@2.4.9, vitest@4.1.2]
  patterns: [Dexie EntityTable 제네릭, Zustand create 패턴, TanStack Router 파일 기반 라우팅, TanStack Query Provider 중첩]

key-files:
  created:
    - package.json
    - vite.config.ts
    - tsconfig.json
    - tsconfig.app.json
    - tsconfig.node.json
    - biome.json
    - index.html
    - components.json
    - src/index.css
    - src/lib/utils.ts
    - src/vite-env.d.ts
    - src/db/index.ts
    - src/stores/ui-store.ts
    - src/router.ts
    - src/main.tsx
    - src/routeTree.gen.ts
    - src/routes/__root.tsx
    - src/routes/index.tsx
    - src/routes/chat/$conversationId.tsx
    - src/routes/settings.tsx
  modified: []

key-decisions:
  - "@vitejs/plugin-react 5.2.0 사용 (Vite 6 호환, 6.0.1은 Vite 8용)"
  - "TypeScript 6 ignoreDeprecations 설정으로 baseUrl/paths 유지"
  - "crypto.randomUUID() 대신 UUID 라이브러리 없이 네이티브 API 사용 예정"

patterns-established:
  - "Dexie.js v4 EntityTable<T, KeyProp> 제네릭 타입 패턴"
  - "Zustand create<Interface> 스토어 패턴"
  - "TanStack Router 파일 기반 라우팅 + Register 타입 선언"
  - "QueryClientProvider + RouterProvider 중첩 렌더링"
  - "shadcn/ui cn() 유틸리티 (clsx + tailwind-merge)"

requirements-completed: [DATA-01, DATA-02, DATA-03, DATA-05, DATA-06, DATA-07]

# Metrics
duration: 6min
completed: 2026-03-30
---

# Phase 1 Plan 1: 프로젝트 인프라 구축 Summary

Vite 6 + React 19 + TypeScript 6 (strict) 프로젝트 기반과 Dexie.js v4 IndexedDB 스키마, Zustand 상태 관리, TanStack Query/Router 설정을 포함한 전체 인프라 구축

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-30T16:04:08Z
- **Completed:** 2026-03-30T16:10:36Z
- **Tasks:** 2
- **Files modified:** 22

## Accomplishments
- Vite 6.4.1 + React 19.2.4 + TypeScript 6 (strict) 프로젝트 생성 및 모든 의존성 설치
- Dexie.js v4 EntityTable 기반 IndexedDB 스키마 (settings, conversations, messages 3개 테이블)
- TanStack Router 파일 기반 라우팅 (/, /chat/$conversationId, /settings) 자동 생성 확인
- Zustand UI 상태 스토어 + TanStack Query Provider 설정
- pnpm build 성공 (tsc 타입체크 + vite 번들링)

## Task Commits

Each task was committed atomically:

1. **Task 1: Vite 프로젝트 초기화 + 의존성 설치 + 설정 파일 구성** - `8fba721` (feat)
2. **Task 2: Dexie.js DB 스키마 + 타입 + Zustand 스토어 + TanStack Query/Router 설정** - `4b1f51d` (feat)

## Files Created/Modified
- `package.json` - 프로젝트 메타데이터, 19개 의존성 (8 runtime + 11 dev)
- `vite.config.ts` - TanStack Router + Tailwind v4 + React 플러그인, @ 경로 alias
- `tsconfig.app.json` - TypeScript strict 모드, @/* 경로 alias, ignoreDeprecations 6.0
- `tsconfig.node.json` - Node.js 타입 포함, vite.config.ts 전용
- `biome.json` - Biome linter/formatter (indent 2, line width 100)
- `index.html` - React 앱 진입점 (lang="ko")
- `components.json` - shadcn/ui 설정 (new-york 스타일, zinc 기본 색상)
- `src/index.css` - Tailwind v4 + @theme 다크모드 기본 CSS 변수
- `src/lib/utils.ts` - shadcn/ui cn() 유틸리티 (clsx + tailwind-merge)
- `src/vite-env.d.ts` - Vite 클라이언트 타입 선언
- `src/db/index.ts` - Dexie.js DB 정의 (Setting, Conversation, Message 인터페이스 + EntityTable)
- `src/stores/ui-store.ts` - Zustand UI 스토어 (sidebarOpen, toggleSidebar, setSidebarOpen)
- `src/router.ts` - TanStack Router 인스턴스 + Register 타입 선언
- `src/main.tsx` - 앱 진입점 (QueryClientProvider + RouterProvider)
- `src/routeTree.gen.ts` - TanStack Router 자동 생성 라우트 트리
- `src/routes/__root.tsx` - 루트 레이아웃 (bg-background + text-foreground)
- `src/routes/index.tsx` - 홈 라우트 (빈 상태 placeholder)
- `src/routes/chat/$conversationId.tsx` - 채팅 라우트 (placeholder)
- `src/routes/settings.tsx` - 설정 라우트 (placeholder)

## Decisions Made
- @vitejs/plugin-react 버전을 5.2.0으로 고정: 6.0.1은 Vite 8 peer dependency를 가져 Vite 6.4.1과 호환되지 않음
- TypeScript 6의 baseUrl/paths 사용 중단 경고를 ignoreDeprecations: "6.0"으로 해결: Vite resolve.alias가 실제 경로 해석을 담당하므로 기능적 영향 없음
- shadcn/ui CLI 대신 수동 설정: 대화형 CLI가 비대화형 환경에서 동작하지 않아 components.json + cn() 유틸리티 직접 생성

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] @vitejs/plugin-react 버전 불일치 수정**
- **Found during:** Task 1 (의존성 설치)
- **Issue:** RESEARCH.md에 명시된 6.0.1 버전은 Vite 8용 peer dependency를 가져 Vite 6.4.1과 호환되지 않음
- **Fix:** @vitejs/plugin-react를 5.2.0으로 다운그레이드 (Vite 6 호환)
- **Files modified:** package.json
- **Verification:** pnpm build 성공 (peer dependency 경고 해결)
- **Committed in:** 8fba721 (Task 1 commit)

**2. [Rule 3 - Blocking] TypeScript 6 baseUrl/paths 사용 중단 해결**
- **Found during:** Task 1 (빌드 검증)
- **Issue:** TypeScript 6에서 baseUrl 옵션이 deprecated되어 TS5101 에러 발생
- **Fix:** tsconfig.app.json에 "ignoreDeprecations": "6.0" 추가
- **Files modified:** tsconfig.app.json
- **Verification:** pnpm build 성공 (TS5101 에러 해결)
- **Committed in:** 8fba721 (Task 1 commit)

**3. [Rule 3 - Blocking] @types/node 누락 설치**
- **Found during:** Task 1 (빌드 검증)
- **Issue:** vite.config.ts에서 node:path와 __dirname 사용 시 node 타입 정의 누락
- **Fix:** @types/node 설치 및 tsconfig.node.json에 "types": ["node"] 추가
- **Files modified:** package.json, tsconfig.node.json
- **Verification:** pnpm build 성공
- **Committed in:** 8fba721 (Task 1 commit)

---

**Total deviations:** 3 auto-fixed (3 blocking)
**Impact on plan:** 모든 수정은 빌드 성공을 위한 필수 작업. 범위 확장 없음.

## Issues Encountered
- pnpm create vite 대화형 프롬프트가 비대화형 환경에서 동작하지 않아 수동으로 프로젝트 파일 생성
- shadcn/ui CLI init 대화형 프롬프트도 동일 문제로 components.json 수동 생성

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 프로젝트 인프라 완전 구축, Phase 1 Plan 02 (대화 관리 UI) 진행 준비 완료
- TanStack Router가 3개 라우트를 정상 인식
- Dexie.js DB 스키마로 IndexedDB 테이블 생성 준비 완료
- Zustand 스토어로 UI 상태 관리 준비 완료
- shadcn/ui 컴포넌트 추가 가능 상태 (cn() 유틸리티, CSS 변수 설정 완료)

---
*Phase: 01-데이터-상태-기반*
*Completed: 2026-03-30*

## Self-Check: PASSED

- All 17 created files verified present on disk
- Both task commits verified in git log (8fba721, 4b1f51d)
- pnpm build exits with code 0
