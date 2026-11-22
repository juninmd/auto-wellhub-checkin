# AGENTS.md

Gym check-in validation for a Wellhub partner gym. The NestJS backend in `gym-checkin-system/` checks a student's active Wellhub check-in and opens the turnstile. It is not a tool for students to check themselves in.

## Stack

- NestJS backend (`gym-checkin-system/backend`), TypeScript, Jest, ESLint, Prettier
- gRPC contract for biometrics (`proto/biometrics.proto`)
- Wellhub Access Control API (see Domain below)

## Commands

- Root (delegates to the backend): `npm install` (postinstall installs the backend), `npm run build`, `npm test`, `npm run dev`, `npm start`
- Backend: `npm --prefix gym-checkin-system/backend run build | test | lint | format`
- Dev server with watch: `npm --prefix gym-checkin-system/backend run start:dev`
- Production start: `npm --prefix gym-checkin-system/backend run start:prod` (runs `dist/main`)

## Structure

- `gym-checkin-system/backend/src/checkin/` — check-in controller, DTOs, `ProcessCheckinService`
- `gym-checkin-system/backend/src/students/` — student controller, DTOs, service
- `gym-checkin-system/backend/src/wellhub/` — Wellhub module
- `gym-checkin-system/backend/src/infrastructure/wellhub/` — `WellhubAccessClient` behind `IWellhubAccessService`
- `gym-checkin-system/backend/src/infrastructure/grpc/` — biometrics client
- `gym-checkin-system/backend/src/infrastructure/logger/` — logger contract and Nest logger
- `gym-checkin-system/backend/src/hardware/` — turnstile hardware service
- Top-level `README.md`, `SOLUTION.md`, `RESPONSE.md`, `LIMITATIONS.md`, `docs/`

## Conventions

- Principles: DRY, KISS, SOLID, YAGNI. One clear purpose per module; prefer composition; implement only what the task needs.
- Max 180 lines per file.
- Every code change needs unit tests covering critical logic and edge cases. Target coverage is 85%; `jest.config.js` does not enforce it.
- Lint and static analysis (ESLint) before a PR. Document functions, classes and modules.
- Robust error handling and logging that give useful feedback.
- Git with feature branches and releases.
- Every code change needs review from at least two developers.
- Daily regression tests are required to keep existing behavior.
- Implement appropriate data validation. No secrets or PII in logs.

## Domain: Wellhub Access Control API

- Flow: student checks in on the Wellhub app → triggers access (turnstile, fingerprint, kiosk, reception) → our system calls the Access Control API → if an active check-in exists (about 20 minutes valid), the turnstile opens.
- Validation endpoint: `POST https://api.partners.gympass.com/access/v1/validate`
- Sandbox: `https://apitesting.partners.gympass.com/access/v1` (default in `.env.example`)
- Headers: `Authorization: Bearer <token>` and `X-Gym-Id`.
- Body: `gympass_id` (13 digits, required) and `custom_code` (optional). Without an active check-in the validation is denied.
- Prerequisites: partner registration on the Partner Portal (token and Gym ID), sandbox access, and each student's `gympass_id`.
- Not confirmed (partner login required): response schema, error codes, webhooks. Until confirmed: 2xx = approved; 401/403/429/5xx/network/timeout = error (access fails closed); other 4xx = denied. Keep the response type open.
- Architecture: `WellhubAccessClient` sits behind `IWellhubAccessService` and is called by `ProcessCheckinService` only for students with a `gympassId`.
- The legacy root `src/` (fictional endpoints, email/password login) was removed. Do not restore it.
- Sources: https://developers.wellhub.com/product/access-control-api/1.0/endpoints and https://developers.wellhub.com/product/access-control-api/1.0/faq

## Gotchas

- Secrets: `WELLHUB_API_TOKEN` and Gym ID come from env (`gym-checkin-system/backend/.env.example` lists names only). Never commit or log them.
- Root `.gitignore` ignores `package-lock.json` at the root.

<!-- base-actions-main-policy -->
## GitHub Actions — padrão obrigatório (@main)

- Referencie as actions internas sempre pelo branch, nunca por SHA:
  - `uses: juninmd/base-actions/<action>@main`
  - `uses: juninmd/base-actions/.github/workflows/<arquivo>.yml@main`
- Não fixe `@<sha>` em `juninmd/base-actions`: a atualização é centralizada no
  `main` e passa a valer no próximo run.
- PRs cujos checks não iniciam por billing/spending limit são mesclados pelo bot central
  `juninmd/base-actions/.github/workflows/auto-merge-billing-blocked.yml`.
  Para impedir o merge automático de um PR, aplique a label `do-not-merge`.
