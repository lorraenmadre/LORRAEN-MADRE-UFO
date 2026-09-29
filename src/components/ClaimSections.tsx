import React, { useState } from 'react';
import { Entity } from '../types';
import { boxLabel, boxRole, isUnnamed, orderForBoard } from '../entityOrder';
import { slotForEntity } from '../planSlots';
import { calculateProgress } from '../progress';
import EntityArt, { Progress } from './EntityArt';

interface Props {
  entities: Entity[];
  onSelect: (id: string) => void;
  onUpdate: (e: Entity) => void;
}

const SECTIONS: { key: string; title: string; note: string; steps: string[]; match: (e: Entity) => boolean }[] = [
  {
    key: 'mothership', title: 'Mothership',
    note: 'Your Queen (the church) and your UFO (the holding company). Everything else orbits these two.',
    steps: ['Start both with the setup steps above.', 'Name each one here so every plan knows where it belongs.'],
    match: (e) => e.type === 'church' || e.type === 'holding_company' || e.type === 'trust',
  },
  {
    key: 'planets', title: 'Planets',
    note: 'Each planet is a project that runs on a 6-month cadence. Treat it like a season: one goal, worked for six months, then reviewed and renewed.',
    steps: [
      'Name the project that lives on this planet.',
      'Set one goal for the next six months: what will be true, how you will measure it, and by when.',
      'Build it out in the voice app: 1 goal, 8 outcomes, 64 tasks.',
      'Check the Time view to see when the planet is lit, and push it forward then.',
    ],
    match: (e) => !!slotForEntity(e.id) || e.type === 'planet',
  },
  {
    key: 'dinosaurs', title: 'Dinosaurs',
    note: 'Each dinosaur is an agent that runs one domain of your family office through a social media account. Its zodiac sign sets its voice; its platform is where it works.',
    steps: [
      'Connect the social media account shown on the card (Instagram, TikTok, YouTube and so on).',
      'Name the dinosaur and give it the domain it runs, like brand, story or community.',
      'Let it post, answer and report back for that domain on its own cadence.',
    ],
    match: (e) => e.type === 'dinosaur',
  },
  {
    key: 'houses', title: 'Houses',
    note: 'Each house is an entryway: the digital product you open to manage that part of your life. The voice app sends you to the right house for whatever you are working on.',
    steps: [
      'Open a house to see its product and where it lives.',
      'Do that house’s work there: money in the Treasury house, recipes in the Cookbook house, and so on.',
      'Come back here to see how far along each house is.',
    ],
    match: (e) => e.type === 'offering',
  },
  {
    key: 'satellites', title: 'Satellites',
    note: 'Your own connections that are not already one of the common houses, like a tool, partner or service only your family uses.',
    steps: ['Add each outside tool or partner you rely on.', 'Name what it does for your family office.'],
    match: (e) => e.type === 'satellite',
  },
];

/** Name-and-claim sections under the Space / Time views. Same boxes, grouped. Unnamed boxes are terminals. */
export default function ClaimSections({ entities, onSelect, onUpdate }: Props) {
  const ordered = orderForBoard(entities);
  const seen = new Set<string>();
  return (
    <section className="space-y-12" aria-label="Name and claim">
      {SECTIONS.map((s) => {
        const items = ordered.filter((e) => !seen.has(e.id) && s.match(e));
        items.forEach((e) => seen.add(e.id));
        if (!items.length) return null;
        const claimed = items.filter((e) => !isUnnamed(e)).length;
        return (
          <section key={s.key}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <h2 className="text-2xl font-belleza">{s.title}</h2>
              <span className="font-figtree font-semibold text-sm">{claimed}/{items.length} claimed</span>
            </div>
            <p className="text-base max-w-3xl">{s.note}</p>
            <ol className="mt-3 mb-5 max-w-3xl grid gap-1 list-decimal pl-5 text-sm">
              {s.steps.map((t) => <li key={t}>{t}</li>)}
            </ol>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {items.map((e) => (isUnnamed(e) ? <ClaimCard key={e.id} e={e} onSelect={onSelect} onUpdate={onUpdate} /> : (
                <button key={e.id} type="button" onClick={() => onSelect(e.id)} className="group border border-black rounded-xl min-h-32 p-4 text-left flex flex-col gap-2 hover:bg-black hover:text-white transition-colors">
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-figtree font-semibold text-xs uppercase tracking-[0.06em]">{boxLabel(e)}</span>
                    <EntityArt entity={e} size={32} />
                  </span>
                  <span className="font-belleza text-lg leading-snug">{e.name}</span>
                  {boxRole(e) && <span className="text-sm">{s.key === 'houses' ? `Entryway: ${boxRole(e)}` : boxRole(e)}</span>}
                  {s.key === 'houses' && e.description && <span className="text-xs leading-relaxed line-clamp-3">{e.description}</span>}
                  <span className="mt-auto pt-1"><Progress value={calculateProgress(e)} /></span>
                </button>
              )))}
            </div>
          </section>
        );
      })}
    </section>
  );
}

function ClaimCard({ e, onSelect, onUpdate }: { e: Entity; onSelect: (id: string) => void; onUpdate: (e: Entity) => void }) {
  const [value, setValue] = useState('');
  return (
    <form
      className="rounded-xl min-h-32 p-4 bg-black text-white flex flex-col gap-2"
      onSubmit={(ev) => {
        ev.preventDefault();
        if (value.trim()) onUpdate({ ...e, name: value.trim() });
      }}
    >
      <span className="flex items-start justify-between gap-2">
        <button type="button" onClick={() => onSelect(e.id)} className="text-left font-figtree font-semibold text-xs uppercase tracking-[0.06em] hover:underline">
          {boxLabel(e)}
        </button>
        <EntityArt entity={e} size={32} />
      </span>
      {boxRole(e) && <span className="text-sm">{boxRole(e)}</span>}
      <label className="mt-auto flex items-center gap-1 border border-white/60 rounded-md px-2 min-h-[36px] font-mono text-sm cursor-text focus-within:outline-2 focus-within:outline-white">
        <span className="text-[#00bf63]" aria-hidden>&gt;</span>
        <input value={value} onChange={(ev) => setValue(ev.target.value)} placeholder="name it" aria-label={`${boxLabel(e)}: name it`} className="flex-1 min-w-0 bg-transparent outline-none text-white placeholder:text-white/75" />
      </label>
    </form>
  );
}
