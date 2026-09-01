# Mona Lisa Connect

The "connect all your accounts" surface — the Lorraen Madre equivalent of the
Composio `~/connect/clients` dashboard. A client links their tech accounts and
their insurance policies once; the seven Mona Lisa Stack agents then act on
those accounts with approval.

- **UI:** `src/connect/ConnectDashboard.tsx`, reachable from the **Connections**
  tab in the app header.
- **Catalog:** `src/connect/catalog.ts` — the single source of truth for which
  accounts can be linked and which WISH WELL house each one feeds.
- **Engine:** [Nango](https://nango.dev) for every OAuth provider, Canopy Connect
  for insurance, and the existing in-app flow for Google Drive.
- **Server routes:** `server.ts`, section "Mona Lisa Connect".
- **Storage:** Firestore `users/{uid}/connections/{connectorKey}` — status only;
  the actual OAuth tokens live inside Nango / Canopy, never in our database.

```
Browser ──POST /api/connect/session──▶ server ──▶ Nango  (mints session token)
Browser ──Nango Connect UI (OAuth)──▶ provider
Nango ──POST /api/connect/webhook?secret=…──▶ server ──▶ Firestore (status)
Browser ──GET /api/connect/connections──▶ server ──▶ Nango + Firestore (merged)
```

---

## Milestone 1 — one real end-to-end connection

Goal: sign in, click **Connect** on GitHub (or Notion/Slack), complete OAuth,
see the card flip to **Connected**, and see it persist on reload.

### 1. Nango Cloud account (free)

1. Sign up at <https://app.nango.dev>. (Self-hosting is the long-term plan — see
   below — but Cloud gets Milestone 1 done today, and the code is identical.)
2. **Environment Settings → copy the `Secret Key`** for the `dev` environment.
3. **Integrations → Configure New Integration → GitHub.** For a first test you
   can use Nango's shared dev OAuth app; for production add your own GitHub OAuth
   app Client ID / Secret. Set the integration **Unique Key** to exactly
   `github` (must match `integrationId` in `catalog.ts`).
4. **Environment Settings → Webhooks → Callback URL:**
   `https://<your-app-url>/api/connect/webhook?secret=<CONNECT_WEBHOOK_SECRET>`
   Enable "Connection creation" and "Auth errors".

### 2. Environment variables

Add to your local `.env` and to the Cloud Run / Vercel service:

```
NANGO_HOST=https://api.nango.dev
NANGO_SECRET_KEY=<dev secret key from step 1.2>
CONNECT_WEBHOOK_SECRET=<invent a long random string>
APP_URL=https://<your-app-url>      # already used by the Google flow
```

### 3. Run it

```
npm install
npm run dev
```

Sign into Orbit → **Connections** tab → **Connect** on GitHub → approve in the
popup. The webhook writes `users/{uid}/connections/github` and the card shows
**Connected**. `GET /api/connect/connections` merges the live Nango list with
that mirror on every load and window-focus.

### 4. Verify

- Card shows **Connected** with a synced date.
- Reload the page — still connected (proves the Firestore mirror).
- Click **Disconnect** — calls `DELETE /api/connect/connections/:id`, removes it
  from Nango and the mirror, card returns to **Not linked**.
- In the Nango dashboard, **Connections** lists one connection whose
  `endUserId` equals the Firebase uid.

---

## Adding more tech providers

1. Configure the integration in Nango, Unique Key = the `integrationId` you want.
2. Add/expand the entry in `src/connect/catalog.ts` and the `NANGO_INTEGRATIONS`
   map in `server.ts` (keep the two in sync — same key, same integration id).
3. That's it — no new routes. The dashboard renders the new card automatically.

Providers already in the catalog: Notion, Dropbox, Monday, Trello, Google
Calendar, GitHub, Slack, Gmail, Shopify, Stripe, QuickBooks, LinkedIn, YouTube.
(`vercel` and `plaid` are in the catalog but flagged `comingSoon` until their
integrations are configured.)

---

## Insurance — Canopy Connect

Carriers do not offer OAuth, so insurance uses a consumer-permissioned data
aggregator instead of Nango.

1. Get a Canopy account and API credentials (<https://www.usecanopyconnect.com>).
   Sandbox first.
2. Set env vars:
   ```
   CANOPY_BASE=https://sandbox.usecanopy.com/api/v1.0.0
   CANOPY_CLIENT_ID=<from Canopy>
   CANOPY_API_KEY=<from Canopy>
   ```
3. Register the webhook in Canopy:
   `https://<your-app-url>/api/connect/insurance/webhook?secret=<CONNECT_WEBHOOK_SECRET>`
4. **Confirm the request/response field names** in `server.ts`
   (`/api/connect/insurance/url` and the webhook handler) against Canopy's
   current API docs — they are isolated in one place and marked with a `NOTE:`
   comment because they were written from the documented pattern, not a live
   account. Expect to adjust `connect_url` / `pull` / `policies` key names.

The insurance card behaves like any other: **Connect** opens Canopy's hosted
flow in a popup; the webhook writes `users/{uid}/connections/insurance-canopy`
with a `policyCount`.

---

## Moving to self-hosted Nango (later)

The picked long-term path. When ready:

1. Run Nango via Docker Compose (Postgres + Redis + the Nango server) on a
   persistent host — Render, Railway, Fly.io, or a small VM. See
   <https://docs.nango.dev/host/self-host/self-hosting-instructions>.
2. Re-create the integrations there (or export/import from Cloud).
3. Change one env var: `NANGO_HOST=https://nango.your-domain.com`.
4. Nothing else changes — `server.ts` talks to Nango over its REST API and
   `@nangohq/frontend` takes `host` from the session token's origin.

---

## Security notes

- OAuth tokens never touch our database or the browser — Nango/Canopy hold them.
- `users/{uid}/connections/*` is **read-only to the owner** and **write-denied to
  all clients** in `firestore.rules`; only the server (Admin SDK) writes it, and
  only from a webhook that carries `CONNECT_WEBHOOK_SECRET`.
- Session tokens minted by `/api/connect/session` are short-lived and scoped to
  the one integration being connected (`allowed_integrations`).
- Per the Mona Lisa Stack approval rule: connecting an account grants *read /
  draft* capability to agents. Anything that publishes, pays, or changes
  settings still needs founder approval before an agent acts.
