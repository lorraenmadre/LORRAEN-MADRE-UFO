import React from 'react';
import { Crown, Orbit, Satellite } from 'lucide-react';
import { Entity } from '../types';
import { slotForEntity } from '../planSlots';
import DinosaurIcon from './DinosaurIcon';
import PlatformIcon, { matchPlatform } from './PlatformIcon';

// Watercolor planet artwork (same files as the voice app), served from /public/planets.
const PLANET_ART = new Set(['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'earth']);

/** The picture for a box: planet artwork, dinosaur + platform, or the house's platform logo. */
export default function EntityArt({ entity, size = 32, compact = false }: { entity: Entity; size?: number; compact?: boolean }) {
  const slot = slotForEntity(entity.id);
  if (PLANET_ART.has(entity.id)) {
    return <img src={`/planets/lm-planet-${entity.id}.webp`} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: 'contain' }} />;
  }
  if (slot) return <span aria-hidden style={{ fontSize: size * 0.7, lineHeight: 1 }}>{slot.glyph}</span>;
  if (entity.type === 'dinosaur' && compact) {
    return matchPlatform(entity.platform) ? <PlatformIcon platform={entity.platform!} size={Math.round(size * 0.75)} /> : null;
  }
  if (entity.type === 'dinosaur') {
    return (
      <span className="inline-flex items-center gap-1">
        <DinosaurIcon zodiac={entity.zodiacSign} size="sm" />
        {entity.platform && matchPlatform(entity.platform) && <PlatformIcon platform={entity.platform} size={Math.round(size * 0.6)} />}
      </span>
    );
  }
  if (entity.type === 'offering') return matchPlatform(entity.platform) ? <PlatformIcon platform={entity.platform!} size={Math.round(size * 0.75)} /> : <Satellite width={size * 0.6} height={size * 0.6} aria-hidden />;
  if (entity.type === 'satellite' && matchPlatform(entity.name)) return <PlatformIcon platform={entity.name} size={Math.round(size * 0.75)} />;
  if (entity.type === 'church') return <Crown width={size * 0.7} height={size * 0.7} aria-hidden />;
  if (entity.type === 'holding_company') return <Orbit width={size * 0.7} height={size * 0.7} aria-hidden />;
  return <Satellite width={size * 0.6} height={size * 0.6} aria-hidden />;
}

/** Thin progress bar: how far along a box is. */
export function Progress({ value, dark = false }: { value: number; dark?: boolean }) {
  return (
    <span className="flex items-center gap-2 w-full" aria-label={`${value}% complete`}>
      <span className={`flex-1 h-[4px] rounded-full overflow-hidden ${dark ? 'bg-white/25' : 'bg-black/10'}`}>
        <span className={`block h-full rounded-full ${dark ? 'bg-white' : 'bg-black'}`} style={{ width: `${value}%` }} />
      </span>
      <span className="font-figtree font-semibold text-xs tabular-nums">{value}%</span>
    </span>
  );
}
