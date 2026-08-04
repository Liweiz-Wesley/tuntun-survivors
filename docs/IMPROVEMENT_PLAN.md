# Game feel and maintainability improvement plan

## Guardrails

- Preserve current gameplay, saves, art, characters, bosses, weapons, skills, farm, and static Pages delivery.
- Move behavior behind small APIs before changing balance or presentation.
- Keep Chinese and English behavior identical.
- Each phase ends with source checks, a generated `index.html`, Playwright, real browser play, and a `PROGRESS.md` update.

## Phase 1 — audit and infrastructure

Status: in progress.

- Document architecture, risks, input, rendering, deployment, and licenses.
- Add `AGENTS.md`, this plan, the audit, resource ledger, checklist, and progress log.
- Add Node package metadata, static test server, source syntax/build checks, Playwright smoke/navigation/gameplay tests, and screenshot capture.
- Add a test-only bridge gated by `?testMode=1`; normal players are unaffected.
- Add CI for Chromium desktop/mobile tests and archived reports/screenshots.
- Preserve the existing branch-based GitHub Pages deployment while validating a deployable artifact.

Exit criteria: tests run locally and in CI, main flows are manually opened, and known failures are explicitly recorded rather than hidden.

## Phase 2 — UI interaction quality

1. Introduce shared CSS theme tokens for color, radius, border, shadow, spacing, type, icon size, and motion.
2. Create one interaction contract for default/hover/pressed/disabled/focus-visible.
3. Route button clicks through one UI sound hook while retaining native button semantics.
4. Apply tokens screen by screen: main menu, character select, upgrade, shop, pause, codex, chest, farm, results.
5. Add screenshot review at desktop and mobile sizes; do not begin pixel-diff enforcement yet.

## Phase 3 — combat feedback and audio manager

1. Define a `CombatFeedback` API for hit, critical hit, kill, pickup, level-up, and boss impact.
2. Move flash, knockback, damage text, particles, shake, hit-stop, and sound throttling behind that API.
3. Establish intensity budgets and accessibility limits.
4. Create an audio manager with master/music/SFX volume, mute, concurrency limits, cooldowns, and persisted settings.
5. Migrate weapons incrementally; never maintain two feedback paths for one weapon.

## Phase 4 — performance and stability

1. Measure before optimizing using a development HUD and Playwright stress fixture.
2. Add reusable pools for particles, damage texts, and projectiles first; expand only where measurements justify it.
3. Replace per-frame whole-array churn where it produces measurable GC spikes.
4. Add explicit runtime lifecycle and listener/interval teardown.
5. Test 220 enemies, projectile caps, boss hazards, long sessions, repeated restart, and tab background/foreground cycles.

## Phase 5 — input, mobile, and final unification

1. Introduce one input manager covering keyboard, pointer, touch, pause, confirm, back, and focus loss.
2. Add a visible, configurable virtual joystick with safe-area-aware placement and shared movement vectors.
3. Prevent UI pointer ownership from leaking into gameplay.
4. Complete responsive layout passes at representative phone/tablet/desktop sizes.
5. Run the full game-feel checklist and final regression suite.

## Next concrete work after Phase 1

Phase 2 should begin with a read-only inventory of all interactive selectors, then add theme tokens without changing layouts. The first implementation slice should cover only shared base buttons and focus states on the main menu and pause screen. After screenshot review, extend to the upgrade and shop screens.

