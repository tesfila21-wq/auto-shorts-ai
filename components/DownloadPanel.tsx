
import React from 'react';
import { ScriptData, GeneratedImage, VoiceData } from '../types';

interface DownloadPanelProps {
  script: ScriptData | null;
  images: GeneratedImage[];
  voice: VoiceData | null;
  onReset: () => void;
}

const DownloadPanel: React.FC<DownloadPanelProps> = ({ script, images, voice, onReset }) => {
  const downloadTextFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadImage = (filename: string, dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simple Base64 to Blob helper for audio download
  const downloadAudio = (filename: string, base64: string) => {
    const binary = atob(base64);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: 'audio/pcm' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-in zoom-in-95 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-block p-3 bg-green-500/10 text-green-500 rounded-full mb-2">
          <i className="fa-solid fa-circle-check text-3xl"></i>
        </div>
        <h2 className="text-4xl font-extrabold">Your Assets are Ready!</h2>
        <p className="text-slate-400">Everything you need to create your viral YouTube Short is right here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Assets List */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-4">
             <h3 className="font-bold text-lg flex items-center gap-2">
               <i className="fa-solid fa-folder-open text-red-500"></i>
               Generated Package
             </h3>
             <ul className="space-y-3">
               <li className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800 group hover:border-red-500 transition-colors">
                 <div className="flex items-center gap-3">
                   <i className="fa-solid fa-file-lines text-blue-400"></i>
                   <div>
                     <div className="font-bold text-sm">Full Script</div>
                     <div className="text-[10px] text-slate-500 uppercase">Text File</div>
                   </div>
                 </div>
                 <button 
                  onClick={() => downloadTextFile('script.txt', `${script?.hook}\n\n${script?.mainContent}\n\n${script?.ending}\n\nKeywords: ${script?.keywords.join(', ')}`)}
                  className="p-2 hover:bg-slate-800 rounded-lg"
                 >
                   <i className="fa-solid fa-download"></i>
                 </button>
               </li>

               <li className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800 group hover:border-red-500 transition-colors">
                 <div className="flex items-center gap-3">
                   <i className="fa-solid fa-file-audio text-green-400"></i>
                   <div>
                     <div className="font-bold text-sm">Voice Over</div>
                     <div className="text-[10px] text-slate-500 uppercase">Raw PCM File</div>
                   </div>
                 </div>
                 <button 
                  onClick={() => voice?.audioUrl && downloadAudio('voiceover.pcm', voice.audioUrl)}
                  className="p-2 hover:bg-slate-800 rounded-lg"
                 >
                   <i className="fa-solid fa-download"></i>
                 </button>
               </li>

               <li className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800 group hover:border-red-500 transition-colors">
                 <div className="flex items-center gap-3">
                   <i className="fa-solid fa-photo-film text-purple-400"></i>
                   <div>
                     <div className="font-bold text-sm">AI Images ({images.length})</div>
                     <div className="text-[10px] text-slate-500 uppercase">PNG Assets</div>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button 
                    onClick={() => images.forEach((img, i) => downloadImage(`scene-${i+1}.png`, img.url))}
                    className="p-2 hover:bg-slate-800 rounded-lg"
                   >
                     <i className="fa-solid fa-download"></i>
                   </button>
                 </div>
               </li>
             </ul>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-4">
             <h4 className="font-bold text-sm uppercase text-slate-500 tracking-wider">Next Steps</h4>
             <div className="space-y-4">
               {[
                 { step: 1, text: "Import your script and voice-over into CapCut or Premiere Pro." },
                 { step: 2, text: "Sync the AI images with the narration points." },
                 { step: 3, text: "Add captions and background music." },
                 { step: 4, text: "Export as 1080x1920 and upload to Shorts!" },
               ].map((item) => (
                 <div key={item.step} className="flex gap-3 text-sm">
                   <div className="w-5 h-5 rounded-full bg-red-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">{item.step}</div>
                   <p className="text-slate-400">{item.text}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
           <div className="glass p-6 rounded-3xl h-full space-y-4">
             <h3 className="font-bold text-lg">Final Recap</h3>
             <div className="aspect-[9/16] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative group">
                {images[0] ? (
                  <img src={images[0].url} alt="Main Visual" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700">No Image</div>
                )}
                <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end gap-2">
                  <div className="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-2">YOUTUBE SHORTS</div>
                  <h4 className="text-xl font-bold line-clamp-2">{script?.hook}</h4>
                  <p className="text-xs text-slate-300 line-clamp-3 opacity-80">{script?.mainContent}</p>
                </div>
             </div>
             
             <button 
              onClick={onReset}
              className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all text-sm"
             >
               <i className="fa-solid fa-plus-circle"></i>
               Create Another Short
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPanel;
