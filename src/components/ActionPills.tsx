import React from 'react';

// Sitewide CTA rule (Rae, 2026-09-23). Inside the app:
// Design -> book time with Rae (Calendly), Work -> the network form, Play -> the Library.
export const APP_DESIGN_URL = 'https://calendly.com/lorraen-madre';
export const WORK_URL = 'https://www.lorraenmadre.com/connect';
export const PLAY_URL = 'https://www.lorraenmadre.com/library';

interface ActionPillsProps {
  onDesign?: () => void;
  onWork?: () => void;
  onPlay?: () => void;
  designLabel?: string;
  workLabel?: string;
  playLabel?: string;
  designHref?: string;
  workHref?: string;
  playHref?: string;
  className?: string;
  stacked?: boolean;
}

export default function ActionPills({
  onDesign,
  onWork,
  onPlay,
  designLabel = 'DESIGN',
  workLabel = 'WORK',
  playLabel = 'PLAY',
  designHref = APP_DESIGN_URL,
  workHref = WORK_URL,
  playHref = PLAY_URL,
  className = '',
  stacked = false,
}: ActionPillsProps) {
  const designClass =
    'inline-flex items-center justify-center rounded-full border-2 border-black bg-white text-black font-extrabold text-base md:text-lg tracking-wider px-10 py-3 shadow-xs hover:bg-black hover:text-white transition-all cursor-pointer select-none';

  const workClass =
    'inline-flex items-center justify-center rounded-full bg-[#0047AB] text-white font-extrabold text-base md:text-lg tracking-wider px-10 py-3 shadow-md hover:bg-[#003888] transition-all cursor-pointer select-none';

  const playClass =
    'inline-flex items-center justify-center rounded-full bg-[#E51818] text-white font-extrabold text-base md:text-lg tracking-wider px-10 py-3 shadow-md hover:bg-[#c91212] transition-all cursor-pointer select-none';

  return (
    <div className={`flex ${stacked ? 'flex-col items-center gap-4' : 'flex-wrap items-center justify-center gap-4 md:gap-6'} ${className}`}>
      {/* DESIGN */}
      {designHref ? (
        <a href={designHref} className={designClass}>
          <span className="underline underline-offset-4 decoration-2">{designLabel}</span>
        </a>
      ) : (
        <button onClick={onDesign} type="button" className={designClass}>
          <span className="underline underline-offset-4 decoration-2">{designLabel}</span>
        </button>
      )}

      {/* WORK */}
      {workHref ? (
        <a href={workHref} className={workClass}>
          <span className="underline underline-offset-4 decoration-2">{workLabel}</span>
        </a>
      ) : (
        <button onClick={onWork} type="button" className={workClass}>
          <span className="underline underline-offset-4 decoration-2">{workLabel}</span>
        </button>
      )}

      {/* PLAY */}
      {playHref ? (
        <a href={playHref} className={playClass}>
          <span className="underline underline-offset-4 decoration-2">{playLabel}</span>
        </a>
      ) : (
        <button onClick={onPlay} type="button" className={playClass}>
          <span className="underline underline-offset-4 decoration-2">{playLabel}</span>
        </button>
      )}
    </div>
  );
}
