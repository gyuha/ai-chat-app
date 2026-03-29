# Phase 3: 채팅 핵심 - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

사용자가 OpenRouter 무료 모델과 실시간 SSE 스트리밍으로 대화하고, 대화를 생성/조회/삭제하며, Stop/Regenerate 기능을 사용할 수 있는 핵심 채팅 기능을 구현한다. 마크다운 렌더링, 다크 모드, 반응형 레이아웃 등 UI/UX 개선은 Phase 4에서 다룬다.

**포함:** SSE 스트리밍, 대화/메시지 CRUD, OpenRouter 프록시, Stop/Regenerate, 대화 목록, 자동 제목 생성, 시스템 프롬프트, 모델 allowlist, rate limit 처리
**제외:** 마크다운 렌더링, 다크 모드 토글, 반응형 레이아웃, 코드 복사, 자동 스크롤, 로딩 스켈레톤, 빈 상태 온보딩 (Phase 4)

</domain>

<decisions>
## Implementation Decisions

### 스트리밍 아키텍처
- **D-01:** 백엔드가 OpenRouter API에 SSE/chunked 스트리밍으로 연결하고, 클라이언트에도 SSE로 토큰 단위 전달하는 풀 프록시 방식
- **D-02:** 클라이언트는 EventSource 대신 fetch API + ReadableStream 사용 (POST 요청 본문 전달 + 스트리밍 응답 동시 지원)
- **D-03:** 스트리밍 중 연결 해제 시 백엔드에서 AbortController로 OpenRouter 요청 취소
- **D-04:** 메시지 상태: `streaming` | `completed` | `stopped` | `error` — Prisma Message 모델에 status 필드 추가

### 대화/메시지 API 설계
- **D-05:** RESTful CRUD — `POST /api/chats`, `GET /api/chats`, `GET /api/chats/:id`, `DELETE /api/chats/:id`
- **D-06:** 메시지 전송 — `POST /api/chats/:id/messages` (스트리밍 응답 반환)
- **D-07:** 메시지 조회 — `GET /api/chats/:id/messages?cursor=&limit=50` 커서 기반 페이지네이션
- **D-08:** 최초 대화 진입 시 최근 50개 메시지 로드, 스크롤업 시 이전 메시지 추가 로드 (Phase 4에서 무한 스크롤 구현)
- **D-09:** 대화 제목 자동 생성 — 첫 번째 사용자 메시지 전송 후 백그라운드에서 AI로 제목 생성 (첫 30자 truncate 기본값, AI 응답으로 교체)

### 모델 관리
- **D-10:** v1은 기본 무료 모델 1개 고정 사용 (예: `google/gemma-2-9b-it:free`)
- **D-11:** 백엔드에 모델 allowlist 배열 관리 — 환경변수 또는 하드코딩
- **D-12:** 프론트엔드에 모델 선택 UI는 Phase 3에서 최소 구조만 준비 (드롭다운 컴포넌트 + 현재 모델 표시), 실제 모델 전환은 v2에서 활성화

### 채팅 UI 구조
- **D-13:** 사이드바(좌) + 메인 채팅 영역(우) 2단 레이아웃 — ChatGPT 스타일
- **D-14:** 사이드바: 대화 목록 + 새 대화 버튼 + 로그아웃 버튼
- **D-15:** 메인 영역: 메시지 목록 + 입력 영역(하단 고정) + Stop/Regenerate 버튼
- **D-16:** 라우팅: `/` → 최근 대화 또는 새 대화, `/chat/:id` → 특정 대화
- **D-17:** 메시지 표시: 사용자 메시지(우측 정렬) + AI 메시지(좌측 정렬) — 기본 텍스트 표시 (마크다운 렌더링은 Phase 4)

### Stop/Regenerate
- **D-18:** Stop generating: AbortController로 fetch 스트리밍 중단 + 백엔드에 취소 신호 전달 + 불완전 메시지 `stopped` 상태로 저장
- **D-19:** Regenerate: 마지막 assistant 메시지 삭제 + 동일 user 메시지로 재전송
- **D-20:** Stop/Regenerate 버튼은 스트리밍 중에만 표시, 입력창 위치에 인라인 배치

### 시스템 프롬프트
- **D-21:** 대화별 시스템 프롬프트 설정 — Chat 모델에 systemPrompt 필드 사용
- **D-22:** 사이드바 또는 대화 헤더에서 설정 가능
- **D-23:** 기본 시스템 프롬프트: 없음 (빈 값) — 사용자가 명시적으로 설정한 경우만 OpenRouter에 전달

### Rate Limit 처리
- **D-24:** OpenRouter 429 응답 시 사용자에게 "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." 메시지 + 재시도 버튼 표시
- **D-25:** Retry-After 헤더가 있으면 대기 시간 표시
- **D-26:** 백엔드에서 OpenRouter 에러 코드를 사용자 친화적 메시지로 변환

