# Versioning & Testing Workflow (PR → `main`)

This document defines how we **branch, review, test, version, tag, and release** so that `main` stays deployable and production deployments are reproducible.

## Principles
- **`main` is always green**: protected, merged only via PR, required CI checks.
- **Everything is traceable**: PR links, Conventional Commits, changelog, tags.
- **Production is reproducible**: deploy from a **tag** `vX.Y.Z` (SemVer).

## Branch model
- **Protected branch**: `main`
- **Working branches**:
  - `feat/<short-description>`
  - `fix/<short-description>`
  - `chore/<short-description>`
  - `docs/<short-description>`
- **Release tags**: `vX.Y.Z`

## PR rules (merge to `main`)
- **1+ approvals** (2 for high-risk areas).
- **Required CI checks**:
  - Typecheck / build
  - Lint / format check
  - Unit tests
  - Integration tests (if applicable)
  - E2E smoke (recommended for FE)
- **Definition of Done** included in PR description:
  - Why/what changed
  - How it was tested (CI + manual)
  - Screenshots/video for UI changes
  - Risk + rollback plan (if needed)

## Commit message convention (recommended)
Use **Conventional Commits** so release notes/version bumps can be automated.

- `feat: ...` → **minor**
- `fix: ...` → **patch**
- `feat!: ...` / `fix!: ...` or `BREAKING CHANGE:` → **major**
- `docs: ...`, `chore: ...`, `refactor: ...`, `test: ...` → usually **no bump**

## SemVer policy
- **MAJOR** \(X\): breaking changes
- **MINOR** \(Y\): backward-compatible features
- **PATCH** \(Z\): backward-compatible fixes

## Testing strategy
- **Unit**: pure logic, hooks, utilities, reducers
- **Integration**: route + state + API boundary mocked
- **E2E**: critical user journeys (smoke on PR; full suite nightly or pre-release)

## CI pipeline (recommended)
On **every PR**:
- Install deps from lockfile
- Typecheck
- Lint + format check
- Unit/integration tests
- Production build
- E2E smoke (optional but recommended)

On **merge to `main`**:
- Deploy to staging (recommended)

On **tag `vX.Y.Z`**:
- Build + test (reproducibility)
- Create GitHub Release (changelog)
- Deploy to production

---

## Git command examples (copy/paste)

### Start a new feature branch

```bash
git checkout main
git pull --rebase origin main
git checkout -b feat/audio-to-features
```

### Keep your branch up to date with `main`

```bash
git fetch origin
git rebase origin/main
```

If you prefer merge (less linear history):

```bash
git fetch origin
git merge origin/main
```

### Commit using Conventional Commits

```bash
git add -A
git commit -m "feat: add audio-to-features UI"
```

Breaking change:

```bash
git add -A
git commit -m "feat!: change tree feature schema"
```

### Push your branch and open a PR

```bash
git push -u origin HEAD
```

### Update your PR branch after review feedback

```bash
git add -A
git commit -m "fix: address PR review feedback"
git push
```

### Sync local `main` after PR merge

```bash
git checkout main
git pull --rebase origin main
```

---

## Releases (tag-based)

### Create a release tag (annotated) and push it
Run this from the commit you want to release (typically `main` HEAD after merge).

```bash
git checkout main
git pull --rebase origin main
git tag -a v1.2.3 -m "v1.2.3"
git push origin v1.2.3
```

### List tags and inspect a tag

```bash
git tag --list "v*"
git show v1.2.3
```

### Create a hotfix from a production tag

```bash
git checkout -b hotfix/fix-export v1.2.3
```

Make the fix, then:

```bash
git add -A
git commit -m "fix: correct CSV export header escaping"
git push -u origin HEAD
```

Open PR → merge to `main` → then tag `v1.2.4`.

---

## Rollback / revert examples

### Revert a single commit on `main` (preferred over reset)

```bash
git checkout main
git pull --rebase origin main
git revert <commit_sha>
git push origin main
```

### Revert a merge commit
Find the merge commit SHA and revert with mainline parent \(usually `-m 1`\):

```bash
git checkout main
git pull --rebase origin main
git revert -m 1 <merge_commit_sha>
git push origin main
```

---

## Notes / options
- If you want fully automated versioning + changelog, consider:
  - **Release Please** or **semantic-release**
- If you deploy from tags, keep tags immutable; never retag the same `vX.Y.Z`.
