# E2E audit — ACP Admin

**Date:** 2026-07-23  
**Projects:** Desktop Chrome `1280×720`, Mobile Chrome `375×667` (Chromium + touch)  
**Command:** `npx playwright test` / `make test-e2e`  
**Latest result:** **46 passed**, **2 skipped**, **0 failed** (~11s)

## Breakpoints (responsive shell)

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile drawer | `< 768px` (`md`) | Off-canvas sidebar (`left: -18rem` / `0`); hamburger opens; overlay or collapse toggle closes |
| Desktop rail | `≥ 768px` | Fixed sidebar; logo + single `PanelLeftClose` / `PanelLeftOpen`; content offset `14rem` / `60px` |
| Modal full-bleed | `< 640px` (`sm`) | Nearly full-viewport dialog |
| Table footer | `< 480px` | Pagination wraps/centers |

## Skips (intentional)

| Skip | Reason |
|---|---|
| `mobile-shell` on Desktop Chrome | Mobile viewport only |
| `sidebar links` on Mobile Chrome | Covered by `mobile-shell` drawer navigation |

## Coverage

- Landing → Login → Dashboard  
- Signup / Forgot / OTP smoke  
- Header: tenant switch, Cmd+K / search, notifications, user menu theme  
- Users + Tenants modal routes (deep link, create, cancel)  
- Roles, Menu tree expand/select, Profile/2FA, Settings subpages  
- DataTable filters / columns / page size  
- Mobile drawer open/close, overflow check, edit modal usable  

## Fixes applied

### Sidebar UX (user-reported)

1. Removed header **X** — only collapse in / collapse out (`PanelLeftClose` / `PanelLeftOpen`).  
2. Mobile close = same collapse control or overlay tap (no X).  
3. Shared header/nav gutter so logo mark and nav icons share one left edge (`deltaPx: 0` at 1280; both 18×18).  
4. Drawer positioning via `left` (not `transform`) so viewport/hit-testing stay consistent.

### Product / test hardening

5. Tenants modal **Cancel** (parity with Users).  
6. Single GlobalSearch control (icon mobile / field desktop).  
7. Notifications `Close notifications` label.  
8. Playwright Desktop + Mobile Chromium projects.  

## DOM confirmation (desktop 1280)

```
logoLeft: 18
navIconLeft: 18
deltaPx: 0
headerButtonLabels: ["Collapse menu"]
hasCloseX: false
```

## Remaining debt

- Menu-tree drag-and-drop not e2e’d (expand/select only).  
- CRUD persist (save create/update) not fully asserted.  
- SVG shield vs Lucide optical ink may still differ slightly at odd DPRs; bounding boxes align.

## Manual retest

1. `make dev`  
2. Desktop 1280: logo + one collapse icon; nav icons under logo column; no X.  
3. Mobile 375: hamburger → drawer → Collapse / overlay closes.  
4. `make test-e2e`
