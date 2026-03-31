# Milestones

## v0.1-alpha — Initial Foundation (Phase 2-3)

**Shipped:** 2026-03-31
**Phases:** 2 | **Plans:** 6 | **Tasks:** ~12
**Timeline:** 4일 (2026-03-27 → 2026-03-31)

### Accomplishments

1. IndexedDB 영속성 — Dexie liveQuery reactive hooks와 Zustand UI store로 대화/설정 영구 저장
2. ChatGPT 스타일 레이아웃 — 반응형 사이드바 (260px) + 모바일 오버레이 토글
3. HomePage + ChatLayout 통합 — IndexedDB 연결된 전체 채팅 UI
4. 테마 시스템 — Zustand persist + useTheme hook + system theme detection
5. 사이드바 대화 관리 — 새 대화, 정렬, 편집, 삭제, 테마 토글
6. 빈 상태 UI — MessageSquare 아이콘 + 자동 제목 생성 (40자, Markdown stripping)

### Technical Notes

- Dexie liveQuery는 useState/useEffect 패턴 사용 (useSyncExternalStore 비동기 문제)
- Phase 1 의존성 누락되어 Phase 2 실행 중 자체 생성
- TypeScript 6 + Vite 타입 문제 자동 해결

### Known Gaps

- Phase 1 (Foundation) 미완료 — API 키, 모델 선택, 채팅 기능은 Phase 1에서 구현 필요
- v1.0 마일스톤에서 Phase 1과 통합 필요

---

*Last updated: 2026-03-31*
