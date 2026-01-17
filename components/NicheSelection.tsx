
import React from 'react';
import { NICHES } from '../constants';
import { Niche } from '../types';

interface NicheSelectionProps {
  onSelect: (niche: Niche) => void;
}

const NicheSelection: React.FC<NicheSelectionProps> = ({ onSelect }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Select Your Niche</h2>
        <p className="text-slate-400">Choose a category to generate your customized YouTube Shorts script.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {NICHES.map((niche) => (
          <button
            key={niche.id}
            onClick={() => onSelect(niche)}
            className="group relative flex flex-col items-center justify-center p-8 rounded-3xl glass transition-all duration-300 hover:scale-105 hover:bg-white/5 border-2 border-transparent hover:border-red-500/50"
          >
            <div className={`w-16 h-16 rounded-2xl ${niche.color} flex items-center justify-center mb-4 shadow-lg group-hover:rotate-6 transition-transform`}>
              <i className={`fa-solid ${niche.icon} text-3xl text-white`}></i>
            </div>
            <span className="font-semibold text-lg">{niche.name}</span>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="fa-solid fa-plus text-red-500"></i>
            </div>
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center italic text-slate-500">
        "Once you pick a niche, AutoShorts AI instantly prepares a full script based on your selection."
      </div>
    </div>
  );
};

export default NicheSelection;
