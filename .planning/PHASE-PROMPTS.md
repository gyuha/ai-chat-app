# Phase 실행 프롬프트 초안

## UI UX Pro Max 호출 전략

### 호출 원칙

- 모든 UI 관련 phase에서는 `gsd-*` 흐름과 함께 `ui-ux-pro-max`를 병행한다.
- 최소 호출 순서:
  1. `--design-system`
  2. UX domain 검색
  3. shadcn / react stack 검색
- 출력은 한글 설명으로 요약하고, 구체 규칙은 phase 문서에 반영한다.

### 권장 호출 예시

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "ai chat conversational productivity dark mode dashboard" --design-system -f markdown -p "OpenRouter Free Chat Web App"
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "chat input streaming accessibility focus empty state responsive" --domain ux -n 12
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "chat layout sidebar composer markdown code block" --stack shadcn
```

## Phase 1

`$gsd-plan-phase 1`

추가 컨텍스트:
- 모노레포와 contracts package를 먼저 확정
- NestJS 프록시와 allowlist를 UI보다 먼저 보장
- web 쪽은 health/models API를 소비하는 최소 shell까지만 연결해도 됨

## Phase 2

`$gsd-ui-phase 2`
`$gsd-plan-phase 2`

추가 컨텍스트:
- empty state, sidebar, composer spacing을 세밀하게 정의
- ChatGPT 유사 구조를 따르되 직접 복제 금지
- ui-ux-pro-max 결과를 spacing/token 수준으로 반영

## Phase 3

`$gsd-ui-phase 3`
`$gsd-plan-phase 3`

추가 컨텍스트:
- streaming lifecycle, auto-scroll lock, stop/regenerate를 상태 머신처럼 설계
- markdown/code block 렌더링과 메시지 bubble 규칙을 고정

## Phase 4

`$gsd-ui-phase 4`
`$gsd-plan-phase 4`

추가 컨텍스트:
- 설정 dialog, 모델 selector, delete confirm의 인터랙션 밀도를 조정
- 제목 자동 생성 실패 시 fallback UX 포함

## Phase 5

`$gsd-ui-phase 5`
`$gsd-plan-phase 5`

추가 컨텍스트:
- 모바일 sheet, focus ring, aria-live, empty/error/loading polish를 중심으로 검토

## Phase 6

`$gsd-plan-phase 6`

추가 컨텍스트:
- UI보다 저장소 seam, env, deploy readiness, logging policy가 중심
