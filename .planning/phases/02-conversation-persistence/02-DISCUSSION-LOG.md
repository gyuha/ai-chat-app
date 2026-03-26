# Phase 2: Conversation Persistence - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 02-conversation-persistence
**Areas discussed:** 대화 생성 진입 방식, 목록 정보 밀도, 새 대화 기본 제목 정책, 빈 상태와 초기 화면

---

## 대화 생성 진입 방식

| Option | Description | Selected |
|--------|-------------|----------|
| 로그인 후 `/` 진입 시 대화가 없으면 자동으로 첫 대화를 만든다 | 초기 진입 즉시 usable state를 만든다 | ✓ |
| 빈 상태에서 `새 대화` 버튼을 눌러야 만든다 | 사용자의 명시 액션을 요구한다 | |
| 임시 composer를 먼저 보여주고 첫 메시지 전송 시 대화를 만든다 | 생성 시점을 첫 입력과 결합한다 | |

**User's choice:** 로그인 후 대화가 없으면 자동으로 첫 대화를 생성한다.
**Notes:** 빈 상태 액션 없이 바로 사용할 수 있는 흐름을 선호했다.

---

## 목록 정보 밀도

| Option | Description | Selected |
|--------|-------------|----------|
| 최소형 | 제목만 보여준다 | ✓ |
| 기본형 | 제목과 생성 시각을 보여준다 | |
| 풍부형 | 제목, 시각, 최근 메시지 한 줄 미리보기를 보여준다 | |

**User's choice:** 최소형 목록.
**Notes:** Phase 2 범위를 conversation 생성과 목록 조회의 최소 단위로 유지하려는 의도가 분명했다.

---

## 새 대화 기본 제목 정책

| Option | Description | Selected |
|--------|-------------|----------|
| `새 대화` | 고정 플레이스홀더 제목 사용 | ✓ |
| 생성 시각 기반 제목 | 생성 순간 정보를 제목으로 사용 | |
| `Untitled` 후속 갱신 | 첫 메시지 전까지 임시 영문 제목을 유지 | |

**User's choice:** `새 대화`.
**Notes:** 제목 정책도 단순하고 즉시 이해 가능한 한글 기본값을 선호했다.

---

## 빈 상태와 초기 화면

| Option | Description | Selected |
|--------|-------------|----------|
| 단순형 | 생성된 `새 대화`를 선택 상태로 바로 보여준다 | ✓ |
| 안내형 | 짧은 시작 안내 문구를 함께 보여준다 | |
| 환영형 | 더 큰 웰컴 카피와 팁을 보여준다 | |

**User's choice:** 단순형.
**Notes:** 추가 카피 없이 바로 usable state로 들어가는 초기 화면을 원했다.

---

## the agent's Discretion

- conversation/message 데이터 모델의 세부 컬럼과 인덱스 설계
- active conversation UI의 세부 배치와 스타일링
- 자동 생성 API 호출을 라우트 로드 시점에 붙일지 mutation 흐름으로 둘지에 대한 구현 방식

## Deferred Ideas

- 최근 메시지 미리보기와 richer list metadata
- 첫 메시지 기반 제목 갱신
- 웰컴 카피/사용 팁이 있는 richer onboarding
