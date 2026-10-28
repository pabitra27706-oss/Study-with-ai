# Deploying this site

The site is a **static export** — no server, no database, no API keys in the
browser. It can be hosted anywhere that serves static files.

**The live URL will be:**

```
https://pabitra27706-oss.github.io/Study-with-ai/
```

There are two ways to get there. **Path A** is the permanent one; **Path B**
gets you a live URL today with a single click.

> **Doing it from a phone (Termux)?** Skip to [Path A2](#path-a2--termux-android)
> — one script does the whole thing, and you never build the site on Android.

---

## Path A — GitHub Actions (recommended, automatic forever)

The workflow file lives at **`scripts/deploy-workflow.yml`** in this repo. It
builds the site on every push to `main` and publishes it to GitHub Pages.

**Two steps, once:**

**1. Install the workflow and push it**

```bash
mkdir -p .github/workflows
cp scripts/deploy-workflow.yml .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deploy workflow"
git push origin main
```

> The copy has to be made by you: the token used to build this repo is not
> permitted to push files under `.github/workflows/`. It is the only manual
> step in the whole deployment.

**2. Turn Pages on**

Repo → **Settings** → **Pages** → **Build and deployment** → Source:
**GitHub Actions** → Save.


That is it. From now on every push to `main` redeploys the site automatically.

### What the workflow does

| Variable | Value |
| -------- | ----- |
| `NEXT_OUTPUT` | `export` |
| `NEXT_PUBLIC_BASE_PATH` | `/Study-with-ai` |
| `NEXT_PUBLIC_SITE_HOST` | `pabitra27706-oss.github.io` |

Artifact uploaded: `out/` → published to GitHub Pages.

### The workflow YAML (for reference)

The canonical copy is `scripts/deploy-workflow.yml`. It is also inlined here
so the file can be recreated from scratch if you ever lose it.

```yaml
name: Deploy site to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
        env:
          NEXT_OUTPUT: export
          NEXT_PUBLIC_BASE_PATH: /Study-with-ai
          NEXT_PUBLIC_SITE_HOST: pabitra27706-oss.github.io
      - run: touch out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

> If you rename the repository, change `NEXT_PUBLIC_BASE_PATH` to match the
> new name. If you switch to a user site (`<user>.github.io` → `/`), set
> `NEXT_PUBLIC_BASE_PATH` to empty.

---

## Path A2 — Termux (Android)

Everything below runs on your phone in Termux. The script does the lot.

**Install Termux properly first:** use the **F-Droid** build
(`https://f-droid.org/packages/com.termux/`), not the Play Store one — the
Play Store version is stale and its package manager is unreliable.

### One command

```bash
git clone https://github.com/pabitra27706-oss/Study-with-ai.git
cd Study-with-ai
bash scripts/termux-setup.sh
```

The script:

1. installs `git` and `gh` (`pkg install git gh`),
2. asks you to log in once — `gh auth login --hostname github.com --git-protocol https --web`
   prints a one-time code; open the URL in your phone browser and paste the code
   back,
3. copies `scripts/deploy-workflow.yml` → `.github/workflows/deploy.yml`,
4. commits and pushes it to `main`,
5. turns GitHub Pages on with `gh api --method POST repos/…/pages -f build_type=workflow`,
6. prints the live URL.

**Watch the build:**

```bash
gh run watch
```

**Live URL** (about two minutes after the build turns green):

```
https://pabitra27706-oss.github.io/Study-with-ai/
```

### Why you do *not* build on the phone

Next.js 16 ships native binaries (Turbopack, SWC, lightningcss) compiled
against **glibc**. Android uses **bionic**, so `npm run build` fails on a
plain Termux install. The GitHub Actions runner is real Ubuntu, so the build
happens there — your phone only does `git` and `gh`. That is the whole point
of this path.

### If you ever *do* want to build on the phone

Use a glibc environment:

```bash
bash scripts/termux-build.sh
```

It installs `proot-distro` + Ubuntu, then Node 22 inside it, clones the repo
into Ubuntu's filesystem, runs `npm ci` and `npm run build:pages`, and pushes
the rebuilt `docs/`. Expect a few hundred MB of download the first time, and
a slow build. Only worth it if you are offline or you want to preview a
change on the phone.

---

## Path B — deploy the built folder (live today, one click)

The **built site is already committed in `docs/`**. GitHub Pages can serve a
folder from a branch directly, with no workflow and no CI.

**One step:**

Repo → **Settings** → **Pages** → **Build and deployment** → Source:
**Deploy from a branch** → Branch: **main**, Folder: **/docs** → Save.

The site goes live at the URL above within a minute or two.

**Downside:** the site only changes when the `docs/` folder changes. To publish
an update, rebuild and commit:

```bash
npm run build:pages   # builds with the right basePath straight into docs/
git add docs
git commit -m "Update published site"
```

Once you are on **Path A**, stop rebuilding by hand — delete `docs/` and let
the workflow own it.

---

## Path C — Vercel (free tier, zero config)

1. Import the repo at <https://vercel.com/new>.
2. Framework preset: **Next.js**. Leave the build command as `next build`.
3. Do **not** set `NEXT_OUTPUT=export` — Vercel handles Next.js natively.
4. Add `NEXT_PUBLIC_SITE_HOST` = your Vercel domain.

Because `basePath` is empty in that setup, no path changes are needed.

## Path D — Netlify

1. Add the repo at <https://app.netlify.com/drop>.
2. Build command: `NEXT_OUTPUT=export npm run build`.
3. Publish directory: `out`.

## Path E — Cloudflare Pages

1. **Create a project** → connect the GitHub repo.
2. Framework preset **Next.js**; build command `NEXT_OUTPUT=export npx next build`;
   output `out`.

---

## Local checks before you push

```bash
npm run typecheck     # TypeScript, strict
npm run lint          # ESLint
npm run build         # static export into ./out
npm run preview       # serve ./out locally to verify
npm run stats         # repo status in the terminal
```

`npm run dev` gives you the normal Next.js dev server with hot reload.

---

## Adding a page

1. Create `app/<route>/page.tsx` (server component by default).
2. Put the *content* in `content/*.ts` so it can be edited without touching
   React.
3. Export a `metadata` object with a title and description.
4. Add the route to `app/sitemap.ts`.
5. If it is a journal entry, drop a markdown file in `journal/` with the
   frontmatter shape (`title`, `date`, `tags`, `summary`, `mistakes`) — the
   route and the sitemap pick it up automatically.

---

## Troubleshooting

**Blank page after deploy** — check that `basePath` matches the URL. If the
site lives at `https://user.github.io/repo/`, `NEXT_PUBLIC_BASE_PATH` must be
`/repo`.

**404 on a nested route** — with static export, every dynamic route needs
`generateStaticParams`. The journal route already has it.

**Styles missing** — `app/globals.css` must be imported in
`app/layout.tsx`; Tailwind v4 uses `@import "tailwindcss";` plus the
`@theme` block in that file.

**Fonts missing** — fonts are self-hosted from npm (`@fontsource-variable/*`),
imported in `app/layout.tsx`. No external font CDN is used, so the build works
offline and there is no third-party request.

**"Get permission denied" when committing the workflow** — commit it from a
terminal using your own GitHub account, not from a restricted app token.
