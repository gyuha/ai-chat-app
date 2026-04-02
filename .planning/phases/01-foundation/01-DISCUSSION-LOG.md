# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 01-foundation
**Areas discussed:** Layout & Visual Design, API Key Input, Sidebar

---

## Layout & Visual Design

| Option | Description | Selected |
|--------|-------------|----------|
| ChatGPT一模一样 | 사이드바 260px, 메인 영역 flex-1, 중앙 정렬된 채팅 컨테이너 (max-width 768px) | ✓ |
| 사이드바 좁게 | 사이드바 200px, 더 넓은 메인 영역 | |
| 사이드바 넓게 | 사이드바 300px, 더 넓은 대화 목록 | |

**User's choice:** ChatGPT一模一样
**Notes:** ChatGPT 웹 앱과 동일한 레이아웃 구조 원함

### Color Scheme

| Option | Description | Selected |
|--------|-------------|----------|
| Dark만 (ChatGPT一样) | 어두운 테마만, 라이트 모드 없음 | |
| Light만 (간단하게) | 밝은 테마만, 다크 모드 없음 | ✓ |
| Dark/Light 토글 | 사용자가 전환 가능 | |

**User's choice:** Light만 (간단하게)
**Notes:** 밝은 테마만 지원, Dark 모드 없음

---

## API Key Input

| Option | Description | Selected |
|--------|-------------|----------|
| Modal overlay | 중앙 모달 팝업으로 표시, 입력이 완료되기 전 메인 UI 비활성화 | ✓ |
| 인라인 입력 | 메인 영역 상단에 입력 폼을 항상 표시 | |

**User's choice:** Modal overlay
**Notes:** 깔끔한 UX 선호

---

## Sidebar Conversation List

| Option | Description | Selected |
|--------|-------------|----------|
| 간단하게 제목만 | 대화 제목만 표시, 클릭으로 선택 | ✓ |
| 제목 + 시간 | 제목 + 마지막 메시지 시간 | |
| 제목 + 삭제버튼 | 제목 + 마우스 올릴 때 삭제 아이콘 표시 | |

**User's choice:** 간단하게 제목만
**Notes:** 단순하게 제목만 표시

---

## Claude's Discretion

- 구체적인 Tailwind 색상 클래스 값
- Typography 세밀한 설정 (font-size, font-weight)
- Modal 애니메이션 효과
- 입력 폼 스타일 세밀한 설정

---

## Deferred Ideas

None

---
