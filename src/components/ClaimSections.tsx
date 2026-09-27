import React, { useState } from 'react';
import { Entity } from '../types';
import { boxLabel, boxRole, isUnnamed, orderForBoard } from '../entityOrder';
import { slotForEntity } from '../planSlots';

interface Props {
  entities: Entity[];
  onSelect: (id: string) => void;
  onUpdate: (e: Entity) => void;
}

const SECTIONS: { key: string; title: string; note: string; match: (e: Entity) => boolean }[] = [
  { key: 'mothership', title: 'Mothership', note: 'Your Queen and your UFO — the center everything orbits.', match: (e) => e.type === 'church' || e.type === 'holding_company' || e.type === 'trust' },
  { key: 'planets', title: 'Planets', note: 'Your individual spaces — one standing plan per planet, asteroid and node.', match: (e) => !!slotForEntity(e.id) || e.type === 'planet' },
  { key: 'dinosaurs', title: 'Dinosaurs', note: 'Your individual agents — one per zodiac sign, each on its own platform.', match: (e) => e.type === 'dinosaur' },
  { key: 'houses', title: 'Houses', note: 'Connection resources. The voice app connects you to the right house for whatever you are working on.', match: (e) => e.type === 'offering' },
  { key: 'satellites', title: 'Satellites', note: 'Your own connections that are not already one of the common houses.', match: (e) => e.type === 'satellite' },
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
            <p className="text-base mb-5 max-w-2xl">{s.note}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {items.map((e) => (isUnnamed(e) ? <ClaimCard key={e.id} e={e} onSelect={onSelect} onUpdate={onUpdate} /> : (
                <button key={e.id} type="button" onClick={() => onSelect(e.id)} className="border border-black rounded-xl min-h-32 p-4 text-left flex flex-col gap-2 hover:bg-black hover:text-white transition-colors">
                  <span className="font-figtree font-semibold text-xs uppercase tracking-[0.06em]">{boxLabel(e)}</span>
                  <span className="font-belleza text-lg leading-snug">{e.name}</span>
                  {boxRole(e) && <span className="text-sm mt-auto">{boxRole(e)}</span>}
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
      <button type="button" onClick={() => onSelect(e.id)} className="text-left font-figtree font-semibold text-xs uppercase tracking-[0.06em] hover:underline">
        {boxLabel(e)}
      </button>
      {boxRole(e) && <span className="text-sm">{boxRole(e)}</span>}
      <label className="mt-auto flex items-center gap-1 border border-white/60 rounded-md px-2 min-h-[36px] font-mono text-sm cursor-text focus-within:outline-2 focus-within:outline-white">
        <span className="text-[#00bf63]" aria-hidden>&gt;</span>
        <input value={value} onChange={(ev) => setValue(ev.target.value)} placeholder="name it" aria-label={`${boxLabel(e)}: name it`} className="flex-1 min-w-0 bg-transparent outline-none text-white placeholder:text-white/75" />
      </label>
    </form>
  );
}
