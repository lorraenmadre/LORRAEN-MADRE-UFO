import * as A from "astronomy-engine";

export type ZodiacMode = "tropical" | "sidereal" | "vedic";

export type BodyId =
  | "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" | "Uranus" | "Neptune" | "Pluto"
  | "Chiron" | "Juno" | "Vesta" | "Lilith" | "Rahu" | "Ketu";

export const SIGNS = [
  { name: "Aries", glyph: "♈︎" }, { name: "Taurus", glyph: "♉︎" }, { name: "Gemini", glyph: "♊︎" },
  { name: "Cancer", glyph: "♋︎" }, { name: "Leo", glyph: "♌︎" }, { name: "Virgo", glyph: "♍︎" },
  { name: "Libra", glyph: "♎︎" }, { name: "Scorpio", glyph: "♏︎" }, { name: "Sagittarius", glyph: "♐︎" },
  { name: "Capricorn", glyph: "♑︎" }, { name: "Aquarius", glyph: "♒︎" }, { name: "Pisces", glyph: "♓︎" },
];

/** The Library matrix name for each of the 12 houses (lorraenmadre.com/library). */
export const HOUSE_THEMES = [
  "Business identity", "Asset & home economics", "Telecommunications + energy", "Healthcare & dependency", "Work + creative process", "Culture & systems",
  "Legal accounts", "Insurance & tech", "Education & travel", "Intention & vision", "CRM & mission", "Manifestation & legacy",
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

/** Bodies drawn as tracks, outermost first. `window` = days of motion shown either side of the moment. */
export const BODIES: { id: BodyId; glyph: string; window: number }[] = [
  { id: "Pluto", glyph: "♇", window: 120 },
  { id: "Neptune", glyph: "♆", window: 120 },
  { id: "Uranus", glyph: "♅", window: 120 },
  { id: "Chiron", glyph: "⚷", window: 120 },
  { id: "Saturn", glyph: "♄", window: 90 },
  { id: "Jupiter", glyph: "♃", window: 90 },
  { id: "Rahu", glyph: "☊", window: 90 },
  { id: "Lilith", glyph: "⚸", window: 60 },
  { id: "Juno", glyph: "⚵", window: 40 },
  { id: "Vesta", glyph: "⚶", window: 40 },
  { id: "Mars", glyph: "♂", window: 30 },
  { id: "Venus", glyph: "♀", window: 20 },
  { id: "Mercury", glyph: "☿", window: 15 },
  { id: "Sun", glyph: "☉", window: 15 },
  { id: "Moon", glyph: "☽", window: 1.2 },
];

const norm = (d: number) => ((d % 360) + 360) % 360;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

const julianCenturies = (date: Date) => (date.getTime() / 86400000 + 2440587.5 - 2451545.0) / 36525;

/**
 * Asteroids, computed in-app (no paid data source). Osculating heliocentric elements (ecliptic J2000)
 * from NASA/JPL's public Small-Body Database, epoch JD 2461200.5. Two-body motion from this epoch matches
 * JPL Horizons to ~0.01° in Sept 2026; refresh these numbers about once a year to stay within ~1°.
 */
const ASTEROID_EPOCH_JD = 2461200.5;
const ASTEROIDS: Record<"Chiron" | "Juno" | "Vesta", { a: number; e: number; i: number; om: number; w: number; ma: number; n: number }> = {
  Chiron: { a: 13.68426760850124, e: 0.3797656311453571, i: 6.930574468846328, om: 209.2961258613147, w: 339.2878326589729, ma: 216.7198966018106, n: 0.0194702593257484 },
  Juno: { a: 2.670989527103278, e: 0.2556999836681878, i: 12.98659236598085, om: 169.8115953492418, w: 247.8950743075613, ma: 262.7322944883855, n: 0.2257853690721904 },
  Vesta: { a: 2.361365965127599, e: 0.09020374382834395, i: 7.143925545058711, om: 103.701293265032, w: 151.4686478221564, ma: 81.19015607686903, n: 0.2716183613599909 },
};
const OBLIQUITY_J2000 = rad(23.4392911);

/** Heliocentric equatorial J2000 position (AU) of an asteroid at a Julian day, by Kepler's equation. */
const asteroidHelio = (id: keyof typeof ASTEROIDS, jd: number) => {
  const el = ASTEROIDS[id];
  const M = rad(norm(el.ma + el.n * (jd - ASTEROID_EPOCH_JD)));
  let E = M;
  for (let k = 0; k < 30; k++) E -= (E - el.e * Math.sin(E) - M) / (1 - el.e * Math.cos(E));
  const xv = el.a * (Math.cos(E) - el.e);
  const yv = el.a * Math.sqrt(1 - el.e * el.e) * Math.sin(E);
  const v = Math.atan2(yv, xv);
  const r = Math.hypot(xv, yv);
  const O = rad(el.om), i = rad(el.i), u = v + rad(el.w);
  const x = r * (Math.cos(O) * Math.cos(u) - Math.sin(O) * Math.sin(u) * Math.cos(i));
  const y = r * (Math.sin(O) * Math.cos(u) + Math.cos(O) * Math.sin(u) * Math.cos(i));
  const z = r * Math.sin(u) * Math.sin(i);
  return { x, y: y * Math.cos(OBLIQUITY_J2000) - z * Math.sin(OBLIQUITY_J2000), z: y * Math.sin(OBLIQUITY_J2000) + z * Math.cos(OBLIQUITY_J2000) };
};

const asteroidLon = (id: keyof typeof ASTEROIDS, date: Date) => {
  const t = A.MakeTime(date);
  const jd = t.ut + 2451545.0;
  const earth = A.HelioVector(A.Body.Earth, t);
  let p = asteroidHelio(id, jd);
  const dist = Math.hypot(p.x - earth.x, p.y - earth.y, p.z - earth.z);
  p = asteroidHelio(id, jd - dist * 0.0057755183); // light-time
  return A.Ecliptic(new A.Vector(p.x - earth.x, p.y - earth.y, p.z - earth.z, t)).elon;
};

/** Ayanamsa in degrees. Vedic = Lahiri (Chitrapaksha); Sidereal = Fagan-Bradley. */
export const ayanamsa = (date: Date, mode: ZodiacMode) => {
  if (mode === "tropical") return 0;
  const years = julianCenturies(date) * 100;
  const base = mode === "vedic" ? 23.853 : 24.74;
  return base + years * (50.29 / 3600);
};

/** Tropical geocentric ecliptic longitude (of date). */
const tropicalLon = (id: BodyId, date: Date): number => {
  const t = A.MakeTime(date);
  if (id === "Sun") return A.SunPosition(t).elon;
  if (id === "Moon") return A.EclipticGeoMoon(t).lon;
  if (id === "Rahu" || id === "Ketu") {
    const T = julianCenturies(date);
    const node = norm(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
    return id === "Rahu" ? node : norm(node + 180);
  }
  if (id === "Lilith") {
    // Mean Black Moon Lilith = mean lunar apogee (Meeus, mean perigee + 180°).
    const T = julianCenturies(date);
    return norm(83.3532465 + 4069.0137287 * T - 0.01032 * T * T - (T * T * T) / 80053 + 180);
  }
  if (id === "Chiron" || id === "Juno" || id === "Vesta") return asteroidLon(id, date);
  return A.Ecliptic(A.GeoVector(id as A.Body, t, true)).elon;
};

export const bodyLon = (id: BodyId, date: Date, mode: ZodiacMode) => norm(tropicalLon(id, date) - ayanamsa(date, mode));

/** Tropical ascendant for a moment and place, then shifted into the chosen zodiac. */
export const ascendant = (date: Date, lat: number, lon: number, mode: ZodiacMode) => {
  const t = A.MakeTime(date);
  const T = julianCenturies(date);
  const ramc = rad(norm(A.SiderealTime(t) * 15 + lon));
  const eps = rad(23.4392911 - 0.0130042 * T);
  const phi = rad(Math.max(-66, Math.min(66, lat)));
  const asc = deg(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))));
  return norm(asc - ayanamsa(date, mode));
};

