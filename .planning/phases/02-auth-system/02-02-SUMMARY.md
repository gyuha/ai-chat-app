---
phase: 02-auth-system
plan: 02
subsystem: auth
tags: [zustand, react-query, tanstack-router, axios, jwt, react]

# Dependency graph
requires:
  - phase: 02-01
    provides: 백엔드 인증 API (register, login, refresh, logout, me)
provides:
  - Zustand 인증 상태 관리 (메모리 액세스 토큰, localStorage 사용자 정보)
  - Axios 인터셉터 기반 자동 토큰 주입 및 401 시 자동 갱신
  - TanStack Router 파일 기반 라우팅 및 인증 가드
  - 로그인/회원가입/로그아웃 UI 컴포넌트
affects: [03-chat-core, 04-ui-ux]

# Tech tracking
tech-stack:
  added: [zustand@^5.0.0, @tanstack/react-query@^5.62.0, @tanstack/react-router@^1.90.0, axios@^1.7.0, @tanstack/router-plugin@^1.90.0, @tanstack/router-devtools@^1.90.0, @tanstack/router-cli@^1.90.0, @types/react@^19.0.0, @types/react-dom@^19.0.0]
  patterns: [zustand persist partialize로 액세스 토큰 메모리 전용 저장, axios 응답 인터셉터 토큰 갱신 대기열 패턴, TanStack Router beforeLoad 인증 가드]

key-files:
  created:
    - frontend/src/lib/api/client.ts
    - frontend/src/lib/api/auth.ts
    - frontend/src/lib/api/types.ts
    - frontend/src/stores/auth.ts
    - frontend/src/routes/__root.tsx
    - frontend/src/routes/index.tsx
    - frontend/src/routes/login.tsx
    - frontend/src/routes/register.tsx
    - frontend/src/routes/logout.tsx
    - frontend/src/routeTree.gen.ts
    - frontend/src/components/auth/LoginForm.tsx
    - frontend/src/components/auth/RegisterForm.tsx
    - frontend/src/components/auth/LogoutButton.tsx
    - frontend/src/vite-env.d.ts
  modified:
    - frontend/src/main.tsx
    - frontend/vite.config.ts
    - frontend/package.json

key-decisions:
  - "Vite 프록시 활용으로 Axios baseURL 생략 (localhost:3000 직접 호출 대신 /api 경로 사용)"
  - "zustand persist partialize로 액세스 토큰은 메모리에만 저장 (XSS 방어)"
  - "TanStack Router 파일 기반 라우팅 + CLI 자동 생성 routeTree.gen.ts"

patterns-established:
  - "API 클라이언트 패턴: axios 인스턴스 + 요청/응답 인터셉터 + zustand 스토어 연동"
  - "라우트 가드 패턴: beforeLoad에서 useAuthStore.getState()로 동기 인증 확인"
  - "폼 패턴: useState + useMutation + 인라인 에러 표시"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, SEC-02]

# Metrics
duration: 12min
completed: 2026-03-29
---

# Phase 02 Plan 02: 프론트엔드 인증 연동 Summary

**Zustand persist로 액세스 토큰 메모리 저장 + Axios 인터셉터 자동 갱신 + TanStack Router beforeLoad 인증 가드**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-29T13:10:26Z
- **Completed:** 2026-03-29T13:22:00Z
- **Tasks:** 4
- **Files modified:** 14

## Accomplishments
- Axios 클라이언트: 요청 인터셉터로 액세스 토큰 자동 주입, 응답 인터셉터로 401 시 자동 리프레시
- Zustand authStore: persist 미들웨어 partialize로 사용자 정보만 localStorage 저장, 액세스 토큰은 메모리 전용
- TanStack Router 파일 기반 라우팅: __root, index, login, register, logout 라우트 생성
- 인증 가드: beforeLoad에서 isAuthenticated 확인하여 미인증 시 /login으로 리다이렉트
- 로그인/회원가입 폼: TanStack Query mutation 기반, 클라이언트 유효성 검증, 인라인 에러 표시

## Task Commits

Each task was committed atomically:

