# Setup

One-time. Everything here runs on the phone.

## Termux

Install from **F-Droid**, not the Play Store (the Play Store build is
unmaintained and lacks the package manager).

```bash
pkg update && pkg upgrade
pkg install git nodejs clang
```

`clang` is the C compiler. `gcc` works too — `runner/lib/sandbox.mjs` detects
either.

Keep clones in the Termux home directory, **not** `/sdcard`. Android's shared
storage does not support the file permissions and symlinks git needs, and it is
slow.

## Git identity and authentication

```bash
git config --global user.name "Pabitra Chakraborty"
git config --global user.email "pabitra27.7.06@gmail.com"
```

For the GitHub token: a **classic PAT** with `repo` and `workflow`, because the
GitHub CLI device-code flow is unusable on a phone.

```bash
export GH_TOKEN=<your classic PAT>
gh auth setup-git
```

Do not commit the token. Do not leave it in shell history — clear it when you
are done:

```bash
history -d <line-number>
```

## Dependencies

```bash
npm ci --no-audit --no-fund
```

`node_modules` is never committed. After any environment reset, run this again
before `npm run typecheck`.

## CodeC

CodeC is the editor and the terminal. It is an Android app you build yourself
from `https://github.com/pabi277/CodeC`.

It clones into its own private storage:

```
/data/data/com.codeci.ide/files/CodeC/projects/<repo-name>
```

To use it for this project:

1. **Projects -> + -> Clone Git Repo**, and clone this repository.
2. Give CodeC a GitHub token (a classic PAT with `repo`) in its Git settings.
   It stores it in `GitCredentialsStore` and feeds it to git through an askpass
   script, so the token is never written into a remote URL.
3. Edit `learn/<topic>/solutions/<task>.c` in the editor.
4. Stage, commit and push from CodeC's Git panel. CodeC pushes the branch name
   explicitly, and it will not present a local commit as a successful upload.

CodeC also has **Publish to GitHub**, which creates a repository through
`POST /user/repos` and pushes to it — useful for starting a new project, not
needed for this one.

## The Learning Archive

```bash
git clone https://github.com/pabitra27706-oss/portfolio.git ~/portfolio
```

The exporter expects that clone at `../portfolio` by default, or you pass the
path:

```bash
node scripts/export-to-portfolio.mjs ~/portfolio
```

## Deploying the site

You cannot push workflow files from the sandbox. The canonical hardened workflow
is `scripts/deploy-workflow.yml`; the owner copies it into place:

```bash
cp scripts/deploy-workflow.yml .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "ci: harden the Pages workflow"
git push
```

`docs/` is the static export and is gitignored. The deploy guide is `DEPLOY.md`
at the repository root.
