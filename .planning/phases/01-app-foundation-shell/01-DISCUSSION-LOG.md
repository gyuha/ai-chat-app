# Phase 1: App Foundation & Shell - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-31
**Phase:** 01-app-foundation-shell
**Areas discussed:** Shell 구조, 첫 진입 상태, 브랜드 톤, 설정 접근 위치

---

## Shell 구조

| Option | Description | Selected |
|--------|-------------|----------|
| ChatGPT 근접형 | 약 280px sidebar + 넓은 메인 채팅 pane. 가장 낮은 리스크로 익숙한 사용성을 줌 | ✓ |
| 조금 더 compact | sidebar를 더 좁게 두고 정보 밀도를 높임 | |
| 브랜드 강조형 | 헤더 존재감과 포인트 영역을 더 크게 둠 | |
| You decide | 가장 안전한 기본안을 the agent가 선택 | |

**User's choice:** ChatGPT 근접형
**Notes:** 초기 코드가 없는 상태라 이후 phase의 기본 패턴이 되는 shell로 채택.

---

## 첫 진입 상태

| Option | Description | Selected |
|--------|-------------|----------|
| 메인 패널 안내형 | 2-pane shell은 유지하고, 메인 패널 안에서 welcome + API key 안내 카드를 보여줌 | ✓ |
| 전용 onboarding 화면 | 첫 진입만 별도 onboarding 느낌으로 보여준 뒤 shell로 진입 | |
| 모달 유도형 | shell 위에 key 입력/안내를 모달로 띄움 | |
| You decide | 가장 자연스러운 첫 진입 방식을 the agent가 선택 | |

**User's choice:** 메인 패널 안내형
**Notes:** shell을 숨기지 않고, 제품의 기본 구조를 첫 진입부터 보여주기로 결정.

---

## 브랜드 톤

| Option | Description | Selected |
|--------|-------------|----------|
| 중립 다크 + cyan 포인트 | ChatGPT처럼 차분하지만, 약한 브랜드 포인트를 남김 | ✓ |
| 거의 ChatGPT 중립형 | 브랜드감 최소화, 매우 익숙한 느낌에 집중 | |
| 브랜드 강조형 | cyan/teal 존재감을 더 키워 제품 개성을 드러냄 | |
| You decide | 가장 무난한 시각 톤을 the agent가 선택 | |

**User's choice:** 중립 다크 + cyan 포인트
**Notes:** 익숙함을 유지하면서도 OpenRouter Chat만의 정체성을 약하게 부여하는 방향.

---

## 설정 접근 위치

| Option | Description | Selected |
|--------|-------------|----------|
| Sidebar+Header | sidebar 하단에 기본 진입점을 두고, header 우측에도 빠른 접근을 둠 | ✓ |
| Sidebar 하단만 | ChatGPT와 가장 비슷한 정보 구조 | |
| Header 우측만 | 메인 pane 중심 구조에 더 깔끔함 | |
| You decide | 가장 일관된 접근 방식을 the agent가 선택 | |

**User's choice:** Sidebar+Header
**Notes:** 정보 구조의 안정성과 빠른 접근성을 동시에 확보하기로 결정.

## the agent's Discretion

- exact spacing scale
- header height
- icon set
- empty state illustration level

## Deferred Ideas

None.
