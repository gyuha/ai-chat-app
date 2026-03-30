# Domain Pitfalls

**Domain:** OpenRouter API 활용 웹 채팅 앱 (SPA, 백엔드 없는 구조)
**Researched:** 2026-03-30
**Confidence:** MEDIUM

---

## Critical Pitfalls

### Pitfall 1: Streaming 응답 에러 무시

**무슨 문제가 발생하나:** AI 응답 스트리밍 중 에러가 발생해도 개발자들이 간과하기 쉬움. 스트리밍 중 에러는 HTTP 응답이 아닌 SSE 이벤트 형태로 전달됨.

**왜 발생하는가:** 일반 HTTP 에러는 `response.status`로 확인하지만, 스트리밍 중 에러는 `finish_reason: "error"`와 함께 데이터 청크 안에 포함됨. 개발자들은 이를 놓치고 정상적인 응답처럼 처리.

**的后果:** 에러 메시지가 사용자에게 잘못 표시되거나, 토큰 만료·길이 초과 등의 상황이 정상 응답으로 오인될 수 있음.

**예방 방법:**
```typescript
// SSE 스트리밍 파싱 시 에러 체크
for await (const chunk of stream) {
  const data = JSON.parse(chunk);
  if (data.finish_reason === "error") {
    // 에러를 별도로 처리
    showErrorToast(data.error?.message);
    break;
  }
  if (data.finish_reason === "length") {
    // 토큰 초과 상황 - 정상적 처리
  }
}
```

**탐지 방법:** `finish_reason`이 "error"인 청크가 있으면 로깅. 응답이 완료되지 않고 끊긴 경우 조사.

---

### Pitfall 2: IndexedDB 동시 트랜잭션 충돌

**무슨 문제가 발생하나:** 여러 요청이 동시에 같은 IndexedDB 키에 접근할 때 트랜잭션 충돌 발생. 특히 대화 저장 중에 새 요청이 들어오면 데이터가 유실되거나 불일치 발생.

**왜 발생하는가:** Dexie.js의 기본 동작은 읽기/쓰기 동시성 제어가 제한적. 스트리밍 응답이 도착할 때마다 IndexedDB에 저장하려 하면 동시 쓰기 발생.

**的后果:** 대화 내용이 누락되거나, 마지막 응답만 저장되고 이전 메시지가 사라짐.

**예방 방법:**
```typescript
// Dexie.js에서 버전 관리 및 트랜잭션 명시적 사용
const db = new Dexie('ChatDB');
db.version(1).stores({
  conversations: '++id, updatedAt',
  messages: '++id, conversationId, createdAt'
});

// 대량 쓰기 시 명시적 트랜잭션
await db.transaction('rw', db.messages, async () => {
  for (const msg of messages) {
    await db.messages.add(msg);
  }
});
```

**탐지 방법:** IndexedDB 트랜잭션 에러 (`TransactionInactiveError`) 발생 시 로깅. 데이터 불일치 시 디버깅.

---

### Pitfall 3: API 키 클라이언트 측 노출

**무슨 문제가 발생하나:** 사용자가 입력한 OpenRouter API 키가 IndexedDB에 저장되며, XSS 취약점이 있으면 탈취 가능.

**왜 발생하는가:** 백엔드 없는 순수 프론트엔드架构에서 API 키를 서버 환경 변수에 저장할 수 없음. 클라이언트 스토리지에 저장할 수밖에 없는 구조.

**的后果:** 사용자의 API 키가 외부에 유출되면 비정상적 호출이나 비용 발생 가능.

**예방 방법:**
- API 키 입력 필드에 `type="password"` 사용
- IndexedDB 저장 시 키를 간단히 암호화 (예: AES-GCM, 키는 브라우저 메모리에만 유지)
- CSP(Content Security Policy) 헤더 설정
- XSS 방지를 위해 모든 사용자 입력 이스케이프 처리

**현재 프로젝트 상태:** Out of Scope로 등록되어 있음.初期版에서는 API 키를 IndexedDB에 평문 저장. 장기적으로 개선 필요.

---

### Pitfall 4: 응답 스트림 읽기 중복 방지

**무슨 문제가 발생하나:** Fetch 응답의 `body`는 `ReadableStream`이며, 한 번 읽으면 다시 읽을 수 없음 (`Locked`/`Disturbed` 상태). 응답을 여러 번 처리하려 하면 오류 발생.

