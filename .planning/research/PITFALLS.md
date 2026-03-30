# 도메인 위험 요소 연구

**도메인:** 백엔드 없는 프론트엔드 전용 AI 채팅 앱 (SSE 스트리밍 + IndexedDB + 마크다운 렌더링)
**조사일:** 2026-03-30
**신뢰도:** MEDIUM (검증 도구 제한으로 문서/경험 기반)

---

## Critical Pitfalls

### Pitfall 1: SSE 스트리밍 리소스 누수

**문제 상황:**
AbortController로 중단된 SSE 연결이 정리되지 않아 메모리 누수가 발생하고, 백그라운드에서 계속 토큰을 소비합니다.

**발생 원인:**
- `useEffect` cleanup 함수에서 `controller.abort()` 호출 누락
- 이벤트 리스너(`onmessage`, `onerror`) 제거 안 함
- 컴포넌트 언마운트 후에도 `reader.read()` 계속 실행
- stale closure로 인해 오래된 state 업데이트 시도

**예방 전략:**
```typescript
useEffect(() => {
  const controller = new AbortController();
  const signal = controller.signal;

  fetch(url, { signal })
    .then(response => {
      const reader = response.body?.getReader();
      // reader.read() 루프에서 signal.aborted 체크 필수
    });

  return () => {
    controller.abort();
    // 이벤트 리스너 제거
  };
}, [dependency]);
```

**경고 징후:**
- 개발자 도구 Network 패널에서 "pending" 상태의 요청이 계속 쌓임
- 컴포넌트 언마운트 후에도 메시지가 계속 추가됨
- 메모리 프로파일러에서 detached DOM 노드 증가

**대응 페이즈:**
Phase 1 (기본 채팅 구현) — Stop 버튼 구현 시 반드시 함께 구현

---

### Pitfall 2: IndexedDB 트랜잭션 중첩 deadlock

**문제 상황:**
하나의 트랜잭션 내에서 비동기 작업을 기다리는 동안 트랜잭션이 자동으로 종료되어, 이후 쿼리에서 "TransactionInactiveError" 발생

**발생 원인:**
- Dexie.js 트랜잭션 내부에서 `await` 사용 시 트랜잭션 타임아웃
- 트랜잭션 블록 내에서 외부 API 호출 등 긴 비동기 작업 수행
- 중첩된 트랜잭션에서 서로 다른 순서로 lock 획득 시도

**예방 전략:**
```typescript
// ❌ 잘못된 방식
db.transaction('rw', db.conversations, db.messages, async () => {
  const modelInfo = await fetch('/api/models'); // 트랜잭션 타임아웃!
  await db.messages.add({ content: modelInfo }); // TransactionInactiveError
});

// ✅ 올바른 방식
const modelInfo = await fetch('/api/models');
db.transaction('rw', db.conversations, db.messages, async () => {
  await db.messages.add({ content: modelInfo }); // 트랜잭션 내부는 순수 DB 작업만
});
```

**경고 징후:**
- 콘솔에서 "TransactionInactiveError" 빈번 발생
- 특정 작업 후 메시지가 DB에 저장되지 않음
- 트랜잭션 관련 에러가 랜덤하게 발생 (타이밍 이슈)

**대응 페이즈:**
Phase 1 (데이터 저장 구현) — 첫 DB 작업 구현 시 트랜잭션 패턴 확정

---

### Pitfall 3: Dexie.js 스키마 마이그레이션 무시

**문제 상황:**
개발 중 스키마 변경(`db.version(x).stores()`)을 하고 배포하면, 사용자의 기존 데이터베이스가 새 스키마와 호환되지 않아 앱이 작동하지 않음

**발생 원인:**
- 로컬 개발에서는 `indexedDB.deleteDatabase()`로 해결해서 문제 인식 못 함
- 사용 가능 데이터 마이그레이션 로직 미작성
- 버전 번호를 올리지 않고 스키마만 변경

