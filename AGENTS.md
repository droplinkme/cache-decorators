# AGENTS.md

## Cursor Cloud specific instructions

This is a **TypeScript npm library** (`@droplink/cache-decorators`) that provides decorators for caching. It is not a web app — there is no server to start.

### Commands

| Task | Command | Notes |
|------|---------|-------|
| Install deps | `yarn install --frozen-lockfile` | Uses `yarn.lock`. The `prepare` hook auto-runs `yarn build`. |
| Build | `yarn build` | Compiles TS → `built/` via `tsc` + `tsc-alias`. |
| Unit tests | `yarn test` | No external dependencies needed. |
| E2E tests | `REDIS_HOST=localhost REDIS_PORT=6379 yarn test:e2e` | Requires a running Redis on localhost:6379. |
| Unit tests (coverage) | `yarn test:cov` | |
| E2E tests (coverage) | `REDIS_HOST=localhost REDIS_PORT=6379 yarn test:e2e:cov` | |

### Caveats

- **Redis for E2E tests**: E2E tests require a Redis instance. Install with `sudo apt-get install -y redis-server` and start with `redis-server --daemonize yes`. The tests read `REDIS_HOST` and `REDIS_PORT` env vars.
- **No ESLint config**: The repo has ESLint in devDependencies but no `.eslintrc*` or `eslint.config.*` file, so `npx eslint` will error. This is the repo's current state.
- **Haste module collision warning**: Jest prints a harmless warning about `@droplink/cache-decorators` name collision between `package.json` and `built/package.json` (the `prepare` hook copies `package.json` into `built/`). This can be ignored.
- **DataSource.initialize() is async**: When testing the library manually, `DataSource.initialize()` returns a promise and needs ~1.5s for the Redis connection to stabilize before use (see `src/database/fake/initialize.ts`).
