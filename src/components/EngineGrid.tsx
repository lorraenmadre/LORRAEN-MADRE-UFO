import React, { useEffect, useState } from 'react';
import { Castle } from 'lucide-react';
import { JourneyState } from '../journey';
import { RESOURCES, HOUSE_PURPOSES } from '../houseLinks';
import { START_FALLBACK_URL } from '../startLinks';
import system from '../ufo-system.json';

// Mothership grid still walks the ring clockwise from the top-left.
export const ENGINE_POSITIONS = [[1, 1], [1, 2], [1, 3], [1, 4], [2, 4], [3, 4], [4, 4], [4, 3], [4, 2], [4, 1], [3, 1], [2, 1]];
// The Mothership sits each House where its hour sits on a clock: 12 at the top, 3 on the right, 6 at the bottom, 9 on the left.
export const HOUSE_POSITIONS: Record<number, [number, number]> = {
  10: [1, 1], 11: [1, 2], 12: [1, 3], 1: [1, 4],
  9: [2, 1], 2: [2, 4],
  8: [3, 1], 3: [3, 4],
  7: [4, 1], 6: [4, 2], 5: [4, 3], 4: [4, 4],
};
// Rae's matrix (Cookbook): what each House of the family office covers.
export const ENGINE_HOUSES: { n: number; title: string; text: string }[] = [
  { n: 1, title: 'Family / Business', text: 'Founder identity, the family container and how the family moves.' },
  { n: 2, title: 'Economy', text: 'Market analysis of cash, credit and crypto.' },
  { n: 3, title: 'Energy / Tech / Communication', text: 'Messages, files, channels, uploads.' },
  { n: 4, title: 'Home / Health', text: 'Holistic home inspection and the home server.' },
  { n: 5, title: 'Play / Work', text: 'Agile project management and gamified workflow.' },
  { n: 6, title: 'Systems / Habits', text: 'Checklists, workflows, repeatable process.' },
  { n: 7, title: 'Contracts / Accountability', text: 'Court dates, agreements, service, follow-through.' },
  { n: 8, title: 'Insurance / Risk', text: 'Evidence, safety, money risk, discipline.' },
  { n: 9, title: 'Trust / Travel / Therapy', text: 'Legal doctrine, travel logistics, the bigger path.' },
  { n: 10, title: 'Story / Legacy', text: 'Digital organization: documents, folders and important story records.' },
  { n: 11, title: 'Community Network', text: 'Data governance and CRM.' },
  { n: 12, title: 'Longevity', text: 'Mind, body and soul activation; the Dream Backlog keeps every wish.' },
];

const hourNow = () => { const h = new Date().getHours() % 12; return h === 0 ? 12 : h; };

function Nodes() {
  return (
    <div className="lm-nodes" aria-label="North Node: Retirement Plan. South Node: Nonprofit Foundation.">
      <svg viewBox="0 0 400 300" aria-hidden="true" className="lm-nodes-field">
        {[60, 100, 140, 180].map((r) => <ellipse key={r} cx="200" cy="150" rx={r * 1.05} ry={r * 0.75} fill="none" stroke="#e9e3d2" strokeWidth="1.5" />)}
        {[60, 100, 140, 180].map((r) => <ellipse key={'v' + r} cx="200" cy="150" rx={r * 0.55} ry={r * 0.9} fill="none" stroke="#efeadc" strokeWidth="1.2" />)}
      </svg>
      <p className="lm-node-label is-north"><strong>NORTH NODE</strong><span>Retirement Plan</span></p>
      <div className="lm-magnet"><span>N</span><Castle aria-hidden className="lm-castle" /><span>S</span></div>
      <p className="lm-node-label is-south"><strong>SOUTH NODE</strong><span>Nonprofit Foundation</span></p>
    </div>
  );
}

