
import React, { useState, useRef } from 'react';
import { ScriptData, VoiceData } from '../types';
import { VOICES } from '../constants';
import { generateSpeech, decode, decodeAudioData } from '../services/geminiService';

interface VoiceGeneratorProps {
  script: ScriptData | null;
  voice: VoiceData | null;
  onUpdateVoice: (voice: VoiceData) => void;
  onNext: () => void;
  onBack: () => void;
}

const VoiceGenerator: React.FC<VoiceGeneratorProps> = ({ script, voice, onUpdateVoice, onNext, onBack }) => {
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [generating, setGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleGenerate = async () => {
    if (!script) return;
    setGenerating(true);
    const fullText = `${script.hook} . ${script.mainContent} . ${script.ending}`;
    
    try {
      const base64Audio = await generateSpeech(fullText, selectedVoice.id);
      
      // Calculate actual duration
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioData = decode(base64Audio);
      const buffer = await decodeAudioData(audioData, ctx, 24000, 1);
      const actualDuration = buffer.duration;
      await ctx.close();

      onUpdateVoice({
        audioUrl: base64Audio,
        voiceName: selectedVoice.name,
        speed: 1.0,
        duration: actualDuration
      });
    } catch (err) {
      console.error(err);
      alert("Failed to generate voice-over.");
    } finally {
      setGenerating(false);
    }
  };

  const playPreview = async () => {
    if (!voice?.audioUrl) return;

    if (isPlaying) {
      audioSourceRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      const audioData = decode(voice.audioUrl);
      const buffer = await decodeAudioData(audioData, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      
      audioSourceRef.current = source;
      source.start();
      setIsPlaying(true);
    } catch (err) {
      console.error("Playback error:", err);
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Studio Voice Generator</h2>
          <p className="text-slate-400">Transform your script into a professional narration.</p>
        </div>
        {voice?.duration && (
           <div className="glass px-4 py-2 rounded-xl text-xs font-bold text-red-400 border-red-500/20">
             <i className="fa-solid fa-clock mr-2"></i>
             {voice.duration.toFixed(1)}s Length
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm uppercase text-slate-500 tracking-wider">Select Voice</h3>
            <div className="space-y-2">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                    selectedVoice.id === v.id 
                    ? 'bg-red-600/10 border-red-500 text-white' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedVoice.id === v.id ? 'bg-red-600' : 'bg-slate-800'}`}>
                      <i className={`fa-solid ${v.gender === 'Female' ? 'fa-user-nurse' : 'fa-user-tie'}`}></i>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm">{v.name}</div>
                      <div className="text-[10px] opacity-60 uppercase">{v.gender} Voice</div>
                    </div>
                  </div>
                  {selectedVoice.id === v.id && <i className="fa-solid fa-circle-check text-red-500"></i>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 h-full">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-1000 ${generating || isPlaying ? 'bg-red-600 animate-pulse shadow-[0_0_50px_rgba(220,38,38,0.4)]' : 'bg-slate-800'}`}>
               <i className={`fa-solid ${generating ? 'fa-spinner fa-spin' : isPlaying ? 'fa-waveform-lines' : 'fa-microphone'} text-4xl`}></i>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{generating ? 'AI is narrating...' : voice ? 'Voice Over Ready' : 'Narrate your script'}</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                {generating 
                  ? "Blending emotion and tone for studio-quality results." 
                  : voice 
                  ? `Final audio is ${voice.duration?.toFixed(1)} seconds. Perfect for a YouTube Short.` 
                  : "Pick a voice and click the button below to generate the audio file."}
              </p>
            </div>

            <div className="flex flex-col w-full gap-3">
              {voice ? (
                <button
                  onClick={playPreview}
                  className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
                >
                  <i className={`fa-solid ${isPlaying ? 'fa-stop' : 'fa-play'}`}></i>
                  {isPlaying ? 'Stop Preview' : 'Preview Audio'}
                </button>
              ) : null}

              <button
                onClick={handleGenerate}
                disabled={generating}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  generating 
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20'
                }`}
              >
                {generating ? 'Please wait...' : voice ? 'Regenerate Voice' : 'Generate Voice-over'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-slate-900 sticky bottom-0 bg-slate-950/80 backdrop-blur-md py-4 z-10">
        <button onClick={onBack} className="px-6 py-3 font-semibold text-slate-400 hover:text-white transition-colors">
          <i className="fa-solid fa-chevron-left mr-2"></i> Back
        </button>
        <button 
          onClick={onNext}
          disabled={!voice}
          className={`px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${
            !voice 
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20'
          }`}
        >
          Final Review <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default VoiceGenerator;
