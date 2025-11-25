import React from 'react';
import { GeneratedImage } from '../types';
import { TrashIcon } from './Icons';

interface HistoryGalleryProps {
  history: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  onClear: () => void;
  selectedId?: string;
}

export const HistoryGallery: React.FC<HistoryGalleryProps> = ({ 
  history, 
  onSelect, 
  onClear,
  selectedId 
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-12 mb-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-semibold text-white/90">Your Creations</h2>
        <button 
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
          Clear History
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {history.map((img) => (
          <div 
            key={img.id}
            onClick={() => onSelect(img)}
            className={`
              relative group cursor-pointer rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200
              ${selectedId === img.id ? 'border-brand-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'border-transparent hover:border-white/20'}
            `}
          >
            <img 
              src={img.base64Url} 
              alt={img.prompt} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <p className="text-xs text-white line-clamp-2">{img.prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};