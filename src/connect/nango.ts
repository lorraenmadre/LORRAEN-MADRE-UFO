/**
 * Thin browser-side wrapper around @nangohq/frontend.
 *
 * We never ship a Nango secret to the browser. The flow is:
 *   1. browser asks our server for a short-lived Connect session token
 *   2. browser opens Nango's Connect UI with that token
 *   3. Nango runs the OAuth dance and stores the tokens
 *   4. Nango calls our webhook; our server writes status to Firestore
 *
 * Docs: https://docs.nango.dev/guides/connect
 */

let nangoModPromise: Promise<typeof import('@nangohq/frontend')> | null = null;
function loadNango() {
  if (!nangoModPromise) nangoModPromise = import('@nangohq/frontend');
  return nangoModPromise;
}

/** Ask the server for a Connect session token for the signed-in user. */
async function fetchSessionToken(integrationId?: string): Promise<string> {
  const res = await fetch('/api/connect/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(integrationId ? { integrationId } : {}),
  });
  if (!res.ok) throw new Error(`Session token request failed (${res.status})`);
  const data = await res.json();
  if (!data.token) throw new Error('Server did not return a session token');
  return data.token as string;
}

export interface NangoConnectResult {
  providerConfigKey?: string;
  connectionId?: string;
}

/**
 * Open Nango's hosted Connect UI. Resolves once the user finishes; rejects with
 * Error('closed') if they dismiss it without connecting.
 */
export async function connectWithNango(integrationId: string): Promise<NangoConnectResult> {
  const [{ default: Nango }, token] = await Promise.all([
    loadNango(),
    fetchSessionToken(integrationId),
  ]);

  const nango = new Nango({ connectSessionToken: token });

  return new Promise<NangoConnectResult>((resolve, reject) => {
    nango.openConnectUI({
      sessionToken: token,
      detectClosedAuthWindow: true,
      onEvent: (event) => {
        if (event.type === 'connect') {
          const p = event.payload as { providerConfigKey?: string; connectionId?: string };
          resolve({ providerConfigKey: p?.providerConfigKey, connectionId: p?.connectionId });
        } else if (event.type === 'close') {
          reject(new Error('closed'));
        }
      },
    });
  });
}
