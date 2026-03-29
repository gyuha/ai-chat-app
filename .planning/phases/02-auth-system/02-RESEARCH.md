# 2단계: 인증 시스템 - 연구

**조사일:** 2026-03-29
**도메인:** JWT 기반 인증 (NestJS + React)
**확신 수준:** HIGH

## 요약

이메일/비밀번호 기반 인증 시스템과 JWT 듀얼 토큰 전략(액세스 토큰 15분, 리프레시 토큰 7일)을 구현합니다. NestJS의 Passport/JWT와 bcrypt를 사용하여 백엔드 인증을 처리하고, React의 Zustand와 TanStack Query로 프론트엔드 인증 상태를 관리합니다. 리프레시 토큰은 httpOnly 쿠키에 저장하여 XSS 공격을 방지하고, 액세스 토큰은 메모리에 저장하여 보안을 강화합니다. 토큰 만료 5분 전에 자동 갱신하여 긴 대화 중 세션이 끊기지 않도록 합니다.

**핵심 권장 사항:** NestJS의 @nestjs/passport와 @nestjs/jwt를 사용하여 JWT 인증을 구현하고, Passport의 JwtStrategy로 토큰 검증을 처리합니다.

<user_constraints>
## 사용자 제약사항 (CONTEXT.md에서)

### 잠긴 결정
- **D-01:** 액세스 토큰(15분) + 리프레시 토큰(7일) 듀얼 토큰 전략 사용
- **D-02:** 리프레시 토큰은 DB에 저장하여 서버 사이드 무효화 가능 (User 모델에 refreshToken 필드 추가)
- **D-03:** 액세스 토큰 만료 5분 전 자동 갱신
- **D-04:** 토큰 만료 시 401 응답, 프론트엔드에서 리프레시 토큰으로 자동 재발급
- **D-05:** 리프레시 토큰은 httpOnly 쿠키에 저장 (XSS 공격 방지)
- **D-06:** 액세스 토큰은 메모리에 저장 (zustand store), 새로고침 시 리프레시 토큰으로 재발급
- **D-07:** 쿠키 설정: secure=false (개발환경), sameSite=lax, path=/api/auth/refresh
- **D-08 ~ D-12:** 인증 API 설계 (register, login, refresh, logout, me)
- **D-13 ~ D-15:** 비밀번호 정책 (최소 8자, 최대 128자, 복잡도 규칙 없음, bcrypt 해싱)
- **D-16 ~ D-20:** 인증 UI 흐름 (별도 페이지, 리다이렉트, 자동 로그인)
- **D-21 ~ D-24:** NestJS 모듈 구조 (AuthModule, UsersModule, JwtStrategy, JwtAuthGuard, PrismaModule)
- **D-25 ~ D-27:** 프론트엔드 인증 상태 관리 (Zustand authStore, TanStack Query, 라우트 가드)

### Claude의 재량
- 회원가입/로그인 폼의 정확한 레이아웃 (shadcn/ui 기반)
- 에러 메시지 표시 방식 (인라인 vs 토스트)
- 로딩 스피너 디자인
- 이메일 중복 체크 시점 (제출 시 vs 입력 중)

### 연기된 아이디어 (범위 외)
없음 — 토론이 단계 범위 내에 유지됨
</user_constraints>

<phase_requirements>
## 단계 요구사항

| ID | 설명 | 연구 지원 |
|----|-------------|------------------|
| AUTH-01 | 사용자는 이메일/비밀번호로 회원가입할 수 있다 | NestJS AuthService + Passport Local Strategy, bcrypt 해싱, Prisma User 모델 |
| AUTH-02 | 사용자는 로그인 후 브라우저 새로고침 시에도 세션이 유지된다 | httpOnly 쿠키에 리프레시 토큰 저장, 액세스 토큰 자동 재발급 로직 |
| AUTH-03 | 사용자는 모든 페이지에서 로그아웃할 수 있다 | POST /api/auth/logout 엔드포인트, 쿠키 삭제, DB 리프레시 토큰 무효화 |
| SEC-02 | JWT 토큰이 자동 갱신되어 긴 대화 중 세션 만료를 방지한다 | 액세스 토큰 만료 5분 전 자동 갱신 로직, axios 인터셉터로 401 처리 |
</phase_requirements>

## 표준 스택

