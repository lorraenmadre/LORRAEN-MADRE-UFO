import React, { useState } from 'react';
import { Entity } from '../types';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Crown, 
  Orbit, 
  Anchor, 
  Heart, 
  ArrowUpRight, 
  Briefcase, 
  Satellite as SatelliteIcon, 
  Plus, 
  Sparkles,
  Info,
  Layers,
  Check,
  Terminal,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import PlatformIcon from './PlatformIcon';
import DinosaurIcon, { getDinosaurForHouse, getDinosaurForZodiac } from './DinosaurIcon';

interface Props {
  entities: Entity[];
  onSelect: (id: string) => void;
}

export default function EcosystemMap({ entities, onSelect }: Props) {
  const [showConnectSatelliteGuide, setShowConnectSatelliteGuide] = useState(true);

  const trust = entities.find(e => e.type === 'trust');
  const church = entities.find(e => e.type === 'church');
  const holding = entities.find(e => e.type === 'holding_company');
  const northNode = entities.find(e => e.type === 'north_node');
  const southNode = entities.find(e => e.type === 'south_node');
  const planets = entities.filter(e => e.type === 'planet' || e.type === 'asteroid');
  const dinosaurs = entities.filter(e => e.type === 'dinosaur');
  const satellites = entities.filter(e => e.type === 'satellite');
  const offerings = entities.filter(e => e.type === 'offering');

  const isUnnamed = (entity?: Entity) => {
    if (!entity) return true;
    if (!entity.name || entity.name.trim() === '') return true;
    const n = entity.name.toLowerCase();
    return (
      n.includes('name to be chosen') ||
      n.includes('not yet provided') ||
      n.includes('unnamed') ||
      n.includes('empty workspace') ||
      n.includes('empty brand identity')
    );
  };

  const getGenericName = (entity: Entity) => {
    if (entity.house) {
      return `${entity.house.toUpperCase()} // PRODUCT SEED`;
    }
    if (entity.symbol) {
      const role = entity.highLevelSystem || entity.type.replace('_', ' ');
      return `${role.toUpperCase()} [${entity.symbol.toUpperCase()}]`;
    }
    if (entity.zodiacSign) {
      return `AGENT // ${entity.zodiacSign.toUpperCase()}`;
    }
    return `${entity.type.replace('_', ' ').toUpperCase()} // GENERIC`;
  };

  const getSystemConfig = (entity: Entity) => {
    const configs: Record<string, { tag: string; icon: React.ReactNode }> = {
      'trust': { tag: 'The Trust', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
      'church': { tag: 'The Church', icon: <Crown className="w-3.5 h-3.5" /> },
      'holding': { tag: 'UFO / Mothership', icon: <Orbit className="w-3.5 h-3.5" /> },
      'north-node': { tag: 'Retirement Plan', icon: <Anchor className="w-3.5 h-3.5" /> },
      'south-node': { tag: 'Nonprofit Foundation', icon: <Heart className="w-3.5 h-3.5" /> },
      'sun': { tag: 'Brand Identity', icon: <Sparkles className="w-3.5 h-3.5" /> },
      'moon': { tag: 'Home Economics', icon: <Layers className="w-3.5 h-3.5" /> },
      'mars': { tag: 'Business Activation', icon: <Sparkles className="w-3.5 h-3.5" /> },
      'mercury': { tag: 'Integrated Marketing', icon: <Sparkles className="w-3.5 h-3.5" /> },
      'venus': { tag: 'Content Library', icon: <Layers className="w-3.5 h-3.5" /> },
      'saturn': { tag: 'Digital Organization', icon: <Layers className="w-3.5 h-3.5" /> },
      'jupiter': { tag: 'Capital Container', icon: <Sparkles className="w-3.5 h-3.5" /> },
      'neptune': { tag: 'The Movie', icon: <Sparkles className="w-3.5 h-3.5" /> },
      'uranus': { tag: 'Function to confirm', icon: <HelpCircle className="w-3.5 h-3.5" /> },
      'pluto': { tag: 'Acquisition', icon: <Sparkles className="w-3.5 h-3.5" /> },
      'earth': { tag: '24-hour Routine', icon: <Sparkles className="w-3.5 h-3.5" /> },
      'lilith': { tag: 'Special Projects', icon: <Sparkles className="w-3.5 h-3.5" /> },
      'chiron': { tag: 'Healing Journey', icon: <Heart className="w-3.5 h-3.5" /> },
      'juno': { tag: 'Relationship Status / Goal', icon: <Heart className="w-3.5 h-3.5" /> },
      'vesta': { tag: 'Passion / Talent', icon: <Sparkles className="w-3.5 h-3.5" /> },
    };

    const config = configs[entity.id] || { tag: entity.type.replace('_', ' '), icon: null };
    if (!configs[entity.id]) {
      if (entity.type === 'offering') config.icon = <Briefcase className="w-3.5 h-3.5" />;
      if (entity.type === 'satellite') config.icon = <SatelliteIcon className="w-3.5 h-3.5" />;
      if (entity.type === 'dinosaur') config.icon = <Sparkles className="w-3.5 h-3.5" />;
    }
    return config;
  };

  const calculateProgress = (entity: Entity) => {
    let score = 0;
    const max = 5;

    if (entity.intentions) score++;
    if (entity.manifestations) score++;
    if (entity.leanValueCanvas) score++;
    if (entity.executiveSummary) score++;
    
    if (entity.type === 'trust' && entity.vaultDocuments?.length) score++;
    else if (entity.type === 'church' && entity.councilMembers?.some(m => m !== '')) score++;
    else if ((entity.type === 'north_node' || entity.type === 'south_node') && entity.fundingStrategies?.length) score++;
    else if (entity.type === 'planet' && entity.storyCardVideo) score++;
    else if (entity.type === 'offering' && entity.customerAcquisitionCost) score++;
    else if (entity.type === 'dinosaur') score++;
    else score += 2;

    return Math.min(100, Math.round((score / max) * 100));
  };

  const ProgressBar = ({ progress, color }: { progress: number; color?: string }) => (
    <div className={`w-full h-[3px] mt-3 overflow-hidden rounded-full ${color === 'black' ? 'bg-gray-200' : 'bg-gray-100'}`}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={`h-full transition-all duration-500 rounded-full ${
          color === 'red' ? 'bg-[#E51818]' :
          color === 'yellow' ? 'bg-[#F59E0B]' :
          color === 'green' ? 'bg-[#10B981]' :
          color === 'black' ? 'bg-black' :
          'bg-black'
        }`}
      />
    </div>
  );

  const EntityBox = ({ entity, className = "" }: { entity: Entity | undefined; className?: string; key?: string }) => {
    if (!entity) return null;
    const config = getSystemConfig(entity);
    const progress = calculateProgress(entity);
    const unnamed = isUnnamed(entity);
    const genericName = getGenericName(entity);

    // Terminal styling for things that still need to be named
    if (unnamed) {
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => onSelect(entity.id)}
          className={`p-4 border border-emerald-500/60 bg-[#0C120C] text-left flex flex-col justify-between group relative overflow-hidden font-mono shadow-xs transition-all ${className}`}
        >
          <div className="z-10 relative w-full">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-1.5 min-w-0">
                <Terminal className="w-3.5 h-3.5 text-[#00FF66]" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-emerald-400/80 truncate">
                  {config.tag}
                </span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#00FF66] opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>

            <div className="space-y-1 my-2">
              <div className="text-[9px] text-emerald-500/60 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-ping" />
                <span>UNCLAIMED // INPUT NEEDED</span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-[#00FF66] tracking-wide break-words">
                &gt; {genericName}
                <span className="inline-block w-2 h-3.5 ml-1 bg-[#00FF66] animate-pulse align-middle" />
              </h3>
              {entity.symbol && <p className="text-[10px] text-emerald-500/70 italic">Archetype: {entity.symbol}</p>}
            </div>
          </div>

          <div className="w-full mt-2 pt-2 border-t border-emerald-950">
            <div className="flex justify-between items-center text-[9px] text-emerald-500/80 mb-1">
              <span>INITIALIZING</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-[2px] bg-emerald-950 rounded-full overflow-hidden">
              <div style={{ width: `${progress}%` }} className="h-full bg-[#00FF66]" />
            </div>
          </div>
        </motion.button>
      );
    }

    return (
      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: '#fdfdfd' }}
        onClick={() => onSelect(entity.id)}
        className={`p-4 border border-black hover:border-gray-500 transition-all text-left flex flex-col justify-between group relative overflow-hidden bg-white shadow-2xs ${className}`}
      >
        <div className="z-10 relative w-full">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-black/40">{config.icon}</span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 truncate">
                {config.tag}
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          <div className="flex items-center gap-3">
            {entity.logoUrl ? (
              <img src={entity.logoUrl} className="w-10 h-10 object-contain" referrerPolicy="no-referrer" alt="" />
            ) : null}
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-spectral font-medium leading-snug truncate">{entity.name}</h3>
              {entity.symbol && <p className="text-[10px] italic text-gray-400 font-montserrat">{entity.symbol}</p>}
            </div>
          </div>
        </div>
        <ProgressBar progress={progress} />
      </motion.button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
      
      {/* 1. Governance Triad */}
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center mb-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 block mb-1">
            Triad of Protection & Sovereignty
          </span>
          <h3 className="font-spectral text-2xl">Mothership Core</h3>
        </div>
        {trust && <EntityBox entity={trust} className="w-72 text-center" />}
        <EntityBox entity={church} className="w-72 text-center" />
        <div className="w-px h-8 bg-black opacity-20" />
        <EntityBox entity={holding} className="w-72 text-center" />
      </div>

      {/* 2. Nodes & Planets (With description directly in section) */}
      <div className="pt-8 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
              <h4 className="text-sm uppercase tracking-[0.3em] font-bold">Planets & Astrological Nodes</h4>
            </div>
            {/* Section description moved directly here from footer */}
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
              Planets represent the primary functional ventures and story buckets. They hold the larger mission of each office.
            </p>
          </div>
          <div className="text-xs font-mono text-gray-400">
            12 Planetary Positions · Vision & Mission Polarized
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* South Node (Left) */}
          <div className="col-span-12 lg:col-span-2 flex flex-col justify-center">
            <EntityBox entity={southNode} className="h-48 border-dashed" />
            <div className="mt-3 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black">Mission</p>
              <span className="text-[9px] text-gray-400 font-mono">South Node Root</span>
            </div>
          </div>

          {/* Planets (Center) */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {planets.map(planet => (
              <EntityBox key={planet.id} entity={planet} className="h-44" />
            ))}
          </div>

          {/* North Node (Right) */}
          <div className="col-span-12 lg:col-span-2 flex flex-col justify-center">
            <EntityBox entity={northNode} className="h-48 border-dashed" />
            <div className="mt-3 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black">Vision</p>
              <span className="text-[9px] text-gray-400 font-mono">North Node Horizon</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. House Products (With connection icons & dinosaur icons & interesting card design) */}
      <div className="pt-12 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 border-2 border-black rounded-full" />
              <h4 className="text-sm uppercase tracking-[0.3em] font-bold">House Products</h4>
            </div>
            {/* Section description moved directly here from footer */}
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
              House products are the entry points into the twelve departments. Portfolio placements describe separate business functions.
            </p>
          </div>
          <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> &gt;75%
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-2" /> 40–75%
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-2" /> &lt;40%
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {offerings.map(offering => {
            const progress = calculateProgress(offering);
            const isArchived = offering.isArchived;
            const unnamed = isUnnamed(offering);
            const genericName = getGenericName(offering);
            
            // Extract house number if present (e.g. "House 5" -> 5)
            const houseNumMatch = offering.house?.match(/\d+/);
            const houseNum = houseNumMatch ? parseInt(houseNumMatch[0], 10) : 1;
            const companionDino = getDinosaurForHouse(houseNum);
            
            let barColor = 'black';
            if (!isArchived) {
              if (progress < 40) barColor = 'red';
              else if (progress < 75) barColor = 'yellow';
              else barColor = 'green';
            }

            // Unnamed offering terminal style
            if (unnamed) {
              return (
                <div key={offering.id} className="relative group/offering">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelect(offering.id)}
                    className="w-full h-full text-left p-5 border border-emerald-500/60 bg-[#0C120C] text-[#00FF66] font-mono flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-emerald-950/80 mb-3">
                        <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                          {offering.house || 'OFFERING SEED'}
                        </span>
                        <div className="flex items-center">
                          <PlatformIcon platform={offering.platform || 'Google'} size={18} />
                        </div>
                      </div>

                      <div className="space-y-1.5 my-2">
                        <div className="text-[9px] text-emerald-500/60 uppercase tracking-widest flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-ping" />
                          <span>NAME_PENDING</span>
                        </div>
                        <h5 className="font-bold text-sm text-[#00FF66] tracking-wide">
                          &gt; {genericName}
                          <span className="inline-block w-2 h-3.5 ml-1 bg-[#00FF66] animate-pulse align-middle" />
                        </h5>
                        <p className="text-[10px] text-emerald-500/70">{offering.platform || 'Unassigned platform'}</p>
                      </div>
                    </div>

                    <div className="w-full mt-4 pt-3 border-t border-emerald-950">
                      <div className="flex justify-between items-center text-[9px] text-emerald-400 mb-1">
                        <span>COMPLETION</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-[3px] bg-emerald-950 rounded-full overflow-hidden">
                        <div style={{ width: `${progress}%` }} className="h-full bg-[#00FF66]" />
                      </div>
                    </div>
                  </motion.button>
                </div>
              );
            }

            return (
              <div key={offering.id} className="relative group/offering">
                <motion.button 
                  whileHover={{ y: -3, scale: 1.01 }}
                  onClick={() => onSelect(offering.id)}
                  className={`w-full h-full text-left p-5 border transition-all flex flex-col justify-between shadow-2xs ${
                    isArchived 
                    ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60' 
                    : 'bg-white border-black hover:border-gray-500 hover:shadow-md'
                  }`}
                >
                  <div className="w-full">
                    {/* Header: House Tag + Platform Icon */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                        {offering.house || 'House Product'}
                      </span>
                      <div className="flex items-center">
                        {/* Platform Connection Icon */}
                        <PlatformIcon platform={offering.platform || 'Google'} size={20} />
                      </div>
                    </div>

                    {/* Body: Product Name & Platform details */}
                    <div className="space-y-1">
                      <h5 className={`font-spectral text-lg font-semibold leading-tight ${isArchived ? 'line-through' : 'text-black'}`}>
                        {offering.name}
                      </h5>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-gray-500">{offering.platform || 'Platform'}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-[10px] uppercase font-mono text-gray-400">{companionDino.species}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar under words */}
                  <div className="w-full mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-[9px] uppercase font-mono text-gray-400 mb-1">
                      <span>Status</span>
                      <span className="font-bold">{progress}%</span>
                    </div>
                    <ProgressBar progress={progress} color={barColor} />
                  </div>
                </motion.button>
                
                {/* Archive / Restore Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    (window as any).dispatchUpdateEntity?.({
                      ...offering,
                      isArchived: !offering.isArchived
                    });
                  }}
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover/offering:opacity-100 transition-all z-20 border shadow-xs ${
                    isArchived 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-500 border-gray-300 hover:text-black hover:border-black'
                  }`}
                  title={isArchived ? "Restore Offering" : "Archive Offering"}
                >
                  <span className="text-[9px] uppercase font-bold">{isArchived ? 'R' : 'A'}</span>
                </button>
              </div>
            );
          })}

          {/* Add Offering Button */}
          <button 
            onClick={() => {
              const name = prompt("Name your new offering (e.g. 'Athent', 'WISHOPOLY'):");
              if (name) {
                const newId = `off-${Date.now()}`;
                (window as any).dispatchAddOffering?.({
                  id: newId,
                  type: 'offering',
                  name,
                  description: 'A new transactional seed in your ecosystem.',
                  house: 'House 12',
                  platform: 'Unassigned'
                });
              }
            }}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 hover:border-black bg-gray-50/50 hover:bg-white transition-all group min-h-[160px] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full border border-gray-300 group-hover:border-black flex items-center justify-center mb-2 group-hover:rotate-90 transition-transform bg-white">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase tracking-widest font-bold text-gray-700 group-hover:text-black">Add Offering</span>
            <span className="text-[10px] text-gray-400 mt-1 font-mono">Create seed / house product</span>
          </button>
        </div>
      </div>

      {/* 4. Dinosaurs Section (With section description moved directly here) */}
      <div className="pt-12 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
              <h4 className="text-sm uppercase tracking-[0.3em] font-bold">Dinosaurs — Zodiac + Platform + Identity</h4>
            </div>
            {/* Section description moved directly here from footer */}
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
              Dinosaurs are agents with zodiac archetypes, platform assignments and distinct brand identities. Their registry lives in House 3.
            </p>
          </div>
          <div className="text-xs font-mono text-gray-400">
            12 Agent Identities Defined
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {dinosaurs.map(dino => {
            const dinoMeta = getDinosaurForZodiac(dino.zodiacSign);
            const unnamed = isUnnamed(dino);
            const genericName = getGenericName(dino);

            if (unnamed) {
              return (
                <motion.button
                  key={dino.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onSelect(dino.id)}
                  className="p-3 border border-emerald-500/60 bg-[#0C120C] text-left flex flex-col justify-between font-mono"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold text-emerald-400">{dino.zodiacSign}</span>
                      <PlatformIcon platform={dino.platform || 'Shopify'} size={16} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#00FF66]">&gt; {genericName}</p>
                      <p className="text-[10px] text-emerald-500/70">{dino.platform}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-emerald-950 w-full">
                    <span className="text-[8px] text-emerald-400 font-mono">DEFINED</span>
                  </div>
                </motion.button>
              );
            }

            return (
              <motion.button
                key={dino.id}
                whileHover={{ y: -2, borderColor: '#000' }}
                onClick={() => onSelect(dino.id)}
                className="p-4 border border-gray-200 text-left bg-white hover:border-black transition-all flex flex-col justify-between shadow-2xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <DinosaurIcon zodiac={dino.zodiacSign} size="sm" />
                      <span className="text-[10px] font-bold font-mono text-gray-700">{dino.zodiacSign}</span>
                    </div>
                    <PlatformIcon platform={dino.platform || 'Shopify'} size={18} />
                  </div>
                  <h5 className="font-spectral font-semibold text-base leading-snug">{dino.name}</h5>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{dino.platform}</p>
                  {dinoMeta && (
                    <p className="text-[10px] text-gray-400 mt-0.5">{dinoMeta.species}</p>
                  )}
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 w-full">
                  <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono">
                    <span>Registry H3</span>
                    <span className="text-emerald-600 font-bold">Ready</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 5. Satellites (With "Connect your own satellite" step-by-step instructions located strictly under this section) */}
      <div className="pt-12 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <SatelliteIcon className="w-4 h-4 text-black" />
              <h4 className="text-sm uppercase tracking-[0.3em] font-bold">Satellites (Radar & Coordination)</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
              External entities you choose to connect to your UFO. An API or Composio connector is optional; a manual handoff can keep a satellite in the loop.
            </p>
          </div>
          <button
            onClick={() => setShowConnectSatelliteGuide(!showConnectSatelliteGuide)}
            className="text-xs font-mono font-bold uppercase tracking-wider text-black underline underline-offset-4"
          >
            {showConnectSatelliteGuide ? 'Hide Satellite Guide' : 'Show Satellite Guide'}
          </button>
        </div>

        {/* Satellite Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {satellites.map(sat => {
            const unnamed = isUnnamed(sat);
            const genericName = getGenericName(sat);

            if (unnamed) {
              return (
                <motion.button
                  key={sat.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onSelect(sat.id)}
                  className="p-5 border border-emerald-500/60 bg-[#0C120C] text-left flex flex-col justify-between font-mono"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <SatelliteIcon className="w-4 h-4 text-[#00FF66]" />
                      <span className="text-[9px] text-emerald-400 font-mono">SATELLITE SEED</span>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-bold text-[#00FF66]">&gt; {genericName}</p>
                      <p className="text-xs text-emerald-500/70">{sat.connectionMethod || 'Manual handoff to define'}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-950">
                    <span className="text-[9px] text-emerald-400">CLICK TO CONFIGURE</span>
                  </div>
                </motion.button>
              );
            }

            return (
              <motion.button
                key={sat.id}
                whileHover={{ y: -4, borderColor: '#000' }}
                onClick={() => onSelect(sat.id)}
                className="p-6 border border-gray-200 bg-white shadow-2xs hover:shadow-md flex flex-col justify-between group text-left transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                      <SatelliteIcon className="w-4 h-4" />
                    </div>
                    <PlatformIcon platform={sat.name} size={20} />
                  </div>
                  <h5 className="font-spectral text-xl font-semibold leading-tight">{sat.name}</h5>
                  <p className="text-xs text-gray-500 mt-2 font-mono">{sat.status || 'Registered — not connected'}</p>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">{sat.connectionMethod || 'Connection method to define'}</p>
                </div>
                <ProgressBar progress={calculateProgress(sat)} />
              </motion.button>
            );
          })}
          
          {/* Add Satellite Card */}
          <button 
            onClick={() => {
              const name = prompt("Name your satellite (e.g. 'Composio Gateway', 'Nutrition Program', 'Legal Counsel'):");
              if (name) {
                const newId = `sat-${Date.now()}`;
                (window as any).dispatchAddSatellite?.({
                  id: newId,
                  type: 'satellite',
                  name,
                  description: 'External entity registered for this session. Define its purpose, handoff owner, inputs and outputs before execution.',
                  status: 'Registered — not connected',
                  connectionMethod: 'Manual handoff to define'
                });
              }
            }}
            className="p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 hover:border-black bg-gray-50/40 hover:bg-white transition-all group min-h-[200px] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-2xs">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-700 group-hover:text-black">Add Satellite</span>
            <span className="text-[10px] text-gray-400 text-center font-mono">Tether external entity</span>
          </button>
        </div>

        {/* "Connect your own satellite" instructions - STRICTLY UNDER THE SATELLITE SECTION */}
        {showConnectSatelliteGuide && (
          <div className="border border-black bg-gray-50/60 p-6 md:p-8 rounded-none">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-black" />
              <h5 className="font-spectral text-xl font-semibold">Connect your own satellite</h5>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-3xl">
              Follow these 5 protocol steps to safely link external partners, automated tools, or personal advisors to your Universal Family Office without compromising sovereign control.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white border border-gray-200 p-4">
                <span className="text-[10px] font-mono font-bold text-gray-400 block mb-1">STEP 01</span>
                <h6 className="font-semibold text-xs mb-1">Name & Purpose</h6>
                <p className="text-[11px] text-gray-500 leading-relaxed">Name the external entity and define its specific functional purpose in the UFO.</p>
              </div>

              <div className="bg-white border border-gray-200 p-4">
                <span className="text-[10px] font-mono font-bold text-gray-400 block mb-1">STEP 02</span>
                <h6 className="font-semibold text-xs mb-1">Assign House & Agent</h6>
                <p className="text-[11px] text-gray-500 leading-relaxed">Choose its home house department, responsible dinosaur agent, and daily cadence.</p>
              </div>

              <div className="bg-white border border-gray-200 p-4">
                <span className="text-[10px] font-mono font-bold text-gray-400 block mb-1">STEP 03</span>
                <h6 className="font-semibold text-xs mb-1">Choose Connection</h6>
                <p className="text-[11px] text-gray-500 leading-relaxed">Select API, connector (Composio), file exchange, or human manual handoff.</p>
              </div>

              <div className="bg-white border border-gray-200 p-4">
                <span className="text-[10px] font-mono font-bold text-gray-400 block mb-1">STEP 04</span>
                <h6 className="font-semibold text-xs mb-1">Define Receipts</h6>
                <p className="text-[11px] text-gray-500 leading-relaxed">Specify permitted inputs, expected output receipts, owner, and completion proof.</p>
              </div>

              <div className="bg-white border border-gray-200 p-4">
                <span className="text-[10px] font-mono font-bold text-gray-400 block mb-1">STEP 05</span>
                <h6 className="font-semibold text-xs mb-1">Verify Handoff</h6>
                <p className="text-[11px] text-gray-500 leading-relaxed">Verify one complete end-to-end handoff cycle before marking the satellite connected.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 font-mono">
              <span>OpenCase AI: in use with manual handoff · Spring Code: placeholder</span>
              <button 
                onClick={() => {
                  const name = prompt("Name the satellite to connect:");
                  if (name) {
                    (window as any).dispatchAddSatellite?.({
                      id: `sat-${Date.now()}`,
                      type: 'satellite',
                      name,
                      description: 'Satellite registered via protocol guide.',
                      status: 'Registered — handoff pending',
                      connectionMethod: 'Protocol 5-step handoff'
                    });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Connect New Satellite</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
