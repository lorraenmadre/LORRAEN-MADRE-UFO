import { Entity, EntityType } from './types';
import system from './ufo-system.json';

// Founder example only. Never overwrite a customer's mothership with this data.
export const INITIAL_ENTITIES: Entity[] = [
  ...system.portfolio.map(p => ({
    id: p.id, type: p.type as EntityType, symbol: p.symbol,
    name: p.name || `${p.symbol} — name to be chosen`,
    description: `${p.role}. ${p.description}`,
    highLevelSystem: p.role, cadence: p.cadence,
    ...(p.type === 'church' ? { councilMembers: Array(12).fill('') } : {}),
  })),
  ...system.houses.filter(h => h.product).map(h => ({
    id: `product-house-${h.number}`, type: 'offering' as const,
    name: h.product!, house: `House ${h.number}`, platform: h.platform || 'Unassigned',
    description: h.description, cadence: h.cadence,
  })),
  ...system.dinosaurs.map(d => ({
    id: `dinosaur-${d.zodiac.toLowerCase()}`, type: 'dinosaur' as const,
    name: d.name, zodiacSign: d.zodiac, platform: d.platform,
    description: `Platform-specific agent identity. ${d.note}`,
    status: d.executionStatus,
  })),
  ...system.satellites.map((s, i) => ({
    id: `satellite-${i}`, type: 'satellite' as const, name: s.name,
    description: `${s.role}. ${s.notes}`, status: s.status, connectionMethod: s.method,
  })),
];

export const UFO_CONTEXT = JSON.stringify(system);

// Empty customer fields are independent from the founder example.
export const CLEAN_ENTITIES: Entity[] = INITIAL_ENTITIES.map(e => ({
  id: e.id, type: e.type, symbol: e.symbol, zodiacSign: e.zodiacSign,
  house: e.house, name: '', description: '',
  ...(e.type === 'church' ? { councilMembers: Array(12).fill('') } : {}),
}));
