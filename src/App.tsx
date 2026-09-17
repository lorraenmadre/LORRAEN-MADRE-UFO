import React, { useState, useEffect } from 'react';
import { Entity } from './types';
import { INITIAL_ENTITIES, CLEAN_ENTITIES } from './constants';
import EcosystemMap from './components/EcosystemMap';
import OrbitMap from './components/OrbitMap';
import CleanOutline from './components/CleanOutline';
import OperatingMap from './components/OperatingMap';
import EntitySnapshot from './components/EntitySnapshot';
import LorraineMadreChat from './components/LorraineMadreChat';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, LayoutGrid, Info, LogOut, ChevronRight, Check } from 'lucide-react';

type FirebaseUser = { uid: string };

export default function App() {
  const [entities, setEntities] = useState<Entity[]>(INITIAL_ENTITIES);
  const [cleanEntities, setCleanEntities] = useState<Entity[]>(CLEAN_ENTITIES);
  const [mapLayout, setMapLayout] = useState<'orbit' | 'outline'>('orbit');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'framework' | 'business'>('business');
  const [user, setUser] = useState<FirebaseUser | null>(null);
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

  if (!isAuthReady) return <div className="min-h-screen bg-white flex items-center justify-center font-mono text-[10px] uppercase tracking-widest">Waking Lorraen...</div>;

  if (!user && !isPreviewMode) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-belleza tracking-tight">LORRAEN MADRE</h1>
          <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">Universal Family Office Framework</p>
          {authWarning && (
            <p className="max-w-lg mx-auto text-xs text-gray-500 leading-relaxed">{authWarning}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={handleLogin}
            className="border border-black px-12 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-all"
          >
            Sign into Orbit
          </button>
          <button 
            onClick={() => setIsPreviewMode(true)}
            className="border border-gray-300 px-12 py-4 text-[10px] uppercase tracking-widest font-bold hover:border-black transition-all"
          >
            Enter Public Preview
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
            <header className="border-b border-gray-100 py-4 px-6 sticky top-0 bg-white/80 backdrop-blur-md z-50">
              <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-belleza tracking-tight cursor-default">LORRAEN MADRE</h1>
                </div>
                <div className="flex bg-gray-100 rounded-none p-1">
                  <button 
                    onClick={() => setViewMode('framework')}
                    className={`px-4 py-1.5 text-[10px] uppercase tracking-widest transition-all ${viewMode === 'framework' ? 'bg-white shadow-sm font-bold' : 'opacity-40'}`}
                  >
                    Framework
                  </button>
                  <button 
                    onClick={() => setViewMode('business')}
                    className={`px-4 py-1.5 text-[10px] uppercase tracking-widest transition-all ${viewMode === 'business' ? 'bg-white shadow-sm font-bold' : 'opacity-40'}`}
                  >
                    Founder’s Example
                  </button>
                  <div className="w-px h-4 bg-gray-300 mx-2 self-center" />
                  <button 
                    onClick={handleLogout}
                    title={isPreviewMode ? 'Exit Preview' : 'Sign Out'}
                    className="p-1.5 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            {/* Google Drive Connection Bar */}
            {isPreviewMode && (
              <div className="bg-gray-100 text-gray-700 py-3 px-6 text-center text-[10px] uppercase tracking-[0.3em] font-bold">
                Public Preview Mode — sign in later to unlock Google Drive vault actions.
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
               <div className="bg-green-50 text-green-700 py-3 px-6 text-center text-[10px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-2">
                 <Check className="w-3 h-3" />
                 <span>Vault Synced with Google Drive</span>
               </div>
            )}

            {/* Lorraine Chat Top */}
            <LorraineMadreChat context="General Ecosystem Navigation" />

            {/* Title Section */}
            <div className="max-w-7xl mx-auto text-left py-20 px-6">
              <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-6">a WishWell system</p>
              <h2 className="text-4xl md:text-6xl font-spectral leading-[1.1] tracking-tighter mb-2">
                Design happily ever after <span className="italic text-black">with</span>
              </h2>
              <h3 className="text-4xl md:text-6xl font-spectral italic text-black tracking-tighter normal-case">
                TIME . <span className="lowercase">space</span> + Story
              </h3>
              <div className="flex items-center gap-4 mt-12">
                <div className="h-px w-8 bg-gray-200" />
                <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-gray-500">Visual Roadmap of Your Universal Family Office</p>
              </div>
              <p className="max-w-xl text-gray-400 font-spectral text-lg italic mt-4 opacity-60">
                LORRAEN MADRE is the brand. Sterling Drive Consulting is the founder’s mothership / UFO.
              </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-8 flex flex-wrap items-center gap-3">
              {(['orbit', 'outline'] as const).map(layout => <button key={layout} aria-pressed={mapLayout === layout} onClick={() => setMapLayout(layout)} className={`border border-black rounded-full px-5 py-2 text-sm ${mapLayout === layout ? 'bg-black text-white' : ''}`}>{layout === 'orbit' ? 'Orbit view' : 'Outline view'}</button>)}
              <p className="text-xs text-gray-500">{viewMode === 'framework' ? 'Your clean framework — changes stay separate from the founder example.' : 'The founder’s example — explore each workspace.'} Edits last for this session.</p>
            </div>
            {mapLayout === 'orbit' ? <OrbitMap entities={displayEntities} onSelect={setSelectedEntityId} /> : viewMode === 'framework' ? <CleanOutline entities={displayEntities} onSelect={setSelectedEntityId} /> : <EcosystemMap entities={displayEntities} onSelect={setSelectedEntityId} />}
            {viewMode === 'business' && <OperatingMap />}

            {/* Newcastle Connection Footer */}
            <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-end border-t border-gray-100 mt-20">
              <div className="text-right space-y-8">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Connect with Newcastle</h4>
                <div className="flex flex-col md:flex-row items-center justify-end gap-6">
                  <a href="#" className="px-8 py-3 bg-red-600 text-white rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:bg-red-700 transition-all hover:scale-105 active:scale-95">
                    Get a Castle
                  </a>
                  <a href="#" className="px-8 py-3 bg-blue-600 text-white rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95">
                    Become an Affiliate
                  </a>
                </div>
              </div>
            </div>

            {/* Legend / Info */}
            <footer className="max-w-7xl mx-auto px-6 pt-12 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-black rounded-full" />
                  <h4 className="text-[10px] uppercase tracking-widest font-bold">Planets</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">Planets represent the primary functional ventures and story buckets. They hold the larger mission of each office.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 border border-black rounded-full" />
                  <h4 className="text-[10px] uppercase tracking-widest font-bold">Offerings</h4>
                </div>
                <p className="text-base text-gray-500 leading-relaxed">House products are the entry points into the twelve departments. Portfolio placements describe separate business functions.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-gray-200" />
                  <h4 className="text-[10px] uppercase tracking-widest font-bold">Dinosaurs</h4>
                </div>
                <p className="text-base text-gray-500 leading-relaxed">Dinosaurs are agents with zodiac archetypes, platform assignments and distinct brand identities. Their registry lives in House 3.</p>
              </div>
            </footer>
            <div className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100 text-center space-y-4">
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 leading-relaxed max-w-3xl mx-auto">
                Disclaimer: This application is a framework designed to help organize information within the WishWell system. 
                It does not constitute financial, medical, or legal advice. 
                If you require professional advice in any of these areas, please consult with an AI assistant within the system for direction to the appropriate affiliates who can service those specific needs.
              </p>
              <p className="text-[8px] text-gray-300 uppercase tracking-widest">© 2026 LORRAEN MADRE | WishWell individual flow</p>
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
