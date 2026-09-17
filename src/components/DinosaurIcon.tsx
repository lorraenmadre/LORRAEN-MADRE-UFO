import React from 'react';

export interface DinosaurData {
  zodiac: string;
  name: string;
  species: string;
  code: string;
  symbol: string;
  bg: string;
  color: string;
}

export const ZODIAC_DINOSAURS: Record<string, DinosaurData> = {
  aries: {
    zodiac: 'Aries',
    name: 'Lisi',
    species: 'Velociraptor',
    code: 'ARI',
    symbol: 'ARI',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  },
  taurus: {
    zodiac: 'Taurus',
    name: 'On Our Guard',
    species: 'Ankylosaurus',
    code: 'TAU',
    symbol: 'TAU',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  },
  gemini: {
    zodiac: 'Gemini',
    name: 'Sanctuary Self',
    species: 'Pterodactyl',
    code: 'GEM',
    symbol: 'GEM',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  },
  cancer: {
    zodiac: 'Cancer',
    name: 'Miss Honey',
    species: 'Brachiosaurus',
    code: 'CAN',
    symbol: 'CAN',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  },
  leo: {
    zodiac: 'Leo',
    name: 'LORRAEN MADRE',
    species: 'T-Rex',
    code: 'LEO',
    symbol: 'LEO',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  },
  virgo: {
    zodiac: 'Virgo',
    name: 'Paradise Quick',
    species: 'Triceratops',
    code: 'VIR',
    symbol: 'VIR',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  },
  libra: {
    zodiac: 'Libra',
    name: 'Rael / Rael E Mar',
    species: 'Parasaurolophus',
    code: 'LIB',
    symbol: 'LIB',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  },
  scorpio: {
    zodiac: 'Scorpio',
    name: 'Madre Madre',
    species: 'Spinosaurus',
    code: 'SCO',
    symbol: 'SCO',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  },
  sagittarius: {
    zodiac: 'Sagittarius',
    name: 'Killer Jean',
    species: 'Dilophosaurus',
    code: 'SAG',
    symbol: 'SAG',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  },
  capricorn: {
    zodiac: 'Capricorn',
    name: 'Y-B-E-88 cents',
    species: 'Pachycephalosaurus',
    code: 'CAP',
    symbol: 'CAP',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  },
  aquarius: {
    zodiac: 'Aquarius',
    name: 'Light Scouts',
    species: 'Plesiosaur',
    code: 'AQU',
    symbol: 'AQU',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  },
  pisces: {
    zodiac: 'Pisces',
    name: 'Saint Madre Ray',
    species: 'Mosasaur',
    code: 'PIS',
    symbol: 'PIS',
    bg: 'bg-gray-50 text-gray-500 border-gray-200',
    color: '#6B7280'
  }
};

