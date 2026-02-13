# BanLe Portal (React PWA) Architecture

_Last updated: 28 Jan 2026_

## 1. System Overview

`portal` is the merchant-facing Admin Portal built with **React + TypeScript + Vite**. The project follows a **Clean Architecture** style separation where UI concerns, domain rules, and data access remain isolated and testable.

Unlike the mobile app, this is a **web PWA**:
- Runs in a browser (desktop/tablet/mobile web)
- Can be installed (Add to Home Screen)
- Can cache assets for offline/low-connectivity scenarios (service worker)

High-level layers:

```
┌──────────────────────────────────────────────────────┐
│                 Presentation (UI)                    │
│ Pages • Layouts • Components • Form adapters         │
├──────────────────────────────────────────────────────┤
│                    ViewModel                         │
│ Hooks orchestrating use cases + server state         │
├──────────────────────────────────────────────────────┤
│                      Domain                          │
│ Entities • Use Cases • Repository contracts          │
├──────────────────────────────────────────────────────┤
│                       Data                           │
│ Repositories • Remote APIs • DTOs • Mappers • Cache  │
├──────────────────────────────────────────────────────┤
│                Core Infrastructure                   │
│ Env config • API client • Storage • Logging • PWA    │
└──────────────────────────────────────────────────────┘n```

Key external services:
- BanLe backend REST API (current dev default: `http://localhost:8082/api`)

---

## 2. Project Structure (Portal)

Target structure (mirrors the mobile project’s intent, adapted for web):

```
portal/
├── public/                        # Static assets
├── src/
│   ├── presentation/              # 🎨 UI: pages/components/layouts
│   │   ├── pages/
│   │   ├── components/
│   │   ├── layouts/
│   │   └── styles/
│   ├── viewmodels/                # 🎯 Hooks: useXxxViewModel
│   ├── domain/                    # 🏛️ Entities, usecases, interfaces
│   │   ├── entities/
│   │   ├── interfaces/
│   │   └── usecases/
│   ├── data/                      # 💾 Repos, datasources, dto, mappers
│   │   ├── repositories/
│   │   └── datasources/
│   │       ├── remote/
│   │       │   └── api/
│   │       └── local/
│   ├── core/                      # 🔧 Cross-cutting: env, storage, utils
│   │   ├── config/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   ├── state/                     # 🗂️ App state (Redux Toolkit or Zustand)
│   ├── routes/                    # 🚦 React Router route tree + guards
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── .env.development
├── vite.config.ts
└── package.json
```

Notes:
- `@/*` aliases point to `src/*` (configured in `vite.config.ts` + `tsconfig.app.json`).
- Presentation should not call Axios directly; it calls ViewModels.

---

## 3. Layer Responsibilities

### 3.1 Presentation Layer (`src/presentation`)
Purpose: Render UI and collect user inputs.

Responsibilities:
- Pages and route-level screens
- Layout composition (sidebar/header)
- Form rendering and validation bindings
- Display loading/error states

Rules:
- No direct API calls
- Avoid business rules here (keep it in domain/usecases)
- Calls ViewModel hooks

### 3.2 ViewModel Layer (`src/viewmodels`)
Purpose: Bridge UI ↔ domain/data.

Responsibilities:
- Orchestrate **UseCases**
- Own UI-friendly state: `isLoading`, `error`, `success` messages
- Integrate server state (recommended: **TanStack React Query**) for fetching/mutations
- Trigger cache invalidations after mutations

Rules:
- No JSX rendering
- No hard dependency on UI components

### 3.3 Domain Layer (`src/domain`)
Purpose: Pure business logic and contracts.

Responsibilities:
- Entities (business models)
- Repository interfaces (contracts)
- UseCases (business workflows)

Rules:
- No React imports
- No Axios imports
- No browser APIs (`localStorage`, `fetch`) inside domain

### 3.4 Data Layer (`src/data`)
Purpose: Implement repository interfaces and coordinate remote/local data sources.

Responsibilities:
- Remote data sources (API modules)
- DTO definitions + mappers (DTO ↔ Entity)
- Repository implementations
- Caching strategy (optional: IndexedDB/Dexie, or minimal localStorage)

### 3.5 Core Layer (`src/core`)
Purpose: Cross-cutting infrastructure.

Responsibilities:
- Environment config (`.env.*` access)
- API client (Axios instance + interceptors)
- Storage helpers (token persistence)
- Logging / error normalization
- PWA wiring (service worker registration & cache policies) when enabled

