import React, { useEffect, useState } from 'react';
import { Castle } from 'lucide-react';
import { JourneyState } from '../journey';
import system from '../ufo-system.json';

// Mothership grid still walks the ring clockwise from the top-left.
export const ENGINE_POSITIONS = [[1, 1], [1, 2], [1, 3], [1, 4], [2, 4], [3, 4], [4, 4], [4, 3], [4, 2], [4, 1], [3, 1], [2, 1]];
// The Advocacy Engine sits each House where its hour sits on a clock: 12 at the top, 3 on the right, 6 at the bottom, 9 on the left.
export const HOUSE_POSITIONS: Record<number, [number, number]> = {
  10: [1, 1], 11: [1, 2], 12: [1, 3], 1: [1, 4],
  9: [2, 1], 2: [2, 4],
  8: [3, 1], 3: [3, 4],
  7: [4, 1], 6: [4, 2], 5: [4, 3], 4: [4, 4],
};
// Rae's matrix (Cookbook): what each House of the family office covers.
export const ENGINE_HOUSES: { n: number; title: string; text: string }[] = [
  { n: 1, title: 'Family / Business', text: 'Founder identity and the family container.' },
  { n: 2, title: 'Economy', text: 'Market analysis of cash, credit and crypto.' },
  { n: 3, title: 'Energy / Tech / Communication', text: 'Messages, files, channels, uploads.' },
  { n: 4, title: 'Home / Health', text: 'Holistic home inspection and the home server.' },
  { n: 5, title: 'Play / Work', text: 'Agile project management and gamified workflow.' },
  { n: 6, title: 'Systems / Habits', text: 'Checklists, workflows, repeatable process.' },
  { n: 7, title: 'Contracts / Accountability', text: 'Court dates, agreements, service, follow-through.' },
  { n: 8, title: 'Insurance / Risk', text: 'Evidence, safety, money risk, discipline.' },
  { n: 9, title: 'Trust / Travel / Therapy', text: 'Legal doctrine, travel logistics, the bigger path.' },
  { n: 10, title: 'Story / Legacy', text: 'Backlog of tasks and important story records.' },
  { n: 11, title: 'Community Network', text: 'Data governance and CRM.' },
  { n: 12, title: 'Longevity', text: 'Mind, body and soul activation of the Hero’s journey.' },
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

/** The Advocacy Engine: twelve Houses of the family office on a clock, the North and South Nodes in the middle. */
export default function EngineGrid({ onOpenHouse }: { journey: JourneyState; onSelect: (component: number) => void; onOpenHouse?: (id: string) => void }) {
  const [center, setCenter] = useState<'nodes' | 'clock'>('nodes');
  const [now, setNow] = useState(() => new Date());
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => { if (center !== 'clock') return; const t = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(t); }, [center]);
  const lit = center === 'clock' ? (now.getHours() % 12 || 12) : null;
  const house = open ? ENGINE_HOUSES.find((h) => h.n === open)! : null;
  const product = open ? system.houses.find((h: any) => h.number === open) : null;
  return (
    <section className="lm-engine-shell" id="engine">
      <p className="lm-kicker">YOUR MOTHERSHIP · FUELED BY WISHES</p>
      <h2 className="lm-section-title">Advocacy Engine</h2>
      <p>Twelve Houses run your family office, one for each hour on the clock. Open a House to see what it covers and the product that serves it.</p>
      <div className="lm-engine-center-toggle" role="group" aria-label="Center view">
        <button type="button" aria-pressed={center === 'nodes'} onClick={() => setCenter('nodes')}>Nodes</button>
        <button type="button" aria-pressed={center === 'clock'} onClick={() => { setNow(new Date()); setCenter('clock'); }}>Clock</button>
      </div>
      <div className="lm-engine-ring lm-matrix">
        {ENGINE_HOUSES.map((h) => {
          const [row, col] = HOUSE_POSITIONS[h.n];
          return (
            <button type="button" key={h.n} className="lm-engine-cell" style={{ gridRow: row, gridColumn: col }} aria-pressed={open === h.n} data-lit={lit === h.n ? 'true' : undefined} onClick={() => setOpen(open === h.n ? null : h.n)}>
              <small>{h.n}</small>
              <strong>{h.title}</strong>
              <span>{h.text}</span>
            </button>
          );
        })}
        <div className={`lm-engine-center ${center === 'clock' ? 'is-clock' : ''}`}>{center === 'clock' ? <Clock now={now} /> : <Nodes />}</div>
      </div>
      {house && (
        <div className="lm-engine-detail" aria-live="polite">
          <small>HOUSE {house.n}</small>
          <h3>{house.title}</h3>
          <p>{house.text}</p>
          {product?.product && product.product !== 'None' && <p><strong>Entryway:</strong> {product.product}{product.platform && product.platform !== 'Unassigned' ? ` · ${product.platform}` : ''}</p>}
          <div className="lm-engine-detail-actions">
            {onOpenHouse && <button type="button" className="lm-pill lm-pill-blue" onClick={() => onOpenHouse(`product-house-${house.n}`)}>Open this House</button>}
            <button type="button" className="lm-pill lm-pill-white" onClick={() => setOpen(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
