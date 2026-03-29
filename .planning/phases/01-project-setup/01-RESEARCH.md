# 1단계: 프로젝트 설정 - 연구

**조사일:** 2026-03-29
**도메인:** 모노레포 인프라, NestJS 백엔드, React 프론트엔드, Prisma ORM
**확신 수준:** HIGH

## 요약

이 프로젝트는 pnpm workspace 기반 모노레포로 구성되며, NestJS 백엔드와 React 프론트엔드를 통합 개발합니다. 핵심 설정 요소는 (1) pnpm workspace로 공통 의존성 관리, (2) Prisma 6 + SQLite로 타입 안전한 데이터베이스 스키마, (3) Biome으로 통합 린트/포맷팅, (4) 환경변수 관리 시스템입니다.

**핵심 권장사항:** pnpm workspace 프로토콜을 사용하여 의존성 호이스팅 충돌을 방지하고, 루트 package.json에 공통 의존성을 선언하여 디스크 공간을 절약하세요.

## 표준 스택

### 코어
| 라이브러리 | 버전 | 용도 | 선정 이유 |
|-----------|------|------|-----------|
| **pnpm** | 9.x | 패키지 매니저 | 효율적인 디스크 사용, workspace 프로토콜, monorepo 표준 |
| **NestJS** | 11.1.17 | 백엔드 프레임워크 | TypeScript 네이티브, 의존성 주입, 모듈식 아키텍처 |
| **React** | 19.2.4 | UI 라이브러리 | 컴포넌트 기반, 생태계 최대, 훅 기반 개발 |
| **Vite** | 8.0.3 | 프론트엔드 빌드 도구 | 빠른 HMR, 네이티브 ESM, 최적화된 프로덕션 빌드 |
| **Prisma** | 7.6.0 | ORM | 타입스크립트 네이티브, 마이그레이션 관리, 자동 생성 타입 |
| **Biome** | 2.4.9 | 린터/포매터 | ESLint/Prettier보다 100배 빠름, 통합 구성, Rust 기반 |
| **TypeScript** | 6.0.2 | 타입 안전성 | 런타임 오류 방지, 리팩터링 용이성, IDE 지원 |

### 지원
| 라이브러리 | 버전 | 용도 | 사용 시기 |
|-----------|------|------|-----------|
| **@nestjs/config** | 4.0.3 | 환경변수 관리 | .env 기반 구성, 유효성 검증, 타입 안전성 |
| **@prisma/client** | 7.6.0 | Prisma 클라이언트 | 타입 안전한 데이터베이스 쿼리 |
| **SQLite3** | 5.1.7 | 개발용 데이터베이스 | 경량, 파일 기반, 설정 불필요 |
| **Tailwind CSS** | 4.2.2 | 유틸리티 우선 CSS | 빠른 개발, 일관된 디자인, 작은 번들 크기 |
| **@tanstack/react-query** | 5.95.2 | 서버 상태 관리 | 캐싱, 자동 리페칭, 낙관적 업데이트 |
| **zustand** | 5.0.12 | 클라이언트 상태 | Redux보다 간단, 보일러플레이트 적음, 타입 안전성 |
| **@tanstack/react-router** | 1.168.8 | 파일 기반 라우팅 | 타입 안전한 라우팅, 코드 스플리팅, 중첩 라우트 |

### 고려한 대안
| 대신 사용 | 사용 가능 | 트레이드오프 |
|----------|----------|--------------|
| pnpm | npm/yarn | pnpm은 디스크 효율성과 workspace 프로토콜이 우수 |
| Prisma | TypeORM, Drizzle | Prisma의 타입 안전성과 마이그레이션 도구가 최고급 |
| NestJS | Express, Fastify | NestJS가 구조화된 아키텍처를 제공하며 대규모 앱에 더 적합 |
| Biome | ESLint + Prettier | Biome이 훨씬 빠르고 통합 구성이 더 간단 |
| SQLite | PostgreSQL, MongoDB | SQLite는 파일 기반이라 개발에 완벽. 나중에 PostgreSQL로 쉽게 마이그레이션 가능 |

**설치:**
```bash
# 루트 의존성 (pnpm workspace)
pnpm install -D @biomejs/biome@^2.4.0 typescript@^6.0.0

# 백엔드
cd backend
pnpm install @nestjs/common@^11.0.0 @nestjs/core@^11.0.0 @nestjs/platform-express@^11.0.0
pnpm install @nestjs/config@^4.0.0 @prisma/client@^7.6.0
pnpm install -D prisma@^7.6.0 @types/node@^22.0.0

# 프론트엔드
cd frontend
pnpm install react@^19.0.0 react-dom@^19.0.0
pnpm install -D vite@^8.0.0 @vitejs/plugin-react@^6.0.0
pnpm install -D tailwindcss@^4.2.0
pnpm install @tanstack/react-query@^5.95.0 zustand@^5.0.0 @tanstack/react-router@^1.168.0
```

