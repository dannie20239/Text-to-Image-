import React, { useState } from 'react';
import { AspectRatio } from '../types';
import { ASPECT_RATIOS, SAMPLE_PROMPTS } from '../constants';
import { enhancePrompt } from '../services/geminiService';
import { SparklesIcon, SquareIcon, LandscapeIcon, PortraitIcon, Portrait23Icon, TallIcon, ChevronRightIcon, MagicWandIcon } from './Icons';

interface PromptInputProps {
  onGenerate: (prompt: string, aspectRatio: AspectRatio) => void;
  isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('1:1');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim(), selectedRatio);
    }
  };

  const handleEnhance = async () => {
    if (!prompt.trim() || isEnhancing || isGenerating) return;
    
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt.trim());
      setPrompt(enhanced);
    } catch (error) {
      console.error("Failed to enhance prompt", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSampleClick = (sample: string) => {
    setPrompt(sample);
  };

  const getRatioIcon = (ratio: AspectRatio) => {
    switch (ratio) {
      case '16:9': return <LandscapeIcon className="w-5 h-5" />;
      case '9:16': return <PortraitIcon className="w-5 h-5" />;
      case '2:3': return <Portrait23Icon className="w-5 h-5" />;
      case '1:2': return <TallIcon className="w-5 h-5" />;
      default: return <SquareIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-4 relative z-10">
      <form onSubmit={handleSubmit} className="relative group">
        
        {/* Main Input Container */}
        <div className={`
          relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 
          rounded-2xl shadow-xl transition-all duration-300
          ${isExpanded ? 'p-6 ring-2 ring-brand-500/50' : 'p-2 pl-4 flex items-center'}
        `}>
          
          {/* Expanded View: Label */}
          {isExpanded && (
            <label className="block text-xs font-semibold text-brand-300 uppercase tracking-wider mb-3">
              Imagine Something
            </label>
          )}

          {/* Text Area / Input */}
          <div className="flex-grow">
            {isExpanded ? (
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                className="w-full bg-transparent text-white placeholder-slate-400 border-none focus:ring-0 resize-none h-24 text-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            ) : (
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder="Describe what you want to see..."
                className="w-full bg-transparent text-white placeholder-slate-400 border-none focus:ring-0 text-lg h-12"
              />
            )}
          </div>

          {/* Expanded View: Settings & Actions */}
          {isExpanded && (
            <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-700/50 pt-4">
              
              {/* Aspect Ratio Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap mr-2">Aspect Ratio:</span>
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    type="button"
                    onClick={() => setSelectedRatio(ratio.value)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                      ${selectedRatio === ratio.value 
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
                    `}
                    title={ratio.label}
                  >
                    {getRatioIcon(ratio.value)}
                    <span>{ratio.value}</span>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 justify-end flex-wrap">
                
                {/* Magic Enhance Button */}
                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={!prompt.trim() || isEnhancing || isGenerating}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${!prompt.trim() ? 'text-slate-600 cursor-not-allowed' : 'text-indigo-300 hover:text-white hover:bg-white/10'}
                  `}
                  title="Optimize prompt for Pinterest trends and high quality"
                >
                  {isEnhancing ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MagicWandIcon className="w-4 h-4" />
                  )}
                  Pinterest Enhance
                </button>

                <div className="h-6 w-px bg-slate-700 mx-1"></div>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="text-slate-400 hover:text-white text-sm font-medium px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!prompt.trim() || isGenerating}
                  className={`
                    flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-white transition-all
                    ${!prompt.trim() || isGenerating 
                      ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                      : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/25 transform hover:scale-105 active:scale-95'}
                  `}
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <SparklesIcon className="w-5 h-5" />
                  )}
                  Generate
                </button>
              </div>
            </div>
          )}

          {/* Collapsed View: Generate Button */}
          {!isExpanded && (
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className={`
                ml-2 p-2 rounded-xl transition-all
                ${!prompt.trim() ? 'text-slate-500' : 'text-brand-400 hover:text-brand-300 hover:bg-brand-500/10'}
              `}
            >
              <ChevronRightIcon className="w-8 h-8" />
            </button>
          )}
        </div>

        {/* Quick Prompts (only in expanded mode) */}
        {isExpanded && !prompt && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
             <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Try a sample prompt:</p>
             <div className="flex flex-wrap gap-2">
               {SAMPLE_PROMPTS.map((sample, i) => (
                 <button
                   key={i}
                   type="button"
                   onClick={() => handleSampleClick(sample)}
                   className="text-left text-xs bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 py-1.5 px-3 rounded-full transition-colors truncate max-w-[200px]"
                 >
                   {sample}
                 </button>
               ))}
             </div>
          </div>
        )}
      </form>
    </div>
  );
};