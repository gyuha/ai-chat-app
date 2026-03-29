# Phase 03: 채팅 핵심 - 검증 문서

**작성일:** 2026-03-29
**상태:** 검증 준비 완료

## 검증 개요

Phase 03(채팅 핵심)의 모든 계획(03-01 ~ 03-04)이 완료된 후, 이 문서의 검증 기준을 사용하여 기능이 올바르게 구현되었는지 확인한다.

## 검증 방법

1. **수동 검증:** 각 검증 항목의 명령어를 실행하고 결과를 확인
2. **자동 검증:** 테스트 스크립트 실행 (추후 작성 예정)
3. **사용자 시나리오:** 정의된 사용자 시나리오를 수행하며 기능 확인

## 검증 기준

### WAVE 1: 백엔드 채팅 기초 (03-01)

#### 기능적 요구사항

| ID   | 요구사항                                                  | 검증 방법                                                                      | 예상 결과                                          |
|------|-----------------------------------------------------------|--------------------------------------------------------------------------------|---------------------------------------------------|
| BACK-01 | 백엔드가 OpenRouter API를 프록시한다                     | `GET /api/openrouter/models` 호출                                              | 사용 가능한 모델 목록 반환                        |
| BACK-02 | 서버에서 사용 가능 모델 allowlist를 관리한다              | `ALLOWED_MODELS` 환경변수 확인                                                 | 쉼표로 구분된 모델 ID 목록                        |
| CONV-01 | 사용자는 새 대화를 생성할 수 있다                         | `POST /api/chats`                                                              | 201 Created + Chat 객체                           |
| CONV-02 | 사용자는 사이드바에서 대화 목록을 최근 순으로 조회할 수 있다 | `GET /api/chats`                                                                | 200 OK + 최신순 Chat 배열                         |
| CONV-03 | 사용자는 대화를 삭제할 수 있다                            | `DELETE /api/chats/:id`                                                        | 200 OK + 삭제 성공 메시지                         |

#### 기술적 요구사항

| 항목          | 검증 방법                                    | 예상 결과                                    |
|---------------|----------------------------------------------|----------------------------------------------|
| Prisma 마이그레이션 | `cd backend && npx prisma migrate status` | Migration `add_message_status`이 applied 상태 |
| ChatModule 등록    | `backend/src/app.module.ts` 확인          | ChatModule이 imports에 포함                   |
| OpenRouterModule 등록 | `backend/src/app.module.ts` 확인      | OpenRouterModule가 imports에 포함             |
| JWT Guard 보호     | 인증 없이 `/api/chats` 요청             | 401 Unauthorized 반환                        |
| OpenAI SDK 설치    | `cd backend && pnpm list openai`         | openai@4.77.3이 설치됨                        |
| 환경변수 설정      | `backend/.env.example` 확인              | OPENROUTER_API_KEY, ALLOWED_MODELS 포함       |

#### 검증 명령어

```bash
# 1. 백엔드 서버 시작
cd backend && pnpm dev

# 2. Prisma 마이그레이션 확인
npx prisma migrate status

# 3. API 테스트 (access token 필요)
# 먼저 로그인하여 토큰 획득:
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.accessToken')

# 모델 목록 조회
curl http://localhost:3000/api/openrouter/models \
  -H "Authorization: Bearer $TOKEN"

# 대화 생성
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"systemPrompt":"You are a helpful assistant"}'

# 대화 목록 조회
curl http://localhost:3000/api/chats \
  -H "Authorization: Bearer $TOKEN"

# 대화 삭제 (CHAT_ID를 위에서 생성된 ID로 교체)
curl -X DELETE http://localhost:3000/api/chats/{CHAT_ID} \
  -H "Authorization: Bearer $TOKEN"
```

---

### WAVE 2: 스트리밍 메시징 (03-02)

#### 기능적 요구사항

| ID   | 요구사항                                                  | 검증 방법                                                            | 예상 결과                                    |
|------|-----------------------------------------------------------|----------------------------------------------------------------------|----------------------------------------------|
| CHAT-01 | 사용자는 메시지를 전송하고 SSE 기반 토큰 단위 스트리밍 응답을 받을 수 있다 | `POST /api/chats/:id/messages` + SSE 응답 확인                     | text/event-stream + 청크 단위 전송           |
| BACK-05 | SSE/chunked streaming으로 토큰 단위 응답을 전달한다      | curl -N으로 스트리밍 응답 확인                                      | data: {"content":"..."} 형식의 청크 전송     |

