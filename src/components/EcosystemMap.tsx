import React from 'react';
import { Entity } from '../types';
import { motion } from 'motion/react';
import { 
  Shield, 
  ChevronRight, 
  ArrowUpRight, 
  Compass, 
  Target, 
  Globe, 
  Zap, 
  Package, 
  Cloud, 
  Eye, 
  Users, 
  Boxes,
  Briefcase,
  Crown,
  Orbit,
  Satellite as SatelliteIcon,
  Plus,
  ShieldCheck,
  Anchor,
  Heart,
  Sun,
  Moon,
  Cpu,
  Library,
  Layers,
  Coins,
  Film,
  AppWindow,
  Bot
} from 'lucide-react';

interface Props {
  entities: Entity[];
  onSelect: (id: string) => void;
}

export default function EcosystemMap({ entities, onSelect }: Props) {
  const trust = entities.find(e => e.type === 'trust');
  const church = entities.find(e => e.type === 'church');
  const holding = entities.find(e => e.type === 'holding_company');
  const northNode = entities.find(e => e.type === 'north_node');
  const southNode = entities.find(e => e.type === 'south_node');
  const planets = entities.filter(e => e.type === 'planet');
  const dinosaurs = entities.filter(e => e.type === 'dinosaur');
  const satellites = entities.filter(e => e.type === 'satellite');

  const getSystemConfig = (entity: Entity) => {
    const configs: Record<string, { tag: string; icon: React.ReactNode }> = {
      'trust': { tag: 'The Trust', icon: <ShieldCheck className="w-3 h-3" /> },
      'church': { tag: 'The Church', icon: <Crown className="w-3 h-3" /> },
      'holding': { tag: 'Holding Company', icon: <Orbit className="w-3 h-3" /> },
      'north-node': { tag: 'Retirement Plan', icon: <Anchor className="w-3 h-3" /> },
      'south-node': { tag: 'Nonprofit Foundation', icon: <Heart className="w-3 h-3" /> },
      'sun': { tag: 'Brand Identity', icon: <Sun className="w-3 h-3" /> },
      'moon': { tag: 'Story Production', icon: <Moon className="w-3 h-3" /> },
      'mars': { tag: 'Business Activation', icon: <Zap className="w-3 h-3" /> },
      'mercury': { tag: 'Marketing Technology', icon: <Cpu className="w-3 h-3" /> },
      'venus': { tag: 'Content Library', icon: <Library className="w-3 h-3" /> },
      'saturn': { tag: 'Digital Organization Architecture', icon: <Layers className="w-3 h-3" /> },
      'jupiter': { tag: 'Capital Container', icon: <Coins className="w-3 h-3" /> },
      'neptune': { tag: 'The Movie', icon: <Film className="w-3 h-3" /> },
      'uranus': { tag: 'SAS Membership', icon: <AppWindow className="w-3 h-3" /> },
      'pluto': { tag: 'AI Agency', icon: <Bot className="w-3 h-3" /> },
    };

    const config = configs[entity.id] || { tag: entity.type.replace('_', ' '), icon: null };
    
    // Fallback based on type if not in direct id mapping
    if (!configs[entity.id]) {
      if (entity.type === 'offering') config.icon = <Briefcase className="w-3 h-3" />;
      if (entity.type === 'satellite') config.icon = <SatelliteIcon className="w-3 h-3" />;
      if (entity.type === 'dinosaur') config.icon = <Bot className="w-3 h-3" />;
    }

    return config;
  };

  const calculateProgress = (entity: Entity) => {
    let score = 0;
    let max = 5;

    if (entity.intentions) score++;
    if (entity.manifestations) score++;
    if (entity.leanValueCanvas) score++;
    if (entity.executiveSummary) score++;
    
    // Type specific
    if (entity.type === 'trust' && entity.vaultDocuments?.length) score++;
    else if (entity.type === 'church' && entity.councilMembers?.some(m => m !== '')) score++;
    else if ((entity.type === 'north_node' || entity.type === 'south_node') && entity.fundingStrategies?.length) score++;
    else if (entity.type === 'planet' && entity.storyCardVideo) score++;
    else if (entity.type === 'offering' && entity.customerAcquisitionCost) score++;
    else if (entity.type === 'dinosaur') score++; // AI status
    else score++; // Default filler for completion

    return (score / max) * 100;
  };

  const ProgressBar = ({ progress, color }: { progress: number, color?: string }) => (
    <div className={`w-full h-[2px] mt-4 overflow-hidden ${color === 'black' ? 'bg-gray-200' : 'bg-gray-100'}`}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={`h-full transition-colors duration-500 ${
          color === 'red' ? 'bg-red-500' :
          color === 'yellow' ? 'bg-yellow-400' :
          color === 'green' ? 'bg-emerald-500' :
          color === 'black' ? 'bg-black' :
          'bg-black'
        }`}
      />
    </div>
  );

  const EntityBox = ({ entity, className = "" }: { entity: Entity | undefined, className?: string, key?: string }) => {
    if (!entity) return null;
    const config = getSystemConfig(entity);
    const progress = calculateProgress(entity);
    
    return (
      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: '#f9f9f9' }}
        onClick={() => onSelect(entity.id)}
        className={`p-4 border border-black hover:border-gray-400 transition-all text-left flex flex-col justify-between group relative overflow-hidden ${className}`}
      >
        <div className="z-10 relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-black/40">{config.icon}</span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                {config.tag}
              </span>
            </div>
            <ArrowUpRight className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          <div className="flex items-center gap-3">
            {entity.logoUrl ? (
              <img src={entity.logoUrl} className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
            ) : null}
            <div>
              <h3 className="text-xl font-spectral font-medium leading-tight">{entity.name}</h3>
              {entity.symbol && <p className="text-[10px] italic text-gray-400 font-montserrat">{entity.symbol}</p>}
            </div>
          </div>
        </div>
        <ProgressBar progress={progress} />
      </motion.button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Top Governance */}
      <div className="flex flex-col items-center space-y-4">
        <EntityBox entity={trust} className="w-64 text-center" />
        <div className="w-px h-8 bg-black opacity-20" />
        <EntityBox entity={church} className="w-64 text-center" />
        <div className="w-px h-8 bg-black opacity-20" />
        <EntityBox entity={holding} className="w-64 text-center" />
      </div>

      {/* Nodes and Planets */}
      <div className="grid grid-cols-12 gap-8">
        {/* South Node (Left) */}
        <div className="col-span-2 flex flex-col justify-center">
          <EntityBox entity={southNode} className="h-48 border-dashed" />
          <div className="mt-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black">Mission</p>
          </div>
        </div>

        {/* Planets (Center) */}
        <div className="col-span-8 grid grid-cols-3 gap-4">
          {planets.map(planet => (
            <EntityBox key={planet.id} entity={planet} className="h-40" />
          ))}
        </div>

        {/* North Node (Right) */}
        <div className="col-span-2 flex flex-col justify-center">
          <EntityBox entity={northNode} className="h-48 border-dashed" />
          <div className="mt-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black">Vision</p>
          </div>
        </div>
      </div>

      {/* Dinosaurs / Technical Domains */}
      <div className="pt-12 border-t border-gray-100">
        <h4 className="text-sm uppercase tracking-[0.3em] font-bold mb-8 text-center text-gray-400">Domains (Technical Identities)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dinosaurs.map(dino => (
            <motion.button
              key={dino.id}
              whileHover={{ x: 2 }}
              onClick={() => onSelect(dino.id)}
              className="p-3 border border-gray-200 text-left hover:border-black transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold bg-black text-white px-1.5 py-0.5">{dino.zodiacSign}</span>
                  <span className="text-[9px] text-gray-400">{dino.house}</span>
                </div>
                <h5 className="font-spectral font-medium">{dino.name}</h5>
              </div>
              <ProgressBar progress={calculateProgress(dino)} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Offerings (Business Seeds) */}
      <div className="pt-12 border-t border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <h4 className="text-sm uppercase tracking-[0.3em] font-bold text-gray-400">Offerings (Seeds)</h4>
          <p className="text-[10px] uppercase text-gray-400 tracking-widest mt-2">Transactional units growing inside planetary buckets</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {entities.filter(e => e.type === 'offering').map(offering => {
            const progress = calculateProgress(offering);
            const isArchived = offering.isArchived;
            
            // Determine color based on progress and archived state
            let barColor = 'black';
            if (!isArchived) {
              if (progress < 40) barColor = 'red';
              else if (progress < 75) barColor = 'yellow';
              else barColor = 'green';
            }

            return (
              <div key={offering.id} className="relative group/offering">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onSelect(offering.id)}
                  className={`flex flex-col min-w-[160px] border transition-all overflow-hidden ${
                    isArchived 
                    ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60' 
                    : 'bg-white border-black hover:shadow-lg'
                  }`}
                >
                  <div className="px-6 py-4 flex flex-col items-center text-center">
                    <Briefcase className={`w-4 h-4 mb-2 ${isArchived ? 'text-gray-300' : 'text-black'}`} />
                    <span className={`font-spectral text-sm transition-all ${isArchived ? '' : 'font-medium'}`}>{offering.name}</span>
                    <div className="w-full mt-2">
                       <ProgressBar progress={progress} color={barColor} />
                    </div>
                  </div>
                </motion.button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    (window as any).dispatchUpdateEntity?.({
                      ...offering,
                      isArchived: !offering.isArchived
                    });
                  }}
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover/offering:opacity-100 transition-all z-20 border ${
                    isArchived 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-400 border-gray-200 hover:text-black hover:border-black'
                  }`}
                  title={isArchived ? "Restore Offering" : "Archive Offering"}
                >
                  <span className="text-[10px] uppercase font-bold">{isArchived ? 'R' : 'A'}</span>
                </button>
              </div>
            );
          })}

          <button 
            onClick={() => {
              const name = prompt("Name your new offering:");
              if (name) {
                const newId = `off-${Date.now()}`;
                (window as any).dispatchAddOffering?.({
                  id: newId,
                  type: 'offering',
                  name,
                  description: 'A new transactional seed in your ecosystem.'
                });
              }
            }}
            className="flex flex-col items-center justify-center px-8 border border-dashed border-gray-200 hover:border-black transition-all group opacity-50 hover:opacity-100 min-w-[160px] cursor-pointer"
          >
            <Plus className="w-4 h-4 mb-2 group-hover:rotate-90 transition-transform" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Add Offering</span>
          </button>
        </div>
      </div>

      {/* Satellites */}
      <div className="pt-12 border-t border-gray-100">
        <div className="flex flex-col items-center mb-12">
          <h4 className="text-sm uppercase tracking-[0.3em] font-bold text-gray-400 mb-2">Satellites (Radar & Coordination)</h4>
          <p className="text-[10px] uppercase text-gray-400 tracking-widest max-w-md text-center opacity-60">
            External programs, products, or agencies keeping radar on the UFO.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {satellites.map(sat => (
            <motion.button
              key={sat.id}
              whileHover={{ y: -4, borderColor: '#000' }}
              onClick={() => onSelect(sat.id)}
              className="p-6 border border-gray-100 bg-white shadow-sm flex flex-col justify-between group text-left"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                  <SatelliteIcon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                {sat.logoUrl && <img src={sat.logoUrl} className="w-12 h-12 object-contain mb-4" referrerPolicy="no-referrer" />}
                <h5 className="font-spectral text-lg font-medium leading-tight">{sat.name}</h5>
                <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-2">Active Satellite</p>
              </div>
              <ProgressBar progress={calculateProgress(sat)} />
            </motion.button>
          ))}
          
          <button 
            onClick={() => {
              const name = prompt("Name your satellite (e.g. 'Nutrition Program', 'Legal Counsel'):");
              if (name) {
                const newId = `sat-${Date.now()}`;
                // This would normally be handled by onUpdate or a global state, 
                // but since we are modifying initial state in real-time for UI demo:
                // I'll add logic in App.tsx to handle this addition.
                (window as any).dispatchAddSatellite?.({
                  id: newId,
                  type: 'satellite',
                  name,
                  description: 'A newly integrated coordinate in your UFO radar.'
                });
              }
            }}
            className="p-6 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 hover:border-black transition-all group opacity-50 hover:opacity-100"
          >
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Add Satellite</span>
          </button>
        </div>
      </div>
    </div>
  );
}
