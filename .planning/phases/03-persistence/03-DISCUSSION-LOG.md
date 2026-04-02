# Phase 3: Persistence - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 03-persistence
**Areas discussed:** Storage scope, Error handling UX, Storage limits

## Storage scope

| Option | Description | Selected |
|--------|-------------|----------|
| 현재 유지 | apiKey, selectedModel, conversations만 저장 | ✓ |
| 모두 저장 | isStreaming, error 포함 전체 ChatState 저장 | |

**User's choice:** 현재 유지
**Notes:** 새로고침 시 streaming/error 상태 초기화 허용

## Error handling UX

| Option | Description | Selected |
|--------|-------------|----------|
| 토스트 알림 | 화면 하단에 toast로 알림, 비방해적 | ✓ |
| console만 logging | 개발자용, 사용자 미관여 | |
| 대화상자 | modal로 심각한 오류 표시 | |

**User's choice:** 토스트 알림
**Notes:** 사용자에게友好的인 방식

## Storage limits

| Option | Description | Selected |
|--------|-------------|----------|
| 오래된 대화 자동 삭제 | 오래된 대화부터 순차적 삭제 | |
| 사용자께 알림만 | 삭제 없이 용량 초과 알림만 제공 | ✓ |
| 대화 내보내기 | 사용자가 Markdown으로 내보내면 공간 확보 | |

**User's choice:** 사용자께 알림만
**Notes:** 사용자가 직접 대화 삭제하여 공간 확보

## Claude's Discretion

- Toast 컴포넌트 구현 방식
- Toast 표시 시간 및 스타일
- localStorage quota 감지 방법

## Deferred Ideas

None — discussion stayed within phase scope
