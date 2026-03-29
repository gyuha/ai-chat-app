# 리서치: Stack

## 결론

이 프로젝트의 표준 스택은 `pnpm workspace + Vite/React SPA + NestJS API + shared contracts package` 조합이 가장 적절하다. 채팅 중심 UX와 서버 프록시 요구사항을 고려하면 Next.js보다 구조가 단순하고, 프론트/백엔드 역할 분리가 명확하다.

## 권장 스택

### Frontend

- React + TypeScript
- Vite
- TanStack Router
- TanStack Query
- Zustand
- shadcn/ui
- Tailwind CSS
- Biome
- react-markdown + remark-gfm

### Backend

- NestJS + TypeScript
- `@nestjs/config`
- `class-validator` + `class-transformer`
- Node fetch 기반 OpenRouter client
- SSE 스타일 스트리밍 응답

### Workspace

- pnpm workspace
- packages/contracts
- packages/config

## 추천하지 않는 선택

- 프론트에서 OpenRouter 직접 호출: 보안상 불가
- 초기부터 Turbo 필수화: 현재 규모에는 과도함
- 초기부터 PostgreSQL 강제: MVP 속도 저하
- 지나친 상태관리 혼합: Query와 Zustand 경계가 흐려짐

## 구현 메모

- shadcn/ui는 block을 그대로 쓰지 말고 chat product에 맞게 수정한다
- sidebar는 `SidebarProvider` 전제로 설계한다
- markdown/code rendering은 초기에 구조를 고정해 후속 변경 비용을 줄인다