**버전 검증:** 위 버전들은 npm registry에서 확인된 최신 버전입니다 (2026-03-29 기준).

## 아키텍처 패턴

### 권장 프로젝트 구조
```
gsd-glm/
├── backend/                 # NestJS 백엔드
│   ├── prisma/
│   │   ├── schema.prisma   # 데이터베이스 스키마
│   │   └── migrations/      # 마이그레이션 파일
│   ├── src/
│   │   ├── auth/           # 인증 모듈 (2단계)
│   │   ├── chat/           # 채팅 모듈 (3단계)
│   │   ├── common/         # 공유 모듈
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── interceptors/
│   │   │   └── pipes/
│   │   ├── config/         # 설정
│   │   └── main.ts         # 엔트리 포인트
│   ├── test/               # 테스트 파일
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
├── frontend/               # Vite + React 프론트엔드
│   ├── src/
│   │   ├── routes/         # TanStack Router 파일 기반 라우팅
│   │   ├── components/     # React 컴포넌트
│   │   │   └── ui/         # shadcn/ui 컴포넌트
│   │   ├── stores/         # Zustand 스토어
│   │   ├── lib/            # 유틸리티 및 API 클라이언트
│   │   ├── hooks/          # 커스텀 훅
│   │   ├── types/          # TypeScript 타입
│   │   └── main.tsx        # 엔트리 포인트
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── .planning/              # 프로젝트 계획 문서
├── pnpm-workspace.yaml     # PNPM 워크스페이스 설정
├── package.json            # 루트 package.json
├── biome.json              # Biome 설정
└── .env.example            # 환경변수 예시
```

### 패턴 1: pnpm Workspace 모노레포
**설명:** 프론트엔드와 백엔드를 별도 패키지로 관리하되, 공통 타입과 유틸리티를 공유
**사용 시기:** 풀스택 웹 애플리케이션에서 프론트엔드와 백엔드가 밀접하게 연결될 때
**예시:**
```yaml
# pnpm-workspace.yaml
packages:
  - 'backend'
  - 'frontend'
```

```json
// package.json (루트)
{
  "name": "gsd-glm",
  "private": true,
  "scripts": {
    "dev": "concurrently \"pnpm --filter backend dev\" \"pnpm --filter frontend dev\"",
    "lint": "biome check .",
    "format": "biome format --write ."
  },
  "devDependencies": {
    "@biomejs/biome": "^2.4.0",
    "typescript": "^6.0.0"
  }
}
```

