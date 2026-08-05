# Cloudflare Pages setup

This project keeps GitHub Pages as the current public release and uses Cloudflare Pages as an additional Git-based preview environment.

## Verified project configuration

- Repository: `Liweiz-Wesley/tuntun-survivors`
- Framework preset: None
- Production branch: `main`
- Root directory: repository root (leave the field blank)
- Build command: `pnpm build:cloudflare`
- Build output directory: `dist`
- Node.js: 20
- Package manager: pnpm (the committed `pnpm-lock.yaml` is used)
- Vite: not required

The normal `pnpm build` command regenerates the bilingual root `index.html`. The Cloudflare command then creates a clean `dist/` artifact containing only `index.html` and `assets/`. Source pages, tests, and repository documentation are not published.

The game uses relative asset paths. No root-absolute `/assets/...` references were found in the source, so branch preview hostnames do not need a path-prefix rewrite. Query parameters are read by client-side JavaScript and remain available on Pages, including:

```text
?testCoins=5000&testMode=1
```

## One-time dashboard steps

1. Sign in to Cloudflare. Do not paste an API token into Codex, source code, chat, or the repository.
2. Open **Workers & Pages**.
3. Select **Create application > Pages > Connect to Git**.
4. Connect GitHub and authorize Cloudflare to access `Liweiz-Wesley/tuntun-survivors`.
5. Select that repository and choose **Begin setup**.
6. Use a project name such as `tuntun-survivors` (the exact available `pages.dev` hostname is decided by Cloudflare).
7. Set **Production branch** to `main`.
8. Set **Framework preset** to `None`.
9. Leave **Root directory** blank.
10. Set **Build command** to `pnpm build:cloudflare`.
11. Set **Build output directory** to `dist`.
12. Add the environment variable `NODE_VERSION=20` if the dashboard build image does not already select Node 20.
13. Save and deploy.

Creating or authorizing the Cloudflare account and GitHub installation is a manual owner action. Repository preparation alone does not mean that a Cloudflare project has been created.

## Branch previews

In the Pages project, open **Settings > Builds > Branch control**:

- Production branch: `main`
- Automatic production deployments: enabled
- Preview branches: **All non-Production branches**

Alternatively, choose **Custom branches** and include only agreed prefixes such as `feature/*`, `fix/*`, and `branch2`.

Every push to a non-production branch creates a preview deployment. Cloudflare provides:

- an immutable commit deployment such as `<hash>.<project>.pages.dev`;
- a moving branch alias such as `feature-hit-effects.<project>.pages.dev`.

Branch aliases are lowercased and characters such as `/` are converted to `-`. The dashboard shows the exact alias under the preview deployment's build details.

## Pull requests

For pull requests created from branches in this repository, the Cloudflare GitHub integration adds a build/check result and a preview link. Fork-based pull requests do not receive the same automatic preview URL behavior.

To inspect a PR preview:

1. Open the pull request in GitHub.
2. Open **Checks** or the checks section near the merge controls.
3. Select the Cloudflare Pages check.
4. Follow the deployment/preview link.

## Keeping GitHub Pages

Do not remove or change the repository's existing GitHub Pages configuration or `.github/workflows/deploy.yml` while Cloudflare is being evaluated. GitHub Pages continues to serve the version from `main`; Cloudflare Pages is an additional deployment target.

For a complete shared build, merge both the owner's and Wesley's accepted changes into `main` before treating a deployment as the full version. Feature-branch Cloudflare URLs are previews and must not be described as the complete `main` build.

## Finding and sharing a preview

1. Open Cloudflare **Workers & Pages** and select the project.
2. Open **Deployments**.
3. Select the deployment for the intended branch and verify its commit SHA.
4. Copy the branch alias when testers should always see the newest push, or the hash URL when they must test one exact commit.
5. Append `?testCoins=5000&testMode=1` when a 5000-coin test save is needed.

Always state the branch and commit SHA next to a preview link. For the complete game, provide only a link whose deployment commit matches the latest remote `main`.

## Deployment failures

1. Open the Pages project and select the failed deployment.
2. Open **View build** and inspect install, build, and upload logs.
3. Reproduce locally with:

   ```powershell
   pnpm install --frozen-lockfile
   pnpm check
   pnpm build:cloudflare
   pnpm test
   ```

4. Confirm that `dist/index.html` and `dist/assets/` exist.
5. Confirm the dashboard uses Node 20, the repository root, `pnpm build:cloudflare`, and `dist`.
6. If GitHub access fails, review the Cloudflare Pages GitHub App installation and repository authorization.
7. If the deployed page is stale, compare the Cloudflare deployment SHA with the GitHub branch SHA before assuming a browser-cache problem.

Cloudflare account operations should use OAuth through the official plugin/MCP or the dashboard. Do not create or commit long-lived API tokens for this Git-integrated Pages workflow.
