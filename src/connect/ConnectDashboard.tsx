import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, AlertTriangle, RefreshCw, Plug, ExternalLink } from 'lucide-react';
import {
  CONNECTORS,
  CATEGORY_ORDER,
  type Connector,
} from './catalog';
import { connectWithNango } from './nango';

type ConnectionStatus = 'connected' | 'error' | 'disconnected';

interface ConnectionRecord {
  key: string;
  status: ConnectionStatus;
  connectionId?: string;
  provider?: string;
  lastSyncedAt?: string;
  detail?: string;
}

interface Props {
  /** Firebase uid — connections are scoped to this user. */
  uid: string | null;
  /** True while running in public preview (no real account). */
  previewMode?: boolean;
}

export default function ConnectDashboard({ uid, previewMode }: Props) {
  const [records, setRecords] = useState<Record<string, ConnectionRecord>>({});
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (previewMode) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/connect/connections');
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data: { connections: ConnectionRecord[] } = await res.json();
      const map: Record<string, ConnectionRecord> = {};
      for (const c of data.connections ?? []) map[c.key] = c;
      setRecords(map);
      setError(null);
    } catch (e) {
      setError('Could not load connection status. The Connect service may still be configuring.');
    } finally {
      setLoading(false);
    }
  }, [previewMode]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Nango Connect UI + Canopy both post back via window messages / redirects;
  // re-check status when the tab regains focus.
  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      items: CONNECTORS.filter((c) => c.category === cat),
    })).filter((g) => g.items.length > 0);
  }, []);

  const connectedCount = Object.keys(records).filter(
    (k) => records[k]?.status === 'connected',
  ).length;

  async function handleConnect(c: Connector) {
    if (previewMode) {
      setError('Sign into Orbit to link real accounts.');
      return;
    }
    setBusyKey(c.key);
    setError(null);
    try {
      if (c.engine === 'nango') {
        await connectWithNango(c.integrationId!);
      } else if (c.engine === 'canopy') {
        const res = await fetch('/api/connect/insurance/url', { method: 'POST' });
        const { url } = await res.json();
        if (!url) throw new Error('No Canopy Connect URL returned');
        window.open(url, 'canopy_connect', 'width=520,height=760');
      } else if (c.engine === 'native') {
        const res = await fetch('/api/auth/google/url');
        const { url } = await res.json();
        window.open(url, 'google_auth', 'width=600,height=700');
      }
      // Give the webhook a beat to land, then refresh.
      setTimeout(refresh, 1500);
    } catch (e) {
      if ((e as Error).message !== 'closed') {
        setError(`Could not start the ${c.name} connection.`);
      }
    } finally {
      setBusyKey(null);
    }
  }

  async function handleDisconnect(c: Connector, rec: ConnectionRecord) {
    if (!rec.connectionId) return;
    setBusyKey(c.key);
    try {
      await fetch(`/api/connect/connections/${encodeURIComponent(rec.connectionId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: c.key, provider: rec.provider }),
      });
      await refresh();
    } catch {
      setError(`Could not disconnect ${c.name}.`);
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between border-b border-gray-100 pb-6 mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-3">Mona Lisa Stack</p>
          <h2 className="text-3xl md:text-5xl font-spectral tracking-tighter">Connected Accounts</h2>
          <p className="text-sm text-gray-500 mt-3 max-w-xl">
            Link the tools and policies that feed your Universal Family Office. Each connection lets the
            seven agents capture, sort, and act on your behalf — nothing is posted or paid without approval.
          </p>
        </div>
        <div className="text-right shrink-0 pl-6">
          <div className="text-4xl font-spectral">{previewMode ? '—' : connectedCount}</div>
          <div className="text-[9px] uppercase tracking-widest text-gray-400">Connected</div>
          <button
            onClick={refresh}
            className="mt-3 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {previewMode && (
        <div className="mb-8 bg-gray-100 text-gray-700 py-3 px-5 text-[10px] uppercase tracking-[0.3em] font-bold text-center">
          Public preview — sign into Orbit to link real accounts.
        </div>
      )}
      {error && (
        <div className="mb-8 bg-amber-50 text-amber-800 py-3 px-5 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-14">
        {grouped.map(({ category, items }) => (
          <section key={category}>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-6 bg-gray-300" />
              <h3 className="text-[10px] uppercase tracking-[0.35em] font-bold text-gray-500">{category}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((c) => {
                const rec = records[c.key];
                const status: ConnectionStatus = rec?.status ?? 'disconnected';
                const busy = busyKey === c.key;
                return (
                  <motion.div
                    key={c.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 p-5 flex flex-col justify-between hover:border-black transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl leading-none">{c.glyph}</span>
                        <StatusChip status={status} comingSoon={c.comingSoon} />
                      </div>
                      <h4 className="font-bold text-sm tracking-tight">{c.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.blurb}</p>
                      {c.house && (
                        <p className="text-[9px] uppercase tracking-widest text-gray-300 mt-2">{c.house}</p>
                      )}
                      {rec?.lastSyncedAt && (
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">
                          Synced {new Date(rec.lastSyncedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      {c.comingSoon ? (
                        <span className="text-[9px] uppercase tracking-widest text-gray-300">· soon</span>
                      ) : status === 'connected' ? (
                        <button
                          onClick={() => handleDisconnect(c, rec!)}
                          disabled={busy}
                          className="w-full border border-gray-200 py-2 text-[10px] uppercase tracking-widest hover:border-black transition-colors disabled:opacity-40"
                        >
                          {busy ? 'Working…' : 'Disconnect'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(c)}
                          disabled={busy || previewMode}
                          className="w-full bg-black text-white py-2 text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-40 inline-flex items-center justify-center gap-1.5"
                        >
                          {busy ? (
                            'Opening…'
                          ) : (
                            <>
                              {c.engine === 'canopy' ? <ExternalLink className="w-3 h-3" /> : <Plug className="w-3 h-3" />}
                              Connect
                            </>
                          )}
                        </button>
                      )}
                      {status === 'error' && rec?.detail && (
                        <p className="text-[9px] text-red-500 mt-2">{rec.detail}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 leading-relaxed max-w-3xl mt-16 pt-8 border-t border-gray-100">
        Connections are stored per account and encrypted at rest by the Connect service. You can disconnect
        any account here at any time. Insurance data is pulled read-only via Canopy Connect and is never
        shared outside your Universal Family Office.
      </p>
    </div>
  );
}

function StatusChip({ status, comingSoon }: { status: ConnectionStatus; comingSoon?: boolean }) {
  if (comingSoon) {
    return <span className="text-[8px] uppercase tracking-widest text-gray-300 border border-gray-200 px-2 py-0.5">Soon</span>;
  }
  if (status === 'connected') {
    return (
      <span className="text-[8px] uppercase tracking-widest text-green-700 bg-green-50 px-2 py-0.5 inline-flex items-center gap-1">
        <Check className="w-2.5 h-2.5" /> Connected
      </span>
    );
  }
  if (status === 'error') {
    return <span className="text-[8px] uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5">Needs attention</span>;
  }
  return <span className="text-[8px] uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-0.5">Not linked</span>;
}
