import React, { useState } from 'react';
import { Entity } from '../types';

export default function OrbitMap({ entities, onSelect }: { entities: Entity[]; onSelect: (id: string) => void }) {
  const [paused, setPaused] = useState(false);
  const sun = entities.find(e => e.id === 'sun');
  const planets = entities.filter(e => e.type === 'planet' && e.id !== 'sun');
  const groups = [
    { title: 'Mothership + protection', items: entities.filter(e => ['trust', 'church', 'holding_company', 'north_node', 'south_node'].includes(e.type)) },
    { title: 'Asteroids', items: entities.filter(e => e.type === 'asteroid') },
    { title: 'Offering seeds', items: entities.filter(e => e.type === 'offering') },
    { title: 'Zodiac dinosaurs', items: entities.filter(e => e.type === 'dinosaur') },
    { title: 'Satellites', items: entities.filter(e => e.type === 'satellite') },
  ];
  const label = (e: Entity) => e.symbol || e.zodiacSign || e.house || e.type.replaceAll('_', ' ');

  const isUnnamed = (e: Entity) => {
    if (!e.name || e.name.trim() === '') return true;
    const n = e.name.toLowerCase();
    return n.includes('name to be chosen') || n.includes('empty workspace') || n.includes('empty brand identity') || n.includes('not yet provided');
  };

  return (
    <section className="max-w-7xl mx-auto px-6" aria-label="Interactive orbit map">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-spectral">Your universe, in motion.</h2>
          <p className="text-sm text-gray-500 mt-2">Choose a planet to open its workspace. Motion pauses while you explore.</p>
        </div>
        <button
          className="border border-black rounded-full px-5 py-2 text-sm hover:bg-black hover:text-white transition-colors"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? 'Resume orbits' : 'Pause orbits'}
        </button>
      </div>

      <div className="orbit-scroll border border-gray-200 rounded-3xl">
        <div className={`orbit-stage ${paused ? 'is-paused' : ''}`}>
          <svg className="orbit-lines" viewBox="0 0 1000 740" aria-hidden="true">
            {planets.map((e, i) => (
              <ellipse key={e.id} cx="500" cy="370" rx={105 + i * 40} ry={(105 + i * 40) * 0.68} fill="none" stroke="currentColor" strokeWidth=".6" />
            ))}
          </svg>
          {sun && (
            <button
              className={`orbit-sun ${isUnnamed(sun) ? 'border-emerald-500' : ''}`}
              onClick={() => onSelect(sun.id)}
              aria-label={`Open Sun: ${sun.name || 'empty brand identity'}`}
            >
              <span>Sun</span>
              <strong>{sun.name || '> UNCLAIMED _'}</strong>
            </button>
          )}
          {planets.map((e, i) => (
            <div
              key={e.id}
              className="orbit-track"
              style={{ '--radius': `${105 + i * 40}px`, '--period': `${90 + i * 23}s`, '--phase': `${-i * 17 - 8}s` } as React.CSSProperties}
            >
              <div className="orbit-arm">
                <div className="orbit-position">
                  <div className="orbit-counter">
                    <button
                      className="orbit-planet"
                      onClick={() => onSelect(e.id)}
                      aria-label={`Open ${label(e)}: ${e.name || 'empty workspace'}`}
                    >
                      <span className="orbit-dot" />
                      <span>{label(e)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4" aria-label="Planet shortcuts">
        {[sun, ...planets]
          .filter((e): e is Entity => Boolean(e))
          .map(e => (
            <button
              key={e.id}
              onClick={() => onSelect(e.id)}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm hover:bg-black hover:text-white transition-colors"
            >
              {label(e)}
            </button>
          ))}
      </div>

      <div className="space-y-10 mt-12">
        {groups.map(group => (
          <section key={group.title}>
            <h3 className="text-xl font-spectral font-medium mb-4">{group.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {group.items.map((e, i) => {
                const unnamed = isUnnamed(e);
                return (
                  <button
                    key={e.id}
                    onClick={() => onSelect(e.id)}
                    aria-label={`Open ${label(e)} ${i + 1}`}
                    className={`min-h-32 border p-4 text-left transition-all ${
                      unnamed
                        ? 'border-emerald-500/60 bg-[#0C120C] text-[#00FF66] font-mono hover:border-[#00FF66]'
                        : 'border-black hover:bg-gray-50 text-black'
                    }`}
                  >
                    <span className={`block text-xs uppercase tracking-widest ${unnamed ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {label(e)}
                    </span>
                    {e.name && !unnamed ? (
                      <span className="block mt-5 min-h-6 font-spectral text-base font-medium">{e.name}</span>
                    ) : (
                      <span className="block mt-5 min-h-6 font-mono text-xs text-[#00FF66]">
                        &gt; [{label(e).toUpperCase()}] <span className="animate-pulse">_</span>
                      </span>
                    )}
                    {e.platform && <span className={`block text-xs mt-2 ${unnamed ? 'text-emerald-500/70' : 'text-gray-500'}`}>{e.platform}</span>}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
