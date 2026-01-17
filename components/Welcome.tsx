
import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-12">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur opacity-25 animate-pulse"></div>
        <div className="relative bg-slate-900 p-6 rounded-full border border-white/10">
          <i className="fa-solid fa-wand-magic-sparkles text-6xl text-red-500"></i>
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Create YouTube Shorts <br />
          <span className="gradient-text">Automatically with AI</span>
        </h2>
        <p className="text-lg text-slate-400">
          The smart platform that helps you create and upload high-quality YouTube Shorts automatically. 
          Generate everything from scripts to professional voice-overs in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[
          { icon: 'fa-pen-nib', title: 'Script', desc: 'Engaging & Optimized' },
          { icon: 'fa-image', title: 'Images', desc: 'AI-Generated Scenes' },
          { icon: 'fa-microphone', title: 'Voice-over', desc: 'Studio Quality' },
          { icon: 'fa-download', title: 'Assets', desc: 'Ready for Export' },
        ].map((item, i) => (
          <div key={i} className="glass p-6 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-800/50 transition-all">
            <i className={`fa-solid ${item.icon} text-red-500 text-2xl`}></i>
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <button 
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200 bg-red-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-red-500 shadow-lg shadow-red-900/30"
      >
        Start Creating Now
        <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
      </button>

      <p className="text-sm text-slate-500">No account required. Free to explore.</p>
    </div>
  );
};

export default Welcome;
