---
phase: 02-auth-system
plan: 01
subsystem: auth
tags: [jwt, passport, bcrypt, prisma, nestjs, cookie, sqlite]

# Dependency graph
requires:
  - phase: 01-project-setup
    provides: NestJS 기본 프로젝트 구조, Prisma 스키마, ValidationPipe, CORS 설정
provides:
  - 이메일/비밀번호 회원가입 API (POST /api/auth/register)
  - 로그인 API (POST /api/auth/login)
  - 액세스 토큰 재발급 API (POST /api/auth/refresh)
  - 로그아웃 API (POST /api/auth/logout)
  - 현재 사용자 조회 API (GET /api/auth/me)
  - JWT 듀얼 토큰 인증 (액세스 15분 / 리프레시 7일)
  - httpOnly 쿠키 기반 리프레시 토큰 전달
  - bcrypt 비밀번호 해싱
  - opaque 리프레시 토큰 DB 저장 및 무효화
affects: [03-chat-system, 04-frontend-auth]

# Tech tracking
tech-stack:
  added: ["@nestjs/passport@11", "@nestjs/jwt@11", "passport@0.7", "passport-jwt@4", "passport-local@1", "bcrypt@5.1", "cookie-parser@1.4", "@prisma/adapter-better-sqlite3", "better-sqlite3"]
  patterns: [Passport 전략 패턴, JWT 듀얼 토큰, opaque 리프레시 토큰, httpOnly 쿠키, @Global PrismaModule]

key-files:
  created:
    - backend/src/prisma/prisma.service.ts
    - backend/src/prisma/prisma.module.ts
    - backend/src/users/users.service.ts
    - backend/src/users/users.module.ts
    - backend/src/users/dto/create-user.dto.ts
    - backend/src/auth/auth.module.ts
    - backend/src/auth/auth.service.ts
    - backend/src/auth/auth.controller.ts
    - backend/src/auth/strategies/local.strategy.ts
    - backend/src/auth/strategies/jwt.strategy.ts
    - backend/src/auth/guards/jwt-auth.guard.ts
    - backend/src/auth/dto/register.dto.ts
    - backend/src/auth/dto/login.dto.ts
    - backend/src/auth/dto/auth-response.dto.ts
    - backend/src/auth/types/authenticated-request.interface.ts
  modified:
    - backend/prisma/schema.prisma
    - backend/src/app.module.ts
    - backend/src/main.ts
    - backend/package.json
    - package.json

key-decisions:
  - "Prisma v7 library 엔진 + better-sqlite3 adapter 방식으로 DB 연결 (client 엔진은 adapter/accelerate 필수)"
  - "opaque 리프레시 토큰(randomBytes) 사용 - JWT 대신 DB 저장 방식으로 서버 사이드 무효화 지원"
  - "리프레시 토큰을 httpOnly 쿠키로 전달, 경로를 /api/auth/refresh로 제한하여 CSRF 방어"

patterns-established:
  - "NestJS 모듈 구조: prisma/ (Global), users/ (export), auth/ (전략/가드/DTO 계층)"
  - "인증 흐름: register/login → 액세스 토큰(JSON) + 리프레시 토큰(httpOnly 쿠키)"
  - "Prisma v7 패턴: schema.prisma에 url 없음, prisma.config.ts에서 관리, adapter로 런타임 연결"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, SEC-02]

# Metrics
duration: 27min
completed: 2026-03-29
---

# Phase 02 Plan 01: 백엔드 인증 시스템 구축 Summary

**NestJS Passport/JWT 듀얼 토큰 인증 (액세스 15분/리프레시 7일), bcrypt 해싱, httpOnly 쿠키, opaque 리프레시 토큰 DB 저장**

## Performance

- **Duration:** 27분
- **Started:** 2026-03-29T12:34:13Z
- **Completed:** 2026-03-29T13:01:27Z
- **Tasks:** 4
- **Files modified:** 20+

## Accomplishments
- 5개 인증 API 엔드포인트 구현 (register, login, refresh, logout, me)
- JWT 액세스 토큰 (15분 만료) + opaque 리프레시 토큰 (7일, DB 저장) 듀얼 토큰 전략
- bcrypt로 비밀번호 해싱, httpOnly 쿠키로 리프레시 토큰 안전 전달
- Passport LocalStrategy (이메일/비밀번호) 및 JwtStrategy (Bearer 토큰) 구현
- Prisma v7 + better-sqlite3 adapter 연결 문제 해결

## Task Commits

Each task was committed atomically:

1. **Task 1: Prisma 스키마 업데이트 및 인증 의존성 설치** - `6db7378` (feat)
2. **Task 2: PrismaModule, UsersModule, AuthModule 생성** - `dada355` (feat)
3. **Task 3: Passport 전략 및 AuthService 구현** - `260c9ad` (feat)
4. **Task 4: AuthController 엔드포인트 구현** - `15a11fa` (feat)