**왜 발생하는가:** 스트리밍 응답을 UI에 표시하면서 동시에 IndexedDB에 저장하려 할 때, stream reader가 이미 사용된 상태에서 재사용 시도.

**的后果:** `TypeError: Body has already been consumed.` 또는 스트리밍 응답이 전혀 표시되지 않음.

**예방 방법:**
```typescript
const response = await fetch(url, { signal: abortController.signal });

// 복제본 생성 (여러 곳에서 읽기 위해)
const responseForDB = response.clone();

// 하나는 UI 스트리밍에 사용
const reader = response.body.getReader();
// ...

// 다른 하나는 DB 저장이 필요하면 별도 처리
// ...
```

**탐지 방법:** "Body has already been consumed" 에러 발생 시 응답 처리 로직 점검.

---

## Moderate Pitfalls

### Pitfall 5: 비율 제한(Rate Limit) 미처리

**무슨 문제가 발생하나:** OpenRouter 무료 모델은 분당 50회 요청 제한이 있음. 초과 시 429 에러 발생하지만 재시도 로직이 없어 사용자가 그냥 실패로 인식.

**왜 발생하는가:** 429 에러 발생 시 지수 백오프(exponential backoff)로 재시도해야 하지만, 단순 재시도나 사용자에게 즉시 오류 표시.

**的后果:** 채팅이 갑자기 실패하는 것처럼 보임. 일시적 비율 제한이면 자동 복구되지 않음.

**예방 방법:**
- 429 응답 시 `Retry-After` 헤더 확인
- 지수 백오프 구현 (1초, 2초, 4초, 8초...)
- 최대 재시도 횟수 설정 (예: 3회)
- 사용자에게 현재 비율 제한 중임을 안내

---

### Pitfall 6: 토큰 길이 초과를 정상 응답으로 오해

**무슨 문제가 발생하나:** OpenRouter에서 `context_length_exceeded`, `max_tokens_exceeded`, `token_limit_exceeded` 에러는 HTTP 200으로 반환되며, `finish_reason: "length"`로 표시됨. 이는 정상 응답처럼 보임.

**왼 발생하는가:** Chat Completions API와 Responses API에서 동작이 다름. 개발자들은 모든 200 응답을 성공으로 처리.

**的后果:** 응답이 잘린 것인데 사용자에게 정상 완료로 표시됨. 대화가 갑자기 끝난 것처럼 보임.

**예방 방법:**
- `finish_reason === "length"` 체크하여 "대화가 최대 길이에 도달했습니다" 안내
- 이전 메시지를 요약하거나 대화를 분리하는 옵션 제공

---

### Pitfall 7: 스트리밍 중 AbortController 시점 잘못

**무슨 문제가 발생하나:** Fetch 완료 후 abort를 호출하면 `AbortError`가 발생함. 사용자가 "새 대화 생성"이나 "응답 취소"를 눌렀을 때时机 잘못.

**왜 발생하는가:** fetch() 완료 후 response.body를 읽는 동안 abort하면 AbortError throw.

**的后果:** 응답이 갑자기 멈추고 콘솔에 에러 표시.

**예방 방법:**
```typescript
// abort는 fetch 호출 전에 설정해야 함
const controller = new AbortController();

// fetch 시작 후 abort
const response = await fetch(url, { signal: controller.signal });

// 취소는 fetch 호출 전 또는 response读完 전에만 가능
controller.abort(); // ❌ fetch 완료 후 호출 시 에러
```

---

### Pitfall 8: 마크다운 렌더링 성능 저하

**무슨 문제가 발생하나:** 긴 스트리밍 응답을 매 청크마다 React-markdown으로 렌더링하면 성능 저하 발생. 특히 코드 블록이 포함된 경우 highlight.js 처리가 무거움.

**왜 발생하는가:** 각 청크마다 전체 markdown을 다시 파싱·렌더링하면 O(n^2) 복잡도 발생.

**的后果:** UI 버벅임, 입력 반응迟滞, 긴 응답에서 특히 심함.

**예방 방법:**
- 스트리밍 텍스트는 일시적으로 plain text로 표시
- 완료 후 한 번만 markdown 렌더링
- 또는 청크 단위로 accumulated text만 렌더링 (debounce 적용)

---

### Pitfall 9: 새 대화 시작 시 기존 스트림 방해