**예방 전략:**
```typescript
// 스키마 변경 시 항상 버전 증가
db.version(1).stores({
  conversations: 'id, title, modelId, createdAt',
  messages: 'id, conversationId, role, content, createdAt'
});

// 나중에 필드 추가 시
db.version(2).stores({
  conversations: 'id, title, modelId, createdAt, systemPrompt', // systemPrompt 추가
  messages: 'id, conversationId, role, content, createdAt'
}).upgrade(async (tx) => {
  // 기존 데이터 마이그레이션 로직
  await tx.table('conversations').toCollection().modify(conv => {
    conv.systemPrompt = null; // 기본값 설정
  });
});
```

**경고 징후:**
- 프로덕션에서 "앱이 작동하지 않음" 보고 (로컬에선 재현 안 됨)
- "KeyPath 에러" 또는 "Constraint 에러" 발생
- 사용자별로 다른 증상 (사용 기간에 따른 DB 버전 차이)

**대응 페이즈:**
Phase 2 (데이터 관리 기능) — 스키마 변경이 필요한 기능 추가 전

---

### Pitfall 4: 대용량 마크다운 렌더링 프리징

**문제 상황:**
긴 코드 블록이나 대용량 응답에서 rehype-highlight가 메인 스레드를 차단하여 UI가 멈춤

**발생 원인:**
- rehype-highlight가 동기적으로 구문 강조 처리
- 매 렌더링마다 전체 마크다운을 재파싱
- 코드 블록 내부의 긴 텍스트 처리

**예방 전략:**
```typescript
// 1. 메모이제이션
const MemoizedMarkdown = memo(({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeHighlight]}
  >
    {content}
  </ReactMarkdown>
));

// 2. 긴 코드 블록 길이 제한
const MAX_CODE_LENGTH = 10000;
const truncatedContent = content.length > MAX_CODE_LENGTH
  ? content.slice(0, MAX_CODE_LENGTH) + '\n\n...(truncated)'
  : content;

// 3. 점진적 렌더링 (스트리밍 응답의 경우)
// 스트리밍 토큰을 버퍼링했다가 일정 크기마다 렌더링
```

**경고 징후:**
- 긴 응답에서 스크롤이 버벅거림
- 타이핑 중 UI가 멈춤
- 코드 블록 포함 메시지 로딩 시 1초 이상 멈춤

**대응 페이즈:**
Phase 1 (마크다운 렌더링 구현) — 기본 구현 후 성능 테스트

---

### Pitfall 5: OpenRouter 무료 모델 Rate Limit 누락

**문제 상황:**
무료 모델의 제한(약 20req/min, 200req/day)을 고려하지 않아 사용자가 갑자기 "429 Too Many Requests"를 받고 멘탈이 깨짐

**발생 원인:**
- 개발 중에는 빈도가 낮아서 제한에 안 닿음
- 사용자가 연속으로 여러 대화를 생성하면 제한 도달
- 에러 처리가 없어 그냥 "실패"로만 표시

**예방 전략:**
```typescript
// 1. 요청 간격 제한 (throttle)
const lastRequestTime = useRef<number>(0);
const MIN_REQUEST_INTERVAL = 3000; // 3초

const canMakeRequest = () => {
  const now = Date.now();
  if (now - lastRequestTime.current < MIN_REQUEST_INTERVAL) {
    return false;
  }
  lastRequestTime.current = now;
  return true;
};

// 2. 429 에러 처리 및 재시도
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  // 사용자에게 알림 + 자동 재시도 로직
}

// 3. 로컬에서 요청 카운팅 (UI에 표시)
// "오늘 150/200 요청 사용"
```

**경고 징후:**
- 개발 환경에서는 잘 되다가 갑자기 429 에러
- 여러 대화를 빠르게 생성하면 실패
- 에러 메시지가 기술적("429")이라 사용자가 이해 못 함

**대응 페이즈:**
Phase 1 (API 연결) — 첫 API 호출 구현 시 함께 구현

---

### Pitfall 6: Zustand + TanStack Query 상태 중복

**문제 상황:**
Zustand와 TanStack Query에 같은 데이터를 중복 저장하여 불일치 발생

**발생 원인:**
- 클라이언트 상태(Zustand)와 서버 상태(TanStack Query) 경계 불명확
- API 응답을 TanStack Query에 저장하면서 Zustand에도 복사
- 두 상태 간 동기화 로직 누락

