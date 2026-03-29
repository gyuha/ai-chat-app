# 리서치 요약

## 핵심 결론

- 구조: `pnpm workspace` 모노레포가 가장 실용적이다
- 프론트: `Vite + React + TanStack Router + Query + Zustand + shadcn/ui`
- 백엔드: `NestJS`가 프록시, validation, allowlist, streaming 제어에 적합하다
- UX: `Dark Mode (OLED)` 계열, `Fira Sans + Fira Code`, 스트리밍/포커스/빈 상태/모바일 폭 제어가 핵심이다

## Table Stakes

- 대화 목록, 새 채팅, 삭제
- 모델 선택과 표시
- 스트리밍 응답
- stop / regenerate
- markdown + code block rendering
- 반응형, 접근성, 에러/빈 상태

## 반드시 피할 것

- 브라우저 직접 OpenRouter 호출
- light mode 중심 기본 설계
- placeholder만 있는 입력창
- 모바일에서 깨지는 코드/표 레이아웃

## 구현 우선순위

1. 서버 프록시와 모노레포 기반
2. Chat shell과 composer
3. 스트리밍 lifecycle
4. 대화 관리와 설정 UI
5. 오류/접근성/모바일 polish
