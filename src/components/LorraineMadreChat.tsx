import React, { useState, useId } from 'react';
import { ArrowRight } from 'lucide-react';
import { askLorraine } from '../geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  context?: string;
}

export default function LorraineMadreChat({ context }: Props) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await askLorraine(query, context);
      setResponse(res || 'No response arrived. Please try again.');
      setIsOpen(true);
    } catch (error) {
      console.error(error);
      setResponse("I couldn’t connect just now. Your wish is still here—please try again.");
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="rounded-[32px] border border-black/10 bg-[#f5f5f3] p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center text-sm text-neutral-500 px-1 mb-5">
          <span className="font-belleza text-xl">Lorraen Madre</span>
          <span role="status" className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-black" />{isLoading ? 'thinking' : 'ready when you are'}</span>
        </div>
        <form onSubmit={handleAsk} className="rounded-[24px] border border-black/15 bg-white p-5 sm:p-7">
          <label htmlFor={inputId} className="block text-xl font-semibold mb-5">What is your wish today?</label>
          <textarea id={inputId} value={query} onChange={e => setQuery(e.target.value)} placeholder="Turn a dream into a real plan..." rows={5} className="w-full resize-y min-h-40 text-xl placeholder:text-neutral-400 focus:outline-none" />
          <div className="border-t border-black/10 pt-5 mt-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-neutral-500 max-w-72">Start messy. We can make sense of it together.</p>
            <button type="submit" disabled={isLoading || !query.trim()} className="flex items-center gap-3 rounded-full bg-black text-white px-6 py-3 disabled:bg-neutral-400 disabled:cursor-not-allowed">{isLoading ? 'Thinking...' : 'Begin'}<ArrowRight className="w-5 h-5" /></button>
          </div>
        </form>
        <button type="button" onClick={() => { setQuery('I have a dream that needs a real plan.'); document.getElementById(inputId)?.focus(); }} className="mt-4 rounded-2xl bg-black/5 px-5 py-4 text-left w-full text-neutral-700 hover:bg-black/10">a dream that needs a real plan</button>
      </div>

      <AnimatePresence>
        {isOpen && response && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="status" aria-live="polite" className="mt-4 p-6 bg-white border border-black rounded-2xl shadow-xl relative"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-xs uppercase tracking-widest hover:underline"
            >
              Close
            </button>
            <div className="prose prose-sm max-w-none font-medium text-black leading-relaxed">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-[10px] uppercase tracking-widest bg-black text-white px-2 py-0.5">LORRAEN MADRE</span>
              </div>
              <p className="font-spectral text-xl leading-snug">{response}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