### 패턴 2: NestJS Prisma 통합
**설명:** PrismaService를 싱글톤 프로바이더로 등록하여 모든 모듈에서 타입 안전한 데이터베이스 액세스 제공
**사용 시기:** NestJS 애플리케이션에서 Prisma를 사용할 때
**예시:**
```typescript
// prisma/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

// prisma/prisma.module.ts
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 패턴 3: Biome 통합 린트/포맷팅
**설명:** 단일 도구로 ESLint와 Prettier를 대체하여 일관된 코드 스타일 유지
**사용 시기:** TypeScript/JavaScript 프로젝트 전체
**예시:**
```json
// biome.json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded"
    }
  }
}
```

### 안티패턴 회피
- **의존성 중복 설치:** 각 패키지에 개별적으로 설치하지 말고 루트에 공통 의존성 선언
- **PrismaClient 다중 인스턴스:** 모듈마다 새로운 인스턴스 생성하지 말고 싱글톤 PrismaService 사용
- **환경변수 하드코딩:** .env 파일을 git에 커밋하지 말고 .env.example만 커밋
- **TypeScript 설정 불일치:** 루트 tsconfig.json을 확장하여 공통 설정 공유

## 직접 구현하지 마세요

| 문제 | 직접 구현하지 마세요 | 대신 사용하세요 | 이유 |
|------|---------------------|----------------|------|
| 패키지 관리 | symlink 수동 설정 | pnpm workspace | 의존성 호이스팅, 버전 충돌 방지, 디스크 공간 절약 |
| 데이터베이스 마이그레이션 | SQL 파일 수手动 관리 | Prisma Migrate | 타입 안전성, 롤백 지원, 자동 마이그레이션 생성 |
| 환경변수 검증 | 수동 if문 확인 | @nestjs/config + joi | 타입 안전성, 초기화 실패 시 명확한 에러 |
| 코드 린트/포맷 | ESLint + Prettier 병행 | Biome | 100배 빠름, 통합 구성, Rust 기반 |
| 타입스크립트 설정 | 각 패키지에 중복 설정 | 루트 tsconfig.json 확장 | 설정 중복 방지, 일관된 컴파일 옵션 |

**핵심 통찰:** 모노레po에서 인프라를 직접 구현하면 버전 충돌, 설정 불일치, 유지보수 부담이 급증합니다. 표준 도구를 사용하세요.

## 런타임 상태 인벤토리

> 이 단계는 greenfield 프로젝트이므로 런타임 상태 마이그레이션이 필요하지 않습니다. 모든 시스템을 새로 구축합니다.

## 일반적인 함정

### 함정 1: 의존성 호이스팅 충돌
**문제 발생:** 프론트엔드와 백엔드가 서로 다른 버전의 공통 의존성을 요구할 때
**원인:** 각 패키지의 package.json에 개별적으로 버전을 명시하면 pnpm이 별도로 설치
**예방 방법:** 루트 package.json에 공통 의존성을 선언하고 각 패키지는 workspace:* 프로토콜 사용
**경고 신호:** `pnpm install` 시 "Peer dependency conflicts" 메시지

### 함정 2: Prisma 클라이언트 생성 누락
**문제 발생:** Prisma 스키마를 수정했지만 `npx prisma generate`를 실행하지 않아 타입 오류
**원인:** 마이그레이션 후 Prisma 클라이언트 재생성 필요
**예방 방법:** 마이그레이션 실행 후 자동으로 클라이언트 생성되도록 postinstall 스크립트 구성
**경고 신호:** "Cannot find module '@prisma/client'" 또는 타입 정의 누락

### 함정 3: 환경변수 노출
**문제 발생:** .env 파일을 실수로 git에 커밋하여 API 키 노출
**원인:** .gitignore에 .env 미추가
**예방 방법:** .gitignore에 .env 추가, .env.example만 커밋, pre-commit 훅으로 검증
**경고 신호:** git history에 API 키가 포함됨

### 함정 4: Biome 설정 무시
**문제 발생:** 개발자가 Biome 포맷팅을 무시하고 코드를 커밋
**원인:** pre-commit 훅 미설정, IDE 통합 미구성
**예방 방법:** Husky + lint-staged로 커밋 전 자동 포맷팅, IDE 확장 설치
**경고 신호:** PR에서 포맷팅不一致가 지속적으로 발생

### 함정 5: TypeScript 경 heaps 무시
**문제 발생:** @ts-check를 사용하지 않거나 any 타입을 남용하여 런타임 오류
**원인:** 엄격한 TypeScript 설정 미사용
**예방 방법:** tsconfig.json에서 strict: true, noImplicitAny: true 설정
**경고 신호:** 프로덕션에서 "Cannot read property of undefined"

## 코드 예제

공식 소스에서 검증된 패턴:

### pnpm Workspace 설정
```yaml
# pnpm-workspace.yaml
# Source: https://pnpm.io/workspaces
packages:
  - 'backend'
  - 'frontend'