function Clock({ now }: { now: Date }) {
  const h = now.getHours() % 12, m = now.getMinutes();
  const hourDeg = h * 30 + m * 0.5, minDeg = m * 6;
  return (
    <div className="lm-clock" aria-label={`Clock: ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="86" fill="none" stroke="#fff" strokeWidth="2" />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i * 6 * Math.PI) / 180, long = i % 5 === 0;
          return <line key={i} x1={100 + Math.sin(a) * 86} y1={100 - Math.cos(a) * 86} x2={100 + Math.sin(a) * (long ? 76 : 81)} y2={100 - Math.cos(a) * (long ? 76 : 81)} stroke="#fff" strokeWidth={long ? 2 : 1} />;
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const n = i + 1, a = (n * 30 * Math.PI) / 180;
          return <text key={n} x={100 + Math.sin(a) * 63} y={100 - Math.cos(a) * 63 + 6} textAnchor="middle" fill="#fff" fontSize="17" fontFamily="Figtree, sans-serif">{n}</text>;
        })}
        <line x1="100" y1="100" x2={100 + Math.sin((hourDeg * Math.PI) / 180) * 42} y2={100 - Math.cos((hourDeg * Math.PI) / 180) * 42} stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <line x1="100" y1="100" x2={100 + Math.sin((minDeg * Math.PI) / 180) * 62} y2={100 - Math.cos((minDeg * Math.PI) / 180) * 62} stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="100" cy="100" r="5" fill="#fff" />
      </svg>
    </div>
  );
}

// The part of the mothership each House holds (same order the old Mothership grid used, so saved notes carry over).
export const MOTHERSHIP_PARTS = ['Holding company', 'Fund', 'Domains', 'Home server', 'Small product team', 'Nonprofit foundation', 'Church', 'Insurance', 'Trust', 'Career', 'CRM', 'Retirement'];
type Part = { name: string; next: string; enabled: boolean };

function readParts(key: string): Record<string, Part> {
  try { const x = JSON.parse(localStorage.getItem(key) || '{}'); return x && typeof x === 'object' && !Array.isArray(x) ? x : {}; } catch { return {}; }
}

/**
 * The Mothership: twelve Houses of the family office on a clock, the North and South Nodes in the middle.
 * Each House holds one part of the mothership and one product. Activating a House means downloading its product.
 */
export default function EngineGrid({ onOpenHouse, scope = 'preview' }: { journey: JourneyState; onSelect: (component: number) => void; onOpenHouse?: (id: string) => void; scope?: string }) {
  const key = `wishwell:mothership:v1:${scope}`;
  const [center, setCenter] = useState<'nodes' | 'clock'>('nodes');
  const [now, setNow] = useState(() => new Date());
  const [open, setOpen] = useState<number | null>(null);
  const [parts, setParts] = useState<Record<string, Part>>(() => (typeof localStorage === 'undefined' ? {} : readParts(key)));
  const [error, setError] = useState('');
  useEffect(() => { if (typeof localStorage !== 'undefined') setParts(readParts(key)); }, [key]);
  useEffect(() => { if (center !== 'clock') return; const t = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(t); }, [center]);

  const partOf = (n: number): Part => parts[n - 1] || { name: '', next: '', enabled: false };
  const save = (n: number, p: Part) => {
    const next = { ...parts, [n - 1]: p };
    setParts(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setError(''); } catch { setError('These edits could not be saved by this browser.'); }
  };
  const activated = ENGINE_HOUSES.filter((h) => partOf(h.n).enabled).length;
  const lit = center === 'clock' ? (now.getHours() % 12 || 12) : null;
  const house = open ? ENGINE_HOUSES.find((h) => h.n === open)! : null;
  const productOf = (n: number) => system.houses.find((h: any) => h.number === n) as any;
  const product = open ? productOf(open) : null;
  const resource = open ? RESOURCES[`product-house-${open}`] : undefined;
  const part = open ? partOf(open) : null;

  return (
    <section className="lm-engine-shell" id="mothership">
      <p className="lm-kicker">MOTHERSHIP ARCHITECTURE · FUELED BY WISHES</p>
      <h2 className="lm-section-title">Mothership</h2>
      <p>Twelve Houses run your family office, one for each hour on the clock. Each House holds one part of your mothership and one product. Activate your mothership one House at a time by downloading its product, starting with omw.life in House 1.</p>
      <p className="lm-caption">{activated} / 12 Houses activated · saved on this browser</p>
      <progress value={activated} max={12} aria-label="Mothership activation progress" />
      <div className="lm-engine-center-toggle" role="group" aria-label="Center view">
        <button type="button" aria-pressed={center === 'nodes'} onClick={() => setCenter('nodes')}>Nodes</button>
        <button type="button" aria-pressed={center === 'clock'} onClick={() => { setNow(new Date()); setCenter('clock'); }}>Clock</button>
      </div>
      <div className="lm-engine-ring lm-matrix">
        {ENGINE_HOUSES.map((h) => {
          const [row, col] = HOUSE_POSITIONS[h.n];
          const on = partOf(h.n).enabled;
          return (
            <button type="button" key={h.n} className="lm-engine-cell" style={{ gridRow: row, gridColumn: col }} aria-pressed={open === h.n} data-lit={lit === h.n ? 'true' : undefined} data-on={on ? 'true' : undefined} onClick={() => setOpen(open === h.n ? null : h.n)}>
              <small>{h.n} · {MOTHERSHIP_PARTS[h.n - 1]}</small>
              <strong>{h.title}</strong>
              <span>{h.text}</span>
              <em>{on ? '● ' : '○ '}{productOf(h.n)?.product}</em>
            </button>
          );
        })}
        <div className={`lm-engine-center ${center === 'clock' ? 'is-clock' : ''}`}>{center === 'clock' ? <Clock now={now} /> : <Nodes />}</div>
      </div>
      {house && part && (
        <div className="lm-engine-detail" aria-live="polite">
          <small>HOUSE {house.n} · {MOTHERSHIP_PARTS[house.n - 1].toUpperCase()}</small>
          <h3>{house.title}</h3>
          <p>{house.text}</p>
          {product?.product && <p><strong>Product:</strong> {product.product}{product.platform && product.platform !== 'Unassigned' ? ` · ${product.platform}` : ''}</p>}
          {HOUSE_PURPOSES[house.n] && <p>{HOUSE_PURPOSES[house.n]}</p>}
          <label>Your {MOTHERSHIP_PARTS[house.n - 1].toLowerCase()}<input value={part.name} placeholder="Name it" onChange={(e) => save(house.n, { ...part, name: e.target.value })} /></label>
          <label>What exists or needs doing next?<textarea value={part.next} onChange={(e) => save(house.n, { ...part, next: e.target.value })} /></label>
          <label className="lm-engine-check"><input type="checkbox" checked={part.enabled} onChange={(e) => save(house.n, { ...part, enabled: e.target.checked })} /> This House is activated</label>
          <div className="lm-engine-detail-actions">
            <a className="lm-pill lm-pill-blue" href={resource?.url || START_FALLBACK_URL} target="_blank" rel="noopener noreferrer" onClick={() => { if (!part.enabled) save(house.n, { ...part, enabled: true }); }}>
              {resource ? `Activate · ${resource.label}` : `Activate · request ${product?.product || 'this product'}`} ↗
            </a>
            {onOpenHouse && <button type="button" className="lm-pill lm-pill-white" onClick={() => onOpenHouse(`product-house-${house.n}`)}>Open this House</button>}
            <button type="button" className="lm-pill lm-pill-white" onClick={() => setOpen(null)}>Close</button>
          </div>
          {resource?.note && <p className="lm-caption">{resource.note}</p>}
          <p className="lm-caption">Activation is your own status on this browser, not a verified connection.</p>
          {error && <p role="alert">{error}</p>}
        </div>
      )}
    </section>
  );
}
