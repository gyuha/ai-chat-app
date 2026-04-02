# AI Chat App

## What This Is

OpenRouter의 무료 API를利用한 웹 채팅 어플리케이션. 로그인 불필요, API 키 입력만으로 채팅 가능. ChatGPT와 유사한 UI를 제공하여 익숙한 채팅 경험을 제공.

## Core Value

브라우저에서 간단하게 사용할 수 있는 무료 AI 채팅 도구. 로그인 없이 즉시 사용 가능.

## Requirements

### Validated

- [x] 사용자는 메인 채팅 영역에서 메시지를 입력하고 AI 응답을 실시간 스트리밍으로 확인 *(Phase 02: 2026-04-02)*
- [x] AI 응답은 ChatGPT처럼 글자가 바로바로 나타나는 스트리밍 방식으로 표시 *(Phase 02: 2026-04-02)*
- [x] 채팅 데이터는 브라우저 localStorage에 영구 저장 *(Phase 03: 2026-04-02)*

### Active

- [ ] 사용자는 API 키를 입력하여 채팅 서비스에 접속 가능
- [ ] 사용자는 사이드바에서 대화방을 생성/선택/삭제 가능
- [ ] 사용자는 메인 채팅 영역에서 메시지를 입력하고 AI 응답을 실시간 스트리밍으로 확인
- [ ] 사용자는 오른쪽 상단 셀렉트 박스에서 무료 모델을 단일 선택 가능
- [ ] AI 응답은 ChatGPT처럼 글자가 바로바로 나타나는 스트리밍 방식으로 표시

### Out of Scope

- 사용자 인증/로그인 시스템
- 클라우드 동기화
- 모바일 네이티브 앱
- 유료 모델 지원
- 다중 모델 비교 뷰

## Context

- **OpenRouter API**: 무료 모델 목록에서 선택하여 사용
- **저장**: localStorage (브라우저 내장, 별도 서버 불필요)
- **UI 패턴**: ChatGPT 웹 앱과 유사한 레이아웃

## Constraints

- **Tech**: React + Vite (단일 페이지 앱)
- **API**: OpenRouter API만 사용 (타 AI 프로바이더 미지원)
- **Storage**: localStorage만 사용 (IndexedDB 미사용)
- **Auth**: 자체 인증 시스템 없음 (API 키로 개별 사용자 식별)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| localStorage 선택 | 서버 불필요, 순수 클라이언트 사이드 | — Pending |
| 사이드바 + 메인 채팅 레이아웃 | ChatGPT 유사 UX | — Pending |

---

*Last updated: 2026-04-02 after phase 03 completion*
