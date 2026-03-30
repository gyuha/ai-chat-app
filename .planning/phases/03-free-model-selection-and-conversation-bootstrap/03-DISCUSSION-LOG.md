# Phase 3: 무료 모델 선택과 대화 부트스트랩 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-31
**Phase:** 3-무료 모델 선택과 대화 부트스트랩
**Areas discussed:** 새 대화 생성 시점, 모델 선택 UX 위치

---

## 새 대화 생성 시점

### conversation 생성 시점

| Option | Description | Selected |
|--------|-------------|----------|
| 즉시 빈 대화 생성 | 새 대화 클릭 즉시 conversation 레코드 생성 | ✓ |
| 모델 선택 후 생성 | 모델 확정 후 conversation 생성 | |
| 기본 모델 있으면 즉시 생성, 없으면 선택 후 생성 | 규칙 2갈래 | |
| 맡김 | the agent가 확정 | |

### 새 대화 `modelId` 초기값

| Option | Description | Selected |
|--------|-------------|----------|
| `defaultModelId`가 있으면 채우고, 없으면 비워 둠 | 기본 설정 활용 + 무설정 대응 | ✓ |
| 항상 비움 | 규칙 단순화 | |
| 항상 첫 무료 모델로 자동 채움 | 즉시 시작 우선 | |
| 맡김 | the agent가 확정 | |

### `modelId` 없는 draft 상태 표현

| Option | Description | Selected |
|--------|-------------|----------|
| 입력창 비활성 + 모델 선택 유도 배너 | 상태와 다음 행동을 명확히 표시 | ✓ |
| 입력 가능, 전송 시 선택 요구 | UI 단순화 | |
| 채팅 대신 모델 선택 화면으로 대체 | 분리된 흐름 | |
| 맡김 | the agent가 확정 | |

### 미완성 draft 누적 정책

| Option | Description | Selected |
|--------|-------------|----------|
| 허용하지 않음 | 미선택 draft 하나만 유지 | ✓ |
| 허용함 | 자유로운 다중 draft | |
| 하나만 허용하고 오래된 draft 자동 정리 | 절충안 | |
| 맡김 | the agent가 확정 | |

**User's choice:** 새 대화 클릭 즉시 conversation을 만들고, `defaultModelId`가 있으면 즉시 채우며, 없으면 입력 비활성 draft로 만들고 미완성 draft는 하나만 유지
**Notes:** ChatGPT 유사 라우팅과 사이드바 흐름을 유지하면서도 미완성 대화 누적은 피한다.

---

## 모델 선택 UX 위치

### 주 진입점

| Option | Description | Selected |
|--------|-------------|----------|
| 헤더 드롭다운 중심 | 상단 헤더에서 모델 선택 | ✓ |
| 본문 상단 인라인 카드 중심 | 채팅 본문에서 모델 선택 | |
| 헤더 + 본문 인라인 둘 다 | 조건부 이중 진입점 | |
| 맡김 | the agent가 확정 | |

### draft conversation의 보조 진입점

| Option | Description | Selected |
|--------|-------------|----------|
| 헤더만 사용 | 배너는 설명만 표시 | |
| 배너에 `모델 선택` 버튼 추가 | 행동 유도 강화 | ✓ |
| 배너에 직접 간단한 모델 선택 UI 삽입 | 첫 선택 속도 우선 | |
| 맡김 | the agent가 확정 | |

### 모델 선택 후 변경 허용 여부

| Option | Description | Selected |
|--------|-------------|----------|
| 허용함 | 현재 대화 모델을 헤더에서 변경 가능 | ✓ |
| 허용하지 않음 | 생성 시점에만 확정 | |
| 첫 메시지 전까지만 허용 | 조건부 잠금 | |
| 맡김 | the agent가 확정 | |

### 헤더 변경 적용 방식

| Option | Description | Selected |
|--------|-------------|----------|
| 즉시 저장 | 선택 즉시 현재 conversation 메타데이터 갱신 | ✓ |
| 확인 버튼으로 확정 | 별도 저장 액션 필요 | |
| 첫 메시지 전후로 다른 규칙 적용 | 상태별 차등 규칙 | |
| 맡김 | the agent가 확정 | |

**User's choice:** 모델 선택은 헤더 드롭다운 중심, draft 배너에는 CTA 제공, 대화 중에도 모델 변경 허용, 변경은 즉시 저장
**Notes:** 구조 중복은 최소화하되, draft 상태에서는 사용자가 다음 행동을 놓치지 않게 보조 CTA를 둔다.

---

## the agent's Discretion

- 헤더 드롭다운의 세부 정보 구성
- draft 상태 CTA와 배너 카피
- draft conversation 표시 방식
- 모델 변경 후 피드백 강도
- 메타데이터 생성 시점의 세부 persistence 전략

## Deferred Ideas

- 무료 모델 목록의 탐색 방식
- 대화 메타데이터 초기화 규칙의 세부 우선순위

