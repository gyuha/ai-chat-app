# 03-02 실행 요약

## 계획 개요

**목표:** SSE 기반 실시간 스트리밍으로 메시지를 전송하고, Stop/Regenerate 기능을 위한 백엔드 API를 구현한다.

## 실행 결과

### 완료된 작업

#### Task 1: MessageService 생성 ✅
- backend/src/chat/message.service.ts 생성
- Prisma 스키마에 Message.status 필드 추가 (기본값: completed)
- 마이그레이션 20260329142600_add_message_status 적용
- ChatModule 생성 및 MessageService 등록
- 구현된 메서드:
  - createMessage: 메시지 생성
  - getMessages: 페이지네이션 지원 메시지 목록 조회
  - updateMessageStatus: 메시지 상태 업데이트
  - updateMessageContent: 메시지 내용 업데이트
  - getLastAssistantMessage: 마지막 AI 메시지 조회
  - deleteMessage: 메시지 삭제

#### Task 2: 스트리밍 메시지 엔드포인트 구현 ✅
- OpenRouterService 생성 (OpenAI SDK 기반)
- ChatController에 POST /api/chats/:id/messages 엔드포인트 구현
- SSE 기반 토큰 단위 스트리밍 응답
- AbortController로 클라이언트 연결 해제 시 요청 중단
- 메시지 상태 관리 (streaming, completed, stopped, error)
- CreateMessageDto 생성

#### Task 3: 메시지 조회 엔드포인트 구현 ✅
- GET /api/chats/:id/messages 엔드포인트 구현
- cursor 기반 페이지네이션 지원
- limit 파라미터로 개수 제한 (기본값 50, 최대 100)
- Chat CRUD 엔드포인트 구현:
  - POST /api/chats: 대화 생성
  - GET /api/chats: 대화 목록 조회
  - GET /api/chats/:id: 대화 상세 조회
  - DELETE /api/chats/:id: 대화 삭제
  - PUT /api/chats/:id: 대화 업데이트

#### Task 3.5: 프론트엔드 타입 정의 확정 ✅
- frontend/src/lib/api/types.ts에 타입 정의 추가:
  - Message: id, content, role, status, createdAt
  - Chat: id, title, systemPrompt, createdAt, updatedAt
  - StreamOptions: onChunk, onComplete, onError, signal

#### Task 4: 프론트엔드 스트리밍 클라이언트 구현 ✅
- frontend/src/lib/api/streaming.ts 생성
- fetch + ReadableStream으로 스트리밍 처리
- SSE 파서: data: 접두사와 [DONE] 마커 처리
- AbortController 반환으로 Stop 기능 지원
- 에러 처리: 네트워크 에러, 파싱 에러, AbortError
- frontend/src/lib/api/chat.ts 생성 (Chat API 클라이언트)
- frontend/src/lib/api/message.ts 생성 (Message API 클라이언트)

## 검증 상태

### 기능적 요구사항
- [x] CHAT-01: 사용자는 메시지를 전송하고 SSE 기반 토큰 단위 스트리밍 응답을 받을 수 있다
- [x] BACK-05: SSE/chunked streaming으로 토큰 단위 응답을 전달한다

### 기술적 요구사항
- [x] MessageService가 생성되고 ChatModule에 등록됨
- [x] POST /api/chats/:id/messages가 SSE 스트리밍을 반환함
- [x] GET /api/chats/:id/messages가 페이지네이션을 지원함
- [x] frontend/src/lib/api/types.ts에 Message, Chat, StreamOptions 타입이 정의됨
- [x] 프론트엔드 streaming.ts가 fetch + ReadableStream으로 스트리밍을 처리함
- [x] SSE 파서가 data: 접두사와 [DONE] 마커를 처리함

## 주요 결정 사항

1. **OpenRouterService 독립 모듈**: OpenRouter API 통신을 별도 모듈로 분리하여 재사용성 확보
2. **AbortController 패턴**: 클라이언트 연결 해제 시 백엔드 요청 중단으로 리소스 누수 방지
3. **메시지 상태 플래그**: streaming, completed, stopped, error로 상태 추적하여 UI에서 적절히 처리
4. **SSE 형식 채택**: text/event-stream 헤더와 data: 프리픽스로 표준 SSE 프로토콜 따름

## 기타 관찰 사항

- 코드 리팩토링 도중 자동으로 일부 파일이 수정됨 (린터/포매터)
- ChatService에 generateTitleAsync 메서드가 자동으로 추가됨 (다른 작업에서)
- OpenRouterController가 자동으로 생성됨 (다른 작업에서)

## 다음 단계

03-03 계획 실행: 스트리밍 UI 구현

---

**실행 시간:** 약 5분
**커밋:** 4개 (MessageService 생성, 스트리밍 엔드포인트, 타입 정의, 프론트엔드 클라이언트)
