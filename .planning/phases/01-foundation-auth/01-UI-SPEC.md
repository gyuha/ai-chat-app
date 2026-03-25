---
phase: 01
slug: foundation-auth
status: approved
shadcn_initialized: false
preset: b1xS4xAK3M
created: 2026-03-26
reviewed_at: 2026-03-26T00:00:00+09:00
---

> 한국어 우선 안내: 이 템플릿은 `UI-SPEC` 자산을 한국어 기준으로 먼저 읽을 수 있게 정리합니다. 아래 영문 원문은 upstream 동기화와 세부 의미 보존을 위해 함께 유지합니다.


# Phase 01 — UI 디자인 계약서 (UI Design Contract)

> 프론트엔드 phase를 위한 시각/상호작용 계약서입니다. `gsd-ui-researcher`가 작성하고 `gsd-ui-checker`가 검증합니다.

---

## Design System (디자인 시스템)

| Property | Value |
|----------|-------|
| Tool | shadcn |
| Preset | `b1xS4xAK3M` captured; initialization deferred to Plan 01-01 because workspace `package.json` does not exist yet |
| Component library | radix |
| Icon library | lucide-react |
| Font | Geist Sans |

---

## Spacing Scale (간격 스케일)

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding |
| sm | 8px | Compact element spacing, helper text gaps |
| md | 16px | Default field spacing, card padding baseline |
| lg | 24px | Auth form section padding, vertical group spacing |
| xl | 32px | Card outer padding, layout gaps |
| 2xl | 48px | Major section breaks, page top/bottom rhythm |
| 3xl | 64px | Page-level spacing on desktop |

Exceptions: minimum touch target `44px`; auth input height `44px`; primary auth button height `44px`

---

## Typography (타이포그래피)

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.5 |
| Label | 14px | 600 | 1.4 |
| Heading | 20px | 600 | 1.2 |
| Display | 28px | 600 | 1.2 |

---

## Color (색상)

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #F7F7F2 | App background, page canvas, primary surfaces |
| Secondary (30%) | #E8E4D8 | Auth card, input background tint, subtle dividers |
| Accent (10%) | #C26A3D | Primary CTA, focus ring, active auth tab or link, loading spinner |
| Destructive | #B42318 | Destructive actions only |

Accent reserved for: primary CTA, active input focus ring, selected auth tab or link, loading spinner; never use accent for all links, all borders, or neutral body text

---

## Copywriting Contract (카피라이팅 계약)

| Element | Copy |
|---------|------|
| Primary CTA | 로그인하기 |
| Empty state heading | 로그인이 필요합니다 |
| Empty state body | 이메일과 비밀번호로 로그인하면 채팅을 시작할 수 있습니다. |
| Error state | 로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요. |
| Destructive confirmation | 로그아웃: 확인 모달 없이 즉시 로그아웃하고 로그인 화면으로 이동한다 |

---

## Interaction Contract (상호작용 계약)

- Auth surface uses a single centered card on desktop and full-width stacked layout on mobile.
- Primary focal point is the auth card heading plus the primary CTA, with form fields and helper/error text as the secondary hierarchy.
- Provide two explicit modes only: `로그인` and `회원가입`. Do not expose password reset, social login, or OAuth entry points.
- Required fields are `이메일` and `비밀번호`. 회원가입 화면 may add `비밀번호 확인` if planner chooses client-side confirmation.
- Validate email format on blur and on submit. Validate password presence on submit. Show one inline error message per field below the field.
- Submit button remains enabled until request starts. While pending, replace button label with a short loading state and show a spinner using accent color.
- On successful login or signup, transition directly into authenticated app bootstrap. Do not show a celebratory interstitial.
- On expired or invalid session, clear client auth state immediately and redirect to `/login` without modal confirmation.
- Session restoration runs once on app boot through a lightweight session endpoint. While restoring, show a compact centered loader with no skeleton layout.
- Error presentation priority: field validation first, then form-level error banner for auth failure or session restore failure.
- Logout is the only destructive action in this phase and does not require confirmation because it is reversible through re-login.

---

## Screen Inventory (화면 인벤토리)

| Screen | Purpose | Required States |
|--------|---------|-----------------|
| `/login` | Existing user authentication | default, submitting, invalid credentials, redirected after session expiry |
| `/signup` | New user registration | default, submitting, validation error, duplicate email failure |
| App bootstrap gate | Restore auth session before protected app loads | checking session, authenticated redirect, unauthenticated redirect |

---

## Registry Safety (레지스트리 안전성)

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none in spec; initialize base form, button, input, card primitives during Plan 01-01 | not required |

---

## Implementation Notes For Planner (플래너 참고)

- Source lock: authentication scope is email/password only, JWT-based, and session expiry must redirect immediately to login.
- Source lock: frontend and backend remain separate top-level apps.
- Source lock: OpenRouter secrets and model identifiers remain backend-only and must not appear in frontend UI or env usage.
- Styling should stay neutral and utility-first so later conversation screens can extend the same tokens without redesigning auth.
- If `shadcn` initialization succeeds during Plan 01-01, preserve this preset string and update `components.json` rather than changing the contract.

---

## Checker Sign-Off (검수 승인)

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved
