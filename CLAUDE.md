# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Style

**All messages, commits, and documentation should be written in Korean.** This includes chat messages, git commit messages, documentation, comments, and code explanations.

## Project Overview

OpenRouter 무료 API를 사용한 웹 채팅 애플리케이션. API 키 보호를 위해 백엔드 서버를 프록시로 사용.

## Tech Stack

**Backend**: NestJS, TypeScript, Prisma (SQLite), Passport/JWT 인증
**Frontend**: React, TypeScript, Vite, shadcn/ui, zustand, @tanstack/react-query, @tanstack/react-router, Tailwind CSS v4, biome

## Workspace Structure

```
pnpm monorepo (pnpm-workspace.yaml)
├── backend/    # NestJS — OpenRouter 프록시, 인증, 채팅 API
└── frontend/   # Vite + React — 채팅 UI
```

## Commands

```bash
pnpm install                        # 전체 의존성 설치
pnpm --filter backend dev           # 백엔드 개발 서버 (nest start --watch)
pnpm --filter frontend dev          # 프론트엔드 개발 서버 (vite)
pnpm --filter backend test          # 백엔드 테스트 (jest)
pnpm --filter frontend lint         # 프론트엔드 린트 (biome check .)
pnpm --filter frontend format       # 프론트엔드 포맷 (biome format --write .)
```

## Backend Architecture

- **Prisma** (SQLite) — User, Chat, Message 모델. 마이그레이션: `npx prisma migrate dev`
- **Modules**: `auth` (JWT + Passport), `chat` (OpenRouter 프록시 + 대화 관리)
- **Guards**: `JwtAuthGuard`로 보호된 라우트
- **Config**: `ConfigModule`로 `.env` 관리 (DATABASE_URL, JWT_SECRET, OPENROUTER_API_KEY)

## Frontend Architecture

- **Routing**: `@tanstack/router` — 파일 기반 라우팅 (`src/routes/`)
- **State**: zustand 스토어 (`src/stores/`) — auth, chat, chatList
- **API layer**: `src/lib/api/` — axios 기반 클라이언트
- **UI**: shadcn/ui 컴포넌트 (`src/components/ui/`)

## GSD / ui-ux-pro-max 스킬 규칙

GSD(`gsd:*`) 및 ui-ux-pro-max 스킬 사용 시 다음 규칙을 따릅니다:

### 안내 메시지
- 스킬 실행 중 사용자에게 표시되는 모든 안내, 질문, 상태 메시지, 설명은 **한글로 작성**합니다.
- 스킬의 원본 템플릿이 영어인 경우, 의미를 유지하면서 한글로 자연스럽게 번역하여 안내합니다.

### 생성 문서
- 모든 문서(PLAN.md, UI-SPEC.md, VERIFICATION.md, RESEARCH.md, roadmap, milestone 등)는 **한글로 작성**합니다. 다음은 예외입니다:
  - AI 에이전트가 참조하는 필드 타이틀 (예: `title:`, `status:`, `owner:` 등 YAML/JSON 키)
  - 파일명, 변수명, 코드 스니펫
  - 스킬 템플릿에 하드코딩된 기본값

- 설명, 근거, 요구사항, 계획 내용, 검증 기준 등 사람이 읽는 모든 본문은 한글로 작성합니다.

## Design System

**DESIGN.md를 UI/스타일 작업 전 반드시 참조.** 핵심 원칙:
- 미니멀 에스테틱: 타이포그래피와 여백만 사용, 장식 없음
- 제한적 컬러: 그레이스케일 팔레트 (#1a1a1a, #6b6b6b, #f9f9f9, #ffffff). 보라색 그라데이션 금지
- 작은 border-radius: 4-8px (shadcn 기본값 아님)
- 사이드바: 어두운 회색 배경으로 레이아웃 계층 구분