**예방 전략:**
```typescript
// ✅ 명확한 역할 분리
// Zustand: 클라이언트 전용 상태 (UI 상태, 임시 데이터)
const useUIStore = create((set) => ({
  isSidebarOpen: true,
  streamingMessage: '', // 스트리밍 중인 메시지 (미완성)
}));

// TanStack Query: 서버 데이터 (DB에 저장된 데이터)
const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => db.conversations.toArray(),
  });
};

// 스트리밍 완료 후 DB 저장 → TanStack Query가 자동 갱신
```

**경고 징후:**
- 새로고침하면 데이터가 사라짐 (Zustand만 사용)
- UI와 DB 데이터가 다름 (동기화 실패)
- 같은 데이터를 위한 두 개의 setState 호출

**대응 페이즈:**
Phase 1 (상태 관리 구축) — 상태 저장소 설계 시 역할 명확히 정의

---

### Pitfall 7: TanStack Router 파일 기반 라우팅 실수

**문제 상황:**
파일 시스템 기반 라우팅에서 쿼리 파라미터, 경로 파라미터 처리 실수로 404 또는 데이터 누락

**발생 원인:**
- `/chat/$conversationId`에서 `conversationId` 파싱 실수
- 검색 파라미터(`?model=xxx`)를 route loader에서 누락
- 라우트 파일명 규칙 오류 (예: `$conversationId` 대신 `conversationId`)

**예방 전략:**
```typescript
// routes/chat.$conversationId.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/chat/$conversationId')({
  component: ChatPage,
  loader: async ({ params }) => {
    const conversation = await db.conversations.get(params.conversationId);
    if (!conversation) throw new Error('Conversation not found');
    return { conversation };
  },
});

function ChatPage() {
  const { conversation } = Route.useLoaderData();
  // 컴포넌트에서는 loader 데이터 사용
}
```

**경고 징후:**
- URL 파라미터 변경 시 페이지가 깨짐
- 새로고침하면 데이터가 사라짐 (loader 미사용)
- 404 페이지로 이동함 (ID 파싱 실패)

**대응 페이즈:**
Phase 1 (라우팅 구현) — 첫 라우트 구현 시 올바른 패턴 확정

---

## Technical Debt Patterns

| 단축 방법 | 당장 이득 | 장기 비용 | 허용 가능 시점 |
|----------|-----------|-----------|----------------|
| 마크다운 HTML 그대로 렌더링 (`dangerouslySetInnerHTML`) | 구현 5분 | XSS 공격 위험, React 이점 상실 | **절대 불가** |
| IndexedDB에 로컬 스토리지처럼 문자열만 저장 | 간단한 API | 타입 안전성 상실, 쿼리 불가능 | 프로토타이핑 전용 |
| SSE 연결 재시도 로직 생략 | 코드 10줄 절약 | 네트워크 불안정 시 사용자 경험 악화 | 초기 개발만 (Phase 1) |
| Dexie.js 스키마 버전 고정 (`version(1)`) | 마이그레이션 안 써도 됨 | 사용자 데이터 손실 위험 | **절대 불가** |
| Zustand로 모든 상태 관리 (TanStack Query 미사용) | 라이브러리 하나만 | 중복 로직, 캐싱 없음, 동기화 복잡 | 프로토타이핑 전용 |
| 마크다운을 매번 전체 재렌더링 | 구현 단순 | 대용량 응답에서 프리징 | 1000토큰 미만인 경우만 |

---

## Integration Gotchas

| 연동 대상 | 흔한 실수 | 올바른 접근 |
|-----------|----------|-------------|
| **OpenRouter API** | SDK 설치 후 사용 시도 | ✅ SDK 불필요. `fetch()`에 `Authorization: Bearer <KEY>` 헤더만 추가 |
| **SSE 스트리밍** | `EventSource` 사용 시도 | ❌ `EventSource`는 POST 불가. ✅ `fetch()` + `response.body.getReader()` 사용 |
| **Dexie.js** | 하나의 DB 인스턴스를 여러 곳에서 생성 | ✅ 싱글톤 패턴으로 DB 인스턴스 하나만 생성 후 export |
| **react-markdown** | `rehype-highlight`만 추가 | ✅ `remark-gfm` (표, 체크박스)도 함께 추가해야 GitHub 호환 |
| **TanStack Query** | `staleTime: 0`으로 설정 | ✅ DB 데이터는 `staleTime: Infinity`로 설정 (수동 갱신) |
| **Zustand** | 전역 상태로 모든 것을 관리 | ✅ UI 상태만 관리. 영구 데이터는 TanStack Query + IndexedDB |

