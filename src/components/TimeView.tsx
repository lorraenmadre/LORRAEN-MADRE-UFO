import React, { useEffect, useMemo, useState } from 'react';
import { Entity } from '../types';
import { SkyWheel } from './SkyWheel';
import { computeSky, formatDeg, SIGNS, HOUSE_THEMES, type ZodiacMode, type BodyId } from '../sky/skyMath';
import { slotForBody } from '../planSlots';
import { isUnnamed } from '../entityOrder';
import styles from './TimeView.module.css';

type Span = 'today' | '6mo';
const SIX_MONTHS_DAYS = 182;
const DAY = 86400000;
const DEFAULT_PLACE = { label: 'Miami', lat: 25.7617, lon: -80.1918 };
const ZODIAC_LABEL: Record<ZodiacMode, string> = { tropical: 'Tropical', sidereal: 'Sidereal', vedic: 'Vedic' };
const ordinal = (n: number) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`;

interface Props {
  entities: Entity[];
  onSelect: (id: string) => void;
}

/** TIME — the same sky wheel as the voice app: each planet track is one of your plans, across the next 6 months. */
export default function TimeView({ entities, onSelect }: Props) {
  const [span, setSpan] = useState<Span>('6mo');
  const [dayOffset, setDayOffset] = useState(0);
  const [mode, setMode] = useState<ZodiacMode>('tropical');
  const [now, setNow] = useState(() => new Date());
  const [here, setHere] = useState<{ label: string; lat: number; lon: number } | null>(null);
  const [selected, setSelected] = useState<BodyId | null>('Sun');

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setHere({ label: 'your location', lat: p.coords.latitude, lon: p.coords.longitude }),
      () => undefined,
      { timeout: 8000, maximumAge: 3_600_000 },
    );
  }, []);

  const place = here ?? DEFAULT_PLACE;
  const rangeStartMs = useMemo(() => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, [now.toDateString()]); // eslint-disable-line react-hooks/exhaustive-deps
  const moment = span === '6mo' && dayOffset > 0 ? new Date(now.getTime() + dayOffset * DAY) : now;
  const range = span === '6mo' ? { start: new Date(rangeStartMs), end: new Date(rangeStartMs + SIX_MONTHS_DAYS * DAY) } : undefined;
  const sky = useMemo(
    () => computeSky(moment, place.lat, place.lon, mode, true, range),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [moment.getTime(), place.lat, place.lon, mode, span, rangeStartMs],
  );
  const sel = sky.bodies.find((b) => b.id === selected) ?? sky.bodies[0];
  const ascSign = SIGNS[sky.ascSign];

  const planFor = (id: BodyId) => {
    const s = slotForBody(id === 'Ketu' ? 'Ketu' : id);
    const e = s ? entities.find((x) => x.id === s.entityId) : undefined;
    return { slot: s, entity: e, name: e && !isUnnamed(e) ? e.name : s?.system ?? '' };
  };

  const events = useMemo(() => {
    if (span !== '6mo') return [];
    const base = new Date(rangeStartMs);
    const six = computeSky(base, place.lat, place.lon, mode, true, { start: base, end: new Date(rangeStartMs + SIX_MONTHS_DAYS * DAY) });
    const out: { ms: number; text: string; glyph: string }[] = [];
    for (const b of six.bodies) {
      if (b.id === 'Moon' || b.id === 'Rahu' || b.id === 'Ketu') continue;
      for (let i = 1; i < b.path.length; i++) {
        const a = b.path[i - 1];
        const c = b.path[i];
        const ms = rangeStartMs + c.offset * DAY;
        const sa = Math.floor(a.lon / 30);
        const sc = Math.floor(c.lon / 30);
        const plan = planFor(b.id).name;
        if (sa !== sc) out.push({ ms, glyph: b.glyph, text: `${b.id} enters ${SIGNS[sc].name}${plan ? ` · ${plan}` : ''}` });
        if (i > 1 && a.retro !== c.retro) out.push({ ms, glyph: b.glyph, text: `${b.id} turns ${c.retro ? 'retrograde' : 'direct'}${plan ? ` · ${plan}` : ''}` });
      }
    }
    return out.filter((e) => e.ms >= rangeStartMs).sort((x, y) => x.ms - y.ms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [span, mode, rangeStartMs, place.lat, place.lon, entities]);

  const monthTicks = useMemo(() => {
    const ticks: { label: string; pct: number }[] = [];
    const d = new Date(rangeStartMs);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    while (d.getTime() < rangeStartMs + SIX_MONTHS_DAYS * DAY) {
      ticks.push({ label: d.toLocaleString(undefined, { month: 'short' }), pct: ((d.getTime() - rangeStartMs) / (SIX_MONTHS_DAYS * DAY)) * 100 });
      d.setMonth(d.getMonth() + 1);
    }
    return ticks;
  }, [rangeStartMs]);

  const selPlan = sel ? planFor(sel.id) : null;

  return (
    <section aria-label="Time — sky wheel" className={styles.wrap}>
      <div className={styles.head}>
        <h2 className={styles.h2}>Time</h2>
        <div className={styles.controls}>
          <div className={styles.segment} role="group" aria-label="Span">
            {(['today', '6mo'] as Span[]).map((s) => (
              <button key={s} type="button" aria-pressed={span === s} className={span === s ? styles.on : ''} onClick={() => { setSpan(s); setDayOffset(0); }}>
                {s === 'today' ? 'Today' : '6 months'}
              </button>
            ))}
          </div>
          <div className={styles.segment} role="group" aria-label="Zodiac">
            {(Object.keys(ZODIAC_LABEL) as ZodiacMode[]).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} className={mode === m ? styles.on : ''} onClick={() => setMode(m)}>
                {ZODIAC_LABEL[m]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.wheelWrap}>
          <div className={styles.wheelPanel}>
            <SkyWheel
              sky={sky}
              selected={sel?.id}
              onSelect={setSelected}
              centerTop={`${dayOffset > 0 ? `In ${dayOffset} days` : 'Now'} · rising`}
              centerMain={ascSign.name}
              centerSub={moment.toLocaleString(undefined, { month: 'short', day: 'numeric', year: dayOffset > 0 ? 'numeric' : undefined, hour: 'numeric', minute: '2-digit' })}
            />
            <p className={styles.legend}>
              <span className={styles.legendPast} /> where it's been
              <span className={styles.legendFuture} /> where it's going
              <span className={styles.legendRetro} /> retrograde
            </p>
          </div>
          {span === '6mo' && (
            <div className={styles.scrub}>
              <div className={styles.scrubHead}>
                <span className={styles.scrubLabel}>Move through the next 6 months</span>
                <span className={styles.scrubDate}>
                  {dayOffset === 0 ? 'Today' : `+${dayOffset} days · ${moment.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                </span>
              </div>
              <input type="range" min={0} max={SIX_MONTHS_DAYS} step={1} value={dayOffset} onChange={(e) => setDayOffset(Number(e.target.value))} aria-label="Days from today" className={styles.range} />
              <div className={styles.ticks}>
                {monthTicks.map((t) => (
                  <span key={t.label + t.pct} style={{ left: `${t.pct}%` }}>{t.label}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className={styles.panel}>
          {sel && (
            <section className={styles.why}>
              <span className={styles.eyebrow}>{selPlan?.slot ? `${selPlan.slot.planet} · ${selPlan.slot.system}` : sel.id}</span>
              <h3 className={styles.whyTitle}>{selPlan?.name || `${sel.id} in ${SIGNS[sel.sign].name}`}</h3>
              <p className={styles.whyText}>
                {sel.id} sits at {formatDeg(sel.degInSign)} {SIGNS[sel.sign].name}
                {sel.retro && sel.id !== 'Rahu' && sel.id !== 'Ketu' ? ', moving backward (retrograde)' : ''}. From {place.label}, {ascSign.name} is rising, so this plan
                is lit in your <strong>{ordinal(sel.house)} house</strong> — {HOUSE_THEMES[sel.house - 1].toLowerCase()}.
              </p>
              {selPlan?.entity && (
                <button type="button" className={styles.open} onClick={() => onSelect(selPlan.entity!.id)}>
                  Open this plan
                </button>
              )}
            </section>
          )}

          <ul className={styles.table}>
            {sky.bodies.map((b) => {
              const p = planFor(b.id);
              return (
                <li key={b.id}>
                  <button type="button" className={`${styles.row} ${b.id === sel?.id ? styles.rowSel : ''}`} onClick={() => setSelected(b.id)}>
                    <span className={styles.glyph}>{b.glyph}</span>
                    <span className={styles.bodyName}>
                      {p.name || b.id}
                      {b.retro && b.id !== 'Rahu' && b.id !== 'Ketu' && <em className={styles.r}>R</em>}
                    </span>
                    <span className={styles.pos}>{SIGNS[b.sign].glyph} {formatDeg(b.degInSign)}</span>
                    <span className={styles.house}>H{b.house}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {events.length > 0 && (
            <section>
              <h3 className={styles.eventsTitle}>Next 6 months</h3>
              <ul className={styles.events}>
                {events.map((e, i) => (
                  <li key={i}>
                    <button type="button" className={styles.event} onClick={() => setDayOffset(Math.max(0, Math.min(SIX_MONTHS_DAYS, Math.round((e.ms - now.getTime()) / DAY))))}>
                      <span className={styles.eventDate}>{new Date(e.ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      <span className={styles.glyph}>{e.glyph}</span>
                      <span className={styles.eventText}>{e.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className={styles.footnote}>Dates are approximate (±2 days). Tap one to jump the wheel there.</p>
            </section>
          )}
          <p className={styles.footnote}>
            {ZODIAC_LABEL[mode]} zodiac{mode === 'vedic' ? ' (Lahiri)' : mode === 'sidereal' ? ' (Fagan-Bradley)' : ''} · whole-sign houses · houses from {place.label}
          </p>
        </aside>
      </div>
    </section>
  );
}
