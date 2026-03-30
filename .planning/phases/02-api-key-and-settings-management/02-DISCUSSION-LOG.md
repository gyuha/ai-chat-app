# Phase 2: API 키와 설정 관리 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-31
**Phase:** 2-API 키와 설정 관리
**Areas discussed:** API 키 저장 정책, 키 검증 흐름, 기본 설정의 적용 범위, 성공 후 이동 흐름

---

## API 키 저장 정책

### 저장 시점

| Option | Description | Selected |
|--------|-------------|----------|
| 검증 성공 후 저장 | 성공한 key만 IndexedDB에 저장 | ✓ |
| 임시 저장 후 확정 저장 | draft와 saved를 분리 | |
| 입력 즉시 저장 | 검증과 무관하게 저장 | |
| 맡김 | the agent가 확정 | |

### 검증 실패 시 입력값 처리

| Option | Description | Selected |
|--------|-------------|----------|
| 입력 유지, 저장 안 함 | 수정 흐름 자연스러움 | ✓ |
| 실패 시 즉시 비움 | 보안 우선 | |
| 세션 동안만 임시 보관 | 메모리 내 보관 | |
| 맡김 | the agent가 확정 | |

### 기존 저장 key 교체 정책

| Option | Description | Selected |
|--------|-------------|----------|
| 새 key 검증 성공 시에만 교체 | 정상 key 보존 | ✓ |
| 입력 즉시 덮어씀 | 상태 단순화 | |
| 교체 전 확인 단계 추가 | 실수 방지 | |
| 맡김 | the agent가 확정 | |

### 삭제 정책

| Option | Description | Selected |
|--------|-------------|----------|
| 즉시 삭제 + 간단 확인 | 명확하고 예측 가능 | ✓ |
| 삭제 후 되돌리기 토스트 | undo 제공 | |
| 저장 버튼으로 일괄 확정 | 일괄 처리 | |
| 맡김 | the agent가 확정 | |

**User's choice:** 검증 성공 후 저장, 실패 시 입력 유지, 새 key 성공 시에만 교체, 삭제는 확인 후 즉시 수행
**Notes:** 실패한 key가 영속 저장되지 않는 방향을 우선한다.

---

## 키 검증 흐름

### 검증 시작 방식

| Option | Description | Selected |
|--------|-------------|----------|
| 버튼 클릭 시만 시작 | 호출 타이밍 명시적 | ✓ |
| debounce 자동 검증 | 즉각적 반응 | |
| 저장 버튼과 검증 통합 | 한 번에 처리 | |
| 맡김 | the agent가 확정 | |

### 검증 성공 반응

| Option | Description | Selected |
|--------|-------------|----------|
| 인라인 성공 + 토스트 | 상태 명확 | ✓ |
| 토스트만 | UI 단순 | |
| 즉시 다음 화면 이동 | 빠른 흐름 | |
| 맡김 | the agent가 확정 | |

### 검증 실패 메시지 레벨

| Option | Description | Selected |
|--------|-------------|----------|
| 2단계 구분 | 권한/유효성 vs 네트워크/일시 오류 | ✓ |
| 가능한 한 세분화 | 상태 원인 상세 노출 | |
| 단일 실패 메시지 | 가장 단순 | |
| 맡김 | the agent가 확정 | |

### 진행 중 입력 UI

| Option | Description | Selected |
|--------|-------------|----------|
| 입력 유지, 버튼만 로딩 | UX 균형 | ✓ |
| 전체 잠금 | 상태 명확 | |
| 잠금 없이 계속 편집 | 자유로움 우선 | |
| 맡김 | the agent가 확정 | |

**User's choice:** 명시적 버튼 검증, 인라인 성공 + 토스트, 2단계 실패 메시지, 버튼만 로딩
**Notes:** OpenRouter 호출 타이밍과 피드백이 예측 가능해야 한다.

---

## 기본 설정의 적용 범위

### 기본 모델 적용 범위

| Option | Description | Selected |
|--------|-------------|----------|
| 새 대화 초기값으로만 적용 | 기존 대화 보존 | ✓ |
| 모든 대화에 일괄 반영 | 상태 단순화 | |
| 추천값만 표시 | 자동 적용 없음 | |
| 맡김 | the agent가 확정 | |

### 글로벌 시스템 프롬프트 적용 범위

| Option | Description | Selected |
|--------|-------------|----------|
| 새 대화 기본값으로만 적용 | 기존 대화 보존 | ✓ |
| 모든 대화에 즉시 반영 | 일관성 우선 | |
| 안내용만 유지 | 자동 주입 없음 | |
| 맡김 | the agent가 확정 | |

### 저장 방식

| Option | Description | Selected |
|--------|-------------|----------|
| 항목별 즉시 저장 | 저장 버튼 없음 | ✓ |
| 공통 저장 버튼 | 변경 의도 명확 | |
| debounce 자동 저장 | 부드러운 저장 | |
| 맡김 | the agent가 확정 | |

### 무효한 기본 모델 처리

| Option | Description | Selected |
|--------|-------------|----------|
| 기본값 없음 상태로 복귀 | 상태 명확 | ✓ |
| 마지막 저장값 유지 + 경고 | 이전 값 노출 | |
| 첫 무료 모델로 자동 대체 | 즉시 사용 가능 | |
| 맡김 | the agent가 확정 | |

**User's choice:** 기본 모델과 글로벌 시스템 프롬프트는 새 대화 초기값으로만 적용, 항목별 즉시 저장, 무효 모델은 기본값 없음으로 복귀
**Notes:** 기존 대화의 맥락을 건드리지 않는 쪽을 우선한다.

---

## 성공 후 이동 흐름

### `/` 온보딩 성공 후

| Option | Description | Selected |
|--------|-------------|----------|
| 같은 화면을 빈 상태 홈으로 전환 | 흐름이 자연스러움 | ✓ |
| `/settings`로 이동 | 추가 설정 유도 | |
| 성공 상태 유지 | 변화 명시적 | |
| 맡김 | the agent가 확정 | |

### `/settings` 성공 후

| Option | Description | Selected |
|--------|-------------|----------|
| 현재 화면 유지, 성공 상태만 갱신 | 설정 연속 수정 용이 | ✓ |
| `/`로 이동 | 바로 사용 흐름 복귀 | |
| CTA만 추가 노출 | 제어권과 유도 절충 | |
| 맡김 | the agent가 확정 | |

### 삭제 후 이동

| Option | Description | Selected |
|--------|-------------|----------|
| `/settings`는 유지, `/`는 온보딩 복귀 | 위치 유지 + 상태 정확 | ✓ |
| 어디서든 `/` 온보딩 이동 | 규칙 단순 | |
| 전용 확인 화면/배너 | 상태 인지 강화 | |
| 맡김 | the agent가 확정 | |

**User's choice:** `/`는 빈 상태 홈으로 전환, `/settings`는 유지, 삭제 후 현재 위치 기준으로 상태만 갱신
**Notes:** 성공/삭제 뒤 강제 이동보다 현재 맥락 유지가 우선이다.

---

## the agent's Discretion

- 설정 key naming과 storage shape
- 성공/오류 카피의 세부 문구
- 다이얼로그와 토스트 문구
- 기본 모델 무효 상태의 copy
- draft/saved state를 어떤 상태 계층에서 관리할지

## Deferred Ideas

None
