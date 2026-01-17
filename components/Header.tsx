
import React from 'react';
import { Step, User } from '../types';

interface HeaderProps {
  currentStep: Step;
  onNavigate: (step: Step) => void;
  user: User | null;
  onLogout: () => void;
  onShowPaywall: (tab: 'PLANS' | 'MANAGE') => void;
}

const Header: React.FC<HeaderProps> = ({ currentStep, user, onLogout, onShowPaywall }) => {
  const stepsList = [
    { key: Step.NicheSelection, icon: 'fa-list-ul' },
    { key: Step.ScriptGeneration, icon: 'fa-pen-nib' },
    { key: Step.ImageGenerator, icon: 'fa-image' },
    { key: Step.VoiceGenerator, icon: 'fa-microphone' },
    { key: Step.Download, icon: 'fa-download' },
  ];

  const getStepIndex = (step: Step) => {
    const steps = Object.values(Step);
    return steps.indexOf(step) - (steps.indexOf(Step.Welcome) + 1);
  };
  
  const currentIndex = getStepIndex(currentStep);

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.location.reload()}>
            <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-500 transition-colors">
              <i className="fa-solid fa-play text-white"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight">AutoShorts <span className="text-red-500">AI</span></h1>
          </div>

          {user && (
            <button 
              onClick={() => onShowPaywall(user.isPremium ? 'MANAGE' : 'PLANS')}
              className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 transition-colors rounded-full border border-slate-800 group"
            >
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Credits</span>
              <span className={`text-xs font-bold ${!user.isPremium && user.credits <= 1 ? 'text-red-500' : 'text-green-500'}`}>
                {user.isCreator || user.isPremium ? 'Unlimited' : `${user.credits} Left`}
              </span>
              <i className={`fa-solid ${user.isPremium ? 'fa-crown text-yellow-500' : 'fa-circle-plus text-red-600'} text-xs ml-1 group-hover:scale-110 transition-transform`}></i>
            </button>
          )}
        </div>

        {!([Step.Welcome, Step.Auth].includes(currentStep)) && (
          <nav className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0">
            {stepsList.map((step, index) => {
              const isActive = index === currentIndex;
              const isPast = index < currentIndex;
              
              return (
                <div key={step.key} className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
                    isActive ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 
                    isPast ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isPast ? <i className="fa-solid fa-check"></i> : index + 1}
                  </div>
                  {index < stepsList.length - 1 && (
                    <div className={`hidden sm:block w-4 h-0.5 rounded ${isPast ? 'bg-green-600' : 'bg-slate-800'}`}></div>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-end gap-1">
                  {user.isCreator ? <span className="text-orange-500 bg-orange-500/10 px-1 rounded tracking-tighter">MASTER CREATOR</span> : <span>USER</span>}
                  <i className="fa-solid fa-circle-check text-sky-500"></i>
                </div>
                <div className="text-xs font-semibold truncate max-w-[120px]">{user.email}</div>
              </div>
              <button 
                onClick={onLogout}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-red-600/10 hover:border-red-600 transition-all group"
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket text-slate-500 group-hover:text-red-500"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