#### 기술적 요구사항

| 항목                | 검증 방법                                    | 예상 결과                                          |
|---------------------|----------------------------------------------|----------------------------------------------------|
| MessageService 생성  | `backend/src/chat/message.service.ts` 확인 | 파일 존재                                          |
| 스트리밍 엔드포인트  | `POST /api/chats/:id/messages` 호출       | SSE 응답 반환                                      |
| 페이지네이션 지원    | `GET /api/chats/:id/messages?cursor=&limit=` | cursor, limit 파라미터 동작                        |
| 프론트엔드 스트리밍  | `frontend/src/lib/api/streaming.ts` 확인   | fetch + ReadableStream 구현                       |
| SSE 파서            | streaming.ts의 파싱 로직 확인              | data: 접두사, [DONE] 마커 처리                   |

#### 검증 명령어

```bash
# 1. 스트리밍 엔드포인트 테스트
curl -N -X POST http://localhost:3000/api/chats/{CHAT_ID}/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content":"Hello, how are you?"}'

# 예상 응답:
# data: {"content":"Hello"}
# data: {"content":"!"}
# data: {"content":" I"}
# data: {"content":"'m"}
# ...
# data: [DONE]

# 2. 메시지 조회
curl http://localhost:3000/api/chats/{CHAT_ID}/messages \
  -H "Authorization: Bearer $TOKEN"

# 3. 페이지네이션 테스트
curl "http://localhost:3000/api/chats/{CHAT_ID}/messages?limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

#### 검증 기준

1. **스트리밍 응답 형식**
   - `Content-Type: text/event-stream` 헤더 포함
   - 각 청크가 `data: {"content":"..."}` 형식
   - 완료 시 `data: [DONE]` 전송

2. **AbortController 동작**
   - 클라이언트 연결 해제 시 백엔드 요청 중단
   - 메시지 상태가 `stopped`로 업데이트

3. **메시지 저장**
   - 사용자 메시지 즉시 DB 저장
   - AI 메시지 `streaming` 상태로 생성
   - 완료 후 `completed` 상태로 업데이트

---

### WAVE 3: 프론트엔드 채팅 UI (03-03)

#### 기능적 요구사항

| ID   | 요구사항                                                  | 검증 방법                                    | 예상 결과                                          |
|------|-----------------------------------------------------------|----------------------------------------------|---------------------------------------------------|
| CHAT-01 | 메시지 전송 및 SSE 스트리밍 응답                         | UI에서 메시지 전송                            | 토큰 단위 실시간 렌더링                           |
| CHAT-02 | Stop generating 기능                                    | 스트리밍 중 "Stop generating" 클릭           | 즉시 중단                                         |
| CHAT-03 | Regenerate 기능                                          | "Regenerate" 버튼 클릭                       | 마지막 응답 재생성                               |
| CONV-01 | 새 대화 생성                                             | "New Chat" 버튼 클릭                         | 새 대화 생성 및 라우팅                            |
| CONV-02 | 대화 목록 조회                                           | 사이드바 확인                                | 최신순 목록 표시                                 |
| CONV-03 | 대화 삭제                                                | 사이드바에서 × 버튼 클릭                     | 확인 다이얼로그 후 삭제                          |

#### 기술적 요구사항

| 항목                    | 검증 방법                                    | 예상 결과                                    |
|-------------------------|----------------------------------------------|----------------------------------------------|
| chatStore 생성          | `frontend/src/stores/chat.ts` 확인         | 파일 존재                                    |
| chatListStore 생성      | `frontend/src/stores/chatList.ts` 확인     | 파일 존재                                    |
| ChatLayout 컴포넌트     | `frontend/src/components/chat/ChatLayout.tsx` 확인 | 파일 존재                            |
| ChatSidebar 컴포넌트    | `frontend/src/components/chat/ChatSidebar.tsx` 확인 | 파일 존재                           |
| ChatMain 컴포넌트       | `frontend/src/components/chat/ChatMain.tsx` 확인 | 파일 존재                              |
| MessageItem 컴포넌트    | `frontend/src/components/chat/MessageItem.tsx` 확인 | 파일 존재                           |
| ChatInput 컴포넌트      | `frontend/src/components/chat/ChatInput.tsx` 확인 | 파일 존재                            |
| /chat/:id 라우트        | 브라우저에서 `/chat/{id}` 접속              | ChatLayout + ChatMain 렌더링                |

#### 검증 명령어

```bash
# 1. 프론트엔드 개발 서버 시작
cd frontend && pnpm dev

