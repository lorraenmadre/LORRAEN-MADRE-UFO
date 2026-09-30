import React, { useEffect, useRef, useState } from 'react';
import VoiceOrb from './VoiceOrb';
import { askLorraine } from '../geminiService';
import { VOICE_MEDIA } from '../voiceMedia';

/** One line in the Story thread: something the Hero said, or Lorraen's reply. */
export type ThreadEntry = { id: string; at?: string; who: 'Hero' | 'Lorraen'; label: string; text: string };

const when = (at?: string) => {
  if (!at) return '';
  const d = new Date(at);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

function readSaved(key: string): ThreadEntry[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(v) ? v.filter((e) => e && typeof e.id === 'string' && typeof e.text === 'string' && (e.who === 'Hero' || e.who === 'Lorraen')) : [];
  } catch {
    return [];
  }
}

/** Entries dissolve as they scroll up under the orb, like the voice app. */
function useThreadFade(stack: React.RefObject<HTMLDivElement | null>, dock: React.RefObject<HTMLDivElement | null>, count: number) {
  useEffect(() => {
    const el = stack.current;
    if (!el || typeof window === 'undefined') return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const line = Math.max(dock.current?.getBoundingClientRect().bottom ?? 0, window.innerHeight * 0.18);
      const zone = Math.max(120, window.innerHeight * 0.28);
      for (const child of Array.from(el.children) as HTMLElement[]) {
        if (!child.classList.contains('lm-thread-entry')) continue;
        const r = child.getBoundingClientRect();
        const t = Math.min(1, Math.max(0, (r.top + r.height * 0.5 - line) / zone));
        child.style.opacity = t >= 1 ? '' : String(t);
        child.style.transform = t >= 1 ? '' : `translateY(${(1 - t) * -10}px) scale(${0.96 + t * 0.04})`;
        child.style.filter = t >= 1 ? '' : `blur(${(1 - t) * 3}px)`;
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [stack, dock, count]);
}

function StorySky() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    try {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) v.pause?.();
      else { const p = v.play?.(); if (p && typeof p.catch === 'function') p.catch(() => {}); }
    } catch { /* jsdom */ }
  }, []);
  return <div className="lm-thread-sky" aria-hidden="true"><video ref={ref} src={VOICE_MEDIA.sky} poster={VOICE_MEDIA.skyPoster} muted loop playsInline autoPlay preload="auto" /><span /></div>;
}

/**
 * STORY — every wish is one entry, stacked oldest to newest like an AI chat thread.
 * The orb stays glowing at the top and answers to voice (listening) and replies (thinking).
 */
export default function StoryThread({ scope, entries }: { scope: string; entries: ThreadEntry[] }) {
  const key = `wishwell:thread:v1:${scope}`;
  const [saved, setSaved] = useState<ThreadEntry[]>(() => readSaved(key));
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const rec = useRef<any>(null);
  const end = useRef<HTMLDivElement>(null);
  const grew = useRef(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => rec.current?.abort(), []);
  useEffect(() => { setSaved(readSaved(key)); }, [key]);

  const all = [...entries, ...saved].sort((a, b) => (a.at || '').localeCompare(b.at || ''));
  useEffect(() => { if (grew.current) end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [all.length]);

  useThreadFade(stackRef, dockRef, all.length + (busy ? 1 : 0));

  const add = (e: ThreadEntry) => {
    grew.current = true;
    setSaved((prev) => {
      const next = [...prev, e];
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { setNotice('This browser could not save the thread; keep this page open.'); }
      return next;
    });
  };

  const talk = () => {
    if (listening) { rec.current?.stop(); return; }
    const C = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!C) { setNotice('Voice is not available in this browser. Type your wish instead.'); return; }
    const r = new C(); rec.current = r; r.lang = navigator.language; r.interimResults = false; r.continuous = false;
    r.onresult = (ev: any) => setText((t) => [t, ev.results[0][0].transcript].filter(Boolean).join(' '));
    r.onend = () => setListening(false);
    r.onerror = () => { setListening(false); setNotice('The microphone could not listen. Check permission or type instead.'); };
    try { r.start(); setListening(true); setNotice(''); } catch { setNotice('The microphone could not start. Please type instead.'); }
  };

  const send = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const t = text.trim();
    if (!t || busy) return;
    rec.current?.stop();
    add({ id: crypto.randomUUID(), at: new Date().toISOString(), who: 'Hero', label: 'Wish', text: t });
    setText(''); setBusy(true); setNotice('');
    try {
      const history = all.slice(-8).map((e) => `${e.who}: ${e.text}`).join('\n');
      const reply = await askLorraine(t, `Story thread. Listen first, then help find the work inside the wish (Goal, Project, Deal, Task, Document).\n${history}`);
      add({ id: crypto.randomUUID(), at: new Date().toISOString(), who: 'Lorraen', label: 'Lorraen', text: reply || 'Hero, what would you like to make clearer first?' });
    } catch {
      setNotice('Your wish is saved. A reply is not available right now.');
    } finally {
      setBusy(false);
    }
  };

  const state = listening ? 'listening' : busy ? 'thinking' : 'ready';
  return (
    <section className="lm-story-thread" aria-label="Story thread">
      <StorySky />
      <div className="lm-thread-orb" ref={dockRef}>
        <VoiceOrb state={state} small />
      </div>
      <div className="lm-thread-stack" aria-live="polite" ref={stackRef}>
        {all.length === 0 ? (
          <p className="lm-thread-empty">Your thread starts with your first wish. Talk or type below, or answer a question on the map above.</p>
        ) : all.map((e) => (
          <article key={e.id} className={`lm-thread-entry ${e.who === 'Lorraen' ? 'is-ai' : 'is-hero'}`}>
            <small>{e.label}{when(e.at) ? ` · ${when(e.at)}` : ''}</small>
            <p>{e.text}</p>
          </article>
        ))}
        {busy && <article className="lm-thread-entry is-ai is-typing"><small>Lorraen</small><p>…</p></article>}
        <div ref={end} />
      </div>
      <form className="lm-thread-composer" onSubmit={send}>
        <label htmlFor="thread-input" className="sr-only">Your wish</label>
        <textarea id="thread-input" rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="I wish…" />
        <div className="lm-thread-actions">
          <button type="button" className="lm-pill lm-pill-white" aria-pressed={listening} onClick={talk}>{listening ? 'Stop' : 'Talk'}</button>
          <button className="lm-pill lm-pill-blue" disabled={busy || !text.trim()}>{busy ? 'Thinking…' : 'Send'}</button>
        </div>
      </form>
      {notice && <p role="status" className="lm-caption">{notice}</p>}
      <p className="lm-caption lm-thread-foot">Saved on this browser. <a className="underline underline-offset-4" href="https://junglebook.lorraenmadre.com/" target="_blank" rel="noopener noreferrer">Jungle Book · Story Calendar ↗</a></p>
    </section>
  );
}
