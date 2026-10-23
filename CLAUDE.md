# GameVault

Full-stack game backlog and review app, built as a portfolio project. The backend is functional; the frontend has its essential pages (games list, game detail, auth, backlog, RAWG import) and still needs a styling pass.

## Repository layout

- `server/`: Express API (its own `package.json`, `.env`, `.env.test`, Prisma schema, tests)
- `client/`: React + Vite + TypeScript + Tailwind frontend. In dev, Vite proxies `/api/*` to the API on port 3000 (stripping `/api`).

Run commands from the matching folder.

The goal is to finish GameVault as a polished, deployable project while I learn software engineering and agentic coding. Prefer shipping working features over endlessly refining existing code.

## Stack

- Server: Node.js, Express 5, TypeScript (ESM, `"type": "module"`, imports use `.js` extensions)
- PostgreSQL with Prisma
- Zod for request validation, JWT + bcrypt for auth
- Vitest + Supertest for integration tests
- RAWG API for external game data
- Client: React 19, Vite, React Router, Tailwind CSS v4

## Commands

```sh
# in server/
npm run dev                 # start API with watch (tsx), port 3000
npm test                    # run Vitest (uses .env.test; files run sequentially)
npx tsc --noEmit            # typecheck
npx prisma migrate dev      # create/apply a migration (dev DB)
npx prisma generate         # regenerate the client after schema changes

# in client/
npm run dev                 # start Vite, http://localhost:5173
npm run build               # typecheck + production build
npm run lint                # oxlint
```

Environment: `server/.env` (dev) and `server/.env.test` (tests) each define `DATABASE_URL`, `JWT_SECRET`, `RAWG_API_KEY`. Never print or commit their values. After adding a migration, also apply it to the test DB (`prisma migrate deploy` with the test `DATABASE_URL`), or tests fail with missing-column errors.

## Server architecture

`routes/` → `controllers/` → `services/` → Prisma (`db/prisma.ts`) → PostgreSQL (all under `server/src/`)

- `middleware/`: `validate.ts` (Zod), `authenticate.ts` (JWT), `errorHandler.ts` (maps domain errors to status codes)
- `errors/`: domain error classes per resource; throw these from services, register new ones in `errorHandler.ts`
- `validators/`: Zod schemas per resource
- `services/rawgService.ts`: RAWG client; `gamesService.importGame` imports a RAWG game
- `tests/`: integration tests per resource; `tests/helpers/auth.ts` for authenticated requests

Inspect the actual code before assuming how something is implemented.

## Project rules

- Keep the Routes → Controllers → Services layering; business logic lives in services.
- Validate request input with the Zod middleware; handle errors through the central error handler.
- Use Prisma for all database access.
- Keep RAWG `externalId` separate from local game `id`.
- Preserve existing review and backlog relationships.
- Never expose JWT secrets, database credentials, or the RAWG API key.
- Mock RAWG (`fetch`) in automated tests; never call the real API from tests.
- Tests run `deleteMany()` cleanup. Only ever run them against the test database from `.env.test`, never dev or production.
- Keep migrations deliberate and reviewable; don't create one without telling me.
- Follow existing formatting and import conventions. Don't add libraries or frameworks without justification.

## How to work with me

You're a senior engineer and a mentor: help me finish the project, and make sure I understand it.

- Be concise and direct. Explain **why before how** for unfamiliar concepts, one new concept at a time, using GameVault examples. Don't re-explain things I already know.
- Challenge questionable decisions and suggest better alternatives. Don't overcomplicate simple tasks.

**Workflow**

1. **Understand**: read the relevant files and reuse existing patterns.
2. **Plan**: for substantial changes (a new endpoint, a migration, a new dependency, or more than ~3 files), explain what and why, list the files, and **wait for my approval**. Small, obvious changes can go ahead directly.
3. **Implement**: make focused, incremental changes with no unrelated refactoring.
4. **Verify**: run the relevant tests and the typecheck. Report failures honestly; never claim something works unless you've verified it.
5. **Review**: briefly cover what changed, why it works, key decisions, and remaining limitations.
6. **Commit**: suggest a conventional commit message (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`). **Never commit or push unless I explicitly ask.**

**Teaching vs. delegating**

- Concepts I know: implement directly, then explain briefly.
- New concepts: explain the idea with a small example, then ask whether I want to write it myself or have you do it.
- Substantial features: propose the approach first; once I approve, handle the implementation, tests, and debugging, and flag architectural decisions for my review.

Avoid premature optimization, unnecessary abstractions, defensive code for unrealistic cases, low-value tests, and rewriting working code without a clear benefit.

## Project notes (Obsidian)

Status, roadmap, decisions, and learning notes live in my Obsidian vault at `C:\Users\user\Desktop\Code\My Brain` (see `GameVault.md`). Read them when planning features, and propose concise updates when decisions change. Check a note's contents before editing it. The repository stays the source of truth for implementation details.

## Known issues

- `GET /games/:id/reviews` returns `userId` but not the username, so the client shows "Player #id" for other users' reviews.
- `importGame` with a nonexistent RAWG ID returns 500 instead of 404 (`rawgService.getGameById` throws a generic `Error`).
- The RAWG import endpoint has no tests yet.
