# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenRouter Chat — ChatGPT 스타일의 웹 AI 채팅 앱. OpenRouter 무료 모델 API를 직접 호출하며, 모든 데이터는 IndexedDB(Dexie.js)에 저장. 백엔드 서버 없는 프론트엔드 전용 프로젝트.

## Tech Stack

- React 19 + Vite + TypeScript (strict)
- pnpm (package manager)
- Biome (lint + format, ESLint/Prettier 대체)
- shadcn/ui + Tailwind CSS v4
- Zustand (클라이언트 전역 상태)
- TanStack Query v5 (서버 상태/캐싱)
- TanStack Router (파일 기반 라우팅)
- Dexie.js v4 (IndexedDB ORM)
- react-markdown + remark-gfm + rehype-highlight

## Commands

```bash
pnpm dev          # Vite 개발 서버 (port 5173)
pnpm build        # 타입체크 + 빌드
pnpm lint         # Biome 체크
pnpm format       # Biome 포맷 적용
pnpm test         # Vitest 실행
```

## Architecture

### 라우트 구조 (TanStack Router)
- `/` — 메인 (새 대화 또는 빈 상태)
- `/chat/$conversationId` — 특정 대화
- `/settings` — API 키, 기본 모델, 시스템 프롬프트, 테마 설정

### UI 레이아웃 (ChatGPT 유사)
- 좌측 사이드바 (280px, 접기 가능): 새 대화 버튼 + 대화 목록 + 설정 링크
- 우측 채팅 영역: 헤더(제목+모델 선택) + 메시지 목록 + 입력 영역
- 반응형: 데스크톱(>1024px) 사이드바 고정, 모바일(<1024px) Sheet/Drawer 토글
- 다크모드 기본 활성

### 데이터 저장 (IndexedDB via Dexie.js)
- DB명: `openrouter-chat-db`
- `settings`: key(PK), value
- `conversations`: id(PK uuid), title, modelId, systemPrompt, createdAt, updatedAt
- `messages`: id(PK uuid), conversationId(indexed), role, content, createdAt

### OpenRouter API
- Base URL: `https://openrouter.ai/api/v1`
- 인증: `Authorization: Bearer <API_KEY>`
- 무료 모델 필터: `pricing.prompt === "0" && pricing.completion === "0"`
- 채팅: `POST /chat/completions` with `stream: true` (SSE)

## Conventions

- 한국어 UI (버튼, 라벨, 안내 문구)
- 코드 식별자는 영어, 문서는 한국어
- PascalCase: 컴포넌트/클래스, camelCase: 변수/함수, kebab-case: 폴더/파일명
- 기본 에디터: Cursor

## Skill Usage Guidelines

- **GSD(get-shit-done)** 및 **ui-ux-pro-max** 스킬 사용 시, 안내 메시지와 생성 문서는 **한국어**로 작성
- GSD에서 **UI 관련 작업**을 수행할 때, **ui-ux-pro-max 스킬을 함께 사용**하여 UI/UX 품질 향상