# 2. 브라우저에서 http://localhost:5173 접속

# 3. 다음 기능 테스트:
# - 새 대화 생성 버튼 클릭
# - 메시지 전송 (Enter 키)
# - 스트리밍 중단 (Stop generating 버튼)
# - 메시지 재생성 (Regenerate 버튼)
# - 대화 삭제 (사이드바에서 × 버튼)
# - 사이드바에서 다른 대화 선택

# 4. 빌드 테스트
cd frontend && pnpm build
```

#### 검증 기준

1. **UI 레이아웃**
   - 사이드바 너비: 260px
   - 사이드바 위치: 좌측 고정
   - 메인 영역: flex-1

2. **메시지 표시**
   - 사용자 메시지: 우측 정렬, 파란색 배경
   - AI 메시지: 좌측 정렬, 회색 배경
   - 스트리밍 중: 커서 깜빡임

3. **상호작용**
   - Enter: 메시지 전송
   - Shift+Enter: 줄바꿈
   - Stop generating: 스트리밍 중단
   - Regenerate: 마지막 응답 재생성

4. **상태 관리**
   - 페이지 새로고침 후 대화 목록 유지
   - 스트리밍 상태 실시간 업데이트
   - 에러 메시지 표시

---

### WAVE 4: 고급 기능 (03-04)

#### 기능적 요구사항

| ID   | 요구사항                                                  | 검증 방법                                    | 예상 결과                                    |
|------|-----------------------------------------------------------|----------------------------------------------|----------------------------------------------|
| CHAT-04 | 대화별 시스템 프롬프트 설정                              | ChatSettings에서 프롬프트 입력 및 저장       | 다음 메시지부터 적용                         |
| CONV-04 | 대화 제목 자동 생성                                      | 첫 메시지 전송                               | 5-10초 후 제목 변경                         |
| BACK-03 | Rate limit 에러 처리                                     | 429 에러 발생 시                             | 사용자 친화적 메시지 + 재시도 버튼           |
| BACK-06 | 에러 메시지 사용자 친화적 변환                           | 모든 API 에러 확인                           | 한글 에러 메시지                            |

#### 기술적 요구사항

| 항목                        | 검증 방법                                    | 예상 결과                                    |
|-----------------------------|----------------------------------------------|----------------------------------------------|
| generateTitleAsync          | `backend/src/chat/chat.service.ts` 확인    | 비동기 제목 생성 메서드 존재                 |
| ChatSettings 컴포넌트       | `frontend/src/components/chat/ChatSettings.tsx` 확인 | 파일 존재                            |
| Rate Limit 처리             | 429 에러 시 응답 확인                       | 사용자 친화적 메시지                         |
| AllExceptionsFilter         | `backend/src/common/filters/all-exceptions.filter.ts` 확인 | 파일 존재                     |

#### 검증 명령어

```bash
# 1. 제목 자동 생성 테스트
# - 새 대화 생성
# - 첫 메시지 전송
# - 5-10초 대기 후 사이드바에서 제목 변경 확인

# 2. 시스템 프롬프트 테스트
# - ChatSettings 열기
# - 프롬프트 입력: "You are a helpful assistant."
# - 저장 후 메시지 전송
# - AI 응답이 프롬프트를 반영하는지 확인

# 3. Rate Limit 에러 테스트 (개발 환경에서 시뮬레이션)
# - 백엔드에서 일부러 429 에러 반환 코드 추가
# - 또는 짧은 시간 동안 여러 메시지 전송
# - 재시도 버튼 표시 확인

