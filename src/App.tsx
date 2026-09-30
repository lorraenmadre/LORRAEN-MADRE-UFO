import React, { useState, useEffect } from 'react';
import { Entity } from './types';
import { INITIAL_ENTITIES, CLEAN_ENTITIES } from './constants';
import SpaceBoard from './components/SpaceBoard';
import TimeView from './components/TimeView';
import ClaimSections from './components/ClaimSections';
import OperatingMap from './components/OperatingMap';
import EntitySnapshot from './components/EntitySnapshot';
import LorraineMadreChat from './components/LorraineMadreChat';
import WelcomeJourney from './components/WelcomeJourney';
import GateOnboarding from './components/GateOnboarding';
import EngineJourney from './components/EngineJourney';
import EngineGrid from './components/EngineGrid';
import VoiceOrb from './components/VoiceOrb';
import StoryThread from './components/StoryThread';
import {useJourney,JOURNEY_DAYS,addContribution} from './journey';
import type { StoryDraft } from './components/LorraineMadreChat';
import ActionPills from './components/ActionPills';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, LayoutGrid, Info, LogOut, ChevronRight, Check } from 'lucide-react';

type FirebaseUser = { uid: string };

export default function App() {
  const [drafts,setDrafts]=useState<StoryDraft[]>([]);
  const [gateDrafts,setGateDrafts]=useState<StoryDraft[]>([]);
  const [entities, setEntities] = useState<Entity[]>(INITIAL_ENTITIES);
  const [cleanEntities, setCleanEntities] = useState<Entity[]>(CLEAN_ENTITIES);
  const [mapLayout, setMapLayout] = useState<'space' | 'time' | 'story'>('space');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'framework' | 'business'>('business');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const {data:journey,update:updateJourney,storageError}=useJourney(user?.uid||'preview');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authWarning, setAuthWarning] = useState<string | null>(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const authFallback = window.setTimeout(() => {
      if (isMounted) {
        setIsAuthReady(true);
        setAuthWarning('Authentication is still being configured. Public preview is available.');
      }
    }, 2500);

    async function initializeAuth() {
      try {
        const [{ auth }, { onAuthStateChanged }] = await Promise.all([
          import('./firebase'),
          import('firebase/auth'),
        ]);

        unsubscribe = onAuthStateChanged(auth, async (u) => {
          if (!isMounted) return;

          setUser(u as FirebaseUser | null);
          setIsAuthReady(true);
          window.clearTimeout(authFallback);

          if (u) {
            try {
              await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: u.uid }),
              });
              checkGoogleConnection();
            } catch (error) {
              console.error('Failed to sync backend session', error);
            }
          }
        });
      } catch (error) {
        console.error('Auth failed to initialize', error);
        if (isMounted) {
          setAuthWarning('Authentication is not ready yet. Use public preview while setup is completed.');
          setIsAuthReady(true);
          window.clearTimeout(authFallback);
        }
      }
    }

    initializeAuth();

    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        checkGoogleConnection();
      }
    };

    window.addEventListener('message', handleOAuthMessage);

    return () => {
      isMounted = false;
      window.clearTimeout(authFallback);
      unsubscribe?.();
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, []);

  const checkGoogleConnection = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setGoogleConnected(Boolean(data.googleConnected));
    } catch (error) {
      console.error('Failed to check connection status', error);
    }
  };

  const handleLogin = async () => {
    try {
      const [{ auth }, { signInWithPopup, GoogleAuthProvider }] = await Promise.all([
        import('./firebase'),
        import('firebase/auth'),
      ]);

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
      setAuthWarning('Sign-in is not fully configured yet. Public preview remains available.');
    }
  };

  const handleConnectGoogle = async () => {
    setIsConnecting(true);
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      if (!url) throw new Error('Missing Google OAuth URL');
      window.open(url, 'google_auth', 'width=600,height=700');
    } catch (error) {
      console.error('Failed to start Google connection', error);
      setAuthWarning('Google Drive connection is not ready yet. Continue using public preview.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const [{ auth }, { signOut }] = await Promise.all([
        import('./firebase'),
        import('firebase/auth'),
      ]);
      await signOut(auth);
    } catch (error) {
      console.error('Sign out failed', error);
    } finally {
      setIsPreviewMode(false);
      setUser(null);
    }
  };

  useEffect(() => {
    (window as any).dispatchAddSatellite = (newSat: Entity) => {
      setEntities(prev => [...prev, newSat]);
    };
    (window as any).dispatchAddOffering = (newOff: Entity) => {
      setEntities(prev => [...prev, newOff]);
    };
    (window as any).dispatchUpdateEntity = (updated: Entity) => {
      setEntities(prev => prev.map(e => e.id === updated.id ? updated : e));
    };
  }, []);

  if (!isAuthReady) return <div className="min-h-screen bg-white flex items-center justify-center"><span className="lm-terminal">&gt; waking lorraen</span></div>;

  if (!user && !isPreviewMode) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-belleza uppercase tracking-[0.06em]">LORRAEN MADRE</h1>
          <p className="text-sm uppercase tracking-[0.24em] font-figtree font-semibold">Universal Family Office</p>
          {authWarning && (
            <p className="max-w-lg mx-auto text-xs text-black leading-relaxed">{authWarning}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={handleLogin}
            className="lm-pill lm-pill-white px-8"
          >
            Continue with Google
          </button>
          <button 
            onClick={() => setIsPreviewMode(true)}
            className="min-h-[44px] px-4 font-figtree font-semibold text-sm underline underline-offset-4"
          >
            Look around first
          </button>
        </div>
      </div>
    );
  }

  const displayEntities = viewMode === 'framework' ? cleanEntities : entities;
  const selectedEntity = displayEntities.find(e => e.id === selectedEntityId);
  const handleUpdateEntity = (updatedEntity: Entity) => {
    const update = viewMode === 'framework' ? setCleanEntities : setEntities;
    update(prev => prev.map(e => e.id === updatedEntity.id ? updatedEntity : e));
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <AnimatePresence mode="wait">
        {!selectedEntityId ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-20"
          >
            {/* Nav Header */}
            <header className="border-b border-black/15 py-4 px-6 sticky top-0 bg-white z-50">
              <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                  <a href="https://lorraenmadre.com/" className="text-2xl font-belleza uppercase tracking-[0.06em] no-underline text-black">LORRAEN MADRE</a>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <ActionPills className="!justify-end" />
                  <div className="flex items-center border border-black rounded-full p-1">
                  <button 
                    onClick={() => setViewMode('framework')}
                    aria-pressed={viewMode === 'framework'} className={`min-h-[36px] px-4 rounded-full font-figtree font-semibold text-sm transition-all ${viewMode === 'framework' ? 'bg-black text-white' : 'text-black'}`}
                  >
                    Framework
                  </button>
                  <button 
                    onClick={() => setViewMode('business')}
                    aria-pressed={viewMode === 'business'} className={`min-h-[36px] px-4 rounded-full font-figtree font-semibold text-sm transition-all ${viewMode === 'business' ? 'bg-black text-white' : 'text-black'}`}
                  >
                    Founder’s Example
                  </button>
                  <div className="w-px h-4 bg-black/20 mx-2 self-center" />
                  <button 
                    onClick={handleLogout}
                    title={isPreviewMode ? 'Exit Preview' : 'Sign Out'}
                    aria-label={isPreviewMode ? 'Exit preview' : 'Sign out'}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full hover:bg-black hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Google Drive Connection Bar */}
            {isPreviewMode && (
              <div className="bg-black py-3 px-6 text-center font-mono text-sm text-[#00bf63]">
                &gt; preview: you're looking at Lorraen's UFO. Sign in to make it yours.
              </div>
            )}

            {!isPreviewMode && !googleConnected && (
              <div className="bg-black text-white py-3 px-6 text-center text-[10px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-4">
                <span>Unlock the Vault: Connect to Google Drive to generate real documents.</span>
                <button 
                  onClick={handleConnectGoogle}
                  disabled={isConnecting}
                  className="bg-white text-black px-4 py-1.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isConnecting ? 'Opening Portal...' : 'Connect Google'}
                </button>
              </div>
            )}
            {!isPreviewMode && googleConnected && (
               <div className="bg-black text-[#00bf63] font-mono text-sm py-3 px-6 text-center flex items-center justify-center gap-2">
                 <Check className="w-3 h-3" />
                 <span>&gt; vault synced with google drive</span>
               </div>
            )}

            {/* Lorraine Chat Top */}
            <GateOnboarding key={user?.uid||'preview'} scope={user?.uid||'preview'} onHistory={setGateDrafts}/>
            <EngineGrid scope={user?.uid||'preview'} journey={journey} onSelect={component=>{updateJourney({...journey,component});}} onOpenHouse={id=>{setSelectedEntityId(id);window.scrollTo({top:0});}}/>



            {/* Title Section */}
            <div id="operating-board" className="max-w-7xl mx-auto text-left py-10 px-6">
              <p className="text-[10px] uppercase tracking-[0.5em] text-black mb-6">a WishWell system</p>
              <h2 className="lm-section-title">
                Design happily ever after <span className="italic text-black">with</span>
              </h2>
              <h3 className="lm-section-title">
                TIME . <span className="lowercase">space</span> + Story
              </h3>
              <div className="flex items-center gap-4 mt-12">
                <div className="h-px w-8 bg-gray-200" />
                <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-black">Your operating board</p>
              </div>
              <p>Your operating board: project management, climate consciousness and business analysis through Time, Space and Story.</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-black rounded-full p-1" role="group" aria-label="View">
                {(['time', 'space', 'story'] as const).map(layout => (
                  <button key={layout} type="button" aria-pressed={mapLayout === layout} onClick={() => setMapLayout(layout)} className={`min-h-[40px] px-5 rounded-full font-figtree font-semibold text-sm uppercase tracking-[0.24em] ${mapLayout === layout ? 'bg-black text-white' : 'text-black'}`}>
                    {layout === 'time' ? 'Time' : layout === 'space' ? 'Space' : 'Story'}
                  </button>
                ))}
              </div>
              <p className="text-sm">{viewMode === 'framework' ? 'Your framework — type a name into any black box to claim it.' : 'The founder’s example — explore each space.'} Board edits last for this session; onboarding progress is saved on this browser.</p>
            </div>
            <div className="max-w-7xl mx-auto px-6 pb-16">
              {mapLayout === 'space'
                ? <SpaceBoard entities={displayEntities} onSelect={setSelectedEntityId} onUpdate={handleUpdateEntity} />
                : mapLayout === 'time' ? <TimeView entities={displayEntities} onSelect={setSelectedEntityId} founder={viewMode === 'business'} /> : <section aria-label="Story board"><h2 className="lm-section-title">Story · Neverland</h2><p className="lm-section-description">Every wish you share is one entry in your story, stacked in order like a conversation.</p><StoryThread scope={user?.uid||'preview'} entries={[
                  ...journey.contributions.map(c=>({id:c.id,at:c.createdAt,who:'Hero' as const,label:`Day ${c.day+1} · ${c.kind}`,text:[c.wish,c.feeling?`How I feel: ${c.feeling}`:''].filter(Boolean).join('\n\n')})),
                  ...[...gateDrafts,...drafts].map(d=>({id:d.id,at:d.at,who:'Hero' as const,label:d.context.split(' · ')[0]||d.kind,text:d.text})),
                ]}/></section>}
            </div>
            <div className="max-w-7xl mx-auto px-6 pb-8">
              <ClaimSections onAddSatellite={sat=>{const update=viewMode==='framework'?setCleanEntities:setEntities;update(prev=>[...prev,sat]);}} entities={displayEntities} onSelect={setSelectedEntityId} onUpdate={handleUpdateEntity} />
            </div>
            {viewMode === 'business' && <details className="max-w-7xl mx-auto px-6"><summary>Explore the full operating map</summary><OperatingMap /></details>}

            <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100"><details><summary>Privacy &amp; use of this preview</summary><p>Wishes and onboarding progress are stored in this browser. Clearing browser storage removes them. Board edits currently last for this session. Sending a message requests an AI response; speech recognition may use your browser’s speech service. Optional video stays local and is not recorded or uploaded.</p><p>This is a planning and coordination tool. AI responses and drafted work need your review. No service enrollment, professional advice, payment or external action is completed by logging a wish.</p></details><p className="lm-caption mt-4">© 2026 LORRAEN MADRE · WISH WELL</p></footer>

          </motion.div>
        ) : (
          <motion.div
            key="snapshot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <EntitySnapshot 
              entity={selectedEntity!}
              onCapture={d=>setDrafts(prev=>[...prev,d])}
              clean={viewMode === 'framework'}
              onBack={() => setSelectedEntityId(null)}
              onUpdate={handleUpdateEntity}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
