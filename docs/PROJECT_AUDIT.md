# Project audit

Audit date: 2026-08-04  
Audited revision: `9fb7539` plus the Phase 1 test bridge

## Executive summary

Tuntun Survivors is a dependency-free browser game implemented with HTML, CSS, vanilla JavaScript, DOM overlays, Web Audio synthesis, and a Canvas 2D battlefield. It does not use Phaser, PixiJS, React, or a bundler. The game is playable and already includes defensive caps for several active-object arrays, gem compaction, a spatial enemy grid, and frame-error recovery. Its main maintenance risk is not lack of content; it is that almost every runtime responsibility exists inside two nearly duplicated, multi-megabyte HTML files.

## Technology and rendering

- Languages: HTML5, CSS, JavaScript (classic browser scripts), Node.js ESM build scripts, and Python art-generation utilities.
- Rendering: Canvas 2D for combat/world rendering; DOM/CSS overlays for HUD, menus, upgrade choices, farm, codex, chests, pause, and results.
- Audio: procedural Web Audio oscillators through a single `AudioContext`; no shipped audio files at the audited revision.
- Persistence: browser `localStorage`, key `tuntun-survivors-save-v2`; export/import uses Base64 text.
- Packaging: `scripts/merge-bilingual.mjs` embeds both source HTML documents as Base64 strings into `index.html`, then loads one through an iframe `srcdoc`.

## Repository structure

| Path | Responsibility |
| --- | --- |
| `source/Tuntun-Survivors-Chinese.html` | Chinese UI plus complete game runtime; about 1,605 lines, 147 named functions, and 2.98 MB. |
| `source/Tuntun-Survivors-English.html` | English duplicate of the same runtime; about 1,606 lines and 2.97 MB. |
| `index.html` | Generated bilingual shell, language picker, test coin injection, iframe `srcdoc`; about 567 KB after Base64 cleanup during build. |
| `assets/scripts/boss-farm-expansion.js` | Monkey-patches boss animation/skills, chili behavior, final battle, and farm systems; about 24 KB. |
| `assets/styles/*.css` | Boss HUD, farm world, and farm expansion styling. Most other CSS remains inline in both source HTML files. |
| `assets/sprites`, `assets/retro32`, `assets/backgrounds` | Runtime PNG/GIF/WebP assets grouped by bosses, idle sprites, icons, props, crops, effects, and backgrounds. |
| `assets/source` | High-resolution/source art used to derive runtime sprites. |
| `scripts/merge-bilingual.mjs` | Produces the deployable root `index.html`. |
| `scripts/*.py` | Pixel-sprite and boss-animation asset-generation utilities. |

## Runtime responsibility map

All line references below refer to the Chinese source and may shift as the file evolves.

| System | Current location |
| --- | --- |
| Main loop | `loop`, `update`, `draw` around lines 1053–1061 and 1434; `requestAnimationFrame`. |
| Character control | Global `keys`/`pointer`, listeners around lines 806–820; movement inside `update`. |
| Enemies and waves | `spawnEnemy`, `pushScaledEnemy`, `spawnElite`, `spawnBoss`, enemy update branches, `BOSS_DEFS` and schedules. |
| Weapons | Per-weapon fire functions around lines 1223–1292, collision in `update`, visual draw functions around lines 1527–1563. |
| Collision | Distance checks, `resolveWorldCollision`, enemy spatial grid, projectile/pot loops. No physics library. |
| Combat feedback | `hitEnemy`, `burst`, `splatter`, `texts`, `particles`, `shake`, `flash`, and `sfx`; logic is centralized only partially. |
| UI | HTML/CSS and event wiring in the same source HTML; runtime render functions such as `renderShop`, `renderTray`, `renderUpgradeChoices`. |
| Save | `freshSave`, `loadSave`, `persistSave`, import/export/reset around lines 701–715. |
| Audio | `initAudio`, `tone`, `scheduleMusic`, `sfx` around lines 855–905. |
| Farm/Boss extension | `assets/scripts/boss-farm-expansion.js`, which replaces several existing functions at runtime. |

## Oversized, duplicated, or mixed-responsibility code