# 4. 에러 처리 테스트
# - 네트워크 연결 해제
# - 메시지 전송 시도
# - 에러 메시지 확인 (한글)
```

#### 검증 기준

1. **제목 자동 생성**
   - 첫 메시지 후 5-10초 내 제목 생성
   - 제목 길이: 5단어 이내
   - 실패 시 "New Chat" 유지

2. **시스템 프롬프트**
   - 2000자 제한
   - 저장 후 즉시 적용

3. **Rate Limit 처리**
   - 429 에러 시 한글 메시지
   - Retry-After 헤더 처리
   - 재시도 버튼 작동

4. **에러 메시지**
   - 모든 에러가 한글로 표시
   - 일관된 형식 ({ message: string })

---

## 종합 검증 시나리오

### 시나리오 1: 새 대화 생성 및 메시지 전송

1. 사용자가 로그인한다
2. "New Chat" 버튼을 클릭한다
3. 시스템 프롬프트를 설정한다 (선택)
4. 첫 메시지를 전송한다
5. 5-10초 후 대화 제목이 자동 생성된다
6. AI 응답이 스트리밍으로 표시된다

**예상 결과:**
- 새 대화가 생성되고 `/chat/{id}`로 라우팅됨
- 메시지가 DB에 저장됨
- 스트리밍 응답이 토큰 단위로 표시됨
- 제목이 자동 생성됨

### 시나리오 2: Stop Generating

1. 메시지를 전송한다
2. AI 응답 스트리밍이 시작된다
3. "Stop generating" 버튼을 클릭한다

**예상 결과:**
- 스트리밍이 즉시 중단됨
- 메시지 상태가 `stopped`로 저장됨
- 불완전한 응답이 표시됨

### 시나리오 3: Regenerate

1. 메시지를 전송하고 완전한 응답을 받는다
2. "Regenerate" 버튼을 클릭한다

**예상 결과:**
- 마지막 AI 메시지가 삭제됨
- 동일한 사용자 메시지로 재전송됨
- 새로운 응답이 스트리밍됨

### 시나리오 4: 대화 관리

1. 사이드바에서 대화 목록을 확인한다
2. 다른 대화를 클릭하여 전환한다
3. × 버튼을 클릭하여 대화를 삭제한다

**예상 결과:**
- 대화 목록이 최신순으로 표시됨
- 대화 전환 시 메시지가 로드됨
- 확인 다이얼로그 후 대화 삭제됨

### 시나리오 5: Rate Limit 에러

1. OpenRouter Rate Limit에 도달하도록 여러 메시지를 빠르게 전송한다
2. 429 에러가 발생한다

**예상 결과:**
- "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." 메시지 표시
- Retry-After가 있으면 대기 시간 표시
- 재시도 버튼 표시

---

## 검증 체크리스트

### 백엔드

- [ ] Prisma 마이그레이션 완료
- [ ] ChatModule 생성 및 등록
- [ ] OpenRouterModule 생성 및 등록
- [ ] MessageService 생성
- [ ] 스트리밍 엔드포인트 구현
- [ ] 페이지네이션 지원
- [ ] 제목 자동 생성
- [ ] Rate Limit 에러 처리
- [ ] 전역 Exception Filter

### 프론트엔드

- [ ] chatStore 생성
- [ ] chatListStore 생성
- [ ] ChatLayout 컴포넌트
- [ ] ChatSidebar 컴포넌트
- [ ] ChatMain 컴포넌트
- [ ] MessageItem 컴포넌트
- [ ] ChatInput 컴포넌트
- [ ] ChatSettings 컴포넌트
- [ ] 스트리밍 클라이언트 구현
- [ ] /chat/:id 라우트

### 기능 테스트

- [ ] 메시지 전송 및 스트리밍 수신
- [ ] Stop generating
- [ ] Regenerate
- [ ] 새 대화 생성
- [ ] 대화 목록 조회
- [ ] 대화 삭제
- [ ] 제목 자동 생성
- [ ] 시스템 프롬프트 설정
- [ ] Rate Limit 에러 처리

---

## 검증 완료 조건

Phase 03이 완료로 간주되려면 다음 조건이 모두 충족되어야 한다:

1. **모든 필수 요구사항 충족**
   - CHAT-01, CHAT-02, CHAT-03, CHAT-04
   - CONV-01, CONV-02, CONV-03, CONV-04
   - BACK-01, BACK-02, BACK-03, BACK-05, BACK-06

2. **모든 기술적 요구사항 충족**
   - 각 Wave의 기술적 요구사항 체크리스트 완료

3. **종합 검증 시나리오 통과**
   - 5개 시나리오 모두 성공

4. **빌드 성공**
   - 백엔드: `pnpm build` 성공
   - 프론트엔드: `pnpm build` 성공

5. **치명적 버그 없음**
   - 스트리밍 연결 누수 없음
   - 메시지 상태 불일치 없음
   - JWT 토큰 만료 후 스트리밍 중단 없음

---

**다음 단계:** 검증 완료 후 `/gsd:execute-phase 3`로 다음 Phase로 진행
