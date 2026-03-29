# Phase 2: 인증 시스템 - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

이메일/비밀번호 기반 회원가입, 로그인, 로그아웃 기능과 JWT 기반 세션 관리를 구현한다. 사용자가 브라우저 새로고침 후에도 로그인 상태가 유지되며, 긴 대화 중에도 세션이 끊기지 않는다. 인증된 사용자만 대화 기능에 접근할 수 있다.

</domain>

<decisions>
## Implementation Decisions

### 토큰 전략
- **D-01:** 액세스 토큰(15분) + 리프레시 토큰(7일) 듀얼 토큰 전략 사용
- **D-02:** 리프레시 토큰은 DB에 저장하여 서버 사이드 무효화 가능 (User 모델에 refreshToken 필드 추가 또는 별도 테이블)
- **D-03:** 액세스 토큰 만료 5분 전 자동 갱신 (SEC-02 요구사항 충족)
- **D-04:** 토큰 만료 시 401 응답, 프론트엔드에서 리프레시 토큰으로 자동 재발급

### 토큰 저장 방식
- **D-05:** 리프레시 토큰은 httpOnly 쿠키에 저장 (XSS 공격 방지)
- **D-06:** 액세스 토큰은 메모리에 저장 (zustand store), 새로고침 시 리프레시 토큰으로 재발급
- **D-07:** 쿠키 설정: secure=false (개발환경), sameSite=lax, path=/api/auth/refresh

### 인증 API 설계
- **D-08:** POST /api/auth/register — 회원가입 (email, password DTO)
- **D-09:** POST /api/auth/login — 로그인 (email, password, 리프레시 토큰 쿠키 설정)
- **D-10:** POST /api/auth/refresh — 액세스 토큰 재발급 (리프레시 토큰 쿠키에서 읽기)
- **D-11:** POST /api/auth/logout — 로그아웃 (쿠키 삭제, DB 리프레시 토큰 무효화)
- **D-12:** GET /api/auth/me — 현재 사용자 정보 조회 (인증 상태 확인용)

### 비밀번호 정책
- **D-13:** 최소 8자, 최대 128자
- **D-14:** 복잡도 규칙 없음 (대문자/숫자/특수문자 강제하지 않음 — 현대적 UX)
- **D-15:** bcrypt로 해싱 (솔트 자동 관리)

### 인증 UI 흐름
- **D-16:** 로그인(/login)과 회원가입(/register)은 별도 페이지
- **D-17:** 미인증 사용자가 보호된 라우트 접근 시 /login으로 리다이렉트
- **D18:** 로그인 성공 후 이전 페이지 또는 메인(/)으로 리다이렉트
- **D-19:** 회원가입 성공 후 자동 로그인 처리
- **D-20:** 로그아웃 시 모든 토큰 삭제 후 /login으로 리다이렉트

### NestJS 모듈 구조
- **D-21:** AuthModule, AuthController, AuthService 구조
- **D-22:** UsersModule, UsersService (사용자 CRUD 분리)
- **D-23:** JwtStrategy (Passport), JwtAuthGuard (전역 가드)
- **D-24:** PrismaModule (PrismaClient 제공자)

### 프론트엔드 인증 상태 관리
- **D-25:** Zustand authStore: user, isAuthenticated, isLoading 상태
- **D-26:** TanStack Query: API 호출 시 토큰 자동 주입 (axios interceptor)
- **D-27:** 라우트 가드: 인증 필요 라우트와 공개 라우트 구분

### Claude's Discretion
- 회원가입/로그인 폼의 정확한 레이아웃 (shadcn/ui 기반)
- 에러 메시지 표시 방식 (인라인 vs 토스트)
- 로딩 스피너 디자인
- 이메일 중복 체크 시점 (제출 시 vs 입력 중)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 인증 아키텍처
- `.planning/research/STACK.md` — NestJS Passport/JWT, bcrypt, class-validator 스택 선정 이유
- `.planning/research/ARCHITECTURE.md` — 인증 모듈 구조, JWT 전략 패턴
- `.planning/research/PITFALLS.md` — JWT 자동 갱신, 스트리밍 중 세션 만료 위험

### 데이터 모델
- `backend/prisma/schema.prisma` — User 모델 정의 (인증 필드)

### 기존 구현
- `backend/src/main.ts` — ValidationPipe 전역 설정 (BACK-04)
- `backend/src/app.module.ts` — ConfigModule, 모듈 등록 패턴
- `CLAUDE.md` — 프로젝트 컨벤션 (한글, 모노레포, TanStack Query/Zustand 분리)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/src/main.ts`: ValidationPipe (whitelist, forbidNonWhitelisted, transform) — 모든 DTO에 자동 적용
- `backend/prisma/schema.prisma`: User 모델 (id, email, password, createdAt, updatedAt) — 인증 기반 준비됨
- CORS 설정: credentials: true — 쿠키 기반 인증 가능

### Established Patterns
- NestJS 모듈 패턴: ConfigModule.forRoot({ isGlobal: true })
- Prisma v7: schema.prisma에서 url 제거, prisma.config.ts 사용
- Biome v2: 린트/포맷팅

### Integration Points
- AuthModule → AppModule (imports)
- JwtAuthGuard → 전역 가드로 등록 (chat, message 라우트 보호)
- axios interceptor → 프론트엔드 API 호출 시 토큰 자동 주입
- TanStack Router → 라우트 가드 (인증 필요/불필요 라우트 구분)

</code_context>

<specifics>
## Specific Ideas

- ChatGPT 스타일: 미인증 시 로그인 페이지로 리다이렉트, 로그인 후 채팅 인터페이스
- 다크 모드 우선: 로그인/회원가입 페이지도 다크 테마
- shadcn/ui Card 컴포넌트로 폼 카드 레이아웃
- 반응형: 모바일에서도 폼 사용 가능

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-auth-system*
*Context gathered: 2026-03-29 via auto mode*
