import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, ChevronDown, ChevronUp, Shield, Orbit, Bot, Globe, Check } from 'lucide-react';
import ActionPills from './ActionPills';

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
  const [isOpen, setIsOpen] = useState(false);
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

  const steps = [
    {
      step: '01',
      title: 'Name and Claim Your Mothership',
      subtitle: 'Anchor the Identity',
      icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
      description:
        'Choose a sovereign, generational name for your mothership entity. This is the root holding vehicle from which all 12 houses and ventures orbit.',
    },
    {
      step: '02',
      title: 'Form the Protective Triad',
      subtitle: 'Trust · Church · Holding',
      icon: <Shield className="w-4 h-4 text-indigo-600" />,
      description:
        'Establish your Trust for asset preservation, your Church for spiritual and cultural values, and your Holding Company (Mothership) for active operations.',
    },
    {
      step: '03',
      title: 'Chart the North and South Nodes',
      subtitle: 'Vision & Mission Alignment',
      icon: <Compass className="w-4 h-4 text-amber-600" />,
      description:
        'Define your North Node (the forward-looking retirement, benefit and legacy packages) and South Node (the charitable foundation and protective roots).',
    },
    {
      step: '04',
      title: 'Furnish the 12 Operating Houses',
      subtitle: 'House Products & Cadences',
      icon: <Orbit className="w-4 h-4 text-blue-600" />,
      description:
        'Assign a tangible house product, technical platform, and review cadence to each department—from Treasury and Holistic Health to Systems and Story.',
    },
    {
      step: '05',
      title: 'Deploy Dinosaur Agents & Satellites',
      subtitle: 'Execution & Coordination',
      icon: <Bot className="w-4 h-4 text-purple-600" />,
      description:
        'Assign platform-specific Zodiac Dinosaur agents to run repetitive workflows. Tether external Satellites with clear input/output handoffs.',
    },
    {
      step: '06',
      title: 'Command from House 13 (Creation)',
      subtitle: 'You in the Present Moment',
      icon: <Globe className="w-4 h-4 text-rose-600" />,
      description:
        'You are the 13th house: choice, action, and active presence across all twelve houses. The system serves your daily rhythm, not vice versa.',
    },
  ];

  return (
    <div className="border border-black bg-white shadow-xs p-6 md:p-8 mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] uppercase tracking-[0.25em] font-bold rounded-full">
            <Sparkles className="w-3 h-3 text-[#00FF66]" />
            <span>Mothership Architecture</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-spectral font-medium tracking-tight">
            Name and claim your world.
          </h3>
          <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
            Every sovereign family office begins with an intentional mothership. Follow these instructions to structure your governance, orbit, and execution agents.
          </p>
        </div>

        {/* Claim World / Mothership Name Input */}
        <div className="min-w-[280px]">
          {editingName ? (
            <form onSubmit={handleSave} className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
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
                  className="bg-black text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-800"
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
              <span className="text-[9px] uppercase tracking-widest text-gray-400 block mb-1">
                Your Mothership / UFO
              </span>
              <div className="flex items-center justify-between gap-3">
                <span className="font-spectral text-base font-semibold text-black truncate">
                  {currentMothershipName || 'Unnamed Mothership'}
                </span>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-[10px] font-mono uppercase underline hover:text-gray-600 whitespace-nowrap"
                >
                  Claim Name
                </button>
              </div>
              {savedSuccess && (
                <span className="text-[10px] text-emerald-600 font-mono mt-1 inline-flex items-center gap-1">
                  <Check className="w-3 h-3" /> Mothership claimed!
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Accordion toggle for step-by-step instructions */}
      <div className="pt-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left py-2 group cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-700 group-hover:text-black flex items-center gap-2">
            <span>Instructions for designing a mothership</span>
            <span className="text-[10px] font-mono text-gray-400">({steps.length} steps)</span>
          </span>
          <span className="p-1 rounded border border-gray-200 group-hover:border-black transition-colors">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 pb-6">
                {steps.map((item) => (
                  <div
                    key={item.step}
                    className="border border-gray-200 p-4 bg-gray-50/50 hover:bg-white hover:border-black transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold text-gray-400">{item.step}</span>
                        <div className="p-1.5 bg-white border border-gray-100 rounded-full">{item.icon}</div>
                      </div>
                      <h4 className="font-spectral font-semibold text-base mb-1">{item.title}</h4>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">{item.subtitle}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Pills in screenshot style */}
              <div className="pt-6 border-t border-gray-100 flex flex-col items-center gap-3 text-center">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-gray-400">
                  Execute Your Universe
                </span>
                <ActionPills
                  designLabel="DESIGN"
                  workLabel="WORK"
                  playLabel="PLAY"
                  onDesign={() => {
                    setEditingName(true);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  onWork={onOpenFramework}
                  onPlay={onExploreOrbit}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