1. **Task 1: 프론트엔드 의존성 설치 및 API 클라이언트 설정** - `e98af96` (feat)
2. **Task 2: Zustand authStore 및 TanStack Query Provider 설정** - `4946fbb` (feat)
3. **Task 3: TanStack Router 라우트 및 인증 가드 구현** - `4392217` (feat)
4. **Task 4: 로그인/회원가입 폼 컴포넌트 구현** - `f1e38ce` (feat)
5. **빌드 수정 (타입 선언 및 라우터 context)** - `25f16aa` (fix)

## Files Created/Modified
- `frontend/src/lib/api/client.ts` - Axios 클라이언트 (토큰 자동 주입 + 401 자동 갱신)
- `frontend/src/lib/api/auth.ts` - 인증 API 함수 (register, login, logout, me)
- `frontend/src/lib/api/types.ts` - DTO 타입 정의
- `frontend/src/stores/auth.ts` - Zustand 인증 스토어 (persist partialize)
- `frontend/src/main.tsx` - TanStack Query + Router Provider 설정
- `frontend/vite.config.ts` - TanStack Router 플러그인 추가
- `frontend/src/routes/__root.tsx` - 루트 라우트 (createRootRouteWithContext)
- `frontend/src/routes/index.tsx` - 인증 가드 라우트 (beforeLoad)
- `frontend/src/routes/login.tsx` - 로그인 페이지
- `frontend/src/routes/register.tsx` - 회원가입 페이지
- `frontend/src/routes/logout.tsx` - 로그아웃 라우트 (API 호출 + 상태 초기화)
- `frontend/src/routeTree.gen.ts` - TanStack Router 자동 생성 라우트 트리
- `frontend/src/components/auth/LoginForm.tsx` - 로그인 폼
- `frontend/src/components/auth/RegisterForm.tsx` - 회원가입 폼
- `frontend/src/components/auth/LogoutButton.tsx` - 로그아웃 버튼
- `frontend/src/vite-env.d.ts` - Vite 타입 선언

## Decisions Made
- Vite 프록시가 /api를 localhost:3000으로 라우팅하므로 Axios baseURL 생략
- zustand persist partialize로 액세스 토큰은 localStorage에 저장하지 않고 메모리에만 보관 (XSS 공격 방어)
- TanStack Router 파일 기반 라우팅 채택: @tanstack/router-plugin + @tanstack/router-cli로 routeTree.gen.ts 자동 생성
- 라우트 가드는 beforeLoad에서 useAuthStore.getState()로 동기 확인 (비동기 아님)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] @types/react 타입 선언 누락 및 라우터 context 속성 누락**
- **Found during:** Task 4 이후 빌드 확인
- **Issue:** React 19 타입 선언이 없어 TS7016 에러 발생, createRootRouteWithContext 사용 시 router에 context 속성 필수
- **Fix:** @types/react, @types/react-dom 설치, main.tsx에 router context 추가, vite-env.d.ts 생성
- **Files modified:** frontend/package.json, frontend/src/main.tsx, frontend/src/vite-env.d.ts
- **Verification:** `pnpm build` 성공 (347.91 kB JS, 0.24 kB CSS)
- **Committed in:** `25f16aa`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** 필수 빌드 수정. 스코프 확장 없음.

## Issues Encountered
- TanStack Router CLI(tsr)를 별도 설치해야 routeTree.gen.ts 자동 생성 가능. @tanstack/router-cli 패키지 추가 설치함.

## User Setup Required
None - 외부 서비스 설정 불필요.

## Next Phase Readiness
- 프론트엔드 인증 전체 흐름 구현 완료 (회원가입 -> 자동 로그인 -> 메인 페이지 -> 로그아웃)
- 3단계(채팅 핵심)에서 authStore의 user 상태와 api 클라이언트를 활용하여 인증된 채팅 API 호출 가능
- TanStack Router 라우트 구조 확립: 향후 /chat/:id 등 라우트 추가 용이

---
*Phase: 02-auth-system*
*Completed: 2026-03-29*

## Self-Check: PASSED

- 14개 파일 모두 존재 확인
- 5개 커밋 모두 존재 확인 (e98af96, 4946fbb, 4392217, f1e38ce, 25f16aa)