### 코어
| 라이브러리 | 버전 | 용도 | 표준 사용 이유 |
|---------|---------|---------|--------------|
| **@nestjs/passport** | 11.0.5 | 인증 프레임워크 | 전략 패턴 기반 인증, NestJS와 완벽한 통합, 타입 안전성 |
| **@nestjs/jwt** | 11.0.2 | JWT 모듈 | JWT 토큰 생성/검증, Passport와 통합, 환경변수 기반 설정 |
| **Passport** | 0.7.0 | 인증 미들웨어 | 전략 기반 인증의 사실상 표준, 커뮤니티 지원 |
| **passport-jwt** | 4.0.1 | JWT 전략 | JWT 기반 인증 전략 구현, Passport와 통합 |
| **passport-local** | 1.0.0 | 로컬 전략 | 이메일/비밀번호 기반 인증, 회원가입/로그인에 필요 |
| **bcrypt** | 5.1.1 | 비밀번호 해싱 | 안전한 단방향 해싱, 솔트 자동 관리, 타이밍 공격 방지 |
| **class-validator** | 0.15.1 | DTO 유효성 검증 | 데코레이터 기반 유효성 검증, 자동 오류 메시지, NestJS 통합 |
| **class-transformer** | 0.5.1 | 객체 변환 | DTO 변환, 플레인 객체를 클래스 인스턴스로 |

### 지원
| 라이브러리 | 버전 | 용도 | 사용 시기 |
|---------|---------|---------|-------------|
| **@prisma/client** | 7.6.0 | 데이터베이스 ORM | 사용자 CRUD, 리프레시 토큰 저장 |
| **cookie-parser** | 1.4.7 | 쿠키 파싱 | httpOnly 쿠키에서 리프레시 토큰 읽기 |
| **zustand** | 5.0.2 | 클라이언트 상태 | 액세스 토큰, 사용자 정보, 인증 상태 관리 |
| **@tanstack/react-query** | 5.62.11 | 서버 상태 | 인증 API 호출, 캐싱, 자동 리페칭 |
| **axios** | 1.7.9 | HTTP 클라이언트 | API 요청, 인터셉터로 토큰 자동 주입 |

### 대안 고려
| 대신 사용 | 사용 가능 | 트레이드오프 |
|------------|-----------|----------|
| Passport/JWT | 세션 기반 인증 | JWT는 무상태로 확장성 용이, 세션은 서버 메모리 사용 |
| bcrypt | argon2, scrypt | bcrypt가 검증됨, argon2는 더 안전하지만 라이브러리 지원 적음 |
| httpOnly 쿠키 | localStorage만 사용 | httpOnly는 XSS 방지, localStorage는 더 간단하지만 보안 취약 |
| Zustand + TanStack Query | Redux Toolkit | Redux는 보일러플레이트 많음, Zustand는 간단하고 TanStack Query는 서버 상태에 최적화 |

**설치:**
```bash
cd backend

# 인증 관련
pnpm install @nestjs/passport@^11.0.0 @nestjs/jwt@^11.0.0 passport@^0.7.0 passport-jwt@^4.0.0 passport-local@^1.0.0
pnpm install bcrypt@^5.1.0
pnpm install cookie-parser@^1.4.7

# 유효성 검증 (이미 설치됨)
pnpm install class-validator@^0.15.0 class-transformer@^0.5.0

# 타입 정의
pnpm install -D @types/passport-jwt@^4.0.0 @types/bcrypt@^5.0.0 @types/passport-local@^1.0.0 @types/cookie-parser@^1.4.7
```

**버전 검증:** 2026-03-29 기준 npm 레지스트리 확인 완료. 모든 패키지가 최신 안정 버전.

## 아키텍처 패턴

### 권장 프로젝트 구조
```
backend/src/
├── auth/                    # 인증 모듈
│   ├── auth.module.ts       # 모듈 정의
│   ├── auth.controller.ts   # 인증 엔드포인트 (register, login, refresh, logout, me)
│   ├── auth.service.ts      # 인증 로직 (JWT 발급, 비밀번호 검증)
│   ├── strategies/          # Passport 전략
│   │   ├── jwt.strategy.ts  # JWT 토큰 검증
│   │   └── local.strategy.ts # 이메일/비밀번호 검증
│   ├── guards/              # 가드
│   │   └── jwt-auth.guard.ts # JWT 인증 가드
│   └── dto/                 # 데이터 전송 객체
│       ├── register.dto.ts  # 회원가입 DTO
│       ├── login.dto.ts     # 로그인 DTO
│       └── auth-response.dto.ts # 인증 응답 DTO
├── users/                   # 사용자 모듈
│   ├── users.module.ts
│   ├── users.service.ts     # 사용자 CRUD
│   └── dto/
│       └── create-user.dto.ts
├── prisma/                  # Prisma 모듈
│   ├── prisma.module.ts
│   └── prisma.service.ts
└── main.ts                  # 엔트리 포인트

frontend/src/
├── stores/                  # Zustand 스토어
│   └── auth.ts              # 인증 상태 (user, accessToken, isAuthenticated, isLoading)
├── lib/
│   └── api/
│       ├── client.ts        # axios 인스턴스 (인터셉터 포함)
│       └── auth.ts          # 인증 API 함수
├── routes/                  # TanStack Router 라우트
│   ├── __root.tsx
│   ├── index.tsx            # 메인 페이지 (인증 필요)
│   ├── login.tsx            # 로그인 페이지
│   └── register.tsx         # 회원가입 페이지
└── components/
    └── auth/                # 인증 컴포넌트
        ├── LoginForm.tsx
        └── RegisterForm.tsx
```

