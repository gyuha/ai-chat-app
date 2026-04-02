# Roadmap: AI Chat App

## Overview

AI 채팅 웹 애플리케이션 개발 로드맵. OpenRouter 무료 API를利用한 ChatGPT 스타일 인터페이스. Phase 1에서 프로젝트 기반 구축, Phase 2에서 핵심 채팅 기능 구현, Phase 3에서 데이터 영속성을 추가.

## Phases

- [x] **Phase 1: Foundation** - API 키 관리, 대화방 CRUD, 레이아웃 (completed 2026-04-02)
- [ ] **Phase 2: Core Chat Loop** - 메시지 입력, AI 스트리밍 응답
- [ ] **Phase 3: Persistence** - localStorage 저장 및 복원

## Phase Details

### Phase 1: Foundation
**Goal**: 사용자 환경설정, 대화방 관리, 기본 레이아웃 완성
**Depends on**: Nothing (first phase)
**Requirements**: API-01, API-02, API-03, API-04, CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, MODEL-01, MODEL-02
**Success Criteria** (what must be TRUE):
  1. 사용자가 API 키 입력 필드에 OpenRouter API 키를 입력 가능
  2. 사용자가 "연결" 버튼으로 API 키 유효성 검사 가능
  3. API 키 유효하지 않을 때 오류 메시지 표시
  4. 사용자가 사이드바에서 "새 대화" 버튼으로 새 대화방 생성 가능
  5. 사용자가 사이드바에서 기존 대화방 클릭하여 선택 가능
  6. 사용자가 사이드바에서 대화방 삭제 가능
  7. 대화방 이름이 첫 번째 사용자 메시지 내용으로 자동 설정
  8. 선택된 대화방의 메시지 목록이 메인 영역에 표시
  9. 사용자가 오른쪽 상단 셀렉트 박스에서 무료 모델 선택 가능
  10. 선택된 모델이 localStorage에 저장되어 유지
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — 프로젝트 스캐폴딩 (Vite + React + TypeScript + Tailwind)
- [x] 01-02-PLAN.md — ChatProvider (Context + Reducer) 및 레이아웃 구조
- [x] 01-03-PLAN.md — API 키 입력/검증, 대화방 CRUD, 모델 선택 기능

### Phase 2: Core Chat Loop
**Goal**: 메시지 입력 및 AI 스트리밍 응답 실시간 표시
**Depends on**: Phase 1
**Requirements**: MSG-01, MSG-02, MSG-03, MSG-04, MSG-05, MSG-06, MSG-07
**Success Criteria** (what must be TRUE):
  1. 사용자가 텍스트 입력창에 메시지 작성 가능
  2. Enter로 메시지 전송 (Shift+Enter는 줄바꿈)
  3. 빈 메시지는 전송 불가 (입력 방지)
  4. AI 응답이 실시간 스트리밍으로 토큰 단위 표시
  5. AI 응답 완료 전 취소 버튼으로 중단 가능
  6. 메시지 전송 중 입력창 비활성화 (중복 전송 방지)
  7. 메시지 영역은 자동 스크롤로 최신 메시지 위치
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md (Wave 1) — 메시지 입력 컴포넌트 및 전송 로직
- [x] 02-02-PLAN.md (Wave 2) — OpenRouter API 연동 및 스트리밍 응답 처리
- [x] 02-03-PLAN.md (Wave 3) — 취소 기능, 입력 잠금, 자동 스크롤

### Phase 3: Persistence
**Goal**: localStorage를 통한 데이터 영속성
**Depends on**: Phase 2
**Requirements**: STORE-01, STORE-02, STORE-03
**Success Criteria** (what must be TRUE):
  1. 모든 대화방 데이터가 localStorage에 자동 저장
  2. 페이지 새로고침 후 대화 데이터 복원
  3. localStorage 용량 초과 시 적절한 오류 처리
**Plans**: 1 plan

Plans:
- [x] 03-01-PLAN.md — localStorage 저장/복원 로직 및 오류 처리

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete   | 2026-04-02 |
| 2. Core Chat Loop | 0/3 | Not started | - |
| 3. Persistence | 1/1 | Not started | - |
