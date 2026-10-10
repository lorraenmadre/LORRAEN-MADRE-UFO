import React from 'react';
import status from '../founderStatus.json';

type Project = (typeof status.projects)[number];

/** The founder's own progress, shown only in the Founder's Example. Source: founderStatus.json. The Houses themselves are shown once, in the Mothership. */
const Bar = ({ value, tone = '#111' }: { value: number; tone?: string }) => (
  <div style={{ height: 6, background: 'rgba(17,17,17,.1)', borderRadius: 3, overflow: 'hidden' }} role="img" aria-label={`${value}%`}>
    <div style={{ width: `${value}%`, height: '100%', background: tone, borderRadius: 3 }} />
  </div>
);

const where = (p: Project) => (p.house ? `House ${p.house}` : (p as any).planet || '');
const asOf = new Date(`${status.asOf}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

export default function FounderStatus() {
  const s = status.summary;
  const projects = [...status.projects].sort((a, b) => b.total - a.total);
  const stats = [
    { label: 'Products toward money + automation', value: s.projects },
    { label: 'Houses 1–13 running', value: s.houses },
    { label: 'UFO operating system', value: s.system },
    { label: 'Ready for the first client sprint', value: s.onboarding },
  ];
  return (
    <section id="founder-status" className="max-w-7xl mx-auto px-6 py-10" aria-label="Founder's progress">
      <p className="lm-kicker">FOUNDERS FRAMEWORK · STATUS AS OF {asOf.toUpperCase()}</p>
      <h2 className="lm-section-title">Where Lorraen's UFO stands</h2>
      <p className="lm-section-description">Every product is split in half. The money half is its Goal, eight Outcomes, a live deliverable and a tested checkout. The automation half is its Plan and tasks, connected tools, and work that runs on its own.</p>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
        {stats.map((t) => (
          <div key={t.label} className="border border-black/15 rounded-xl p-4 grid gap-2">
            <span className="font-belleza" style={{ fontSize: 36, lineHeight: 1 }}>{t.value}%</span>
            <span className="lm-caption">{t.label}</span>
            <Bar value={t.value} />
          </div>
        ))}
      </div>
      <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
        <div className="border border-black/15 rounded-xl p-4 grid gap-2"><span className="font-figtree font-semibold flex justify-between"><span>Money half</span><span>{s.money}%</span></span><Bar value={s.money} tone="var(--lm-red)" /></div>
        <div className="border border-black/15 rounded-xl p-4 grid gap-2"><span className="font-figtree font-semibold flex justify-between"><span>Automation half</span><span>{s.auto}%</span></span><Bar value={s.auto} tone="var(--lm-blue)" /></div>
      </div>

      <div className="grid gap-3 mt-8" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
        {projects.map((p) => (
          <article key={p.id} className="border border-black/15 rounded-xl p-4 grid gap-2 content-start" style={{ minWidth: 0 }}>
            <div className="flex justify-between items-baseline gap-2">
              <h3 className="font-figtree font-semibold" style={{ fontSize: 16, margin: 0 }}>{p.name}</h3>
              <span className="font-belleza" style={{ fontSize: 22 }}>{p.total}%</span>
            </div>
            <span className="lm-caption">{p.sub}{where(p) ? ` · ${where(p)}` : ''}</span>
            <span className="lm-caption">Money {p.money}%</span><Bar value={p.money} tone="var(--lm-red)" />
            <span className="lm-caption">Automation {p.auto}%</span><Bar value={p.auto} tone="var(--lm-blue)" />
            <p className="lm-caption" style={{ margin: 0 }}>{p.note}</p>
            {p.change && <p className="font-mono text-xs" style={{ margin: 0, color: '#00853f' }}>&gt; {p.change}</p>}
          </article>
        ))}
      </div>

    </section>
  );
}
