import type { BodyId } from './sky/skyMath';

// The 16 standing plans — same order and names as the LORRAEN MADRE voice app's SPACE board.
// entityId = the matching placement in ufo-system.json (portfolio).
export const PLAN_SLOTS: { slot: string; planet: string; glyph: string; system: string; body: BodyId; entityId: string }[] = [
  { slot: 'sun', planet: 'Sun', glyph: '☉︎', system: 'Brand Identity', body: 'Sun', entityId: 'sun' },
  { slot: 'moon', planet: 'Moon', glyph: '☽︎', system: 'AI Home Ec Framework', body: 'Moon', entityId: 'moon' },
  { slot: 'mercury', planet: 'Mercury', glyph: '☿︎', system: 'Integrated Marketing', body: 'Mercury', entityId: 'mercury' },
  { slot: 'venus', planet: 'Venus', glyph: '♀︎', system: 'Content Library', body: 'Venus', entityId: 'venus' },
  { slot: 'mars', planet: 'Mars', glyph: '♂︎', system: 'Business Activation', body: 'Mars', entityId: 'mars' },
  { slot: 'jupiter', planet: 'Jupiter', glyph: '♃︎', system: 'Capital Container', body: 'Jupiter', entityId: 'jupiter' },
  { slot: 'saturn', planet: 'Saturn', glyph: '♄︎', system: 'Digital Organization', body: 'Saturn', entityId: 'saturn' },
  { slot: 'uranus', planet: 'Uranus', glyph: '♅︎', system: 'SaaS Membership', body: 'Uranus', entityId: 'uranus' },
  { slot: 'neptune', planet: 'Neptune', glyph: '♆︎', system: 'The Movie', body: 'Neptune', entityId: 'neptune' },
  { slot: 'pluto', planet: 'Pluto', glyph: '♇︎', system: 'Acquisition', body: 'Pluto', entityId: 'pluto' },
  { slot: 'juno', planet: 'Juno', glyph: '⚵︎', system: 'Relationship Goal', body: 'Juno', entityId: 'juno' },
  { slot: 'chiron', planet: 'Chiron', glyph: '⚷︎', system: 'Healing Journey', body: 'Chiron', entityId: 'chiron' },
  { slot: 'vesta', planet: 'Vesta', glyph: '⚶︎', system: 'Passion & Talent', body: 'Vesta', entityId: 'vesta' },
  { slot: 'lilith', planet: 'Lilith', glyph: '⚸︎', system: 'Special Projects', body: 'Lilith', entityId: 'lilith' },
  { slot: 'north_node', planet: 'North Node', glyph: '☊︎', system: 'Retirement Plan', body: 'Rahu', entityId: 'north-node' },
  { slot: 'south_node', planet: 'South Node', glyph: '☋︎', system: 'Foundation', body: 'Ketu', entityId: 'south-node' },
];

export const slotForEntity = (entityId: string) => PLAN_SLOTS.find((s) => s.entityId === entityId);
export const slotForBody = (body: BodyId) => PLAN_SLOTS.find((s) => s.body === body);
