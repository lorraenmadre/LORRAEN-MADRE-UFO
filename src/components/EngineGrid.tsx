import React, { useEffect, useState } from 'react';
import { JourneyState } from '../journey';
import system from '../ufo-system.json';

export type MatrixHouse = (typeof system.houses)[number];
export const LIBRARY_URL = system.library;
export const HOUSES: MatrixHouse[] = system.houses;
const houseOf = (n: number) => HOUSES.find((h) => h.number === n)!;

/**
 * Same clock as the Library (lorraenmadre.com/library): 11 and 12 across the top left, 1 and 2 top right,
 * 3 and 4 down the right side, 5 to 8 along the bottom (right to left), 9 and 10 up the left side.
 * House 13 sits in the center with the clock.
 */
export const HOUSE_POSITIONS: Record<number, [number, number]> = {
  11: [1, 1], 12: [1, 2], 1: [1, 3], 2: [1, 4],
  10: [2, 1], 3: [2, 4],
  9: [3, 1], 4: [3, 4],
  8: [4, 1], 7: [4, 2], 6: [4, 3], 5: [4, 4],
};

function Clock({ now }: { now: Date }) {
  const h = now.getHours() % 12, m = now.getMinutes();
  const hourDeg = h * 30 + m * 0.5, minDeg = m * 6;
  const hand = (deg: number, len: number) => ({ x2: 100 + Math.sin((deg * Math.PI) / 180) * len, y2: 100 - Math.cos((deg * Math.PI) / 180) * len });
  return (
    <div className="lm-clock" role="img" aria-label={`Clock: ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}>
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
        <line x1="100" y1="100" {...hand(hourDeg, 42)} stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <line x1="100" y1="100" {...hand(minDeg, 62)} stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="100" cy="100" r="5" fill="#fff" />
      </svg>
    </div>
  );
}

const Gate = ({ h }: { h: MatrixHouse }) => <span className="lm-gate-chip" style={{ background: h.color, color: h.ink }}>{h.gate}</span>;

type Part = { name: string; next: string; enabled: boolean };
function readParts(key: string): Record<string, Part> {
  try { const x = JSON.parse(localStorage.getItem(key) || '{}'); return x && typeof x === 'object' && !Array.isArray(x) ? x : {}; } catch { return {}; }
}

/**
 * The Mothership: the Library's thirteen Houses on one clock. Each House holds one product.
 * Activating a House is the Hero's own note on this browser, not a verified purchase or connection.
 */
export default function EngineGrid({ onOpenHouse, scope = 'preview' }: { journey: JourneyState; onSelect: (component: number) => void; onOpenHouse?: (id: string) => void; scope?: string }) {
  const key = `wishwell:mothership:v1:${scope}`;
  const [now, setNow] = useState(() => new Date());
  const [open, setOpen] = useState<number | null>(null);
  const [parts, setParts] = useState<Record<string, Part>>(() => (typeof localStorage === 'undefined' ? {} : readParts(key)));
  const [error, setError] = useState('');
  useEffect(() => { if (typeof localStorage !== 'undefined') setParts(readParts(key)); }, [key]);
  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(t); }, []);

  const partOf = (n: number): Part => parts[n - 1] || { name: '', next: '', enabled: false };
  const save = (n: number, p: Part) => {
    const next = { ...parts, [n - 1]: p };
    setParts(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setError(''); } catch { setError('These edits could not be saved by this browser.'); }
  };
  const activated = HOUSES.filter((h) => partOf(h.number).enabled).length;
  const lit = now.getHours() % 12 || 12;
  const house = open ? houseOf(open) : null;
  const part = open ? partOf(open) : null;
  const center = houseOf(13);
  const explore = house && house.explore && !house.explore.startsWith('https://lorraenmadre.app') ? house.explore : '';

  return (
    <section className="lm-engine-shell" id="mothership">
      <p className="lm-kicker">MOTHERSHIP ARCHITECTURE · FUELED BY WISHES</p>
      <h2 className="lm-section-title">Mothership</h2>
      <p>Twelve Houses run your family office, one for each hour on the clock, with the Wishing Reel in the center as House 13. Each House holds one product from the Library. Activate your mothership one House at a time, starting with the Motherboard in House 1.</p>
      <p className="lm-caption">{activated} / {HOUSES.length} Houses activated · saved on this browser</p>
      <progress value={activated} max={HOUSES.length} aria-label="Mothership activation progress" />
      <div className="lm-engine-ring lm-matrix">
        {HOUSES.filter((h) => h.number !== 13).map((h) => {
          const [row, col] = HOUSE_POSITIONS[h.number];
          const on = partOf(h.number).enabled;
          return (
            <button type="button" key={h.number} className="lm-engine-cell" style={{ gridRow: row, gridColumn: col }} aria-pressed={open === h.number} data-lit={lit === h.number ? 'true' : undefined} data-on={on ? 'true' : undefined} onClick={() => setOpen(open === h.number ? null : h.number)}>
              <span className="lm-engine-cell-top"><small>{String(h.number).padStart(2, '0')}</small><Gate h={h} /></span>
              <strong>{h.department}</strong>
              <em>{on ? '● ' : '○ '}{h.product}</em>
              <i>{h.price}</i>
            </button>
          );
        })}
        <div className="lm-engine-center is-clock">
          <Clock now={now} />
          <button type="button" className="lm-engine-13" aria-pressed={open === 13} onClick={() => setOpen(open === 13 ? null : 13)}>
            <span>13</span><strong>{center.product}</strong><i>{center.price}</i>
          </button>
        </div>
      </div>
      {house && part && (
        <div className="lm-engine-detail" aria-live="polite">
          <small>HOUSE {String(house.number).padStart(2, '0')} · {house.department.toUpperCase()}</small>
          <h3>{house.gate}</h3>
          <p><strong>{house.product}</strong> · {house.price}</p>
          <p>{house.description}</p>
          <ul className="lm-engine-covers">{house.covers.map((c) => <li key={c}>{c}</li>)}</ul>
          <div className="lm-engine-detail-actions">
            <a className="lm-pill lm-pill-gold" href={LIBRARY_URL} target="_blank" rel="noopener noreferrer">{house.status === 'coming_soon' ? 'See it in the Library' : 'Get it in the Library'} ↗</a>
            {explore && <a className="lm-pill lm-pill-black" href={explore} target="_blank" rel="noopener noreferrer">Explore ↗</a>}
            {house.links.map((l) => l.url
              ? <a key={l.label} className="lm-pill lm-pill-white" href={l.url} target="_blank" rel="noopener noreferrer">{l.short} ↗</a>
              : <span key={l.label} className="lm-pill lm-pill-white" aria-disabled="true">{l.short} · coming soon</span>)}
            {onOpenHouse && <button type="button" className="lm-pill lm-pill-white" onClick={() => onOpenHouse(`product-house-${house.number}`)}>Open this House</button>}
            <button type="button" className="lm-pill lm-pill-white" onClick={() => setOpen(null)}>Close</button>
          </div>
          <label>What you call it<input value={part.name} placeholder="Name it" onChange={(e) => save(house.number, { ...part, name: e.target.value })} /></label>
          <label>What exists or needs doing next?<textarea value={part.next} onChange={(e) => save(house.number, { ...part, next: e.target.value })} /></label>
          <label className="lm-engine-check"><input type="checkbox" checked={part.enabled} onChange={(e) => save(house.number, { ...part, enabled: e.target.checked })} /> This House is activated</label>
          <p className="lm-caption">Activation is your own status on this browser, not a verified purchase or connection.</p>
          {error && <p role="alert">{error}</p>}
        </div>
      )}
    </section>
  );
}
