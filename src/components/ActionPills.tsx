import React from 'react';

// Sitewide CTA rule (Rae, 2026-09-23). Inside the app:
// Design -> book time with Rae (Calendly), Work -> the network form, Play -> the Library.
// Look matches the voice app + lorraenmadre.com: white / blue / red pills, equal width, soft shadow, no outline. Design text black; Work and Play text white.
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

const base = 'lm-pill lm-brand-cta cursor-pointer select-none';

function Pill({ href, onClick, label, tone }: { href?: string; onClick?: () => void; label: string; tone: 'white' | 'blue' | 'red' }) {
  const cls = `${base} lm-pill-${tone}`;
  return href && !onClick ? (
    <a href={href} className={cls}>{label}</a>
  ) : (
    <button onClick={onClick} type="button" className={cls}>{label}</button>
  );
}

export default function ActionPills({
  onDesign,
  onWork,
  onPlay,
  designLabel = 'Design',
  workLabel = 'Work',
  playLabel = 'Play',
  designHref = APP_DESIGN_URL,
  workHref = WORK_URL,
  playHref = PLAY_URL,
  className = '',
  stacked = false,
}: ActionPillsProps) {
  return (
    <div className={`flex ${stacked ? 'flex-col items-center gap-3' : 'flex-wrap items-center justify-center gap-2'} ${className}`}>
      <Pill href={designHref} onClick={onDesign} label={designLabel} tone="white" />
      <Pill href={workHref} onClick={onWork} label={workLabel} tone="blue" />
      <Pill href={playHref} onClick={onPlay} label={playLabel} tone="red" />
    </div>
  );
}
