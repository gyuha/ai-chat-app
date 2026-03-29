# Phase 3: 채팅 핵심 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in 03-CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 03-chat-core
**Mode:** auto
**Areas discussed:** 스트리밍 아키텍처, 대화/메시지 API, 모델 관리, 채팅 UI, Stop/Regenerate, 시스템 프롬프트, Rate Limit

---

## 스트리밍 아키텍처

| Option | Description | Selected |
|--------|-------------|----------|
| SSE 프록시 | 백엔드→OpenRouter SSE 연결 → 클라이언트에 SSE 전달 | ✓ |
| WebSocket | 백엔드→OpenRouter 연결 → 클라이언트에 WebSocket 전달 | |
| Direct proxy | 클라이언트→백엔드 단순 HTTP 프록시 | |

**User's choice:** SSE 프록시 (auto-selected — recommended)
**Notes:** PROJECT.md에서 SSE 기반 스트리밍 명시. fetch + ReadableStream으로 POST 요청 지원.

## 대화/메시지 API

| Option | Description | Selected |
|--------|-------------|----------|
| 커서 기반 페이지네이션 | cursor + limit 방식, 최근 50개 로드 | ✓ |
| 오프셋 페이지네이션 | page + limit 방식 | |
| 전체 로드 | 모든 메시지 한 번에 로드 | |

**User's choice:** 커서 기반 페이지네이션 (auto-selected — recommended)
**Notes:** 대화가 길어질 때 성능 유지. Phase 4에서 무한 스크롤과 연동.

## 모델 관리

| Option | Description | Selected |
|--------|-------------|----------|
| 기본 모델 고정 + UI 준비 | 1개 무료 모델 고정, 드롭다운 구조만 준비 | ✓ |
| 다중 모델 즉시 구현 | allowlist 모델 모두 선택 가능 | |
| 모델 선택 없음 | 서버가 자동 선택 | |

**User's choice:** 기본 모델 고정 + UI 준비 (auto-selected — recommended)
**Notes:** v1은 무료 모델만 사용. 모델 전환은 v2에서.

## 채팅 UI

| Option | Description | Selected |
|--------|-------------|----------|
| 사이드바 + 메인 (ChatGPT 스타일) | 좌측 대화 목록 + 우측 채팅 영역 | ✓ |
| 탭 기반 | 대화 목록 탭 + 채팅 탭 분리 | |
| 단일 화면 | 대화 목록과 채팅 전환 | |

**User's choice:** 사이드바 + 메인 (auto-selected — recommended)
**Notes:** ChatGPT 참고, PROJECT.md에서 사이드바로 레이아웃 계층 구분 언급.

## Stop/Regenerate

| Option | Description | Selected |
|--------|-------------|----------|
| AbortController + 재전송 | fetch 중단 + 마지막 응답 삭제 후 재전송 | ✓ |
| 스트림 무시 + 재전송 | 스트림은 계속하되 UI만 무시 | |
| 서버 측 취소만 | 백엔드에서만 취소 처리 | |

**User's choice:** AbortController + 재전송 (auto-selected — recommended)
**Notes:** 사용자 경험 핵심. 즉각적 중단 + 깔끔한 재생성.

## Auto-Resolved

- 스트리밍 아키텍처: auto-selected SSE 프록시 (recommended)
- 대화/메시지 API: auto-selected 커서 기반 페이지네이션 (recommended)
- 모델 관리: auto-selected 기본 모델 고정 + UI 준비 (recommended)
- 채팅 UI: auto-selected 사이드바 + 메인 (recommended)
- Stop/Regenerate: auto-selected AbortController + 재전송 (recommended)
- 시스템 프롬프트: auto-selected 대화별 설정 (required by CHAT-04)
- Rate Limit: auto-selected 사용자 친화적 메시지 + 재시도 (required by BACK-03)

## External Research

수행하지 않음 — 코드베이스와 요구사항으로 충분히 판단 가능.
