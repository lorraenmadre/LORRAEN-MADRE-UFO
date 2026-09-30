import React, { useEffect, useRef, useState } from 'react';
import { VOICE_MEDIA } from '../voiceMedia';

type OrbState = 'ready' | 'listening' | 'thinking' | 'saved';
// How fast the orb swirls in each state (same feel as the voice app).
const RATE: Record<OrbState, number> = { ready: 0.55, listening: 1, thinking: 1.6, saved: 0.8 };

/** The living orb: the founder's orb video, with colored light behind it while you talk. */
export default function VoiceOrb({ state = 'ready', small = false, allowVideo = false }: { state?: OrbState; small?: boolean; allowVideo?: boolean }) {
  const stream = useRef<MediaStream | null>(null);
  const mounted = useRef(true);
  const video = useRef<HTMLVideoElement | null>(null);
  const orb = useRef<HTMLVideoElement | null>(null);
  const glow = useRef<HTMLVideoElement | null>(null);
  const [camera, setCamera] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; stream.current?.getTracks().forEach((t) => t.stop()); }; }, []);
  useEffect(() => { if (video.current) video.current.srcObject = stream.current; }, [camera]);
  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    for (const v of [orb.current, glow.current]) {
      if (!v) continue;
      if (reduce) { try { v.pause?.(); } catch { /* jsdom */ } continue; }
      try { v.playbackRate = RATE[state]; } catch { /* some browsers limit rates */ }
      try { const p = v.play?.(); if (p && typeof p.catch === 'function') p.catch(() => {}); } catch { /* autoplay blocked */ }
    }
  }, [state, camera]);

  const toggleCamera = async () => {
    if (camera) { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; setCamera(false); return; }
    if (!navigator.mediaDevices?.getUserMedia) { setError('Camera preview is unavailable in this browser. Your voice and text still work.'); return; }
    setStarting(true); setError('');
    try {
      const next = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (!mounted.current) { next.getTracks().forEach((t) => t.stop()); return; }
      stream.current = next; setCamera(true);
    } catch { if (mounted.current) setError('Camera preview could not open. You can continue with voice or text.'); }
    finally { if (mounted.current) setStarting(false); }
  };

  return (
    <div className={`lm-orb-wrap ${small ? 'is-small' : ''}`}>
      <div className={`lm-voice-orb is-${state} ${camera ? 'is-camera' : 'is-video'}`} aria-hidden="true">
        {camera ? <video ref={video} autoPlay muted playsInline /> : (
          <>
            <span className="lm-orb-glow"><video ref={glow} src={VOICE_MEDIA.texture} muted loop playsInline autoPlay preload="auto" /></span>
            <span className="lm-orb-core"><video ref={orb} src={VOICE_MEDIA.orb} poster={VOICE_MEDIA.orbPoster} muted loop playsInline autoPlay preload="auto" /></span>
          </>
        )}
      </div>
      <span className="lm-orb-caption">{state === 'listening' ? 'Listening to your story' : state === 'thinking' ? 'Finding the next piece' : state === 'saved' ? 'Wish logged' : 'LORRAEN MADRE'}</span>
      {allowVideo && <><button type="button" className="lm-camera-toggle" disabled={starting} onClick={toggleCamera}>{starting ? 'Opening camera…' : camera ? 'Turn video off' : 'Show my video'}</button><small>Local video · no recording or upload</small>{error && <p role="status">{error}</p>}</>}
    </div>
  );
}
