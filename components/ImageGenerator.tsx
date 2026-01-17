
import React, { useState } from 'react';
import { ScriptData, GeneratedImage } from '../types';
import { IMAGE_STYLES } from '../constants';
import { generateImage, generateScenePrompts } from '../services/geminiService';

interface ImageGeneratorProps {
  script: ScriptData | null;
  images: GeneratedImage[];
  onUpdateImages: (images: GeneratedImage[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ script, images, onUpdateImages, onNext, onBack }) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('Cinematic');
  const [generating, setGenerating] = useState(false);
  const [activePrompt, setActivePrompt] = useState(script?.hook || '');
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User specifically asked for 8-10 images.
  const duration = script?.estimatedDuration || 30;
  let recommendedCount = 9;
  if (duration < 20) recommendedCount = 8;
  if (duration > 45) recommendedCount = 10;
  
  const coveragePercent = Math.min(100, (images.length / recommendedCount) * 100);

  const handleGenerate = async () => {
    if (!activePrompt) return;
    setGenerating(true);
    setError(null);
    try {
      const url = await generateImage(activePrompt, selectedStyle);
      onUpdateImages([...images, { url, prompt: activePrompt }]);
    } catch (err: any) {
      console.error(err);
      setError("Image generation failed. This might be a temporary service issue. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleAutoGenerate = async () => {
    if (!script) return;
    setAutoGenerating(true);
    setError(null);
    try {
      const prompts = await generateScenePrompts(script);
      const newImages: GeneratedImage[] = [...images];
      
      for (const prompt of prompts) {
        try {
          const url = await generateImage(prompt, selectedStyle);
          newImages.push({ url, prompt });
          onUpdateImages([...newImages]);
        } catch (imgErr) {
          console.warn("Skipping one image due to failure:", imgErr);
        }
      }
      
      if (newImages.length === images.length) {
        throw new Error("All image generations failed.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Batch generation failed. The AI service is currently busy or unreachable. Please try individual generation or wait a moment.");
    } finally {
      setAutoGenerating(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onUpdateImages(newImages);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">AI Image Generator</h2>
          <p className="text-slate-400">Targeting 8-10 high-quality visual scenes (No text).</p>
        </div>
        
        <div className="glass p-4 rounded-2xl flex items-center gap-6 border-red-500/20">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Visual Density</div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${coveragePercent === 100 ? 'bg-green-500' : 'bg-red-500'}`} 
                  style={{ width: `${coveragePercent}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold">{images.length}/{recommendedCount}</span>
            </div>
          </div>
          <button
            onClick={handleAutoGenerate}
            disabled={autoGenerating || generating}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              autoGenerating ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-white/10'
            }`}
          >
            {autoGenerating ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
            Generate All ({recommendedCount})
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95">
          <i className="fa-solid fa-circle-exclamation text-red-500 mt-1"></i>
          <div>
            <div className="font-bold text-red-400">Service Interruption</div>
            <div className="text-sm text-red-200/70">{error}</div>
            <button onClick={() => setError(null)} className="mt-2 text-xs font-bold underline hover:text-red-300">Dismiss</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-6 rounded-2xl space-y-4 border-white/5">
            <h3 className="font-bold text-sm uppercase text-slate-500 tracking-wider">Image Style</h3>
            <div className="grid grid-cols-2 gap-2">
              {IMAGE_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedStyle === style 
                    ? 'bg-red-600 text-white border-red-500 shadow-md' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-2xl space-y-4 border-white/5">
            <h3 className="font-bold text-sm uppercase text-slate-500 tracking-wider">Manual Prompt</h3>
            <textarea
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 h-32 resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Describe a single scene (e.g., A busy futuristic city street)..."
              value={activePrompt}
              onChange={(e) => setActivePrompt(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={generating || autoGenerating || !activePrompt}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                generating || autoGenerating || !activePrompt 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:opacity-90 active:scale-95 shadow-lg shadow-red-900/20'
              }`}
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-image"></i>
                  Add Scene
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-slate-300">
              <i className="fa-solid fa-clapperboard text-red-500"></i>
              Storyboard Sequence
            </h3>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Scaling to {recommendedCount} total</span>
          </div>

          {images.length === 0 ? (
            <div className="border-2 border-dashed border-slate-800 rounded-3xl h-96 flex flex-col items-center justify-center p-12 text-center text-slate-600">
              <i className="fa-solid fa-film text-5xl mb-4 opacity-10"></i>
              <p className="max-w-xs text-sm">No scenes ready. Click "Generate All" to automatically build a 8-10 image sequence perfectly timed for your Short.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-[9/16] rounded-xl overflow-hidden glass border-white/5 animate-in zoom-in-95 duration-300">
                  <img src={img.url} alt={`Gen ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold">SCENE {idx + 1}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                    <button 
                      onClick={() => removeImage(idx)}
                      className="bg-red-600 hover:bg-red-500 w-8 h-8 rounded-lg flex items-center justify-center text-white ml-auto shadow-lg"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-slate-900 sticky bottom-0 bg-slate-950/90 backdrop-blur-lg py-6 z-20 px-4 -mx-4">
        <button onClick={onBack} className="px-6 py-3 font-semibold text-slate-400 hover:text-white transition-colors">
          <i className="fa-solid fa-chevron-left mr-2"></i> Back
        </button>
        <button 
          onClick={onNext}
          disabled={images.length === 0}
          className={`px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl transition-all ${
            images.length < recommendedCount 
            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
            : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
          }`}
        >
          {images.length < recommendedCount ? 'Continue Anyway' : 'Voice Over Studio'} <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ImageGenerator;
