# Open-source resource ledger

No third-party gameplay code or art was copied during Phase 1. Playwright and GitHub Actions are the only introduced third-party tooling. Candidate runtime resources remain proposals until a later phase approves and records exact imported files.

| Resource | Source | Intended use | License | Introduced? | Usage / idea | Fit, risk, removal |
| --- | --- | --- | --- | --- | --- | --- |
| Playwright | https://github.com/microsoft/playwright | Browser automation, mobile viewport checks, screenshots | Apache-2.0 | Yes, dev dependency | `@playwright/test`, config and project-authored tests only | Strong multi-browser tooling. Browser downloads increase CI time. Remove package, config, tests, and workflow steps. |
| GitHub `checkout`, `setup-node`, `upload-artifact` | https://github.com/actions | CI checkout, Node setup, reports/artifacts | MIT | Yes, workflow references | Versioned Actions only; no vendored code | Native GitHub integration. Major tags require periodic review. Remove corresponding workflow steps. |
| GitHub Pages Actions | https://github.com/actions/deploy-pages | Possible future Actions-based Pages deployment | MIT | No | Reference only; current branch deployment is preserved | Official route if repository setting later changes to Actions. Introducing now could conflict with current Pages source. |
| howler.js | https://github.com/goldfire/howler.js | Audio manager, sound sprites, pooling, volume/mute | MIT | No | Candidate for direct runtime use in Phase 3 | Small and mature, but current procedural Web Audio may need less code with a project-owned manager. Remove import and adapter if adopted. |
| nipplejs | https://github.com/yoannmoinet/nipplejs | Mobile virtual joystick | MIT | No | Candidate for direct use behind the future input adapter | Vanilla, zero-dependency, actively published. Risk: visual style and pointer lifecycle must be adapted. Remove package and adapter. |
| Kontra.js | https://github.com/straker/kontra | Object-pool/game-loop design reference | MIT | No | Reference only; do not merge the library or copy large subsystems | Its Canvas focus is relevant, but adopting the full micro-engine would violate the no-rewrite goal. Implement a minimal project-owned pool from requirements, not copied code. |
| seedrandom | https://github.com/davidbau/seedrandom | Deterministic random test runs | MIT | No | Candidate for test-only direct use | Mature and replaceable, but a tiny project-owned seeded PRNG may be enough. Never replace production randomness by default. |
| Kenney Interface Sounds | https://kenney.nl/assets/interface-sounds | UI click, confirm, back sounds | CC0 1.0 | No | Candidate audio files after listening/normalization review | Clear license and broad selection. Risk: inconsistent loudness/timbre with current synthesis. Remove copied files and manifest entries. |
| Kenney Impact Sounds | https://www.kenney.nl/assets/impact-sounds | Hit/critical/kill impacts | CC0 1.0 | No | Candidate audio files after listening/normalization review | Clear license and easy replacement. Risk: realistic impacts may clash with cute tone. |
| Kenney particle packs | https://kenney.nl/assets?q=particle | Pixel/shape inspiration for flashes and smoke | CC0 on individual asset pages; verify exact pack | No | Reference or selected files only after per-pack license confirmation | Useful starting point, but art density/palette must match this project. Do not import until a specific pack is approved. |
| OpenGameArt | https://opengameart.org | Supplemental CC0 audio/particles | Per-asset; must verify | No | Discovery source only | Licenses vary, so each exact asset needs its own record and attribution analysis. |
| AGENTS.md specification | https://agents.md | Agent workflow conventions | Website/spec reference; verify repository license before copying text | No code copied | Structural inspiration only | We authored project-specific rules. Do not copy unlicensed examples verbatim. |

## License decisions still required

- The repository itself has no root `LICENSE`; the owner should choose one before accepting outside contributions.
- Existing art provenance is not fully documented. Treat current assets as project-owned/authorized but do not relicense them until provenance is confirmed.
- GPL/AGPL candidates are excluded unless the owner explicitly approves their obligations.

