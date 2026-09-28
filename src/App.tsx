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
import EngineJourney from './components/EngineJourney';
import EngineGrid from './components/EngineGrid';
import VoiceOrb from './components/VoiceOrb';
import {useJourney,JOURNEY_DAYS,addContribution} from './journey';
import type { StoryDraft } from './components/LorraineMadreChat';
import MothershipInstructions from './components/MothershipInstructions';
import ActionPills from './components/ActionPills';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, LayoutGrid, Info, LogOut, ChevronRight, Check } from 'lucide-react';

type FirebaseUser = { uid: string };

export default function App() {
  const [drafts,setDrafts]=useState<StoryDraft[]>([]);
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
            <WelcomeJourney journey={journey} onChange={updateJourney} storageError={storageError}/>
            <LorraineMadreChat key={`${user?.uid||'preview'}-${journey.day}`} day={journey.day} dayCue={JOURNEY_DAYS[journey.day].cue}
              initialWords={journey.notes[journey.day]}
              onWordsChange={words=>updateJourney({...journey,notes:{...journey.notes,[journey.day]:words}})}
              context={`Day ${journey.day+1}: ${journey.titles[journey.day]||JOURNEY_DAYS[journey.day].title}. ${JOURNEY_DAYS[journey.day].focus}. Selected component: ${journey.component||'not chosen'}. Guide the Hero, one question at a time.`}
              onContribution={words=>updateJourney(addContribution(journey,{...words,day:journey.day,component:journey.component},crypto.randomUUID(),new Date().toISOString()))}>
            <div className="lm-component-choice"><label htmlFor="wish-component">Give this wish a home (optional)</label><select id="wish-component" value={journey.component??''} onChange={e=>updateJourney({...journey,component:e.target.value?Number(e.target.value):null})}><option value="">Keep it open for now</option>{INITIAL_ENTITIES.filter(e=>e.type==='offering').map(e=><option key={e.id} value={Number(e.id.replace('product-house-',''))}>{e.house} · {e.name}</option>)}</select><p className="lm-caption">Choose a component before keeping your contribution to light its space on the Engine.</p></div>
            </LorraineMadreChat>
            <EngineGrid journey={journey} onSelect={component=>{updateJourney({...journey,component});document.getElementById('daily-conversation')?.scrollIntoView({behavior:'smooth'});}}/>


            <EngineJourney />
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
                <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-black">Your operating board · name and claim your universe</p>
              </div>
              <p className="mt-6 max-w-2xl">Time follows your rhythm. Space holds your 16 Plans. Story opens Neverland, your collection of Stories. Choose a Plan space to name it; explore Wonderland below to find its product Houses.</p><details className="mt-6"><summary>Explore the mothership structure when you are ready</summary><MothershipInstructions
                currentMothershipName={displayEntities.find(e => e.type === 'holding_company')?.name || 'Sterling Drive Consulting'}
                onUpdateMothershipName={(name) => {
                  const holdingEntity = displayEntities.find(e => e.type === 'holding_company');
                  if (holdingEntity) {
                    handleUpdateEntity({ ...holdingEntity, name });
                  }
                }}
                onExploreOrbit={() => setMapLayout('space')}
                onOpenFramework={() => setViewMode('framework')}
              /></details>
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
                : mapLayout === 'time' ? <TimeView entities={displayEntities} onSelect={setSelectedEntityId} founder={viewMode === 'business'} /> : <section aria-label="Story board"><h2 className="lm-section-title">Story · Neverland</h2><div className="lm-neverland-intro"><VoiceOrb allowVideo/><div><p>Hero, this is your collection of Stories: what you wished for, what you felt, what you learned and what comes next.</p><p>Golden Ticket opens the invitation. Jungle Book and the Story Calendar bring the next chapter into view.</p><a className="lm-pill lm-pill-white mt-4" href="https://junglebook.lorraenmadre.com/" target="_blank" rel="noopener noreferrer">Explore Jungle Book · Story Calendar</a><a className="lm-return-story" href="#daily-conversation">Tell the next part of your story ↑</a></div></div>
                  {journey.contributions.length===0&&drafts.length===0?<p className="py-8">Your first thread starts in the talk bar. Keep a contribution and it will appear here.</p>:null}
                  {[...journey.contributions].reverse().map(c=><article key={c.id} className="lm-story-card"><small>Day {c.day+1} · {c.kind} · saved on this browser{c.component?` · Component ${c.component}`:''}</small><p>{c.wish}</p>{c.feeling&&<p>How I feel: {c.feeling}</p>}<button className="lm-return-story" onClick={()=>{updateJourney({...journey,day:c.day});document.getElementById('wish-well')?.scrollIntoView({behavior:'smooth'});}}>Revisit this day ↑</button></article>)}
                  {drafts.map(d=><article key={d.id} className="lm-story-card"><small>{d.kind} · session draft</small><p>{d.text}</p><small>{d.context}</small></article>)}
                </section>}
            </div>
            <div className="max-w-7xl mx-auto px-6 pb-8">
              <ClaimSections onAddSatellite={sat=>{const update=viewMode==='framework'?setCleanEntities:setEntities;update(prev=>[...prev,sat]);}} entities={displayEntities} onSelect={setSelectedEntityId} onUpdate={handleUpdateEntity} />
            </div>
            {viewMode === 'business' && <details className="max-w-7xl mx-auto px-6"><summary>Explore the full operating map</summary><OperatingMap /></details>}

            {/* Newcastle Connection Section - Screenshot CTA Styling */}
            <div className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-100 mt-20">
              <div className="flex flex-col items-center text-center space-y-6">
                <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold text-black">
                  Connect with Newcastle · Activate Your Orbit
                </h4>
                <ActionPills
                  onDesign={() => {
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  onWork={() => {
                    setViewMode('framework');
                  }}
                  onPlay={() => {
                    setMapLayout('space');
                  }}
                />
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100 text-center space-y-4">
              <p className="text-[9px] uppercase tracking-[0.2em] text-black leading-relaxed max-w-3xl mx-auto">
                Disclaimer: This application is a framework designed to help organize information within the WishWell system. 
                It does not constitute financial, medical, or legal advice. 
                If you require professional advice in any of these areas, please consult with an AI assistant within the system for direction to the appropriate affiliates who can service those specific needs.
              </p>
              <p className="text-[8px] text-black uppercase tracking-widest">© 2026 LORRAEN MADRE | WishWell individual flow</p>
            </div>
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