## Files Created/Modified
- `backend/prisma/schema.prisma` - User 모델에 refreshToken 필드 추가
- `backend/src/prisma/prisma.service.ts` - PrismaClient + better-sqlite3 adapter
- `backend/src/prisma/prisma.module.ts` - @Global 모듈
- `backend/src/users/users.service.ts` - 사용자 CRUD (findByEmail, findById, create, findByRefreshToken, updateRefreshToken)
- `backend/src/users/users.module.ts` - UsersService 제공 모듈
- `backend/src/auth/auth.module.ts` - JwtModule, PassportModule, AuthService 설정
- `backend/src/auth/auth.service.ts` - 인증 로직 (register, login, refresh, logout, validateUser)
- `backend/src/auth/auth.controller.ts` - 5개 인증 API 엔드포인트
- `backend/src/auth/strategies/local.strategy.ts` - 이메일/비밀번호 로컬 전략
- `backend/src/auth/strategies/jwt.strategy.ts` - JWT Bearer 토큰 검증
- `backend/src/auth/guards/jwt-auth.guard.ts` - 보호된 라우트용 가드
- `backend/src/auth/dto/register.dto.ts` - 회원가입 DTO 검증
- `backend/src/auth/dto/login.dto.ts` - 로그인 DTO 검증
- `backend/src/auth/dto/auth-response.dto.ts` - 인증 응답 DTO
- `backend/src/auth/types/authenticated-request.interface.ts` - 인증된 요청 타입
- `backend/src/app.module.ts` - PrismaModule, AuthModule 임포트
- `backend/src/main.ts` - cookie-parser 미들웨어 추가

## Decisions Made
- **Prisma v7 library 엔진 + better-sqlite3 adapter**: Prisma v7에서 client 엔진은 adapter 또는 accelerateUrl 필수. library 엔진으로 전환하여 better-sqlite3 adapter 사용
- **opaque 리프레시 토큰 (randomBytes)**: JWT 리프레시 토큰 대신 randomBytes(32)로 생성한 opaque 토큰 사용. DB에 저장하여 서버 사이드 무효화 가능
- **refreshWithToken 메서드**: 쿠키에서 리프레시 토큰을 받아 DB에서 직접 사용자를 조회하는 방식으로, JWT 디코딩 불필요
- **httpOnly 쿠키 경로 제한**: 리프레시 토큰 쿠키를 /api/auth/refresh 경로로 제한하여 CSRF 공격 표면 최소화

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Prisma v7 client 엔진 호환성 문제 해결**
- **Found during:** Task 4 (서버 시작 테스트)
- **Issue:** Prisma v7의 기본 엔진이 "client"로 변경되어 adapter/accelerate 없이 PrismaClient 초기화 불가
- **Fix:** engineType을 "library"로 설정하고 @prisma/adapter-better-sqlite3 사용
- **Files modified:** backend/prisma/schema.prisma, backend/src/prisma/prisma.service.ts, backend/package.json, package.json
- **Verification:** 서버 정상 시작, 모든 라우트 로드 확인
- **Committed in:** 15a11fa (Task 4 커밋에 포함)

**2. [Rule 1 - Bug] cookie-parser 임포트 방식 수정**
- **Found during:** Task 4 (빌드 테스트)
- **Issue:** `import * as cookieParser from "cookie-parser"` 가 TypeScript에서 타입 에러 발생
- **Fix:** `import cookieParser from "cookie-parser"` 로 변경 (allowSyntheticDefaultImports 필요)
- **Files modified:** backend/src/main.ts
- **Verification:** 빌드 성공
- **Committed in:** 15a11fa (Task 4 커밋에 포함)

**3. [Rule 2 - Missing Critical] express 타입 정의 누락**
- **Found during:** Task 4 (빌드 테스트)
- **Issue:** @types/express가 설치되지 않아 Request/Response 타입 인식 불가
- **Fix:** `pnpm --filter backend install -D @types/express` 실행
- **Files modified:** backend/package.json, pnpm-lock.yaml
- **Verification:** 빌드 성공
- **Committed in:** 15a11fa (Task 4 커밋에 포함)

**4. [Rule 3 - Blocking] AuthController 계획 코드의 설계 결함 수정**
- **Found during:** Task 4 (코드 검토)
- **Issue:** 계획의 AuthController 코드에 3가지 문제 - (1) UsersService 미주입으로 /me 동작 불가, (2) verifyRefreshToken 미존재 메서드 호출, (3) LocalStrategy 직접 가드 참조
- **Fix:** UsersService 주입 추가, opaque 토큰 기반 refreshWithToken 메서드 구현, AuthGuard('local') 사용
- **Files modified:** backend/src/auth/auth.controller.ts, backend/src/auth/auth.service.ts, backend/src/users/users.service.ts
- **Verification:** 서버 정상 시작 및 모든 라우트 매핑 확인
- **Committed in:** 15a11fa (Task 4 커밋에 포함)

---

**Total deviations:** 4 auto-fixed (2 bug, 1 missing critical, 1 blocking)
**Impact on plan:** 모든 수정이 정확성과 실행 가능성에 필수적. Prisma v7 호환성은 계획에서 예상하지 못한 플랫폼 변경 사항.

## Issues Encountered
- Prisma v7의 대폭적인 변경사항 (schema에 url 불가, client 엔진이 기본, adapter 필수) 으로 인한 호환성 문제. engineType="library" + better-sqlite3 adapter로 해결
- pnpm 모노레포에서 `.prisma/client` 의 네임스페이스 import 문제. output을 생략하여 기본 @prisma/client 위치에 생성하도록 해결

## User Setup Required
None - 별도 외부 서비스 설정 불필요.

## Next Phase Readiness
- 백엔드 인증 API가 완전히 구현됨. 프론트엔드 인증 연동(02-02) 진행 가능
- JWT_SECRET 환경변수가 .env에 설정되어 있어야 함
- 로그인/회원가입 API가 정상 동작함 (서버 시작 확인 완료)

---
*Phase: 02-auth-system*
*Completed: 2026-03-29*

## Self-Check: PASSED

- 9/9 핵심 파일 존재 확인
- 4/4 태스크 커밋 해시 확인 (6db7378, dada355, 260c9ad, 15a11fa)
