# Tuntun Survivors contributor rules

Before modifying the game, read `docs/PROJECT_AUDIT.md`, `docs/IMPROVEMENT_PLAN.md`, `docs/OPEN_SOURCE_RESOURCES.md`, and `PROGRESS.md`.

## Scope and safety

- Do not rewrite the whole game without a documented, reviewed reason.
- Work on one clearly named module at a time and keep unrelated systems unchanged.
- Do not remove existing characters, bosses, weapons, skills, saves, or art assets.
- Preserve the current static GitHub Pages deployment and offline-capable build.
- Treat `source/Tuntun-Survivors-Chinese.html` and `source/Tuntun-Survivors-English.html` as sources; regenerate `index.html` with `pnpm build` after either changes.
- Preserve save compatibility with `tuntun-survivors-save-v2` unless a migration is included and tested.

## Art and UI

- Render pixel art with nearest-neighbor sampling (`image-rendering: pixelated` and Canvas `imageSmoothingEnabled=false`).
- Do not mix pixel densities, outline weights, palettes, or visual styles without an art-direction decision recorded in the plan.
- Keep gameplay feedback readable and avoid sustained flashing or excessive screen shake.

## Dependencies and licenses

- Check the license before adding third-party code or assets.
- Do not copy GitHub code that has no explicit license.
- Record MIT, BSD, Apache, and CC0 sources and exact usage in `docs/OPEN_SOURCE_RESOURCES.md`.
- Do not introduce GPL or AGPL material without explicit project-owner approval.
- Prefer small, replaceable dependencies; do not let a third-party library take over the architecture.

## Verification

- After every change run `pnpm check`, `pnpm build`, and the relevant Playwright tests.
- Open and interact with the actual game after automated checks. Compilation alone is not completion.
- Test both desktop and mobile viewports for UI or input changes.
- Update `PROGRESS.md` after every completed phase with changed files, validation, and known issues.

