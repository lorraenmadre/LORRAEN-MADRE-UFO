import React, { useEffect, useMemo, useState } from 'react';
import { Entity } from '../types';
import { SkyWheel } from './SkyWheel';
import { computeSky, formatDeg, SIGNS, HOUSE_THEMES, type ZodiacMode, type BodyId } from '../sky/skyMath';
import { slotForBody } from '../planSlots';
import { isUnnamed } from '../entityOrder';
import { FOUNDER_BIRTH, loadBirth, saveBirth, birthDate as toBirthDate, findPlace, type BirthProfile } from '../birth';
import styles from './TimeView.module.css';

type Span = 'today' | '6mo';
type View = 'now' | 'birth';
const SIX_MONTHS_DAYS = 182;
const DAY = 86400000;
const DEFAULT_PLACE = { label: 'Miami', lat: 25.7617, lon: -80.1918 };
const ZODIAC_LABEL: Record<ZodiacMode, string> = { tropical: 'Tropical', sidereal: 'Sidereal', vedic: 'Vedic' };
const ordinal = (n: number) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`;

interface Props {
  entities: Entity[];
  onSelect: (id: string) => void;
  /** true = public preview: show the founder's birth chart. false = the member's own. */
  founder?: boolean;
}

/** TIME — the same sky wheel as the voice app: each planet track is one of your plans, across the next 6 months. */
export default function TimeView({ entities, onSelect, founder = false }: Props) {
  const [span, setSpan] = useState<Span>('6mo');
  const [dayOffset, setDayOffset] = useState(0);
  const [mode, setMode] = useState<ZodiacMode>('tropical');
  const [now, setNow] = useState(() => new Date());
  const [here, setHere] = useState<{ label: string; lat: number; lon: number } | null>(null);
  const [selected, setSelected] = useState<BodyId | null>('Sun');
  const [view, setView] = useState<View>('now');
  const [overlayOn, setOverlayOn] = useState(true);
  const [mine, setMine] = useState<BirthProfile | null>(() => loadBirth());
  const [editing, setEditing] = useState(false);
  const profile = founder ? FOUNDER_BIRTH : mine;

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
  const bDate = useMemo(() => (profile ? toBirthDate(profile) : null), [profile]);
  const birthSky = useMemo(() => (profile && bDate ? computeSky(bDate, profile.lat, profile.lon, mode) : null), [profile, bDate, mode]);
  const showingBirth = view === 'birth' && !!birthSky;
  const wheel = showingBirth ? birthSky! : sky;
  const overlay = overlayOn ? (showingBirth ? sky : birthSky) : null;
  const sel = wheel.bodies.find((b) => b.id === selected) ?? wheel.bodies[0];
  const ascSign = SIGNS[wheel.ascSign];
  const whoseBirth = profile?.name ? `${profile.name}'s birth` : 'Birth';

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
    <section aria-label="Time — Rabbit Hole" className={styles.wrap}><h2 className="lm-section-title">Time · Rabbit Hole</h2><p>Your sky wheel and six-month view of time.</p>
      <div className={styles.head}>
        <div className={styles.controls}>
          <div className={styles.segment} role="group" aria-label="Chart">
            {(['now', 'birth'] as View[]).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} className={view === v ? styles.on : ''} onClick={() => { if (v === 'birth' && !profile) setEditing(true); setView(v); }}>
                {v === 'now' ? 'Now' : 'Birth'}
              </button>
            ))}
          </div>
          {!showingBirth && <div className={styles.segment} role="group" aria-label="Span">
            {(['today', '6mo'] as Span[]).map((s) => (
              <button key={s} type="button" aria-pressed={span === s} className={span === s ? styles.on : ''} onClick={() => { setSpan(s); setDayOffset(0); }}>
                {s === 'today' ? 'Today' : '6 months'}
              </button>
            ))}
          </div>}
          <div className={styles.segment} role="group" aria-label="Zodiac">
            {(Object.keys(ZODIAC_LABEL) as ZodiacMode[]).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} className={mode === m ? styles.on : ''} onClick={() => setMode(m)}>
                {ZODIAC_LABEL[m]}
              </button>
            ))}
          </div>
          {profile && (
            <label className={styles.check}>
              <input type="checkbox" checked={overlayOn} onChange={(e) => setOverlayOn(e.target.checked)} />
              {showingBirth ? "Show today's positions" : 'Show birth positions'}
            </label>
          )}
          {!founder && (
            <button type="button" className={styles.link} onClick={() => setEditing(true)}>
              {profile ? 'Edit birth details' : 'Add birth details'}
            </button>
          )}
        </div>
      </div>

      {editing && !founder && (
        <BirthForm
          initial={mine}
          onCancel={() => { setEditing(false); if (!mine) setView('now'); }}
          onSave={(p) => { saveBirth(p); setMine(p); setEditing(false); setView('birth'); }}
        />
      )}

      <div className={styles.layout}>
        <div className={styles.wheelWrap}>
          <div className={styles.wheelPanel}>
            <SkyWheel
              sky={wheel}
              overlay={overlay}
              selected={sel?.id}
              onSelect={setSelected}
              centerTop={`${showingBirth ? whoseBirth : dayOffset > 0 ? `In ${dayOffset} days` : 'Now'} · rising`}
              centerMain={ascSign.name}
              centerSub={showingBirth && profile
                ? `${new Date(`${profile.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · ${profile.time}`
                : moment.toLocaleString(undefined, { month: 'short', day: 'numeric', year: dayOffset > 0 ? 'numeric' : undefined, hour: 'numeric', minute: '2-digit' })}
            />
            <p className={styles.legend}>
              <span className={styles.legendPast} /> where it's been
              <span className={styles.legendFuture} /> where it's going
              <span className={styles.legendRetro} /> retrograde
              {overlay && (<><span className={styles.legendOverlay} /> {showingBirth ? 'today' : 'birth'}</>)}
            </p>
          </div>
          {span === '6mo' && !showingBirth && (
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
                {sel.retro && sel.id !== 'Rahu' && sel.id !== 'Ketu' ? ', moving backward (retrograde)' : ''}. {showingBirth && profile ? `At birth in ${profile.place}` : `From ${place.label}`}, {ascSign.name} {showingBirth ? 'was' : 'is'} rising, so this plan{' '}
                {showingBirth ? 'was born' : 'is lit'} in your <strong>{ordinal(sel.house)} house</strong> — {HOUSE_THEMES[sel.house - 1].toLowerCase()}.
              </p>
              {selPlan?.entity && (
                <button type="button" className={styles.open} onClick={() => onSelect(selPlan.entity!.id)}>
                  Open this plan
                </button>
              )}
            </section>
          )}

          <ul className={styles.table}>
            {wheel.bodies.map((b) => {
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

          {events.length > 0 && !showingBirth && (
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
            {ZODIAC_LABEL[mode]} zodiac{mode === 'vedic' ? ' (Lahiri)' : mode === 'sidereal' ? ' (Fagan-Bradley)' : ''} · whole-sign houses · {showingBirth && profile ? `born ${profile.place}` : `houses from ${place.label}`}
          </p>
        </aside>
      </div>
    </section>
  );
}

function BirthForm({ initial, onSave, onCancel }: { initial: BirthProfile | null; onSave: (p: BirthProfile) => void; onCancel: () => void }) {
  const [date, setDate] = useState(initial?.date ?? '');
  const [time, setTime] = useState(initial?.time ?? '12:00');
  const [query, setQuery] = useState(initial?.place ?? '');
  const [results, setResults] = useState<{ label: string; lat: number; lon: number; timeZone: string }[]>([]);
  const [picked, setPicked] = useState<{ label: string; lat: number; lon: number; timeZone: string } | null>(
    initial ? { label: initial.place, lat: initial.lat, lon: initial.lon, timeZone: initial.timeZone } : null,
  );
  const [msg, setMsg] = useState('');
  const search = async () => {
    setMsg('');
    try {
      const r = await findPlace(query);
      setResults(r);
      if (!r.length) setMsg('No place found. Try the city and state.');
    } catch {
      setMsg("Couldn't look up that place.");
    }
  };
  return (
    <form
      className={styles.birthForm}
      onSubmit={(e) => {
        e.preventDefault();
        if (!date || !time || !picked) return setMsg('Add your date, time and birthplace.');
        onSave({ date, time, timeZone: picked.timeZone, place: picked.label, lat: picked.lat, lon: picked.lon });
      }}
    >
      <p className={styles.formTitle}>Your birth details</p>
      <label className={styles.field}>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
      <label className={styles.field}>Time<input type="time" value={time} onChange={(e) => setTime(e.target.value)} required /></label>
      <label className={styles.field}>
        Birthplace
        <span className={styles.placeRow}>
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPicked(null); }} placeholder="City, state" />
          <button type="button" onClick={search} className={styles.link}>Find</button>
        </span>
      </label>
      {results.length > 0 && !picked && (
        <ul className={styles.places}>
          {results.map((r) => (
            <li key={r.label + r.lat}>
              <button type="button" onClick={() => { setPicked(r); setQuery(r.label); setResults([]); }}>{r.label}</button>
            </li>
          ))}
        </ul>
      )}
      {msg && <p className={styles.footnote}>{msg}</p>}
      <div className={styles.formActions}>
        <button type="submit" className={styles.open}>Save</button>
        <button type="button" className={styles.link} onClick={onCancel}>Cancel</button>
      </div>
      <p className={styles.footnote}>Saved on this device only.</p>
    </form>
  );
}
