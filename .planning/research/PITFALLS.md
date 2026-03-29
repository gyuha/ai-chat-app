# 리서치: Pitfalls

## Pitfall 1: 브라우저에서 키를 다루는 구조

- 경고 신호: web env에 OpenRouter key를 넣으려는 시도
- 예방: server proxy 강제, 프론트는 내부 API만 호출
- 대응 phase: Phase 1

## Pitfall 2: 스트리밍을 일반 loading spinner로 대체

- 경고 신호: 전체 응답 완료 후 한 번에 렌더링
- 예방: 초기에 stream event contract를 고정
- 대응 phase: Phase 3

## Pitfall 3: Query와 Zustand 책임 혼합

- 경고 신호: 메시지 목록 전체를 Zustand에 저장
- 예방: 서버 데이터는 Query, UI 플래그만 Zustand
- 대응 phase: Phase 2

## Pitfall 4: 모바일에서 코드/표가 화면을 깨뜨림

- 경고 신호: 메시지 영역 가로 스크롤 발생
- 예방: content wrapper와 overflow 정책을 컴포넌트 단위로 정의
- 대응 phase: Phase 5

## Pitfall 5: regenerate와 stop이 상태 꼬임을 만든다

- 경고 신호: 중단 후 버튼 상태가 복구되지 않음
- 예방: streaming lifecycle을 명시적 상태 머신으로 다룸
- 대응 phase: Phase 3