---

## Performance Traps

| 트랩 | 증상 | 예방 | 언제 깨짐 |
|------|------|------|-----------|
| **마크다운 전체 재렌더링** | 긴 응답에서 타이핑 멈춤 | 메모이제이션 + diffing 최적화 | 500토큰 이상 응답 |
| **매 렌더링마다 코드 하이라이팅** | 코드 블록 포함 시 프리징 | 결과 캐싱 + Web Worker 고려 | 10개 이상 코드 블록 |
| **IndexedDB 쿼리 최적화 안 함** | 대화 목록 로딩 1초 이상 | 인덱스 적절히 설정, `useLiveQuery` 사용 | 대화 100개 이상 |
| **SSE 토큰 단위 state 업데이트** | 스트리밍 중 버벅거림 | 버퍼링 후 일정 주기로 batch 업데이트 | 초당 50토큰 이상 |
| **이미지/파일 Base64 저장** | IndexedDB 할당량 초과 | ✅ 이 기능 v2로 연기 (Out of Scope) | 파일 5개 이상 |

---

## Security Mistakes

| 실수 | 위험 | 예방 |
|------|------|------|
| **API 키를 localStorage에 저장** | XSS 공격 시 탈취 가능 | ✅ IndexedDB에 저장 (httpOnly 쿠키 불가하므로) |
| **마크다운 HTML 허용** | XSS 공격 | ✅ `react-markdown` 사용 (자동 sanitization) |
| **API 키를 URL에 포함** | 브라우저 기록, 리퍼러 유출 | ✅ 항상 POST 바디 + 헤더로만 전송 |
| **사용자 입력을 systemPrompt로 그대로 사용** | 프롬프트 인젝션 | ⚠️ 로컬 앱이라 위험도 낮지만, v2에서 검토 |
| **OpenRouter 모델 ID 검증 없이 사용** | 사용자가 임의 모델 지정 가능 | ✅ 무료 모델 목록 API로만 허용 |

---

## UX Pitfalls

| Pitfall | 사용자 영향 | 더 나은 접근 |
|---------|-------------|--------------|
| **스트리밍 중 스크롤 자동 이동** | 사용자가 위쪽을 읽다가 아래로 강제 이동됨 | ✅ 사용자가 스크롤할 때는 자동 이동 중단 |
| **Stop 버튼 위치 상단** | 긴 응답 중 중단하려면 스크롤해야 함 | ✅ 입력 영역 근처에 버튼 고정 |
| **로딩 스피너만 표시** | 무슨 작업 중인지 모름 | ✅ "메시지 생성 중...", "모델 로딩 중..." 등 구체적 상태 표시 |
| **에러가 기술적("429 Too Many Requests")** | 일반 사용자가 이해 못 함 | ✅ "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요." |
| **새 대화 제목이 "New Chat"** | 대화 목록에서 식별 어려움 | ✅ 첫 메시지 기반 자동 제목 생성 (핵심 기능) |
| **사이드바가 모바일에서 항상 열림** | 좁은 화면에서 채팅 영역 좁음 | ✅ 1024px 미만에서는 기본 닫힘, 토글 버튼으로 열기 |

---

## "Looks Done But Isn't" Checklist

