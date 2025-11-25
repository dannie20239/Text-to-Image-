import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon, SparklesIcon } from './Icons';

interface ImagePreviewProps {
  image: GeneratedImage | null;
  isGenerating: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ image, isGenerating }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset loaded state when image changes
  React.useEffect(() => {
    if (image) setIsLoaded(false);
  }, [image]);

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image.base64Url;
    link.download = `gemini-imagine-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[400px] flex flex-col items-center justify-center">
      
      {/* Loading State */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-pulse">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-t-4 border-brand-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-4 border-purple-400 rounded-full animate-spin animation-delay-150"></div>
            <div className="absolute inset-4 border-b-4 border-indigo-400 rounded-full animate-spin animation-delay-300"></div>
          </div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-indigo-300 mb-2">
            Dreaming...
          </h3>
          <p className="text-slate-400">Gemini is crafting your masterpiece.</p>
        </div>
      )}

      {/* Empty State */}
      {!image && !isGenerating && (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-700 rounded-3xl w-full h-[400px] bg-slate-800/30">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600">
            <SparklesIcon className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-medium text-slate-300 mb-2">Ready to Create</h3>
          <p className="text-slate-500 max-w-md">
            Enter a detailed prompt below and select an aspect ratio to start generating amazing images with Gemini.
          </p>
        </div>
      )}

      {/* Image Display */}
      {image && !isGenerating && (
        <div className="relative group w-full flex flex-col items-center animate-in fade-in duration-700 slide-in-from-bottom-4">
          <div className={`
            relative rounded-lg overflow-hidden shadow-2xl bg-black
            ${!isLoaded ? 'min-h-[300px] w-full flex items-center justify-center' : ''}
          `}>
             <img 
              src={image.base64Url} 
              alt={image.prompt}
              onLoad={() => setIsLoaded(true)}
              className="max-h-[70vh] w-auto object-contain rounded-lg shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)]"
            />
            
            {/* Overlay Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={handleDownload}
                className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2 rounded-full border border-white/10 transition-all hover:scale-105 active:scale-95"
                title="Download Image"
              >
                <DownloadIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center max-w-2xl">
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest font-semibold">Prompt</p>
            <p className="text-white text-lg font-light leading-relaxed italic">"{image.prompt}"</p>
          </div>
        </div>
      )}
    </div>
  );
};