1. Both language files contain almost the full application twice. Gameplay fixes must be repeated and can drift.
2. Each source mixes markup, theme values, screens, data definitions, input, simulation, rendering, sound, save migration, and debug recovery.
3. `assets/scripts/boss-farm-expansion.js` captures legacy functions and reassigns global bindings. This is effective for incremental development but makes call order and ownership difficult to reason about.
4. UI values such as radius, border, shadow, timings, font sizes, and padding are repeated across many selectors instead of coming from theme tokens.
5. Combat feedback is invoked directly in `hitEnemy`, weapons, boss skills, pickups, and effects rather than through a documented feedback service.

## Stability and performance findings

### Existing protections

- Delta time is capped at 34 ms.
- The animation frame is rescheduled in `finally`, so a draw/update error does not permanently stop the game.
- Enemy lookup uses a 128 px spatial grid for projectile collisions.
- Gems are periodically compacted; active lists are filtered every frame.
- Hard caps exist for enemies (220), shots (180), gems (500), pickups (120), enemy projectiles (80), particles (650), texts (80), and several boss-effect lists.
- Temporary farm DOM particles remove themselves after 650 ms.

### Risks and observed issues

- No `blur` or `visibilitychange` handler clears keyboard/pointer input. A held key can remain active after focus loss. This is recorded as an expected-failing Playwright test until the input-manager phase.
- Global listeners and the farm/audio intervals live for the document lifetime. They are not repeatedly registered during normal navigation, but there is no lifecycle abstraction or teardown contract.
- Starting a run schedules a new animation loop. `running=false` stops the previous loop on home, but rapid state changes should be covered by regression tests.
- Arrays are recreated by `filter` every frame and most effects allocate new object literals. Caps prevent unbounded growth but do not remove GC pressure.
- `zones` and `lasers` are time-bounded but not hard-capped; current weapon cooldowns constrain them indirectly.
- One console error was observed in the Codex in-app browser: `MutationObserver.observe` received a non-Node. No `MutationObserver` exists in repository code, so this is likely browser instrumentation; standalone Playwright is the authority for CI.
- The two source files contain a large embedded image data URL, inflating edit and review cost. The merger strips that unused cover from generated `index.html`, but it remains in both sources.
- Runtime image loading has no central manifest/error summary; failed images generally fall back to procedural drawing, which can conceal broken paths.
- Visual capture at a Pixel 7 portrait viewport shows severe HUD overlap: health/XP/skill bars, time, purification count, coins, and weapon tray collide across the top. The language selector also consumes a large bottom-right area. A simple scroll-overflow assertion does not detect this, so Phase 5 needs overlap-aware checks and layout work.

## Input audit

- Desktop: WASD and arrow keys move; Space activates character skill; E activates crop skill; Escape closes codex or toggles pause.
- Pointer/touch: pointer drag on the Canvas acts as an implicit joystick; pointer-up on the window stops it. Skill/crop buttons are clickable.
- There is no dedicated visible virtual joystick, dead-zone configuration, input ownership, confirm/back abstraction, focus-loss reset, or prevention layer shared by UI and gameplay.
- Most UI click handlers use `onclick`; Canvas movement begins only on Canvas pointer-down, so normal overlay buttons generally do not start movement. A unified input layer is still needed to guarantee this across future overlays.

## GitHub Pages and delivery

- No workflow existed at the audited revision.
- README documents a branch-based flow: edit both sources, run `node scripts/merge-bilingual.mjs`, commit `index.html`, and push `main`; Pages serves the repository root.
- There is no framework build output directory. The entire repository root is the static site source.
- Phase 1 preserves branch-based Pages and adds CI/build-artifact checks without switching the Pages source setting.

## Quality tooling before Phase 1

- Tests: none.
- Package manifest/lockfile: none.
- Lint/format: none.
- GitHub Actions: none.
- Automated screenshots: none.
- Source license: no repository-level `LICENSE` file was found. This is a distribution/contribution risk and needs an owner decision; Phase 1 does not invent a license.

## Recommended extraction order

Do not split everything at once. Extract one seam at a time after tests are stable: shared test/runtime utilities, input state, UI theme and interaction controller, combat feedback, audio manager, then pooled collections. Keep data and rendering behavior unchanged during each extraction.