```

### Prisma 스키마
```prisma
// backend/prisma/schema.prisma
// Source: https://www.prisma.io/docs/concepts/components/prisma-schema

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Chat {
  id          String    @id @default(uuid())
  title       String?
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages    Message[]
  systemPrompt String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Message {
  id        String   @id @default(uuid())
  content   String
  role      String
  chatId    String
  chat      Chat     @relation(fields: [chatId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

### NestJS 메인 설정
```typescript
// backend/src/main.ts
// Source: https://docs.nestjs.com/techniques/performance
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DTO 기반 검증 활성화 (BACK-04)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS 설정
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
```

### Vite React 설정
```typescript
// frontend/vite.config.ts
// Source: https://vitejs.dev/config/
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

## 최신 기술 현황

| 구 방식 | 최신 방식 | 변경 시점 | 영향 |
|----------|----------|----------|------|
| ESLint + Prettier 병행 | Biome 단일 도구 | 2024 | 100배 빠른 린트/포맷, 통합 구성 |
| Tailwind CSS v3 (JavaScript config) | Tailwind CSS v4 (CSS config) | 2025 | @import 기반 설정, 빠른 빌드 |
| class-validator 대신 Zod | class-validator 여전히 표준 | - | NestJS와의 통합성으로 class-validator 권장 |
| React 18 | React 19 | 2024 | 향상된 성능, 새로운 훅 |

**사용 중단/날짜:**
- TypeScript 5.x: 6.0으로 업그레이드 권장 (decorator 지원 개선)
- Prisma 5.x: 7.6으로 업그레이드 권장 (성능 향상)

## 미해결 질문

1. **Tailwind CSS v4와 shadcn/ui 호환성**
   - 알려진 내용: shadcn/ui가 Tailwind v4를 지원
   - 불명확한 점: Tailwind v4의 새로운 CSS 기반 설정과 shadcn/ui CLI의 완전한 호환성
   - 권장사항: shadcn/ui 공식 문서의 Tailwind v4 설정 가이드 따르기

2. **pnpm workspace 버전 관리 전략**
   - 알려진 내용: workspace:* 프로토콜으로 링크
   - 불명확한 점: 공통 의존성 업데이트 시 각 패키지의 호환성 보장 방법
   - 권장사항: 루트 package.json에 공통 의존성 선언, pnpm-lock.json 커밋

## 환경 가용성

| 의존성 | 필요한 곳 | 사용 가능 | 버전 | 대안 |
|--------|----------|-----------|------|------|
| Node.js | 전체 | ✓ | 20+ | — |
| pnpm | 패키지 매니저 | ✓ | 9.x | npm/yarn (비권장) |
| Python | 없음 (선택 사항) | ✓ | 3.x | — |

**누락된 의존성 (대안 없음):** 없음

**누락된 의존성 (대안 있음):** 없음

## 검증 아키텍처

### 테스트 프레임워크
| 속성 | 값 |
|----------|-------|
| 프레임워크 | 없음 (1단계는 인프라 설정) |
| 설정 파일 | 없음 |
| 빠른 실행 명령어 | 없음 |
| 전체 테이트 명령어 | 없음 |

### 단계 요구사항 → 테스트 매핑
| 요구사항 ID | 동작 | 테스트 유형 | 자동화된 명령어 | 파일 존재? |
|--------|----------|-----------|-------------------|-------------|
| BACK-04 | 환경변수로 Prisma SQLite 데이터베이스 생성 | 수동 검증 | `npx prisma migrate dev` | ❌ 웨이브 0 |
| BACK-04 | pnpm install로 모든 의존성 설치 | 수동 검증 | `pnpm install` | ❌ 웨이브 0 |
| BACK-04 | Biome으로 코드 린트/포맷팅 | 수동 검증 | `pnpm lint` | ❌ 웨이브 0 |
| BACK-04 | 개발 서버 실행 (백엔드/프론트엔드) | 수동 검증 | `pnpm --filter backend dev` | ❌ 웨이브 0 |

### 샘플링 레이트
- **작업 커밋마다:** `pnpm install` 성공 확인
- **웨이브 병합 시:** 개발 서버 실행 확인, Biome 검증
- **단계 게이트:** 모든 성공 기준 충족 확인

### 웨이브 0 간격
- [ ] `backend/prisma/schema.prisma` — Prisma 스키마 정의
- [ ] `pnpm-workspace.yaml` — pnpm workspace 설정
- [ ] `package.json` (루트) — 공통 의존성
- [ ] `backend/package.json` — 백엔드 의존성
- [ ] `frontend/package.json` — 프론트엔드 의존성
- [ ] `biome.json` — Biome 설정
- [ ] `.env.example` — 환경변수 예시
- [ ] 테스트 프레임워크: 이 단계는 인프라 설정으로 테스트 불필요

## 출처

### 1차 (HIGH 확신)
- [STACK.md](.planning/research/STACK.md) - 전체 기술 스택 및 버전 정보
- [ARCHITECTURE.md](.planning/research/ARCHITECTURE.md) - 아키텍처 패턴 및 구조
- [CLAUDE.md](CLAUDE.md) - 프로젝트 규칙 및 한글 작성 요구사항
- npm 패키지 레지스트리 - 모든 버전 정보 직접 확인

### 2차 (MEDIUM 확신)
- [REQUIREMENTS.md](.planning/REQUIREMENTS.md) - BACK-04 요구사항 세부사항
- [ROADMAP.md](.planning/ROADMAP.md) - 1단계 성공 기준

### 3차 (LOW 확신)
- 웹 검색 불가 (API 한계 도달) - STACK.md와 ARCHITECTURE.md의 HIGH 확신 정보로 대체

## 메타데이터

**확신 수준 상세:**
- 표준 스택: HIGH - npm registry에서 버전 직접 확인
- 아키텍처: HIGH - ARCHITECTURE.md의 검증된 패턴 사용
- 함정: MEDIUM - 일반적인 모노레포 문제 기반, 웹 검색 불가로 일부 간접적 증거

**연구 날짜:** 2026-03-29
**유효 기간:** 30일 (안정적인 인프라 도구)