export function ZodiacGlyph({ sign, className = "w-3.5 h-3.5 text-gray-500" }: { sign: string; className?: string }) {
  const key = sign.toLowerCase().trim();
  switch (key) {
    case 'aries':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 11C4 8 6 5.5 9 5.5C11 5.5 12 7 12 9V20 M20 11C20 8 18 5.5 15 5.5C13 5.5 12 7 12 9" />
        </svg>
      );
    case 'taurus':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="14" r="5.5" />
          <path d="M5.5 4.5C6.5 8 9 9.5 12 9.5C15 9.5 17.5 8 18.5 4.5" />
        </svg>
      );
    case 'gemini':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4.5 4.5C8.5 6 15.5 6 19.5 4.5 M4.5 19.5C8.5 18 15.5 18 19.5 19.5 M8.5 5.5V18.5 M15.5 5.5V18.5" />
        </svg>
      );
    case 'cancer':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="7.5" cy="9" r="3" />
          <path d="M7.5 6C11.5 6 18 8 18 13.5" />
          <circle cx="16.5" cy="15" r="3" />
          <path d="M16.5 18C12.5 18 6 16 6 10.5" />
        </svg>
      );
    case 'leo':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="7.5" cy="15.5" r="3" />
          <path d="M9.5 13.5C10.5 8.5 14 5.5 17 7.5C19.5 9 19 13.5 16 16C14.5 17.5 15.5 20 18.5 20" />
        </svg>
      );
    case 'virgo':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 17V8.5C4 6.8 5.2 5.5 6.8 5.5C8.4 5.5 9.5 6.8 9.5 8.5V17 M9.5 8.5C9.5 6.8 10.7 5.5 12.2 5.5C13.8 5.5 15 6.8 15 8.5V17 M15 11C16.5 10 18.5 10.5 19.5 12C20.5 13.5 20 16 18.5 18C17 20 15 21 13 21 M17 15L21 21" />
        </svg>
      );
    case 'libra':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3.5 19.5H20.5 M3.5 15.5H7C8 12.5 9.5 11 12 11C14.5 11 16 12.5 17 15.5H20.5" />
        </svg>
      );
    case 'scorpio':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 17V8.5C4 6.8 5.2 5.5 6.8 5.5C8.4 5.5 9.5 6.8 9.5 8.5V17 M9.5 8.5C9.5 6.8 10.7 5.5 12.2 5.5C13.8 5.5 15 6.8 15 8.5V17.5C15 19 16.5 20 18.5 20H21 M18.5 17.5L21 20L18.5 22.5" />
        </svg>
      );
    case 'sagittarius':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5.5 18.5L19 5 M13 5H19V11 M8 11L13 16" />
        </svg>
      );
    case 'capricorn':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 6.5L7.5 15.5L11 5.5C12.5 5.5 14 6.5 14.5 8.5V14.5C14.5 17.5 17 19.5 19 18C20.5 16.8 20 14.5 17.5 14.5C15 14.5 14.5 17 15.5 19.5" />
        </svg>
      );
    case 'aquarius':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3.5 9L6.5 6.5L9.5 9L12.5 6.5L15.5 9L18.5 6.5L20.5 8.5 M3.5 16L6.5 13.5L9.5 16L12.5 13.5L15.5 16L18.5 13.5L20.5 15.5" />
        </svg>
      );
    case 'pisces':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 4.5C8 8.5 8 15.5 5 19.5 M19 4.5C16 8.5 16 15.5 19 19.5 M2.5 12H21.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function getDinosaurForZodiac(zodiacOrSign?: string): DinosaurData | null {
  if (!zodiacOrSign) return null;
  const key = zodiacOrSign.toLowerCase().trim();
  return ZODIAC_DINOSAURS[key] || null;
}

// Map House numbers to primary archetypal dinosaur companion
export function getDinosaurForHouse(houseNumber: number): DinosaurData {
  const houseDinoMap: Record<number, string> = {
    1: 'leo',
    2: 'cancer',
    3: 'gemini',
    4: 'taurus',
    5: 'aries',
    6: 'virgo',
    7: 'libra',
    8: 'scorpio',
    9: 'sagittarius',
    10: 'capricorn',
    11: 'aquarius',
    12: 'pisces',
  };
  const key = houseDinoMap[houseNumber] || 'leo';
  return ZODIAC_DINOSAURS[key];
}

interface DinosaurIconProps {
  zodiac?: string;
  house?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function DinosaurIcon({ zodiac, house, size = 'sm', showLabel = false }: DinosaurIconProps) {
  const dino = (zodiac ? getDinosaurForZodiac(zodiac) : null) || (house ? getDinosaurForHouse(house) : null) || ZODIAC_DINOSAURS.leo;

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const glyphSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="inline-flex items-center gap-1.5" title={`${dino.zodiac} (${dino.species}) — ${dino.name}`}>
      <div className={`rounded-full flex items-center justify-center border font-bold ${dino.bg} ${iconSizes[size]}`}>
        <ZodiacGlyph sign={dino.zodiac} className={`${glyphSizes[size]} text-gray-500`} />
      </div>
      {showLabel && (
        <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-700">
          {dino.species} <span className="text-gray-400">({dino.zodiac})</span>
        </span>
      )}
    </div>
  );
}
