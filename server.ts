import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import { google } from 'googleapis';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const PORT = Number(process.env.PORT) || 3000;
const FOLDERS_MANIFEST = [
  { key: "sun", name: "Sun - Brand Identity" },
  { key: "moon", name: "Moon - AI Marketing Production" },
  { key: "mars", name: "Mars - Business Activation" },
  { key: "mercury", name: "Mercury - System Framework" },
  { key: "venus", name: "Venus - Content Library" },
  { key: "saturn", name: "Saturn - Digital Architecture" },
  { key: "jupiter", name: "Jupiter - Capital Expansion" },
  { key: "neptune", name: "Neptune - Narrative Design" },
  { key: "uranus", name: "Uranus - Social Architecture" },
  { key: "pluto", name: "Pluto - Agentic Framework" },
  { key: "north-node", name: "North Node - Executive Vision" },
  { key: "south-node", name: "South Node - Executive Mission" },
  { key: "church", name: "Church - Executive Ministry" },
  { key: "trust", name: "Trust - The Vault" }
];

// Lazy Initialize Firebase Admin.
// NOTE: this Firebase project has no "(default)" Firestore database — the app
// uses a named database (matches src/firebase.ts). `admin.firestore()` would
// hit "(default)" and 404, so we resolve the named DB via getFirestore().
const FIRESTORE_DATABASE_ID =
  process.env.FIRESTORE_DATABASE_ID || 'ai-studio-3076a6e6-4299-41a2-b5a8-ecbe3cd8816c';
let db: admin.firestore.Firestore;
function getDb() {
  if (!db) {
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0315145662'
      });
    }
    db = getFirestore(admin.app(), FIRESTORE_DATABASE_ID);
  }
  return db;
}

// Google OAuth Client helper
function getOAuthClient(redirectUri?: string) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