- [ ] **SSE Stop 버튼:** 단순히 UI에만 있음? → 실제로 AbortController를 호출하고 스트리밍이 멈추는지 확인
- [ ] **새 대화 생성:** 로컬 상태에만 추가됨? → IndexedDB에 저장되고 새로고침해도 유지되는지 확인
- [ ] **마크다운 렌더링:** 테스트용 짧은 텍스트로만 테스트함? → 1000토큰 이상 긴 응답에서도 버벅거리지 않는지 확인
- [ ] **API 키 저장:** 입력 폼에서는 저장됨? → 새로고침 후에도 키가 유지되는지 확인
- [ ] **대화 삭제:** UI에서만 사라짐? → IndexedDB에서도 실제로 삭제되는지, 메시지도 연쇄 삭제되는지 확인
- [ ] **반응형 사이드바:** 데스크톱에서만 테스트함? → 모바일(375px)에서도 잘 작동하는지 확인
- [ ] **다크모드:** 단순히 tailwind `dark:` 클래스만 추가함? → 실제로 테마 전환 시 모든 요소가 올바르게 보이는지 확인

---

## Recovery Strategies

| Pitfall | 복구 비용 | 복구 단계 |
|---------|-----------|-----------|
| **SSE 리소스 누수** | LOW | `useEffect` cleanup 함수 추가, 테스트로 검증 |
| **IndexedDB 트랜잭션 deadlock** | MEDIUM | 비동기 작업을 트랜잭션 외부로 이동, 관련 코드 전면 재검토 |
| **스키마 마이그레이션 누락** | HIGH | 사용자 데이터 내보내기 → DB 초기화 → 데이터 복구 (복잡함) |
| **마크다운 렌더링 프리징** | LOW | 메모이제이션 추가, 길이 제한 로직 추가 |
| **Rate Limit 미처리** | LOW | 에러 핸들링 추가, 재시도 로직 추가 |
| **상태 중복** | MEDIUM | Zustand와 TanStack Query 역할 재정의, 리팩토링 |
| **TanStack Router 실수** | LOW | loader 패턴 따르도록 코드 수정 |

---

## Pitfall-to-Phase Mapping

| Pitfall | 예방 페이즈 | 검증 방법 |
|---------|-------------|-----------|
| SSE 스트리밍 리소스 누수 | Phase 1: 기본 채팅 | Stop 버튼 동작 후 개발자 도구 Network 패널 확인 |
| IndexedDB 트랜잭션 deadlock | Phase 1: 데이터 저장 | 트랜잭션 내 await 사용 금지 린트 규칙 추가 |
| Dexie.js 스키마 마이그레이션 | Phase 2: 데이터 관리 | 스키마 변경 시마다 upgrade 함수 작성, 테스트 |
| 대용량 마크다운 렌더링 | Phase 1: 마크다운 | 1000토큰 이상 응답 테스트, Performance 프로파일링 |
| OpenRouter Rate Limit | Phase 1: API 연결 | 429 에러 발생 시 사용자에게 알림 표시 |
| Zustand + TanStack Query 중복 | Phase 1: 상태 관리 | 상태 저장소 설계 문서화, 코드 리뷰 |
| TanStack Router 실수 | Phase 1: 라우팅 | 새로고침 테스트, URL 파라미터 변경 테스트 |
| 반응형 레이아웃 | Phase 1: UI 구조 | 375px, 768px, 1024px, 1440px에서 레이아웃 확인 |
| 다크모드 | Phase 1: 테마 | 모든 컴포넌트에서 dark 모드 테스트 |

---

## Sources

- **SSE/AbortController:** [MDN Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-Sent_events) (MEDIUM — 직접 확인 실패, MDN 신뢰도 높음)
- **Dexie.js:** [GitHub README](https://github.com/dfahlander/Dexie.js) (HIGH — 공식 저장소 확인)
- **react-markdown:** [GitHub README](https://github.com/remarkjs/react-markdown) (HIGH — 공식 저장소 확인)
- **React 성능:** 훈련 데이터 (LOW — 구체적 최신 문서 미확인, Phase 1에서 검증 필요)
- **OpenRouter API:** 훈련 데이터 (LOW — 공식 문서 미확인, Phase 1에서 검증 필요)
- **TanStack Router:** 훈련 데이터 (LOW — 공식 문서 미확인, Phase 1에서 검증 필요)

**검증 필요:**
- OpenRouter 무료 모델 Rate Limit 구체적 수치
- Dexie.js 스키마 마이그레이션 모범 사례
- TanStack Router loader 패턴

---
*OpenRouter Chat 도메인 위험 요소 연구*
*조사일: 2026-03-30*
