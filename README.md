# AI Chat App

OpenRouter API 기반 AI 채팅 애플리케이션입니다.

## 프로젝트 구조

```
ai-chat-app/
├── backend/        # NestJS 백엔드
├── frontend/       # React 프론트엔드
├── DESIGN.md       # 디자인 시스템
└── CLAUDE.md       # Claude Code 가이드
```

## 시작하기

### 사전 요구사항

- Node.js 18+
- pnpm
- PostgreSQL (데이터베이스)

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
# 백엔드 (backend/ 디렉토리)
cd backend
pnpm run start:dev

# 프론트엔드 (frontend/ 디렉토리)
cd frontend
pnpm run dev
```

### 환경변수

**Backend (.env):**
```
OPENROUTER_API_KEY=your_openrouter_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/ai_chat_app
JWT_SECRET=your_jwt_secret
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3000
```

## 기술 스택

- **Backend:** NestJS, Prisma, PostgreSQL
- **Frontend:** React, Vite, TypeScript
- **UI:** shadcn/ui
- **State:** zustand, @tanstack-query
- **Router:** @tanstack-router
