# 리서치: Architecture

## 주요 컴포넌트

- Web App
  - App Shell
  - Chat View
  - Composer
  - Settings Surface
- API Server
  - Chat Module
  - Models Module
  - Streaming Module
  - Storage Adapter
  - OpenRouter Client

## 데이터 흐름

1. 사용자가 composer에서 메시지 전송
2. web app이 server의 `/messages/stream` 호출
3. server가 validation 후 OpenRouter로 요청 중계
4. server가 upstream chunk를 정규화된 SSE 이벤트로 변환
5. web app이 query cache를 patch하며 메시지 렌더링
6. 완료 시 server가 저장소에 대화 상태 반영

## 경계 정의

- Web App은 UI, 로컬 UI 상태, 서버 응답 렌더링만 담당
- Server는 보안, 모델 정책, 저장소, 에러 변환, 제목 생성 담당
- contracts package는 응답 스키마와 스트림 이벤트 타입만 담당

## 권장 빌드 순서

1. 모노레포/공통 설정
2. NestJS health/models/chats skeleton
3. React shell/sidebar/composer
4. 스트리밍 연결
5. 대화 관리와 제목 자동 생성
6. 에러/모바일/접근성 polish
