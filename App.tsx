import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PromptInput } from './components/PromptInput';
import { ImagePreview } from './components/ImagePreview';
import { HistoryGallery } from './components/HistoryGallery';
import { generateImage } from './services/geminiService';
import { GeneratedImage, AspectRatio } from './types';
import { APP_NAME } from './constants';
import { SparklesIcon } from './components/Icons';

function App() {
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from session storage on mount
  useEffect(() => {
    try {
      const savedHistory = sessionStorage.getItem('gemini_image_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Save history to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem('gemini_image_history', JSON.stringify(history));
    } catch (e) {
      console.warn("Session storage quota might be exceeded");
    }
  }, [history]);

  const handleGenerate = async (prompt: string, aspectRatio: AspectRatio) => {
    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);

    try {
      const base64Url = await generateImage(prompt, aspectRatio);
      
      const newImage: GeneratedImage = {
        id: uuidv4(),
        prompt,
        base64Url,
        timestamp: Date.now(),
        aspectRatio,
      };

      setCurrentImage(newImage);
      setHistory((prev) => [newImage, ...prev]);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectFromHistory = (image: GeneratedImage) => {
    setCurrentImage(image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your generation history?')) {
      setHistory([]);
      setCurrentImage(null);
      sessionStorage.removeItem('gemini_image_history');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-brand-500/30">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-900/20 blur-[120px]"></div>
         <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
         <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-purple-900/10 blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full py-6 px-4 md:px-8 border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-brand-600 to-indigo-500 p-2 rounded-lg shadow-lg shadow-brand-500/20">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {APP_NAME}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-medium text-slate-500 uppercase tracking-widest hidden sm:block">Powered by Gemini 2.5</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col">
        
        {/* Error Toast */}
        {error && (
          <div className="w-full max-w-lg mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Input Area */}
        <div className="mb-8">
          <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>

        {/* Preview Area */}
        <div className="flex-grow flex flex-col items-center justify-start min-h-[400px]">
          <ImagePreview image={currentImage} isGenerating={isGenerating} />
        </div>

        {/* History Area */}
        <HistoryGallery 
          history={history} 
          onSelect={handleSelectFromHistory} 
          onClear={handleClearHistory}
          selectedId={currentImage?.id}
        />

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-slate-600 text-sm border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. Generated images are subject to Gemini's usage policies.</p>
      </footer>
    </div>
  );
}

export default App;