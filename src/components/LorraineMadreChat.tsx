import React, { useState } from 'react';
import { Search, Sparkles, MessageCircle, Send } from 'lucide-react';
import { askLorraine } from '../geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  context?: string;
}

export default function LorraineMadreChat({ context }: Props) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await askLorraine(query, context);
      setResponse(res);
      setIsOpen(true);
    } catch (error) {
      console.error(error);
      setResponse("I'm sorry, I couldn't reach the inner logic of the office right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={handleAsk} className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Sparkles className="w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
        </div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="what is the story"
          className="w-full bg-white border border-gray-200 py-4 pl-12 pr-12 rounded-none focus:outline-none focus:border-black transition-all font-spectral italic text-lg shadow-sm hover:shadow-md"
        />
        <button 
          type="submit"
          className="absolute inset-y-0 right-4 flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
          ) : (
            <Send className="w-4 h-4 hover:text-gray-600 cursor-pointer" />
          )}
        </button>
      </form>

      <AnimatePresence>
        {isOpen && response && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-6 bg-white border border-black shadow-xl relative"
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
