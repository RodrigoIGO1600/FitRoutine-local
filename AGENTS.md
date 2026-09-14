# AGENTS.md

## Purpose

This file provides repository-specific instructions for AI-assisted development on FitRoutine. Agents working in this repository should understand existing behavior before modifying it, respect established conventions, keep changes scoped, avoid unnecessary rewrites, and preserve functionality unless the task explicitly changes it.

## Project Overview

FitRoutine is a local full-stack workout management application. The frontend is a React 19 + TypeScript + Vite application in `front/`, and the backend is an Express 5 + TypeScript API in `backend/`. Data persists in a local SQLite database through Prisma 7.

## Repository Structure

```txt
FitRoutine-local/
├── backend/
│   ├── prisma/              # schema.prisma, migrations, seed.ts
│   ├── src/
│   │   ├── routes/          # Express route definitions
│   │   ├── controllers/     # Request/response handling
│   │   ├── services/        # Business logic and Prisma calls
│   │   ├── db/              # Prisma client instance
│   │   ├── generated/       # Generated Prisma client
│   │   ├── utils/           # Small helpers (param parsing, etc.)
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── .env.example
│   └── package.json
├── front/
│   ├── src/
│   │   ├── api/             # API client and endpoint modules
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Screen-level page components
│   │   ├── context/         # Theme and language providers
│   │   ├── i18n/            # Translation dictionaries
│   │   ├── types/           # Shared TypeScript types
│   │   ├── utils/           # Frontend helpers
│   │   ├── App.tsx          # Router and layout
│   │   └── main.tsx         # Entry point
│   ├── .env.example
│   └── package.json
├── docs/                    # API contract and architecture notes
├── start.bat                # Windows quick-start script
├── start.command            # macOS quick-start script
├── show-url.js              # Local-network URL helper
└── package.json             # Root scripts
```

## Architectural Boundaries

- UI components must not contain direct database access.
- Frontend code must communicate with backend functionality through the established API layer in `front/src/api/`.
- HTTP routing must remain separate from domain/business logic; keep controllers thin and put logic in services.
- Database operations must use the existing Prisma layer via `backend/src/db/prisma.ts`.
- Do not duplicate API calls across components if a centralized client or service already exists.
- Follow existing patterns before introducing a new abstraction.

## Frontend Guidelines

- Use TypeScript and preserve type safety.
- Prefer existing reusable components before creating new ones.
- Follow current CSS Modules conventions; keep styles co-located with components.
- Maintain responsive/mobile-first behavior.
- Handle loading, error, and empty states explicitly.
- Avoid unnecessary global state; use React hooks and local component state where possible.
- Preserve accessibility semantics already present (labels, roles, aria attributes).
- Keep UI logic understandable and localized.

## Backend Guidelines

- Define Express routes in `backend/src/routes/` and wire them in `backend/src/app.ts`.
- Keep controllers focused on request/response handling; delegate business logic to services.
- Place Prisma queries and domain rules in `backend/src/services/`.
- Validate request data in controllers or services and return consistent error responses.
- Return JSON responses using the `{ data: ... }` shape for success and `{ error: "..." }` for errors.
- Use appropriate HTTP status codes (`200`, `201`, `400`, `404`, `500`).
- Write asynchronous code with `async/await`.
- Keep Prisma client imports centralized through `backend/src/db/prisma.ts`.

## Database Guidelines

- Do not manually alter the SQLite database structure without updating `backend/prisma/schema.prisma` and the migration path.
- Keep schema changes intentional and minimal.
- Avoid destructive migrations unless explicitly required.
- Preserve existing data expectations where possible.
- Run migrations with `npx prisma migrate deploy` and regenerate the client when the schema changes.

## API Guidelines

- Base all API URLs on `import.meta.env.VITE_API_URL ?? "/api"` in the frontend.
- Keep endpoint modules in `front/src/api/` and reuse `apiGet`, `apiPost`, `apiPut`, and `apiDelete` from `client.ts`.
- Prefer consistent request/response shapes across endpoints.
- Handle API errors near the call site and surface them in the UI.
- Do not invent endpoints that do not exist; check `backend/src/routes/` and `docs/API_CONTRACT.md` before assuming an API contract.

## Scope and Change Discipline

- Read the relevant implementation before making changes.
- Prefer small, targeted changes over broad rewrites.
- Do not refactor unrelated code while implementing a task.
- Do not introduce new dependencies unless they provide a clear benefit and are compatible with the local-only constraint.
- Reuse existing abstractions and conventions where reasonable.
- If an existing convention is problematic, identify the issue before replacing it.
- Preserve backwards compatibility unless the task explicitly requires a breaking change.
- Never silently remove existing functionality.

## Validation Before Completion

Before considering a task complete:

- Check for TypeScript errors (`npm run build` in `front/`, `npm run build` in `backend/`).
- Run ESLint where configured (`npm run lint` in `front/`).
- Verify affected frontend states manually if UI code changed.
- Verify API behavior when backend code changes.
- Verify responsive behavior for UI changes.
- Verify that no unrelated files were modified.

This repository currently has no automated test suite, so running tests is not part of the validation checklist.

## AI-Assisted Development Principles

AI agents are implementation tools, not autonomous owners of the codebase. Proposed changes should remain understandable, reviewable, and consistent with the repository. Generated code must not be accepted solely because it compiles; behavior, maintainability, and architectural fit should also be evaluated.

Do not fabricate APIs, dependencies, or requirements. If a task is ambiguous or a decision could materially affect architecture or behavior, ask or flag the ambiguity before implementing. Explain substantial architectural changes before implementing them.

The project remains intentionally local-only. Do not add authentication, payments, cloud deployment, external databases, push notifications, social features, AI-generated workouts, or complex analytics unless explicitly requested.