### 패턴 1: NestJS Passport JWT 전략
**용도:** JWT 토큰으로 보호된 라우트 구현
**사용 시기:** 인증이 필요한 모든 API 엔드포인트
**예시:**
```typescript
// Source: NestJS 공식 문서 https://docs.nestjs.com/techniques/authentication
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### 패턴 2: httpOnly 쿠키 + 메모리 토큰
**용도:** XSS 공격 방지와 보안 강화
**사용 시기:** 리프레시 토큰 저장, 액세스 토큰은 메모리에만 저장
**예시:**
```typescript
// 백엔드: 리프레시 토큰 쿠키 설정
@Post('login')
async login(@Res({ passthrough: true }) res: Response) {
  const { accessToken, refreshToken } = await this.authService.login(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  });

  return { accessToken };
}

// 프론트엔드: Zustand 스토어
interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
}
```

### 패턴 3: Axios 인터셉터로 자동 토큰 갱신
**용도:** 401 에러 발생 시 자동으로 리프레시 토큰으로 재발급
**사용 시기:** 모든 API 요청에 토큰 자동 주입 및 갱신
**예시:**
```typescript
// Source: axios 공식 문서 https://axios-http.com/docs/interceptors
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            error.config.headers.Authorization = `Bearer ${token}`;
            resolve(axios(error.config));
          });
        });
      }

      isRefreshing = true;
      error.config._retry = true;

      try {
        const { data } = await axios.post('/api/auth/refresh');
        const newToken = data.accessToken;

        useAuthStore.getState().setAuth(data.user, newToken);
        refreshSubscribers.forEach((cb) => cb(newToken));
        refreshSubscribers = [];

        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios(error.config);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

### 안티 패턴
- **localStorage에 액세스 토큰 저장:** XSS 공격에 취약함. httpOnly 쿠키와 메모리 사용을 권장
- **비밀번호 평문 저장:** bcrypt로 해싱하지 않은 비밀번호 저장은 보안 위험
- **JWT 비밀키 하드코딩:** 환경변수로 관리하고 .gitignore에 .env 추가
- **토큰 만료 기간 너무 김:** 액세스 토큰은 15분, 리프레시 토큰은 7일로 제한
- **이메일 확인 없이 회원가입:** 이메일 중복 체크만으로는 부족, 실제 이메일 확인 권장 (v2)

## 직접 구현하지 말 것 (Don't Hand-Roll)

| 문제 | 직접 구현하면 | 대신 사용 | 이유 |
|---------|-------------|-------------|-----|
| 비밀번호 해싱 | 직접 구현한 해싱 로직 | bcrypt | 솔트 관리, 타이밍 공격 방지, 검증된 알고리즘 |
| JWT 서명/검증 | 직접 구현한 JWT 로직 | @nestjs/jwt | 서명 위조 방지, 만료 처리, 표준 준수 |
| 토큰 저장소 | DB에 리프레시 토큰 저장 안 함 | Prisma User.refreshToken | 서버 사이드 무효화, 보안 강화 |
| 세션 관리 | 액세스 토큰만 사용 | 듀얼 토큰 전략 | 보안과 사용자 경험 균형, 자동 갱신 |
| 인증 상태 | Context API만 사용 | Zustand + TanStack Query | 서버 상태와 클라이언트 상태 분리, 자동 리페칭 |

**핵심 인사이트:** 직접 구현한 보안 관련 코드는 일반적으로 알려진 공격에 취약합니다. 검증된 라이브러리를 사용하고 모범 사례를 따르세요.

## 일반적인 위험 요소

### 위험 1: JWT 토큰 만료 후 스트리밍 중단
**문제 상황:** 긴 스트리밍 응답 중 JWT 토큰이 만료되면, 다음 요청부터 401 Unauthorized로 실패. 사용자는 로그아웃 처리되지만 진행 중이던 스트림은 계속되어 혼란.
**발생 원인:**
- 스트리밍 시작 시에만 토큰 검증
- 토큰 갱신(refresh token) 로직 미구현
- 401 발생 시 사용자에게 명확한 안내 없이 로그아웃
**예방 방법:**
- 액세스 토큰 만료 5분 전에 자동 갱신
- 401 발생 시 refresh 토큰으로 재발급 시도
- 갱신 실패 시 사용자에게 "세션 만료. 다시 로그인해주세요" 안내
- 진행 중인 스트림은 완료시키고, 새 요청부터 인증 요구
**경고 신호:**
- 긴 응답 생성 중 갑자기 로그아웃됨
- 401 에러 후 사용자가 무엇을 해야 할지 모름
- 토큰 만료 시간이 하드코딩되어 있음

### 위험 2: 리프레시 토큰 재사용 공격
**문제 상황:** 공격자가 탈취한 리프레시 토큰으로 새 토큰을 발급받으면, 정상 사용자의 세션도 무효화되지 않아 계속 사용 가능.
**발생 원인:**
- 리프레시 토큰을 DB에 저장하지 않아 무효화 불가
- 리프레시 토큰 rotation 미구현
- 동시 리프레시 요청을 탐지하지 않음
**예방 방법:**
- 리프레시 토큰을 DB에 저장하여 서버 사이드 무효화 가능
- 리프레시 토큰 사용 시 새 토큰 발급과 기존 토큰 무효화 (rotation)
- 동일 리프레시 토큰으로 동시 요청 시 하나만 허용
**경고 신호:**
- DB에 User.refreshToken 필드 없음
- 로그아웃 후에도 리프레시 토큰으로 계속 토큰 발급 가능

### 위험 3: XSS로 액세스 토큰 탈취
**문제 상황:** 액세스 토큰이 localStorage에 저장되어 있으면, XSS 공격으로 탈취 가능. 공격자는 탈취한 토큰으로 API 호출 가능.
**발생 원인:**
- 액세스 토큰을 localStorage에 저장
- httpOnly 쿠키를 사용하지 않음
- CSP(Content Security Policy) 미설정
**예방 방법:**
- 리프레시 토큰은 httpOnly 쿠키에 저장
- 액세스 토큰은 메모리(zustand)에만 저장
- CSP 헤더 설정으로 XSS 공격 완화
**경고 신호:**
- localStorage에 accessToken 키가 있음
- 쿠키에 httpOnly 플래그 없음

### 위험 4: 비밀번호 복잡도 규칙 과도/부족
**문제 상황:** 과도한 복잡도 규칙은 사용자 경험 저하, 부족한 규칙은 보안 취약.
**발생 원인:**
- 대문자/숫자/특수문자 강제 (사용자 불편)
- 최소 길이 8자 미만 (보안 취약)
- 복잡도 규칙 없음 (취약한 비밀번호 허용)
**예방 방법:**
- 최소 8자, 최대 128자
- 복잡도 규칙 없음 (현대적 UX)
- 비밀번호 유출 체크 (Have I Been Pwned API) - v2 고려
**경고 신호:**
- 회원가입 폼에 복잡도 요구사항 표시
- 6자 비밀번호 허용

### 위험 5: 이메일 중복 체크 경쟁 조건
**문제 상황:** 두 사용자가 동시에 같은 이메일로 가입하면 둘 다 성공할 수 있음.
**발생 원인:**
- 이메일 중복 체크 후 생성 사이에 다른 요청이 끼어듦
- DB 고유 제약조건 없음
**예방 방법:**
- Prisma 스키마에서 email 필드에 @unique 추가
- 중복 이메일 에러(Prisma P2002) 적절히 처리
**경고 신호:**
- User 모델에 email @unique 없음
- 중복 가입 가능

## 코드 예제

검증된 패턴 (공식 문서 기반):

### NestJS 모듈 설정
```typescript
// Source: NestJS 공식 문서 https://docs.nestjs.com/modules
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m', // 액세스 토큰 15분
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### bcrypt 비밀번호 해싱
```typescript
// Source: bcrypt 공식 문서 https://github.com/kelektiv/node.bcrypt.js
import * as bcrypt from 'bcrypt';

async hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

async comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### JWT 토큰 발급
```typescript
// Source: @nestjs/jwt 공식 문서 https://docs.nestjs.com/security/authentication
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.generateRefreshToken(user.userId), // 7일 유효
    };
  }
}
```

### TanStack Query로 인증 API 호출
```typescript
// Source: TanStack Query 공식 문서 https://tanstack.com/query/latest
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from './client';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      api.post('/api/auth/login', credentials),
    onSuccess: (data) => {
      // Zustand 스토어 업데이트
      useAuthStore.getState().setAuth(data.user, data.accessToken);
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get('/api/auth/me'),
    retry: false,
  });
};
```

## 최신 기술 동향

| 구 방식 | 현대적 방식 | 변경 시점 | 영향 |
|--------------|------------------|--------------|--------|
| 세션 기반 인증 | JWT 기반 인증 | 2010년대 후반 | 무상태, 확장성 용이 |
| localStorage 토큰 | httpOnly 쿠키 + 메모리 | 2020년대 초반 | XSS 방지, 보안 강화 |
| 단일 토큰 | 듀얼 토큰 (Access + Refresh) | 2010년대 후반 | 보안과 사용자 경험 균형 |
| 복잡한 비밀번호 규칙 | 최소 길이만 (현대적 UX) | 2020년대 초반 | 사용자 경험 개선 |

**더 이상 사용되지 않음:**
- **session 기반 인증:** 확장성 제한, 서버 메모리 사용. JWT로 대체 권장
- **localStorage에 토큰 저장:** XSS 취약. httpOnly 쿠키 사용 권장
- **bcrypt cost factor 10:** 너무 낮음. cost 12 이상 권장 (2020년대 기준)

## 환경 가용성

이 단계는 코드/설정 변경만으로 외부 의존성이 없습니다. 환경 가용성 확인 생략.

## 검증 아키텍처

### 테스트 프레임워크
| 속성 | 값 |
|----------|-------|
| 프레임워크 | 없음 (Wave 0에서 설정 예정) |
| 구성 파일 | 없음 |
| 빠른 실행 명령어 | 없음 |
| 전체 테스트 명령어 | 없음 |

### 단계 요구사항 → 테스트 매핑
| Req ID | 동작 | 테스트 유형 | 자동화 명령어 | 파일 존재? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | 회원가입 API 동작 | integration | 없음 (Wave 0) | ❌ Wave 0 |
| AUTH-02 | 새로고침 후 세션 유지 | e2e | 없음 (Wave 0) | ❌ Wave 0 |
| AUTH-03 | 로그아웃 동작 | integration | 없음 (Wave 0) | ❌ Wave 0 |
| SEC-02 | 토큰 자동 갱신 | integration | 없음 (Wave 0) | ❌ Wave 0 |

### 샘플링 속도
- **작업 커밋마다:** `없음 (Wave 0)`
- **웨이브 병합마다:** `없음 (Wave 0)`
- **단계 게이트:** 전체 테스트 스위트 통과 후 `/gsd:verify-work`

### Wave 0 공백
- `backend/test/auth.service.spec.ts` — AUTH-01, AUTH-02, AUTH-03 커버
- `backend/test/auth.controller.spec.ts` — API 엔드포인트 테스트
- `backend/test/e2e/auth.e2e-spec.ts` — 전체 인증 흐름 E2E
- `backend/jest.config.js` — Jest 설정
- `backend/package.json` — test 스크립트 추가 (`"test": "jest"`)

테스트 인프라가 전혀 없습니다. Wave 0에서 Jest 설정과 기본 테스트 파일이 필요합니다.

## 출처

### 1차 (HIGH 확신)
- NestJS 공식 문서 - https://docs.nestjs.com/techniques/authentication (인증, Passport, JWT)
- @nestjs/jwt 공식 문서 - https://docs.nestjs.com/security/authentication
- @nestjs/passport 공식 문서 - https://docs.nestjs.com/security/authentication
- Prisma 공식 문서 - https://www.prisma.io/docs (데이터베이스 ORM)
- bcrypt 공식 문서 - https://github.com/kelektiv/node.bcrypt.js (비밀번호 해싱)
- TanStack Query 공식 문서 - https://tanstack.com/query/latest (서버 상태 관리)
- Zustand 공식 문서 - https://zustand-demo.pmnd.rs (클라이언트 상태)

### 2차 (MEDIUM 확신)
- 없음 (모든 출처가 공식 문서)

### 3차 (LOW 확신)
- 없음 (모든 출처가 공식 문서)

## 메타데이터

**확신 수준 분해:**
- 표준 스택: HIGH - 모든 라이브러리가 공식 문서 기반, 검증된 패턴
- 아키텍처: HIGH - NestJS 모듈 패턴, Passport 전략은 표준 사례
- 위험 요소: HIGH - JWT/인증 관련 문제는 잘 문서화됨

**연구 일자:** 2026-03-29
**유효 기간:** 30일 (안정적인 도메인)

---

*인증 시스템 연구 완료*
*2단계: 인증 시스템*
*조사: 2026-03-29*