**무슨 문제가 발생하나:** AI가 응답 중일 때 사용자가 새 대화를 시작하면, 이전 스트림이 제대로 취소되지 않거나 IndexedDB 쓰기가 중단됨.

**왜 발생하는가:** AbortController가 여러 개일 때 관리不善. 새 대화 시작 시旧的 AbortController를 취소하지 않으면 백그라운드에서 계속 실행.

**的后果:** 이전 응답이 새 대화 스크립트에 나타남. IndexedDB에 incomplete 데이터 저장.

**예방 방법:**
- 전역 abort controller 관리 (Zustand store에서 관리)
- 새 대화 시작 시 기존 스트림 즉시 취소
- incomplete 응답은 저장하지 않음

---

### Pitfall 10: IndexedDB 버전 관리 실수로 데이터 손실

**무슨 문제가 발생하나:** Dexie 스키마 변경 시 (`version().stores()`) 기존 데이터가 삭제되거나 마이그레이션되지 않음.

**왜 발생하는가:** development 중何度もスキーマ変更して테스트할 때, 이미 데이터가 있는 상태에서 버전이 올라가면 마이그레이션 로직 부재 시 데이터 손실.

**的后果:** 사용자의 대화 히스토리가 사라짐.

**예방 방법:**
```typescript
// 마이그레이션 로직 구현
db.version(2).stores({...}).upgrade(tx => {
  return tx.messages.toCollection().modify(msg => {
    // v1 → v2 마이그레이션
  });
});
```

---

## Minor Pitfalls

### Pitfall 11: 무료 모델 목록 캐싱 미비

**무슨 문제가 발생하나:** OpenRouter 무료 모델 목록을 매번 API로 조회하면 Rate Limit에 도달 가능. 캐싱하지 않으면 앱 시작 시 에러 발생.

**예방 방법:** 모델 목록을 IndexedDB에 캐싱 (예: 1시간 또는 하루 TTL). 앱 시작 시 캐시优先使用, 백그라운드에서 업데이트.

---

### Pitfall 12: CORS preflight 미처리

**무슨 문제가 발생하나:** 브라우저에서 OpenRouter API 호출 시 CORS 문제 발생. OpenRouter가 적절한 CORS 헤더를 반환하지 않으면 개발困惑.

**예방 방법:** OpenRouter API는 기본적으로 CORS 지원함. 커스텀 프록시 사용 시 CORS 설정 필요. 개발 시 브라우저 콘솔의 CORS 에러 확인.

---

### Pitfall 13: 디버그 모드 生产 노출

**무슨 문제가 발생하나:** OpenRouter SDK나 커스텀 구현에 디버그 옵션이 있으면生产에서도 활성화되어 민감한 요청 데이터 노출.

**예방 방법:** `debug: false` 기본값 유지. 개발 환경에서만 활성화.

---

## Phase-Specific Warnings

| Phase | 주제 | 발생할 수 있는 문제 | 완화 방법 |
|-------|------|---------------------|-----------|
| Phase 1 | API 연동 기초 | API 키 검증 로직 부재, 에러 처리 미흡 | 400/401/402/429 모든 에러 코드 처리 |
| Phase 1 | IndexedDB 기반 | 트랜잭션 충돌, 스키마 마이그레이션 누락 | Dexie 버전 관리 및 마이그레이션 로직 |
| Phase 2 | 스트리밍 채팅 | 응답 스트림 중복 읽기, AbortControllerタイミング | response.clone() 사용, abort 시점 관리 |
| Phase 2 | 대화 관리 | 새 대화 시작 시 기존 스트림 방해 | 전역 AbortController 관리 |
| Phase 3 | Markdown 렌더링 | 긴 응답 성능 저하 | 청크 단위 렌더링 또는 완료 후 렌더링 |

---

## Sources

- [OpenRouter Errors and Debugging](https://openrouter.ai/docs/api/reference/errors-and-debugging.mdx) — HIGH confidence (공식 문서)
- [OpenRouter Rate Limits](https://openrouter.ai/docs/api/reference/limits.mdx) — HIGH confidence (공식 문서)
- [MDN: Fetch API Streaming Response Bodies](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#streaming_response_bodies) — HIGH confidence (공식 문서)
- [Dexie.js Documentation](https://dexie.org/docs/) — MEDIUM confidence (공식 문서)