async function startServer() {
  const app = express();
  
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());
  app.use(
    cookieSession({
      name: 'session',
      keys: [process.env.SESSION_SECRET || 'llm-framework-secret'],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      // In prod the app is served over HTTPS behind a cross-site OAuth popup, so
      // the cookie must be Secure + SameSite=None. Over plain-HTTP localhost that
      // combo makes the browser drop the cookie entirely, so relax it for dev.
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    })
  );

  // --- API Routes ---

  // Auth Status
  app.get('/api/auth/status', async (req, res) => {
    const uid = (req.session as any)?.uid;
    if (!uid) return res.json({ authenticated: false });

    try {
      const userDoc = await getDb().collection('users').doc(uid).get();
      const userData = userDoc.data();
      res.json({ 
        authenticated: true, 
        googleConnected: !!userData?.googleRefreshToken,
        rootFolderId: userData?.rootFolderId
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Login (Simple app session for demo/dev, usually would use Firebase ID tokens)
  app.post('/api/auth/login', (req, res) => {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: 'Missing uid' });
    (req.session as any).uid = uid;
    res.json({ success: true });
  });

  // Google OAuth URL
  app.get('/api/auth/google/url', (req, res) => {
    const redirectUri = `${process.env.APP_URL}/auth/callback`;
    const oauth2Client = getOAuthClient(redirectUri);

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.appdata'
      ],
    });

    res.json({ url });
  });

  // Google OAuth Callback Handler
  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const { code } = req.query;
    const uid = (req.session as any)?.uid;

    if (!uid || !code) {
      return res.status(400).send('Authentication state missing.');
    }

    try {
      const redirectUri = `${process.env.APP_URL}/auth/callback`;
      const oauth2Client = getOAuthClient(redirectUri);
      const { tokens } = await oauth2Client.getToken(code as string);

      if (tokens.refresh_token) {
        // Store refresh token and connection info
        await getDb().collection('users').doc(uid).set({
          googleRefreshToken: tokens.refresh_token,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        // Trigger Folder Tree Creation in background
        createFolderTreeForUser(uid, tokens.refresh_token).catch(console.error);

        res.send(`
          <html>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                  window.close();
                } else {
                  window.location.href = '/';
                }
              </script>
              <p>Google connected! This window will close.</p>
            </body>
          </html>
        `);
      } else {
        res.status(500).send('No refresh token received. Try removing access and reconnecting.');
      }
    } catch (error) {
      console.error('OAuth Callback Error:', error);
      res.status(500).send('Authentication failed.');
    }
  });

  // Manual Trigger: Create Folder Tree
  app.post('/api/google/setup-folders', async (req, res) => {
    const uid = (req.session as any)?.uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const userDoc = await getDb().collection('users').doc(uid).get();
      const userData = userDoc.data();
      if (!userData?.googleRefreshToken) return res.status(400).json({ error: 'Google not connected' });

      const result = await createFolderTreeForUser(uid, userData.googleRefreshToken);
      res.json({ success: true, folderMap: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create folders' });
    }
  });

  // Generate Doc Endpoint
  app.post('/api/google/generate-doc', async (req, res) => {
    const uid = (req.session as any)?.uid;
    const { sectionKey, title, content } = req.body;

    if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
      const userDoc = await getDb().collection('users').doc(uid).get();
      const userData = userDoc.data();
      if (!userData?.googleRefreshToken) return res.status(400).json({ error: 'Google not connected' });

      const folderId = userData.folderMap?.[sectionKey] || userData.rootFolderId;
      
      const docMetadata = await createGoogleDoc(userData.googleRefreshToken, folderId, title, content);
      
      // Save metadata
      await getDb().collection('users').doc(uid).collection('documents').add({
        docId: docMetadata.id,
        title,
        sectionKey,
        folderId,
        createdAt: new Date().toISOString()
      });

      res.json({ success: true, docId: docMetadata.id });
    } catch (error) {
      console.error('Doc Generation Error:', error);
      res.status(500).json({ error: 'Failed to generate document' });
    }
  });

  // ===================================================================
  // Mona Lisa Connect — multi-provider account linking (Nango + Canopy)
  // ===================================================================

  const NANGO_HOST = process.env.NANGO_HOST || 'https://api.nango.dev';
  const NANGO_SECRET_KEY = process.env.NANGO_SECRET_KEY || '';
  const CONNECT_WEBHOOK_SECRET = process.env.CONNECT_WEBHOOK_SECRET || '';

  // Catalog keys must stay in sync with src/connect/catalog.ts.
  // Maps our stable connector key <-> the Nango integration id.
  const NANGO_INTEGRATIONS: Record<string, string> = {
    notion: 'notion',
    dropbox: 'dropbox',
    monday: 'monday',
    trello: 'trello',
    'google-calendar': 'google-calendar',
    github: 'github-getting-started',
    vercel: 'vercel',
    slack: 'slack',
    gmail: 'google-mail',
    shopify: 'shopify',
    stripe: 'stripe',
    quickbooks: 'quickbooks',
    plaid: 'plaid',
    linkedin: 'linkedin',
    youtube: 'youtube',
  };
  const KEY_BY_INTEGRATION: Record<string, string> = Object.fromEntries(
    Object.entries(NANGO_INTEGRATIONS).map(([k, v]) => [v, k]),
  );

  async function nangoFetch(pathname: string, init: RequestInit = {}) {
    const res = await fetch(`${NANGO_HOST}${pathname}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${NANGO_SECRET_KEY}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });
    const text = await res.text();
    const body = text ? JSON.parse(text) : {};
    if (!res.ok) {
      throw new Error(`Nango ${pathname} -> ${res.status} ${JSON.stringify(body)}`);
    }
    return body;
  }

  // 1. Mint a short-lived Connect session token for the signed-in user.
  app.post('/api/connect/session', async (req, res) => {
    const uid = (req.session as any)?.uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    if (!NANGO_SECRET_KEY) return res.status(503).json({ error: 'Connect service not configured' });

    try {
      const userDoc = await getDb().collection('users').doc(uid).get();
      const userData = userDoc.data() || {};
      const { integrationId } = req.body || {};

      const payload: Record<string, unknown> = {
        end_user: {
          id: uid,
          email: userData.email || undefined,
          display_name: userData.displayName || undefined,
        },
      };
      if (integrationId) payload.allowed_integrations = [integrationId];

      const body = await nangoFetch('/connect/sessions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      res.json({ token: body?.data?.token });
    } catch (error) {
      console.error('Connect session error:', error);
      res.status(502).json({ error: 'Could not create session' });
    }
  });

  // 2. List the user's connections, merged with catalog keys + local metadata.
  app.get('/api/connect/connections', async (req, res) => {
    const uid = (req.session as any)?.uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const connections: any[] = [];

      // Local mirror (written by the webhook) — authoritative for status chips
      // even if Nango is briefly unreachable.
      const snap = await getDb().collection('users').doc(uid).collection('connections').get();
      const local = new Map<string, any>();
      snap.forEach((d) => local.set(d.id, d.data()));

      if (NANGO_SECRET_KEY) {
        try {
          const body = await nangoFetch(`/connections?endUserId=${encodeURIComponent(uid)}`);
          for (const conn of body?.connections || []) {
            const key = KEY_BY_INTEGRATION[conn.provider_config_key] || conn.provider_config_key;
            const l = local.get(key) || {};
            connections.push({
              key,
              status: conn.errors?.length ? 'error' : 'connected',
              connectionId: conn.connection_id,
              provider: conn.provider_config_key,
              lastSyncedAt: l.lastSyncedAt || conn.updated_at,
              detail: conn.errors?.[0]?.message,
            });
          }
        } catch (e) {
          console.warn('Nango connection list unavailable, using local mirror:', e);
        }
      }

      // Fold in anything the mirror knows about that Nango didn't return
      // (e.g. Canopy insurance, or Nango offline).
      for (const [key, data] of local) {
        if (!connections.find((c) => c.key === key)) {
          connections.push({ key, ...data });
        }
      }

      res.json({ connections });
    } catch (error) {
      console.error('Connect list error:', error);
      res.status(500).json({ error: 'Failed to list connections' });
    }
  });

  // 3. Disconnect.
  app.delete('/api/connect/connections/:connectionId', async (req, res) => {
    const uid = (req.session as any)?.uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    const { connectionId } = req.params;
    const { key, provider } = req.body || {};

    try {
      if (NANGO_SECRET_KEY && provider) {
        await nangoFetch(
          `/connections/${encodeURIComponent(connectionId)}?provider_config_key=${encodeURIComponent(provider)}`,
          { method: 'DELETE' },
        );
      }
      if (key) {
        await getDb().collection('users').doc(uid).collection('connections').doc(key).delete();
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Connect delete error:', error);
      res.status(502).json({ error: 'Failed to disconnect' });
    }
  });

  // 4. Nango webhook — auth creation / refresh / error. No session cookie here,
  //    so we trust a shared secret in the query string and the endUser id in
  //    the payload. Configure the URL in Nango as:
  //      {APP_URL}/api/connect/webhook?secret={CONNECT_WEBHOOK_SECRET}
  app.post('/api/connect/webhook', async (req, res) => {
    if (!CONNECT_WEBHOOK_SECRET || req.query.secret !== CONNECT_WEBHOOK_SECRET) {
      return res.status(401).end();
    }
    try {
      const evt = req.body || {};
      const uid = evt.endUser?.endUserId || evt.endUser?.id || evt.end_user?.id;
      const providerConfigKey = evt.providerConfigKey || evt.provider_config_key;
      if (uid && providerConfigKey) {
        const key = KEY_BY_INTEGRATION[providerConfigKey] || providerConfigKey;
        const success = evt.success !== false && evt.operation !== 'auth_error';
        await getDb()
          .collection('users').doc(uid)
          .collection('connections').doc(key)
          .set(
            {
              key,
              provider: providerConfigKey,
              connectionId: evt.connectionId || evt.connection_id || null,
              status: success ? 'connected' : 'error',
              detail: success ? null : evt.error?.description || 'Authorization failed',
              lastSyncedAt: new Date().toISOString(),
            },
            { merge: true },
          );
      }
      res.json({ received: true });
    } catch (error) {
      console.error('Connect webhook error:', error);
      res.status(200).json({ received: true }); // never make Nango retry-storm us
    }
  });

  // --- Insurance via Canopy Connect --------------------------------------
  // Consumer-permissioned pull of auto/home/life/renters/umbrella policies.
  // NOTE: confirm the exact base URL + field names against your Canopy account
  //       docs before going live — kept in one place here on purpose.
  const CANOPY_BASE = process.env.CANOPY_BASE || 'https://sandbox.usecanopy.com/api/v1.0.0';
  const CANOPY_CLIENT_ID = process.env.CANOPY_CLIENT_ID || '';
  const CANOPY_API_KEY = process.env.CANOPY_API_KEY || '';

  app.post('/api/connect/insurance/url', async (req, res) => {
    const uid = (req.session as any)?.uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    if (!CANOPY_CLIENT_ID || !CANOPY_API_KEY) {
      return res.status(503).json({ error: 'Insurance connect not configured' });
    }
    try {
      // Create a pull scoped to this user; Canopy returns a hosted Connect URL.
      const r = await fetch(`${CANOPY_BASE}/pulls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CANOPY_API_KEY}`,
        },
        body: JSON.stringify({
          client_id: CANOPY_CLIENT_ID,
          metadata: { uid },
          redirect_url: `${process.env.APP_URL}/connect/insurance/done`,
          webhook_url: `${process.env.APP_URL}/api/connect/insurance/webhook?secret=${CONNECT_WEBHOOK_SECRET}`,
        }),
      });
      const body = await r.json();
      if (!r.ok) throw new Error(JSON.stringify(body));
      res.json({ url: body.connect_url || body.hosted_url || body.url });
    } catch (error) {
      console.error('Canopy pull create error:', error);
      res.status(502).json({ error: 'Could not start insurance connection' });
    }
  });

  app.post('/api/connect/insurance/webhook', async (req, res) => {
    if (!CONNECT_WEBHOOK_SECRET || req.query.secret !== CONNECT_WEBHOOK_SECRET) {
      return res.status(401).end();
    }
    try {
      const evt = req.body || {};
      const uid = evt.metadata?.uid || evt.pull?.metadata?.uid;
      if (uid) {
        const pull = evt.pull || evt;
        await getDb()
          .collection('users').doc(uid)
          .collection('connections').doc('insurance-canopy')
          .set(
            {
              key: 'insurance-canopy',
              provider: 'canopy',
              status: evt.type === 'PULL_ERROR' ? 'error' : 'connected',
              detail: evt.type === 'PULL_ERROR' ? 'Pull failed — please retry' : null,
              policyCount: Array.isArray(pull.policies) ? pull.policies.length : undefined,
              pullId: pull.pull_id || pull.id || null,
              lastSyncedAt: new Date().toISOString(),
            },
            { merge: true },
          );
      }
      res.json({ received: true });
    } catch (error) {
      console.error('Canopy webhook error:', error);
      res.status(200).json({ received: true });
    }
  });

  // --- Helper Functions ---

  async function createFolderTreeForUser(uid: string, refreshToken: string) {
    const oauth2Client = getOAuthClient();
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // 1. Create Root Folder
    const rootResponse = await drive.files.create({
      requestBody: {
        name: 'Lorraine Madre Universal Office',
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });

    const rootFolderId = rootResponse.data.id!;
    const folderMap: Record<string, string> = {};

    // 2. Create subfolders from manifest
    for (const folder of FOLDERS_MANIFEST) {
      const folderResponse = await drive.files.create({
        requestBody: {
          name: folder.name,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [rootFolderId],
        },
        fields: 'id',
      });
      folderMap[folder.key] = folderResponse.data.id!;
    }

    // 3. Save to DB
    await getDb().collection('users').doc(uid).update({
      rootFolderId,
      folderMap,
      updatedAt: new Date().toISOString()
    });

    return folderMap;
  }

  async function createGoogleDoc(refreshToken: string, folderId: string, title: string, content: string) {
    const oauth2Client = getOAuthClient();
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const docs = google.docs({ version: 'v1', auth: oauth2Client });

    // Step 1: Create empty Doc in folder using Drive API
    const createResponse = await drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.document',
        parents: [folderId],
      },
      fields: 'id',
    });

    const docId = createResponse.data.id!;

    // Step 2: Fill content using Docs API
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: content,
            },
          },
        ],
      },
    });

    return { id: docId };
  }

  // --- Vite / Frontend Setup ---
  
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
