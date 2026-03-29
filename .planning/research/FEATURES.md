# 리서치: Features

## Table Stakes

- 새 채팅 시작
- 대화 목록 조회와 삭제
- 모델 선택
- 스트리밍 응답
- 중단(stop generating)
- regenerate
- markdown 렌더링
- 코드 블록 복사
- 모바일 대응
- 명확한 빈 상태/에러 상태

## Differentiators

- 무료 모델 allowlist 운영
- 첫 화면 완성도 높은 empty state
- 코드와 긴 응답 가독성 최적화
- 향후 로그인/DB 확장에 유리한 구조

## Anti-Features

- 초기부터 로그인/권한 체계
- 과도한 개인화 옵션
- 복잡한 프롬프트 마켓/템플릿 시스템
- 멀티모달 업로드

## 복잡도 메모

- 높음: 스트리밍, regenerate, 제목 자동 생성, 모바일 스크롤 UX
- 중간: 설정 UI, 모델 allowlist, 파일 저장소 추상화
- 낮음: 새 채팅, 삭제, 모델 표시, 코드 복사
