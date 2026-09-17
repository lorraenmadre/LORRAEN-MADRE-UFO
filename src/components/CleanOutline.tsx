import React from 'react';
import { Entity } from '../types';

export default function CleanOutline({ entities, onSelect }: { entities: Entity[]; onSelect: (id: string) => void }) {
  const groups = [
    ['Portfolio', entities.filter(e => !['offering', 'satellite', 'dinosaur'].includes(e.type))],
    ['Offering seeds', entities.filter(e => e.type === 'offering')],
    ['Zodiac dinosaurs', entities.filter(e => e.type === 'dinosaur')],
    ['Satellites', entities.filter(e => e.type === 'satellite')]
  ] as const;

  return (
    <section className="max-w-7xl mx-auto px-6 space-y-10" aria-label="Clean framework outline">
      {groups.map(([title, items]) => (
        <section key={title}>
          <h2 className="text-2xl mb-5 font-spectral font-medium">{title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((e, i) => {
              const tag = e.symbol || e.zodiacSign || e.house || `Satellite ${i + 1}`;
              const isUnnamed = !e.name || e.name.trim() === '';
              return (
                <button
                  key={e.id}
                  onClick={() => onSelect(e.id)}
                  aria-label={`Open ${e.symbol || e.zodiacSign || e.house || `${title} ${i + 1}`}`}
                  className={`border min-h-36 p-5 text-left transition-all ${
                    isUnnamed 
                      ? 'border-emerald-500/60 bg-[#0C120C] text-[#00FF66] font-mono hover:border-[#00FF66]' 
                      : 'border-black hover:bg-gray-50 text-black'
                  }`}
                >
                  <span className={`text-xs uppercase tracking-widest ${isUnnamed ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {tag}
                  </span>
                  {e.name ? (
                    <span className="block mt-5 min-h-6 font-spectral text-base font-semibold">{e.name}</span>
                  ) : (
                    <span className="block mt-5 min-h-6 font-mono text-xs text-[#00FF66]">
                      &gt; [NAME_TO_CHOOSE] <span className="animate-pulse">_</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}
