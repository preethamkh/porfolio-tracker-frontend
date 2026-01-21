# Build Version Configuration

## Overview

The app automatically generates and displays version information in the footer to help track deployments and debug issues.

## What's Displayed

- **Version**: Semantic version + build number (e.g., `v1.0.0+build.123`)
- **Git Commit**: Short SHA of the deployed commit (e.g., `abc1234`)
- **Environment**: Deployment environment (production/preview)

## How It Works

### 1. Automatic Version Generation ✨

The version is **automatically generated at build time** - no manual updates needed!

**Format**: `{package.json version}+build.{git commit count}`

- Example: `1.0.0+build.123`

**How it works**:

1. Vite reads the base version from `package.json` (e.g., `1.0.0`)
2. Counts total commits in the repo: `git rev-list --count HEAD`
3. Combines them: `1.0.0+build.123`
4. Each push to main automatically increments the build number!

**Configuration**: See `vite.config.ts` - the `generateVersion()` function runs on every build.

### 2. Git Commit & Environment (Automatic)

Vercel automatically provides these environment variables during build:

- `VITE_VERCEL_GIT_COMMIT_SHA` - Full commit SHA
- `VITE_VERCEL_GIT_COMMIT_REF` - Branch name (e.g., `main`)
- `VITE_VERCEL_ENV` - Environment (`production`, `preview`, or `development`)

**No configuration needed** - Vercel injects these automatically when you deploy.

### 3. Local Development

In local development, the footer shows:

```
v1.0.0+build.45 • dev • development
```

(Build number = your local commit count)

### 4. Production

In production, the footer shows:

```
v1.0.0+build.123 • abc1234 • production
```

## Updating Version

### Automatic Build Numbers (No Action Required) ✅

Every commit automatically increments the build number. Just push to main and the version updates!

### Semantic Version Updates (Manual, when needed)

Only update `package.json` when making **major/minor releases**:

```bash
# For bug fixes: 1.0.0 → 1.0.1
npm version patch

# For new features: 1.0.0 → 1.1.0
npm version minor

# For breaking changes: 1.0.0 → 2.0.0
npm version major
```

This creates a git tag and automatically commits the change.

**When to update semantic version**:

- ✅ Major new feature release
- ✅ Breaking API changes
- ✅ Significant UI overhaul
- ❌ Not needed for every commit (build number handles this)

## Display Locations

Currently displayed on:

- ✅ Login Page footer
- 🔄 TODO: Register Page footer
- 🔄 TODO: Dashboard footer (optional)

## Code References

- Constants: [`src/utils/constants.ts`](../src/utils/constants.ts)
- Display: [`src/pages/auth/LoginPage.tsx`](../src/pages/auth/LoginPage.tsx)
- Environment: [`.env.local`](../.env.local)

## Troubleshooting

##**Version Generation**: [`vite.config.ts`](../vite.config.ts) - `generateVersion()` function

- **Constants**: [`src/utils/constants.ts`](../src/utils/constants.ts) - `ENV.APP_VERSION`
- **Type Definitions**: [`src/vite-env.d.ts`](../src/vite-env.d.ts) - `__APP_VERSION__` global
- **Display**: [`src/pages/auth/LoginPage.tsx`](../src/pages/auth/LoginPage.tsx)
- **Base Version**: [`package.json`](../package.json) - Semantic version

## How the Auto-Increment Works

```
package.json: "1.0.0"
         ↓
    vite.config.ts (at build time)
         ↓
    git rev-list --count HEAD → "123"
         ↓
    Combines to: "1.0.0+build.123"
         ↓
    Injected as __APP_VERSION__ constant
         ↓
    Available in constants.ts → ENV.APP_VERSION
         ↓
    Displayed in footer
```

**Every commit = new build number automatically!**riables

### Version not updating

- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server: `npm run dev`

### Commit SHA not showing

- Vercel only injects this during actual deployments, not preview URLs from local builds
- Ensure `VITE_` prefix is present (required for Vite to expose to client)
