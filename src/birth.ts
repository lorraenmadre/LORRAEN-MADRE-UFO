import { zonedToUtc } from './sky/skyMath';

export interface BirthProfile {
  name?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM, local time at birthplace
  timeZone: string; // IANA, e.g. America/New_York
  place: string;
  lat: number;
  lon: number;
}

// Founder example (public preview): Lorraen Madre, Dec 1 1988, 8:24 PM, Miami FL.
export const FOUNDER_BIRTH: BirthProfile = {
  name: 'Lorraen',
  date: '1988-12-01',
  time: '20:24',
  timeZone: 'America/New_York',
  place: 'Miami, FL',
  lat: 25.7617,
  lon: -80.1918,
};

const KEY = 'lm-ufo-birth';

/** A member's own birth details stay on their device for now. */
export const loadBirth = (): BirthProfile | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BirthProfile) : null;
  } catch {
    return null;
  }
};

export const saveBirth = (p: BirthProfile) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable */
  }
};

export const birthDate = (p: BirthProfile) => {
  const [y, m, d] = p.date.split('-').map(Number);
  const [h, mi] = p.time.split(':').map(Number);
  return zonedToUtc(y, m, d, h, mi, p.timeZone);
};

/** Free place lookup (Open-Meteo geocoding, no key): city → lat/lon/time zone. */
export const findPlace = async (q: string) => {
  const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`);
  const j = await r.json();
  return ((j.results ?? []) as any[]).map((x) => ({
    label: [x.name, x.admin1, x.country_code].filter(Boolean).join(', '),
    lat: x.latitude as number,
    lon: x.longitude as number,
    timeZone: x.timezone as string,
  }));
};