export type BodyReading = {
  id: BodyId;
  glyph: string;
  lon: number;
  sign: number;
  degInSign: number;
  house: number; // 1-12, whole-sign
  retro: boolean;
  path: { lon: number; offset: number; retro: boolean }[]; // offset in days from the moment
};

export type SkySnapshot = {
  date: Date;
  asc: number;
  ascSign: number;
  bodies: BodyReading[];
  moonNakshatra: string;
};

/**
 * Compute a full chart snapshot. Whole-sign houses: house 1 = the sign holding the ascendant.
 * `range` (optional) draws every body's path across a fixed span (e.g. the next 6 months) instead of its
 * own short window; the Moon always keeps its short window so its track stays readable.
 */
export const computeSky = (
  date: Date,
  lat: number,
  lon: number,
  mode: ZodiacMode,
  withPaths = true,
  range?: { start: Date; end: Date },
): SkySnapshot => {
  const asc = ascendant(date, lat, lon, mode);
  const ascSign = Math.floor(asc / 30);
  const ids: BodyId[] = BODIES.map((b) => b.id);
  if (mode === "vedic") ids.splice(ids.indexOf("Rahu") + 1, 0, "Ketu");
  const bodies = ids.map((id) => {
      const meta = BODIES.find((b) => b.id === id) ?? { glyph: "☋", window: 90 };
      const l = bodyLon(id, date, mode);
      const soon = bodyLon(id, new Date(date.getTime() + 3600_000 * 6), mode);
      const delta = ((soon - l + 540) % 360) - 180;
      const retro = id === "Rahu" || id === "Ketu" ? true : delta < 0;
      const sign = Math.floor(l / 30);
      const path: BodyReading["path"] = [];
      if (withPaths) {
        const useRange = range && id !== "Moon";
        const fromMs = useRange ? range!.start.getTime() : date.getTime() - meta.window * 86400000;
        const toMs = useRange ? range!.end.getTime() : date.getTime() + meta.window * 86400000;
        const steps = useRange ? 92 : 36;
        let prev = bodyLon(id, new Date(fromMs), mode);
        for (let i = 0; i <= steps; i++) {
          const ms = fromMs + ((toMs - fromMs) * i) / steps;
          const off = (ms - date.getTime()) / 86400000;
          const v = bodyLon(id, new Date(ms), mode);
          const d = ((v - prev + 540) % 360) - 180;
          path.push({ lon: v, offset: off, retro: i > 0 && d < 0 });
          prev = v;
        }
      }
      return {
        id,
        glyph: id === "Ketu" ? "☋" : meta.glyph,
        lon: l,
        sign,
        degInSign: l - sign * 30,
        house: ((sign - ascSign + 12) % 12) + 1,
        retro,
        path,
      };
    });
  const moon = bodies.find((b) => b.id === "Moon")!;
  return { date, asc, ascSign, bodies, moonNakshatra: NAKSHATRAS[Math.floor(moon.lon / (360 / 27)) % 27] };
};

/** Local wall-clock time in an IANA timezone → UTC Date. */
export const zonedToUtc = (y: number, mo: number, d: number, h: number, mi: number, timeZone: string) => {
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const offsetAt = (ms: number) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    }).formatToParts(new Date(ms));
    const g = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    return Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute")) - ms;
  };
  let utc = guess - offsetAt(guess);
  utc = guess - offsetAt(utc);
  return new Date(utc);
};

export const formatDeg = (d: number) => {
  const whole = Math.floor(d);
  const min = Math.floor((d - whole) * 60);
  return `${whole}°${String(min).padStart(2, "0")}′`;
};