### NestJS 모듈 구조
- **D-27:** ChatModule (채팅 CRUD), ChatController, ChatService, MessageService
- **D-28:** OpenRouterService (OpenRouter API 통신, 스트리밍 프록시)
- **D-29:** 기존 JwtAuthGuard로 모든 채팅 라우트 보호

### 프론트엔드 상태 관리
- **D-30:** Zustand: chatStore (현재 대화, 메시지 목록, 스트리밍 상태) + chatListStore (대화 목록)
- **D-31:** TanStack Query: 대화 목록 조회, 메시지 로드 (서버 상태)
- **D-32:** 스트리밍 상태는 Zustand에서 관리 (실시간 업데이트에 적합)

### Claude's Discretion
- 정확한 스트리밍 파서 구현 (SSE 이벤트 파싱 세부사항)
- 메시지 날짜 표시 형식
- 사이드바 너비 및 레이아웃 비율
- 에러 메시지 정확한 문구
- 대화 제목 생성 AI 프롬프트 내용
- 입력 영역 최소/최대 높이
- 메시지 정렬 및 간격

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 프로젝트 설정 및 기존 구현
- `backend/src/app.module.ts` — NestJS 모듈 등록 패턴
- `backend/src/main.ts` — ValidationPipe 전역 설정, CORS 설정
- `backend/prisma/schema.prisma` — Chat, Message 모델 정의 (이미 존재)
- `CLAUDE.md` — 프로젝트 컨벤션, 기술 스택, 명령어

### 인증 연동 (Phase 2)
- `.planning/phases/02-auth-system/02-CONTEXT.md` — 인증 결정 사항 (JWT, 가드, 인터셉터)
- `backend/src/auth/guards/jwt-auth.guard.ts` — 전역 JWT 가드
- `frontend/src/lib/api/client.ts` — Axios 인터셉터 (토큰 갱신)
- `frontend/src/stores/auth.ts` — Zustand 인증 스토어 패턴

### 프론트엔드 패턴
- `frontend/src/routes/__root.tsx` — 라우트 구조, 인증 가드
- `frontend/src/stores/auth.ts` — Zustand persist 패턴 참고용

### 외부 명세
- 외부 명세 없음 — 요구사항은 REQUIREMENTS.md와 위 결정에 완전히 포함됨

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/prisma/schema.prisma`: Chat, Message 모델 이미 정의됨 — 마이그레이션만 필요
- `backend/src/auth/guards/jwt-auth.guard.ts`: JwtAuthGuard — 채팅 라우트 보호에 즉시 사용 가능
- `frontend/src/lib/api/client.ts`: Axios 인터셉터 — 인증 토큰 자동 주입, 401 시 자동 갱신
- `frontend/src/stores/auth.ts`: Zustand persist 패턴 — chatStore 설계 참고
- `backend/src/auth/dto/`: DTO 패턴 — class-validator 데코레이터 활용

### Established Patterns
- NestJS 모듈: Controller → Service → Prisma 구조
- DTO: class-validator + class-transformer (ValidationPipe 자동 적용)
- Zustand: persist 미들웨어로 상태 유지, partialize로 민감 데이터 제외
- TanStack Router: 파일 기반 라우팅, beforeLoad로 인증 가드
- Prisma v7: library 엔진 + better-sqlite3 adapter

### Integration Points
- AppModule → ChatModule imports 추가
- JwtAuthGuard → 채팅 컨트롤러에 전역 적용 (이미 전역 가드)
- Axios client → 스트리밍 fetch는 별도 처리 필요 (인터셉터 미적용)
- TanStack Router → `/chat` 라우트 추가, 인증 가드 연결
- Zustand authStore → chatStore에서 사용자 정보 참조

</code_context>

<specifics>
## Specific Ideas

- ChatGPT 스타일: 사이드바 + 메인 채팅 영역, 좌측에 대화 목록
- 스트리밍 응답이 토큰 단위로 실시간 표시되는 것이 핵심 UX
- Stop generating은 입력창 위치에 표시되어 즉시 접근 가능
- 대화 제목은 첫 메시지 전송 직후 자동 생성 (UX 부드러움)
- 모바일에서는 사이드바 접힘 상태가 기본 (Phase 4에서 상세 구현)

</specifics>

<deferred>
## Deferred Ideas

- 마크다운 렌더링 (코드 블록, 표, 목록) — Phase 4
- 코드 복사 버튼 — Phase 4
- 다크/라이트 모드 토글 — Phase 4
- 반응형 레이아웃 세부 조정 — Phase 4
- 자동 스크롤 + 하단 이동 버튼 — Phase 4
- 로딩 스켈레톤/인디케이터 — Phase 4
- 빈 상태 온보딩 안내 — Phase 4
- 멀티라인 입력창 자동 높이 조절 — Phase 4
- 모델 전환 기능 (다중 모델 선택) — v2
- 모델 설명/컨텍스트 길이 표시 — v2

</deferred>

---

*Phase: 03-chat-core*
*Context gathered: 2026-03-29 via auto mode*