### 3.6 State Layer (`src/state`)
Purpose: App state that is not server state.

Use cases:
- Auth session flags (in addition to token storage)
- UI state (sidebar open/close, theme mode)
- Small local-only lists

Guideline:
- Use React Query for server state; use Redux/Zustand only for UI/app state.

### 3.7 Routes (`src/routes`)
Purpose: central routing definition.

Responsibilities:
- Router tree (React Router)
- Route guards (PrivateRoute/PublicRoute)
- Lazy loading boundaries

---

## 4. Application Boot Sequence (Web)

1. `src/main.tsx`
   - Creates React root
   - Mounts providers (Theme, QueryClientProvider, Redux Provider if used)

2. `src/App.tsx`
   - Mounts RouterProvider

3. `src/routes/index.tsx`
   - Defines route tree
   - Applies layouts and route guards

Recommended provider order:

```
<QueryClientProvider>
  <ReduxProvider?>
    <ThemeProvider>
      <RouterProvider />
    </ThemeProvider>
  </ReduxProvider?>
</QueryClientProvider>
```

---

## 5. Runtime Data Flow (End-to-end)

This is the web equivalent of the mobile app’s flow.

```
User action in UI
  ↓
Presentation Page (View)
  ↓ calls
ViewModel Hook (useXxxViewModel)
  ↓ orchestrates
UseCase (domain)
  ↓ depends on
Repository Interface (domain)
  ↓ implemented by
Repository (data)
  ↓ delegates to
Remote DataSource (Axios client) + Local Cache (optional)
  ↓
DTO ↔ Entity mapping
  ↓
React Query cache + state update
  ↓
UI re-renders
```

---

## 6. API & Auth Pattern (Web)

### 6.1 Environment
Use `.env.*` files:

```env
VITE_API_BASE_URL=http://localhost:8082/api
```

### 6.2 API Client
Web equivalent of mobile `ApiService`:
- Axios instance with `baseURL` from env
- Request interceptor injects access token
- Response interceptor handles 401 → logout / redirect

Token storage recommendation:
- Short term: `localStorage` (simple)
- Better security: HttpOnly cookies (requires backend changes)

---

## 7. PWA: Offline & Caching Strategy

Portal is a PWA candidate:
- Use `vite-plugin-pwa` (Workbox-based)
- Cache static assets (app shell) for instant loads
- Optionally cache GET API responses (careful: admin data freshness)

Suggested defaults:
- Cache-first for static assets (JS/CSS/images)
- Network-first for API data
- Provide offline fallback for the shell; show “offline mode” UI state

If offline data is required (e.g., draft forms):
- Persist drafts to IndexedDB (Dexie)
- Replay when network returns

---

## 8. Error Handling & Observability

Guidelines:
- Normalize API errors in one place (core)
- ViewModels expose errors as UI-friendly messages
- Prefer typed error classes in domain for predictable flows:
  - ValidationError
  - UnauthorizedError
  - ConflictError

Optional later:
- Add Sentry for browser error reporting
- Add structured logging utilities in `core/utils`

---

## 9. Performance & Re-renders (Web)

To control re-renders:
- Use React Query selectors and memoized hooks
- Keep ViewModels returning stable references (`useMemo`, `useCallback`)
- Avoid passing new inline objects to deep component trees

---

## 10. Implementation Notes for This Repo (Current State)

As of now, the repository already has:
- `src/presentation/...` pages/layouts
- `src/routes/index.tsx` using lazy imports
- Vite + TS path aliases configured (`@`, `@presentation`, `@viewmodels`, `@domain`, `@data`, `@core`, `@state`, `@routes`)

Next incremental steps (recommended):
1. Add `core/config/env.ts` + `data/.../apiClient.ts` (Axios instance)
2. Introduce React Query and wrap the app with `QueryClientProvider`
3. Move page logic into ViewModels, then into UseCases + Repositories

---

## 11. Quick Start (Local)

```bash
cd portal
npm install
npm run dev
```

Backend is expected at:
- `http://localhost:8082/api`

---

## 12. Glossary

- **Entity**: Domain model describing a business concept.
- **DTO**: Network model matching API payload shapes.
- **Repository**: Interface (domain) + implementation (data) hiding API details.
- **UseCase**: Business workflow orchestrator.
- **ViewModel**: UI-facing hook that composes usecases/state.
- **Server State**: Remote data cached and synchronized (React Query).
