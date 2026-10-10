import { Entity } from './types';
import { PLAN_SLOTS, slotForEntity } from './planSlots';

export const ZODIAC_GLYPHS:Record<string,string>={Aries:'♈︎',Taurus:'♉︎',Gemini:'♊︎',Cancer:'♋︎',Leo:'♌︎',Virgo:'♍︎',Libra:'♎︎',Scorpio:'♏︎',Sagittarius:'♐︎',Capricorn:'♑︎',Aquarius:'♒︎',Pisces:'♓︎'};

export const isUnnamed = (e: Entity) => !e.name || !e.name.trim() || /name to be chosen/i.test(e.name) || e.name.trim() === 'None';

/** Short label for a box: planet glyph + name, house number, zodiac sign or satellite. */
export const boxLabel = (e: Entity) => {
  const s = slotForEntity(e.id);
  if (s) return `${s.glyph} ${s.planet}`;
  if (e.type === 'church') return '♛︎ Queen';
  if (e.type === 'holding_company') return 'UFO';
  if (e.type === 'offering') return e.house || 'House';
  if (e.type === 'dinosaur') return `${ZODIAC_GLYPHS[e.zodiacSign || ''] || ''} ${e.zodiacSign || 'Dinosaur'}`.trim();
  if (e.type === 'satellite') return 'Satellite';
  return e.symbol || e.type;
};

/** What the box is for (the system / role / platform). */
export const boxRole = (e: Entity) => {
  const s = slotForEntity(e.id);
  if (s) return s.system;
  if (e.type === 'offering' || e.type === 'dinosaur') return e.platform || '';
  return e.highLevelSystem || '';
};

/** Board order: the 16 standing plans (voice-app order), mothership, Earth, then houses, dinosaurs, satellites. */
export const orderForBoard = (entities: Entity[]) => {
  const byId = new Map(entities.map((e) => [e.id, e]));
  const plans = PLAN_SLOTS.map((s) => byId.get(s.entityId)).filter(Boolean) as Entity[];
  const used = new Set(plans.map((e) => e.id));
  const pick = (f: (e: Entity) => boolean) => entities.filter((e) => !used.has(e.id) && f(e));
  return [
    ...plans,
    ...pick((e) => e.type === 'church' || e.type === 'holding_company' || e.type === 'trust'),
    ...pick((e) => e.type === 'planet'),
    ...pick((e) => e.type === 'offering'),
    ...pick((e) => e.type === 'dinosaur'),
    ...pick((e) => e.type === 'satellite'),
  ].filter((e, i, a) => a.findIndex((x) => x.id === e.id) === i && !e.isArchived);
};
