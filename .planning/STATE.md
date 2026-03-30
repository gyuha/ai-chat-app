---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: ready
stopped_at: Completed 03-05-PLAN.md
last_updated: "2026-03-31T01:00:00Z"
last_activity: 2026-03-31
progress:
  total_phases: 5
  completed_phases: 2
  total_plans: 15
  completed_plans: 10
  percent: 67
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-30)

**Core value:** 사용자가 서버 없이 자신의 OpenRouter API 키만으로 무료 모델과 안정적으로 대화하고, 대화 기록을 로컬에 안전하게 보관할 수 있어야 한다.
**Current focus:** Phase 3 실행 준비 — 무료 모델 선택과 대화 부트스트랩

## Current Position

Phase: 3 (무료 모델 선택과 대화 부트스트랩) — PLANNED
Plan: 5 of 5
Status: Ready to execute Phase 3
Last activity: 2026-03-31

Progress: [███████░░░] 67%

## Performance Metrics

**Velocity:**

- Total plans completed: 10
- Average duration: -
- Total execution time: 0.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 02 | 5 | - | - |

**Recent Trend:**

- Last 5 plans: 02-01 → 02-02 → 02-03 → 02-04 → 02-05
- Trend: Stable

| Phase 02 P01 | 1 min | 2 tasks | 6 files |
| Phase 02 P02 | 6 min | 2 tasks | 5 files |
| Phase 02 P03 | 9 min | 2 tasks | 3 files |
| Phase 02 P04 | 14 min | 2 tasks | 6 files |
| Phase 02 P05 | 24 min | 2 tasks | 11 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: 프론트엔드 전용 OpenRouter 직접 호출 구조를 유지한다.
- [Init]: 한국어 UI와 ChatGPT 유사 레이아웃을 v1 핵심 경험으로 본다.
- [Init]: 모든 대화와 설정은 IndexedDB에 저장한다.
- [Phase 1]: 앱 셸은 밸런스형 밀도, 280px 안팎 사이드바, 표준형 헤더 기준으로 설계한다.
- [Phase 1]: 모바일은 좌측 `Sheet` 오버레이와 기본 닫힘 흐름을 사용한다.
- [Phase 1]: 비주얼 톤은 ChatGPT 근접형, 거의 평면형, 제한적 강조색으로 유지한다.
- [Phase 01]: Biome 검사 범위는 앱 소스와 루트 설정 파일로 제한해 vendored GSD 문서와 분리했다. — 프로젝트 저장소에는 앱 코드 외에 vendored workflow 파일이 함께 있어, baseline lint를 앱 범위로 제한해야 실행 품질을 안정적으로 유지할 수 있었다.
- [Phase 01]: TypeScript 6 deprecation과 Vite ESM 경로 처리를 baseline 단계에서 바로 흡수했다. — 초기 부트스트랩 단계에서 빌드 체인을 통과시키지 못하면 이후 shadcn, router, shell 구현이 모두 막히므로 TS6/ESM 호환성을 바로 정리했다.
- [Phase 01]: shadcn generated defaults 중 Geist/next-themes 의존성은 유지하지 않고 Inter 중심 토큰과 custom theme plan에 맞게 정리했다. — UI-SPEC에서 완전 중립형 타이포그래피와 custom theme provider 방향을 잠갔기 때문에 generated preset default를 그대로 두지 않았다.
- [Phase 01]: Biome는 Tailwind v4 directives를 파싱하도록 조정해 generated CSS와 충돌하지 않게 했다. — shadcn가 추가한 globals.css를 유지하면서 lint/build를 닫으려면 parser 옵션을 즉시 열어야 이후 shell 작업이 막히지 않는다.
- [Phase 01]: 앱 셸은 desktop fixed sidebar + mobile left Sheet 조합으로 고정한다. — ChatGPT 유사한 기본 흐름을 유지하면서 모바일에서는 기본 닫힘 내비게이션을 명시적으로 제어하기 위해.
- [Phase 02]: API 키는 검증 성공 후에만 저장하고, 실패한 입력은 draft로만 유지한다. — 잘못된 key가 영속 설정을 덮어쓰지 않게 하면서 수정 흐름은 유지하기 위해.
- [Phase 02]: 기본 모델과 글로벌 시스템 프롬프트는 기존 대화를 바꾸지 않고 새 대화의 초기값으로만 적용한다. — 기존 대화 컨텍스트를 보존하면서 기본 설정의 의미를 유지하기 위해.
- [Phase 02]: settings persistence의 단일 source of truth는 Dexie settings store로 유지한다. — localStorage fallback을 만들지 않고 이후 settings/model 흐름을 한 저장소 위에 누적하기 위해.
- [Phase 02]: QueryClient는 singleton으로 두고 테스트마다 cache를 clear한다. — settings/models query가 같은 cache 정책을 공유하면서 test 간 상태 오염을 막기 위해.
- [Phase 02]: `/` 온보딩 성공 후에는 route 이동 없이 settings query cache를 갱신해 empty state로 전환한다. — 첫 사용 흐름을 끊지 않고 같은 화면에서 즉시 다음 행동으로 넘어가게 하기 위해.
- [Phase 02]: settings route tests는 memory router + fake IndexedDB + fetch mock 조합으로 실제 정책을 고정한다. — 브라우저 전용 persistence 앱에서 save/delete/default 흐름 회귀를 빠르게 검증하기 위해.
- [Phase 03]: `새 대화 시작`은 conversation 레코드를 즉시 만들고, 미선택 모델 draft는 하나만 유지한다. — ChatGPT 유사한 라우팅/사이드바 흐름을 유지하면서 미완성 대화 누적을 막기 위해.
- [Phase 03]: 모델 선택의 주 surface는 헤더 드롭다운으로 두고, draft 상태에서는 본문 CTA로만 보조한다. — 정상 상태와 미완성 상태 모두를 커버하면서 구조 중복을 최소화하기 위해.

### Pending Todos

None yet.

### Blockers/Concerns

- OpenRouter 무료 모델 조건과 rate limit은 Phase 3 구현 전에 다시 확인해야 한다.
- 무료 모델 목록 탐색 정보 밀도와 메타데이터 초기화 세부 규칙은 아직 미확정이다.
- route test file ignore pattern은 설정했지만, 새 route-adjacent test 파일도 `.test.tsx` 규칙을 유지해야 한다.

### Planning Notes

- [Phase 02]: foundation(01) → service layer(02) → onboarding/settings UI(03/04 병렬) → integration tests(05) 순서로 plan을 분할했다. — persistence/query 기반을 먼저 고정하고, route UI는 동일한 policy/service 위에서 병렬 구현할 수 있게 하기 위해.
- [Phase 02]: Select interaction은 action-path persistence 테스트와 route fallback 테스트로 나눠 검증했다. — Radix primitive의 JSDOM 한계를 피하면서 정책 coverage는 유지하기 위해.
- [Phase 03]: persistence(01) → bootstrap/sidebar(02) → header selector(03)·draft body(04) → integration tests(05) 순서로 분할했다. — conversation data layer를 먼저 고정하고, shell/header와 chat body를 분리해 구현/검증 범위를 명확히 하기 위해.

## Session Continuity

Last session: 2026-03-31T01:00:00Z
Stopped at: Completed 03-05-PLAN.md
Resume file: .planning/phases/03-free-model-selection-and-conversation-bootstrap/03-05-PLAN.md
