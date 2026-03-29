# OpenRouter Free Chat Web App 문서 인덱스

이 디렉터리는 GSD 기준의 초기 프로젝트 문서 세트다. 현재 상태는 "질문 없이 바로 Phase 1 계획으로 넘어갈 수 있는 수준"을 목표로 정리했다.

## 산출물 순서

1. 프로젝트 이해 요약: `.planning/PROJECT.md`
2. 추가 질문 필요 여부: 추가 질문 없음. 사용자 입력으로 초기화 가능
3. 제품 요구사항 문서(PRD): `.planning/PRD.md`
4. 기술 설계 문서: `.planning/TECH-DESIGN.md`
5. 정보 구조(IA): `.planning/PRD.md` 내 `정보 구조`
6. UX/UI 설계 원칙: `.planning/PRD.md` 내 `UX/UI 설계 원칙`
7. 화면 목록 및 각 화면 책임: `.planning/PRD.md` 내 `화면 목록`
8. 컴포넌트 구조: `.planning/PRD.md` 내 `컴포넌트 구조`
9. 프론트엔드 폴더 구조: `.planning/TECH-DESIGN.md` 내 `프론트엔드 구조`
10. 백엔드 폴더 구조: `.planning/TECH-DESIGN.md` 내 `백엔드 구조`
11. API 설계 초안: `.planning/TECH-DESIGN.md` 내 `API 설계`
12. 상태관리 설계: `.planning/TECH-DESIGN.md` 내 `상태관리 설계`
13. 스트리밍 처리 방식: `.planning/TECH-DESIGN.md` 내 `스트리밍 처리 방식`
14. 에러 처리 전략: `.planning/TECH-DESIGN.md` 내 `에러 처리 전략`
15. 보안 체크리스트: `.planning/TECH-DESIGN.md` 내 `보안 체크리스트`
16. 개발 phase 계획: `.planning/ROADMAP.md`
17. 각 phase별 실행 프롬프트 초안: `.planning/PHASE-PROMPTS.md`
18. UI UX Pro Max 활용 전략: `.planning/PHASE-PROMPTS.md` 내 `UI UX Pro Max 호출 전략`
19. 바로 구현 가능한 첫 phase 작업 목록: `.planning/PHASE-1-KICKOFF.md`

## GSD 기본 설정

- 모드: `yolo`
- granularity: `standard`
- research / plan_check / verifier: 활성화
- planning docs: git 추적
- UI 관련 phase: `ui-ux-pro-max` 병행 사용 전제

## 현재 권장 다음 단계

1. `.planning/PROJECT.md`와 `.planning/ROADMAP.md`를 기준으로 범위를 다시 확인한다.
2. `$gsd-discuss-phase 1 --auto` 또는 `$gsd-plan-phase 1`로 Phase 1에 진입한다.
3. UI 구조를 먼저 확정하고 싶다면 `$gsd-ui-phase 1`을 선행한다.
