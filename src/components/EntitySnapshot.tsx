import React, { useState } from 'react';
import { Entity } from '../types';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  Target, 
  TrendingUp, 
  Users, 
  Layers, 
  Zap,
  Save,
  Lock,
  Plus,
  BookOpen,
  Dices,
  UserPlus,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { generateLVC, generateSummary } from '../geminiService';
import LorraineMadreChat from './LorraineMadreChat';

interface Props {
  entity: Entity;
  onBack: () => void;
  onUpdate: (updatedEntity: Entity) => void;
}

export default function EntitySnapshot({ entity, onBack, onUpdate }: Props) {
  const [isGeneratingLVC, setIsGeneratingLVC] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [intentions, setIntentions] = useState(entity.intentions || '');
  const [manifestations, setManifestations] = useState(entity.manifestations || '');
  const [council, setCouncil] = useState<string[]>(entity.councilMembers || Array(12).fill(''));
  const [vaultDocs, setVaultDocs] = useState<string[]>(entity.vaultDocuments || []);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...entity, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportToGoogleDoc = async (type: 'LVC' | 'Summary') => {
    setIsExporting(type);
    try {
      const content = type === 'LVC' ? entity.leanValueCanvas : entity.executiveSummary;
      const title = `${entity.name} - ${type}`;
      const sectionKey = entity.id; // Using entity ID as section key for manifest mapping

      const res = await fetch('/api/google/generate-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sectionKey, 
          title, 
          content: JSON.stringify(JSON.parse(content || '{}'), null, 2) 
        })
      });
      
      const data = await res.json();
      if (data.success) {
        window.open(`https://docs.google.com/document/d/${data.docId}/edit`, '_blank');
      } else {
        alert(data.error || 'Failed to export to Google Docs');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to connect to the orbital vault service.');
    } finally {
      setIsExporting(null);
    }
  };

  const handleGenerateLVC = async () => {
    setIsGeneratingLVC(true);
    try {
      const lvc = await generateLVC(entity.name, entity.description, entity.type);
      onUpdate({ ...entity, leanValueCanvas: JSON.stringify(lvc, null, 2) });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingLVC(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await generateSummary(entity.name, entity.description);
      onUpdate({ ...entity, executiveSummary: JSON.stringify(summary, null, 2) });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const saveClaims = () => {
    onUpdate({ 
      ...entity, 
      intentions, 
      manifestations, 
      councilMembers: council,
      vaultDocuments: vaultDocs 
    });
    alert("Updated and Saved.");
  };

  const renderLVC = () => {
    if (!entity.leanValueCanvas) return (
      <div className="p-12 text-center border border-dashed border-gray-200">
        <Sparkles className="w-8 h-8 mx-auto mb-4 text-gray-300" />
        <p className="font-spectral text-gray-500 mb-4 italic">The canvas is blank. Let AI architect the value.</p>
        <button 
          onClick={handleGenerateLVC}
          disabled={isGeneratingLVC}
          className="px-6 py-2 bg-black text-white text-[10px] uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isGeneratingLVC ? 'Architecting...' : 'Generate Lean Value Canvas'}
        </button>
      </div>
    );

    const lvc = JSON.parse(entity.leanValueCanvas);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black border border-black shadow-lg">
        {Object.entries(lvc).map(([key, value]) => (
          <div key={key} className="bg-white p-6 min-h-[160px]">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">{key.replace(/([A-Z])/g, ' $1')}</h4>
            <p className="text-sm leading-relaxed">{value as string}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderSummary = () => {
    const title = entity.summaryTitleOverride || 'Executive Summary';
    if (!entity.executiveSummary) return (
      <div className="p-12 text-center border border-dashed border-gray-100">
        <FileText className="w-8 h-8 mx-auto mb-4 text-gray-300" />
        <button 
          onClick={handleGenerateSummary}
          disabled={isGeneratingSummary}
          className="px-6 py-2 border border-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-50"
        >
          {isGeneratingSummary ? 'Integrating...' : `Generate ${title}`}
        </button>
      </div>
    );

    const summary = JSON.parse(entity.executiveSummary);
    return (
      <div className="space-y-8 max-w-2xl mx-auto py-8">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{key}</h4>
            <p className="font-spectral text-2xl leading-relaxed text-gray-800">{value as string}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:underline text-gray-400 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </button>
          <div className="text-center">
            <h2 className="text-xl font-spectral font-medium uppercase tracking-[0.2em]">{entity.name}</h2>
            <p className="text-[9px] uppercase tracking-widest text-gray-400">
              {entity.type === 'dinosaur' ? 'Technical Domain' : entity.type.replace('_', ' ')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer group flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
              <Upload className="w-3 h-3 group-hover:scale-110 transition-transform" />
              <span>Logo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </label>
            {entity.logoUrl && (
              <div className="w-8 h-8 border border-gray-100 p-1">
                <img src={entity.logoUrl} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
            )}
          </div>
        </div>
        <LorraineMadreChat context={`Entity being viewed: ${entity.name} (${entity.type}). Description: ${entity.description}. You are LORRAINE MADRE.`} />
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-24">
        {/* Special Section: Trust Vault */}
        {entity.type === 'trust' && (
          <section className="space-y-8 p-12 border-2 border-black bg-gray-50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Lock className="w-8 h-8" />
                <h3 className="text-4xl font-spectral">The Trust Vault</h3>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Secure Documentation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <button className="flex flex-col items-center justify-center p-6 border border-black hover:bg-black hover:text-white transition-all group">
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Add New</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 border border-black hover:bg-black hover:text-white transition-all">
                <FileText className="w-6 h-6 mb-2" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Document Create</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 border border-black hover:bg-black hover:text-white transition-all">
                <BookOpen className="w-6 h-6 mb-2" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Browse Templates</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 border border-black hover:bg-black hover:text-white transition-all">
                <Dices className="w-6 h-6 mb-2" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Try Toys</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Current Holdings</h4>
              <div className="p-12 text-center border border-dashed border-gray-200">
                <p className="font-spectral italic text-gray-400">No documents in the vault yet.</p>
              </div>
            </div>
          </section>
        )}

        {/* Special Section: Church Council */}
        {entity.type === 'church' && (
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-spectral">Micro-Church Council</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Identification of the 12</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {council.map((member, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-gray-300">Slot {i + 1}</label>
                  <div className="relative group">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-200 group-focus-within:text-black" />
                    <input 
                      type="text"
                      value={member}
                      onChange={(e) => {
                        const newCouncil = [...council];
                        newCouncil[i] = e.target.value;
                        setCouncil(newCouncil);
                      }}
                      placeholder="Identify member..."
                      className="w-full bg-white border border-gray-100 p-3 pl-8 text-sm focus:outline-none focus:border-black font-spectral italic"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ontology Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 border-b border-gray-100">
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Nature</h4>
            <p className="font-spectral text-lg italic leading-snug">{entity.highLevelNature || "A fundamental force in the garden."}</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Astrology</h4>
            <p className="font-spectral text-lg italic leading-snug">{entity.highLevelAstrology || "The planetary alignment of this office."}</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-300">System</h4>
            <p className="font-spectral text-lg italic leading-snug">{entity.highLevelSystem || "The functional branch of the logic."}</p>
          </div>
        </div>

        {/* Name and Claim */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-spectral mb-4 italic">Name & Claim: Intentions</h3>
            <textarea 
              value={intentions}
              onChange={(e) => setIntentions(e.target.value)}
              placeholder="What do you claim for this space?"
              className="w-full h-40 p-4 font-spectral text-xl border border-gray-100 focus:border-black focus:outline-none transition-all resize-none"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-spectral mb-4 italic">Manifestations</h3>
            <textarea 
              value={manifestations}
              onChange={(e) => setManifestations(e.target.value)}
              placeholder="How does it show up in the world?"
              className="w-full h-40 p-4 font-spectral text-xl border border-gray-100 focus:border-black focus:outline-none transition-all resize-none"
            />
          </div>
          <button 
            onClick={saveClaims}
            className="md:col-span-2 flex items-center justify-center gap-2 py-4 bg-black text-white text-[10px] uppercase tracking-widest hover:bg-gray-900 transition-colors"
          >
            <Save className="w-4 h-4" />
            Claim and Save
          </button>
        </section>

        {/* Story Card Video Placeholder */}
        {entity.type === 'planet' && (
          <section className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">The Story Card</h3>
            <div 
              className="relative w-full aspect-video bg-gray-100 border border-gray-200 overflow-hidden group cursor-pointer"
              onClick={() => alert("Playing Story Video...")}
            >
              <img 
                src={entity.storyCardVideo || "https://picsum.photos/seed/story/1920/1080"} 
                alt="Story Card Thumbnail"
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center bg-black/20 backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] uppercase tracking-widest text-white drop-shadow-md">Play Story Narrative</span>
                <span className="font-spectral italic text-white text-sm">Design Time, Space + Story</span>
              </div>
            </div>
          </section>
        )}

        {/* Specialized Sections */}
        {entity.type === 'offering' && (
          <section className="space-y-8 p-12 bg-gray-50 border border-gray-100">
            <h3 className="text-3xl font-spectral text-center">User Journey & Economics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border-r border-gray-200 last:border-0">
                <Users className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <h5 className="text-[10px] uppercase tracking-widest mb-1">Acquisition Cost</h5>
                <p className="font-spectral text-xl">{entity.customerAcquisitionCost || "$0 to obtain"}</p>
              </div>
              <div className="text-center p-6 border-r border-gray-200 last:border-0">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <h5 className="text-[10px] uppercase tracking-widest mb-1">Maintenance</h5>
                <p className="font-spectral text-xl">{entity.maintenanceCost || "$0 to hold"}</p>
              </div>
              <div className="text-center p-6">
                <Zap className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <h5 className="text-[10px] uppercase tracking-widest mb-1">Core Benefit</h5>
                <p className="font-spectral text-xl">{entity.benefit || "Pure activation"}</p>
              </div>
            </div>
          </section>
        )}

        {(entity.type === 'north_node' || entity.type === 'south_node') && (
          <section className="space-y-12">
            <div className="p-12 border-2 border-black text-center bg-gray-50">
               <h3 className="text-4xl font-spectral mb-6">{entity.type === 'north_node' ? 'Executive Vision: Retirement & Funding' : 'Executive Mission: Nonprofit & Sustainability'}</h3>
               <p className="font-spectral text-2xl italic leading-relaxed text-gray-800">{entity.strategy}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-gray-100 pb-2">Funding Strategies</h4>
                <ul className="space-y-4">
                  {(entity.fundingStrategies || []).map((s, i) => (
                    <li key={i} className="flex gap-4 group">
                      <span className="text-gray-300 font-mono text-xs mt-1">0{i+1}</span>
                      <p className="font-spectral text-xl leading-tight group-hover:italic transition-all">{s}</p>
                    </li>
                  ))}
                  {!entity.fundingStrategies?.length && <p className="font-spectral italic text-gray-400">Strategies pending architecture...</p>}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-gray-100 pb-2">Long-term Security Goals</h4>
                <ul className="space-y-4">
                  {(entity.securityGoals || []).map((g, i) => (
                    <li key={i} className="flex gap-4 group">
                      <span className="text-gray-300 font-mono text-xs mt-1">0{i+1}</span>
                      <p className="font-spectral text-xl leading-tight group-hover:italic transition-all">{g}</p>
                    </li>
                  ))}
                  {!entity.securityGoals?.length && <p className="font-spectral italic text-gray-400">Goals pending definition...</p>}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* AI Generated Artifacts */}
        <section className="space-y-12">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-4xl font-spectral">Lean Value Canvas</h3>
              <div className="flex items-center gap-4">
                {entity.leanValueCanvas && (
                  <button 
                    onClick={() => handleExportToGoogleDoc('LVC')}
                    disabled={!!isExporting}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold border border-black px-4 py-2 hover:bg-black hover:text-white transition-all disabled:opacity-50"
                  >
                    {isExporting === 'LVC' ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                    Export to Google Doc
                  </button>
                )}
                {entity.leanValueCanvas && (
                  <button 
                    onClick={handleGenerateLVC}
                    disabled={isGeneratingLVC}
                    className="text-[10px] uppercase tracking-widest underline opacity-50 hover:opacity-100"
                  >
                    Refresh Canvas
                  </button>
                )}
              </div>
            </div>
            {renderLVC()}
          </div>

          <div className="space-y-4 pt-12 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-4xl font-spectral">Executive Summary</h3>
              <div className="flex items-center gap-4">
                {entity.executiveSummary && (
                  <button 
                    onClick={() => handleExportToGoogleDoc('Summary')}
                    disabled={!!isExporting}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold border border-black px-4 py-2 hover:bg-black hover:text-white transition-all disabled:opacity-50"
                  >
                    {isExporting === 'Summary' ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                    Export to Google Doc
                  </button>
                )}
                {entity.executiveSummary && (
                  <button 
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="text-[10px] uppercase tracking-widest underline opacity-50 hover:opacity-100"
                  >
                    Refresh Summary
                  </button>
                )}
              </div>
            </div>
            {renderSummary()}
          </div>
        </section>
      </div>
    </div>
  );
}
