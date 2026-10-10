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

type Office = { name: string; next: string; enabled: boolean };
function readOffices(key: string): Record<string, Office> {
  try { const x = JSON.parse(localStorage.getItem(key) || '{}'); return x && typeof x === 'object' && !Array.isArray(x) ? x : {}; } catch { return {}; }
}
/** Where an office stands: named, next step written, up and running. Each is a third. */
export const officeProgress = (o?: Office) => (o ? Math.round(((o.name?.trim() ? 1 : 0) + (o.next?.trim() ? 1 : 0) + (o.enabled ? 1 : 0)) / 3 * 100) : 0);

const Meter = ({ value, label }: { value: number; label: string }) => (
  <span className="lm-office-meter" role="img" aria-label={`${label}: ${value}%`}><span style={{ width: `${value}%` }} /></span>
);

/**
 * The Matrix: the twelve offices of the Universal Family Office on one clock, House 13 at the center.
 * It is an outline for finding your way around the office; products live in the Library.
 * Progress is the Hero's own note on this browser and only shows once an office is started.
 */
export default function EngineGrid({ scope = 'preview' }: { journey?: JourneyState; onSelect?: (component: number) => void; scope?: string }) {
  const key = `wishwell:mothership:v1:${scope}`;
  const [now, setNow] = useState(() => new Date());
  const [open, setOpen] = useState<number | null>(null);
  const [offices, setOffices] = useState<Record<string, Office>>(() => (typeof localStorage === 'undefined' ? {} : readOffices(key)));
  const [error, setError] = useState('');
  useEffect(() => { if (typeof localStorage !== 'undefined') setOffices(readOffices(key)); }, [key]);
  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(t); }, []);

  const officeOf = (n: number): Office => offices[n - 1] || { name: '', next: '', enabled: false };
  const save = (n: number, o: Office) => {
    const next = { ...offices, [n - 1]: o };
    setOffices(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setError(''); } catch { setError('These notes could not be saved by this browser.'); }
  };
  const total = Math.round(HOUSES.reduce((sum, h) => sum + officeProgress(officeOf(h.number)), 0) / HOUSES.length);
  const lit = now.getHours() % 12 || 12;
  const house = open ? houseOf(open) : null;
  const office = open ? officeOf(open) : null;
  const center = houseOf(13);
  const started = (n: number) => officeProgress(officeOf(n)) > 0;

  return (
    <section className="lm-engine-shell" id="matrix">
      <p className="lm-kicker">THE MATRIX · THE OFFICES OF YOUR UNIVERSAL FAMILY OFFICE</p>
      <h2 className="lm-section-title">The Matrix</h2>
      <p>Under the Tree of Life sits the Matrix: twelve offices, one for each hour on the clock, with House 13, your story in the present, at the center. Open an office to see what it covers, name it, and note where you stand in getting it up and running. The products for each office are in the <a href={LIBRARY_URL} target="_blank" rel="noopener noreferrer">Library</a>.</p>
      {total > 0
        ? <><p className="lm-caption">{total}% of your office is up and running · saved on this browser</p><Meter value={total} label="Whole office" /></>
        : <p className="lm-caption">Start any office and your progress shows up here.</p>}
      <div className="lm-engine-ring lm-matrix">
        {HOUSES.filter((h) => h.number !== 13).map((h) => {
          const [row, col] = HOUSE_POSITIONS[h.number];
          const o = officeOf(h.number), p = officeProgress(o);
          return (
            <button type="button" key={h.number} className="lm-engine-cell" style={{ gridRow: row, gridColumn: col }} aria-pressed={open === h.number} data-lit={lit === h.number ? 'true' : undefined} onClick={() => setOpen(open === h.number ? null : h.number)}>
              <span className="lm-engine-cell-top"><small>{String(h.number).padStart(2, '0')}</small><Gate h={h} /></span>
              <strong>{h.department}</strong>
              <span className="lm-office-text">{o.name.trim() || h.office}</span>
              {p > 0 && <Meter value={p} label={h.department} />}
            </button>
          );
        })}
        <div className="lm-engine-center is-clock">
          <Clock now={now} />
          <button type="button" className="lm-engine-13" aria-pressed={open === 13} onClick={() => setOpen(open === 13 ? null : 13)}>
            <span>13</span><strong>{center.department}</strong><i>{center.gate}</i>
          </button>
        </div>
      </div>
      {house && office && (
        <div className="lm-engine-detail" aria-live="polite">
          <span className="lm-engine-cell-top"><small>HOUSE {String(house.number).padStart(2, '0')}</small><Gate h={house} /></span>
          <h3>{house.department}</h3>
          <p>{house.office}</p>
          {started(house.number) && <><p className="lm-caption">{officeProgress(office)}% up and running</p><Meter value={officeProgress(office)} label={house.department} /></>}
          <label>What you call this office<input value={office.name} placeholder="Name it" onChange={(e) => save(house.number, { ...office, name: e.target.value })} /></label>
          <label>What exists or needs doing next?<textarea value={office.next} onChange={(e) => save(house.number, { ...office, next: e.target.value })} /></label>
          <label className="lm-engine-check"><input type="checkbox" checked={office.enabled} onChange={(e) => save(house.number, { ...office, enabled: e.target.checked })} /> This office is up and running</label>
          <div className="lm-engine-detail-actions"><button type="button" className="lm-pill lm-pill-white" onClick={() => setOpen(null)}>Close</button></div>
          <p className="lm-caption">Your own notes on this browser, not a verified purchase or connection.</p>
          {error && <p role="alert">{error}</p>}
        </div>
      )}
    </section>
  );
}
