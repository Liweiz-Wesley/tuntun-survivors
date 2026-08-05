# Progress

## Cloudflare Pages preview preparation

Status: repository configuration complete; dashboard authorization pending  
Completed: 2026-08-05

### Completed

- Added a framework-free Cloudflare Pages build that regenerates the bilingual entry and publishes only `index.html` plus `assets/` to `dist/`.
- Documented the one-time GitHub OAuth connection, `main` production branch, preview branch behavior, PR checks, test query parameters, GitHub Pages coexistence, and build-log troubleshooting.
- Kept the existing GitHub Pages workflow unchanged.

### Changed files

- `package.json`
- `.gitignore`
- `scripts/build-cloudflare.mjs`
- `docs/CLOUDFLARE_SETUP.md`
- Generated `index.html`

### Validation

- `pnpm check`: passed.
- `pnpm build:cloudflare`: passed; generated `dist/index.html` and `dist/assets/`.
- `pnpm test`: 12 passed and 4 configured skips across desktop Chromium and Pixel 7 emulation.

### Pending owner action

- Complete Cloudflare OAuth and GitHub repository authorization in the Cloudflare dashboard.
- Create the Pages project with production branch `main`, build command `pnpm build:cloudflare`, and output directory `dist`.

## Phase 1 — audit and infrastructure

Status: complete  
Started: 2026-08-04

### Completed

- Audited repository structure, runtime ownership, rendering, input, save, audio, performance caps, and branch-based Pages delivery.
- Added contributor rules and Phase 1–5 plan.
- Added open-source/license ledger and executable game-feel checklist.
- Added Node package metadata, local static server, source parser/build checks, Playwright desktop/mobile projects, smoke/navigation/gameplay tests, and screenshot capture.
- Added a `?testMode=1`-gated test bridge. It is absent from normal player behavior.
- Added CI definitions for checks, Playwright, reports, screenshots, and a deployable static artifact without replacing current Pages settings.

### Changed files

- `AGENTS.md`
- `PROGRESS.md`
- `docs/PROJECT_AUDIT.md`
- `docs/IMPROVEMENT_PLAN.md`
- `docs/OPEN_SOURCE_RESOURCES.md`
- `docs/GAME_FEEL_CHECKLIST.md`
- `package.json`, lockfile, `playwright.config.js`
- `scripts/check-source.mjs`, `scripts/serve.mjs`
- `tests/*.js`
- `.github/workflows/test.yml`, `.github/workflows/deploy.yml`
- Both language source files and generated `index.html` for the gated test bridge only

### Validation

- `node scripts/check-source.mjs`: passed for both source files and generated wrapper markers.
- `node scripts/merge-bilingual.mjs`: passed; generated `index.html` updated.
- `playwright test`: 12 passed, 4 intentionally skipped in 1.9 minutes across desktop Chromium and Pixel 7 emulation. Skips are project-specific screenshot ownership plus the documented focus-loss `fixme`.
- Final core rerun with the stable single-worker configuration: 10 passed, 2 expected `fixme` skips in 40.2 seconds.
- Resource/error smoke test: passed in standalone Playwright; no same-origin 404 or unhandled application errors.
- Visual artifacts generated: main menu, gameplay, level-up, shop, pause, boss battle, results, mobile menu, and mobile gameplay.
- Manual local browser play: main menu, character selection, run start, HUD, and Escape pause verified.
- Visual review: desktop main menu is coherent; mobile portrait HUD overlap is confirmed and deferred to Phase 5.

### Known issues / deferred work

- Input is not cleared on `blur`/`visibilitychange`; the test is tracked as expected-failing until the input-manager phase.
- Pixel 7 portrait gameplay has severe top-HUD overlap and an oversized bottom language selector; this is a high-priority Phase 5 issue.
- Source files remain duplicated and oversized; no large refactor is permitted before the baseline is stable.
- A browser-instrumentation `MutationObserver` console error appeared in the Codex in-app browser, but no such code exists in the repository. Standalone Playwright determines application CI status.
- The repository has no root license.
- Audio settings, UI tokens, combat feedback API, pools, performance HUD, and visible mobile joystick belong to later phases.
