import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { START_STEPS, START_FALLBACK_URL } from '../startLinks';

interface MothershipInstructionsProps {
  currentMothershipName?: string;
  onUpdateMothershipName?: (name: string) => void;
  onExploreOrbit?: () => void;
  onOpenFramework?: () => void;
}

export default function MothershipInstructions({
  currentMothershipName = 'Sterling Drive Consulting',
  onUpdateMothershipName,
  onExploreOrbit,
  onOpenFramework,
}: MothershipInstructionsProps) {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentMothershipName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateMothershipName?.(tempName.trim());
      setEditingName(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="border border-black bg-white shadow-xs p-6 md:p-8 mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] uppercase tracking-[0.25em] font-bold rounded-full">
            <Sparkles className="w-3 h-3 text-[#00bf63]" />
            <span>Mothership Architecture</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-belleza font-medium tracking-tight">
            Name and claim your world.
          </h3>
          <p className="text-sm text-black max-w-2xl leading-relaxed">
            Every family office begins with a mothership. Start these six in order, then name and claim every box below.
          </p>
        </div>

        {/* Claim World / Mothership Name Input */}
        <div className="min-w-[280px]">
          {editingName ? (
            <form onSubmit={handleSave} className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-black uppercase tracking-widest">
                Claim Mothership Name:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. My Mothership"
                  className="px-3 py-1.5 border border-black text-xs font-mono focus:outline-hidden flex-1"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-black text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-[#111111]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingName(false)}
                  className="border border-gray-300 px-2 py-1.5 text-xs hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-none">
              <span className="text-[9px] uppercase tracking-widest text-black block mb-1">
                Your Mothership / UFO
              </span>
              <div className="flex items-center justify-between gap-3">
                <span className="font-belleza text-base font-semibold text-black truncate">
                  {currentMothershipName || 'Unnamed Mothership'}
                </span>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-[10px] font-mono uppercase underline hover:text-black whitespace-nowrap"
                >
                  Claim Name
                </button>
              </div>
              {savedSuccess && (
                <span className="text-[10px] text-black font-mono mt-1 inline-flex items-center gap-1">
                  <Check className="w-3 h-3" /> Mothership claimed!
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Start your mothership: six click-through setups, in order */}
      <div className="pt-6">
        <p className="font-figtree font-semibold text-sm uppercase tracking-[0.12em] mb-4">Start your mothership · 6 steps</p>
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {START_STEPS.map((s, i) => {
            const href = s.url || START_FALLBACK_URL;
            return (
              <li key={s.id} className="border border-black rounded-xl p-5 flex flex-col gap-2">
                <span className="lm-terminal self-start">&gt; {String(i + 1).padStart(2, '0')} · {s.who.toLowerCase()}</span>
                <h4 className="font-belleza text-xl mt-1">{s.title}</h4>
                <p className="text-sm leading-relaxed">{s.description}</p>
                <a href={href} target="_blank" rel="noopener noreferrer" className="lm-pill lm-pill-white mt-auto self-start">
                  {s.url ? s.cta : 'Request setup'}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
