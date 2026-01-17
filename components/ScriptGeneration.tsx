
import React, { useEffect, useState } from 'react';
import { ScriptData } from '../types';
import { generateScript } from '../services/geminiService';

interface ScriptGenerationProps {
  niche: string;
  script: ScriptData | null;
  onUpdateScript: (script: ScriptData) => void;
  onNext: () => void;
  onBack: () => void;
}

const ScriptGeneration: React.FC<ScriptGenerationProps> = ({ niche, script, onUpdateScript, onNext, onBack }) => {
  const [loading, setLoading] = useState(!script);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const newScript = await generateScript(niche);
      onUpdateScript(newScript);
    } catch (err) {
      setError("Failed to generate script. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!script) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-medium animate-pulse">Our AI is writing your viral script for <span className="text-red-500">{niche}</span>...</p>
        <p className="text-slate-500">Optimizing for engagement and reach...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your AI-Generated Script</h2>
          <p className="text-slate-400">Review and edit your niche content.</p>
        </div>
        <button 
          onClick={handleGenerate}
          className="p-3 glass rounded-xl hover:bg-slate-800 text-sm flex items-center gap-2"
        >
          <i className="fa-solid fa-rotate"></i> Regenerate
        </button>
      </div>

      {error && <div className="p-4 bg-red-900/30 border border-red-500 text-red-200 rounded-xl">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Hook */}
          <div className="glass p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-xs tracking-wider">
              <i className="fa-solid fa-anchor"></i> The Hook (First 3 Seconds)
            </div>
            <textarea 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
              rows={2}
              value={script?.hook}
              onChange={(e) => onUpdateScript({ ...script!, hook: e.target.value })}
            />
          </div>

          {/* Main Body */}
          <div className="glass p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-xs tracking-wider">
              <i className="fa-solid fa-align-left"></i> Main Content
            </div>
            <textarea 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={6}
              value={script?.mainContent}
              onChange={(e) => onUpdateScript({ ...script!, mainContent: e.target.value })}
            />
          </div>

          {/* Ending */}
          <div className="glass p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-green-400 font-bold uppercase text-xs tracking-wider">
              <i className="fa-solid fa-flag-checkered"></i> Ending / CTA
            </div>
            <textarea 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-green-500"
              rows={2}
              value={script?.ending}
              onChange={(e) => onUpdateScript({ ...script!, ending: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-tags text-red-500"></i> SEO Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {script?.keywords.map((kw, i) => (
                <span key={i} className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs text-slate-400">
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-red-950/20 border border-red-500/20 p-6 rounded-2xl text-sm text-slate-400 leading-relaxed">
            <i className="fa-solid fa-circle-info text-red-500 mb-2 block"></i>
            This script is optimized for the YouTube Shorts algorithm. Aim for 30-50 seconds total reading time.
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 sticky bottom-0 bg-slate-950/80 backdrop-blur-md py-4 z-10">
        <button onClick={onBack} className="px-6 py-3 font-semibold text-slate-400 hover:text-white transition-colors">
          <i className="fa-solid fa-chevron-left mr-2"></i> Back
        </button>
        <button 
          onClick={onNext}
          className="bg-red-600 hover:bg-red-500 px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-900/20"
        >
          Next: Generate Images <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ScriptGeneration;
