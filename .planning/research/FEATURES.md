# Feature Landscape

**Domain:** ChatGPT 스타일 웹 채팅 애플리케이션
**Researched:** 2026-03-30
**Overall confidence:** MEDIUM

> **Research note:** WebSearch/WebFetch에 제한이 있어, 공개 ChatGPT 클론 앱들의 기능 비교(Open WebUI, Chatbot UI, Chatbox, Vercel AI Chatbot)와 일반적인 AI 채팅 앱 지식에 기반. 공식 문서를 통한 검증이 불완전하므로 일부 영역에서 MEDIUM-LOW confident.

## Table Stakes

사용자가 기대하는 기본 기능. 없으면 제품이 불완전하게 느껴짐.

| Feature | 기대 이유 | 복잡도 | 비고 |
|---------|----------|--------|------|
| API 키 관리 | 사용자가 자신의 OpenRouter API 키를 등록/저장/변경/삭제 가능해야 함 | Low | PROJECT.md에 명시된 Requirements |
| 모델 선택 | 무료 모델 목록 조회 및 선택 가능해야 함 | Low | OpenRouter API로 가능 |
| 채팅 입력/송수신 | 기본적인 텍스트 대화 가능 | Low | OpenRouter API로 가능 |
| Markdown 렌더링 | AI 응답에 Markdown(코드 블록, 목록, emphasis 등) 포함 | Low | react-markdown + remark-gfm |
| 스트리밍 응답 | ChatGPT처럼 실시간 타이핑 효과 | Medium | fetch stream 사용 |
| 대화 목록 | 새 대화, 기존 대화 목록 조회 | Low | IndexedDB로 관리 |
| 대화 영속성 | IndexedDB에 대화/설정 저장 | Low | Dexie.js 사용 |
|Dark/Light 모드 | shadcn/ui 기본 다크/라이트 지원 | Low | PROJECT.md에 명시 |

## Differentiators

사용자가 기대하지 않지만 있으면 평가하는 기능. 제품을 차별화함.

| Feature | 가치 제안 | 복잡도 | 비고 |
|---------|----------|--------|------|
| 음성 입력 (Voice Input) | 마이크로 말하면 텍스트 변환 | Medium | Web Speech API |
| 대화 검색 | 과거 대화 내용 검색 | Medium | IndexedDB 인덱싱 필요 |
| 대화 공유 | 대화를其他人과 공유 (링크/エクスポート) | Medium | JSON 내보내기/가져오기 |
| 프롬프트 템플릿 라이브러리 | 자주 쓰는 프롬프트 저장/재사용 | Medium | 로컬 스토리지 |
| 코드 블록 실행 | Python/JS 등 코드 블록 직접 실행 | High | sandbox 환경 필요 |
| 모델별 설정 기억 | 모델마다 시스템 프롬프트/파라미터 저장 | Low | IndexedDB에 저장 |
| 키보드 단축키 | Cmd+K로 명령 팔레트, Cmd+Enter 전송 등 | Low | 전역 단축키 |
| 타이핑 인디케이터 | AI가 응답 중임을 시각적으로 표시 | Low | 스트리밍과 함께 |
| 응답 복사/재생성 | 응답 텍스트 복사, 재생성 버튼 | Low | 코드 블록별也行 |
| 대화 제목 자동 생성 | 첫 메시지 기반으로 제목 자동 생성 | Low | 간단한 요약 API 或는규칙 기반 |

## Anti-Features

명시적으로 구축하지 않을 기능.

| Anti-Feature | 이유 | 대안 |
|--------------|------|------|
| PWA / 오프라인 지원 | 별도 작업 필요, PROJECT.md에서 명시적 제외 | — |
| 유료 모델 지원 | 토큰 사용량 추적 복잡, 별도 작업 필요 | 무료 모델만 지원 |
| 이미지/파일 첨부 (멀티모달) | 별도 작업 필요, PROJECT.md에서 명시적 제외 | — |
| i18n (다국어 지원) | 한국어만 우선, PROJECT.md에서 명시적 제외 | — |
| 사용자 인증/클라우드 동기화 | 백엔드 없는 순수 프론트엔드 아키텍처와 충돌 | 로컬 스토리지만 |
| 대화 내보내기/가져오기 | PROJECT.md에서 향후 고려로 분류,初期版 제외 | — |

## Feature Dependencies

```
API 키 등록
  └── 모델 목록 조회
        └── 모델 선택 → 채팅 시작
              └── 스트리밍 응답
                    └── 대화 저장 (IndexedDB)
                          └── 대화 목록 표시
                                └── 대화 검색 (향후)
```

**초기 MVP 순서:**
1. API 키 관리 → 모델 선택 → 채팅 → 스트리밍 → IndexedDB 저장 → 대화 목록

## MVP Recommendation

**초기 버전에서 우선순위:**

1. **Table Stakes 우선 (필수)**
   - API 키 관리 (설정/저장/변경/삭제)
   - 무료 모델 선택 (OpenRouter API로 목록 조회)
   - Markdown 포함 스트리밍 채팅
   - 대화 목록/삭제/새 대화
   - IndexedDB 영속성
   - Dark/Light 모드

2. **Differentiator 중에서도 우선:**
   - 타이핑 인디케이터 (스트리밍의 자연스러운 일부)
   - 응답 복사 버튼 (낮은 복잡도, 높은 가치)
   - 대화 제목 자동 생성 (낮은 복잡도, UX 향상)
   - 키보드 단축키 (power user용)

**Defer (별도 작업으로 미루기):**
- 음성 입력 → 별도 작업 필요
- 대화 검색 → IndexedDB 인덱싱 필요
- 대화 공유/내보내기 → PROJECT.md에서 향후 고려
- PWA/오프라인 → 별도 작업
- 멀티모달 → 별도 작업

## Sources

| Source | Confidence | Topic |
|--------|------------|-------|
| [Open WebUI (GitHub)](https://github.com/open-webui/open-webui) | MEDIUM | 포괄적 기능 목록 |
| [Chatbot UI (GitHub)](https://github.com/mckaywrigley/chatbot-ui) | MEDIUM | 기본 ChatGPT 클론 기능 |
| [Chatbox (GitHub)](https://raw.githubusercontent.com/Bin-Huang/chatbox/main/README.md) | MEDIUM | 크로스 플랫폼 채팅 기능 |
| [Vercel AI Chatbot](https://github.com/vercel-labs/ai-chatbot) | MEDIUM | shadcn/ui + Next.js 기반 |
| PROJECT.md | HIGH | 프로젝트 요구사항 및 결정 |

## Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Table Stakes | HIGH | PROJECT.md 요구사항과 일치, 일반적ChatGPT 앱 기대사항 |
| Differentiators | MEDIUM | 유사 앱 분석 기반, 사용자 조사는 아님 |
| Anti-Features | HIGH | PROJECT.md Out of Scope와 직접 일치 |
| Dependencies | MEDIUM | 기술적 의존성 분석 기반, 검증 제한 |

## Open Questions

- **사용자 조사 부족:** 실제 사용자 조사를 수행하지 못함. 테이블 스테이크와 디ifferentiator 분류는 유사 앱 분석과 일반적인 기대에 기반.
- **한국어 사용자 기대:** 한국어 UI 우선 전략이 사용자 기대에 어떻게影響하는지 불분명.
- **성능 기대:** 스트리밍 응답의 UX 기대 수준(지연 시간, 타이핑 속도 등)에 대한 검증 필요.
