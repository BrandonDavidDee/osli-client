# AGENTS.md — OSLI Client

**Object Storage Library Index** — A Quasar v2 + Vue 3 + TypeScript SPA for browsing,
tagging, and sharing media assets stored in S3 buckets or Vimeo.

---

## Architecture Overview

The app has two media source types that run in parallel throughout the codebase:
- **Bucket** — S3-backed media (images/files)
- **Vimeo** — Vimeo-hosted video

This `bucket` vs `vimeo` split is reflected in models (`src/models/`), API modules
(`src/api/`), stores (`src/stores/`), routes, and page directories (`src/pages/items/bucket/`,
`src/pages/items/vimeo/`). When adding a feature for one source type, mirror it for
the other.

**Layouts / route structure** (`src/router/routes.ts`):
- `/login` → `LoginLayout.vue` (unauthenticated)
- `/share/*` → `PublicLayout.vue` (token-free public gallery/item links)
- `/*` → `MainLayout.vue` (authenticated, JWT-guarded)

---

## Developer Workflows

```bash
# Start dev server (HTTPS on localhost)
quasar dev

# Lint
npm run lint

# Production build
quasar build

# Deploy (builds then syncs dist/spa → S3)
npm run deploy   # calls ./deploy.sh → aws s3 sync
```

**Environment variables** (read via `dotenv` in `quasar.config.js`):
```
API_DEV          # backend base URL for dev
API_PRODUCTION   # backend base URL for prod
COMPANY_NAME / COMPANY_LOGO / COMPANY_URL / APP_TITLE
```
The `API` env var is injected at build time as `process.env.API`.

Dev server runs with `https: true`; self-signed cert is expected locally.

---

## Key Patterns

### API Layer (`src/api/`)
Every API module exports plain async functions that wrap `api` (the Axios instance from
`src/boot/axios.ts`) in a `try/catch` and call `errorHandler` on failure:

```ts
export async function galleryCreate(payload: Gallery) {
  try {
    return await api.post(path, payload);
  } catch (err) {
    return errorHandler(err);  // shows Quasar Notify; suppresses 404 toasts
  }
}
```
Never call `api` directly from a component — always go through an `src/api/` function.

### Auth Flow (`src/boot/axios.ts`, `src/stores/auth.ts`)
- JWT access token stored in Pinia state; refresh token stored in a `Secure; SameSite=Strict` cookie.
- On boot, `refreshTokenSet()` is called once to hydrate tokens from the cookie.
- A response interceptor auto-retries on 401 after refreshing tokens.
- Routes named `gallery-link-public` and `item-link-public` bypass the auth guard entirely.

### Notifications (`src/services/notify.ts`)
Use the four helpers — `positiveNotification`, `negativeNotification`, `warningNotification`,
`infoNotification` — rather than calling `Notify.create` directly.

### Dialogs (`src/components/DialogMaster.vue`)
Wrap any modal content in `<DialogMaster v-model="show">` with the `#content` slot.
Supports `size` prop (`'small' | 'large' | 'full'`) and optional close header/footer.

### Pinia Stores (`src/stores/`)
- `auth` — tokens + current user
- `sources` — lazy-loaded bucket/vimeo source lists (cached; only fetched if empty)
- `search` — global filter string, selected tags, grid/list view toggle

### Form Validation (`src/services/rules.ts`)
Use the exported rule factories (`required`, `charLengthRule`, `urlFriendlyStringRule`)
as Quasar `:rules` arrays.

---

## Key Files Reference

| Path | Purpose |
|------|---------|
| `src/boot/axios.ts` | Axios instance, auth interceptors, router guard |
| `src/api/error-handler.ts` | Centralised API error + notification logic |
| `src/stores/auth.ts` | JWT auth state & cookie management |
| `src/router/routes.ts` | Full route map (layout groupings + public routes) |
| `quasar.config.js` | Build targets, env injection, Quasar plugins (Cookies, Notify, Meta) |
| `deploy.sh` | Build + S3 deploy |

