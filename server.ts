import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import { google } from 'googleapis';
import admin from 'firebase-admin';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const PORT = 3000;
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

// Lazy Initialize Firebase Admin
let db: admin.firestore.Firestore;
function getDb() {
  if (!db) {
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0315145662'
      });
    }
    db = admin.firestore();
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
  
  app.use(express.json());
  app.use(
    cookieSession({
      name: 'session',
      keys: [process.env.SESSION_SECRET || 'llm-framework-secret'],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: true,
      sameSite: 'none',
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
