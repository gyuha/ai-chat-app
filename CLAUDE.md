# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

OpenRouter 무료 API를利用한 웹 채팅 어플리케이션. ChatGPT와 유사한 UI를 목표로 함.

### 기술 스택
- **프레임워크**: React
- **패키지 관리**: pnpm
- **린팅/포맷팅**: Biome
- **타입 시스템**: TypeScript
- **UI 컴포넌트**: shadcn/ui
- **상태 관리**: Zustand
- **데이터 페칭**: TanStack Query
- **라우팅**: TanStack Router
- **로컬 스토리지**: IndexedDB

## 공통 명령어

```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 린트
pnpm lint

# 포맷팅
pnpm format

# 타입 체크
pnpm typecheck
```

## 아키텍처 참고사항

- 프론트엔드 only 프로젝트 (백엔드 없음)
- OpenRouter API를 통한 채팅 통신
- IndexedDB에 대화 데이터 영속성 저장

## GSD(gsd) 및 UI-UX-PRO-MAX(ui-ux-pro-max) 스킬 사용 지침

### 스킬 사용 시 안내 메시지 및 문서 언어

gsd 스킬과 ui-ux-pro-max 스킬을 사용할 때, 생성되는 안내 메시지와 문서는 **반드시 한글(한국어)**로 작성해야 함.

- AI용 타이틀/기본값 제외
- 설명, 안내, 프롬프트 등은 모두 한글로 작성

### UI 관련 작업 시 스킬 연계

gsd에서 UI 관련된 작업을 수행할 때에는 **ui-ux-pro-max 스킬을 반드시 함께 사용**해야 함.

- UI 컴포넌트 생성/수정 시 gsd와 ui-ux-pro-max를 연계하여 작업
- 레이아웃, 스타일, 디자인 관련 작업 시 두 스킬을 동시에 활용
