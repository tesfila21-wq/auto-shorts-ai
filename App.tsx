
import React, { useState, useCallback, useEffect } from 'react';
import { Step, ScriptData, GeneratedImage, VoiceData, Niche, User } from './types';
import { NICHES } from './constants';
import Welcome from './components/Welcome';
import NicheSelection from './components/NicheSelection';
import ScriptGeneration from './components/ScriptGeneration';
import ImageGenerator from './components/ImageGenerator';
import VoiceGenerator from './components/VoiceGenerator';
import DownloadPanel from './components/DownloadPanel';
import Header from './components/Header';
import Footer from './components/Footer';
import Auth from './components/Auth';
import SubscriptionModal from './components/SubscriptionModal';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Auth);
  const [user, setUser] = useState<User | null>(null);
  const [paywallConfig, setPaywallConfig] = useState<{ show: boolean, tab: 'PLANS' | 'MANAGE' }>({ show: false, tab: 'PLANS' });
  
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);
  const [script, setScript] = useState<ScriptData | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [voice, setVoice] = useState<VoiceData | null>(null);

  // Load user session from local storage
  useEffect(() => {
    const saved = localStorage.getItem('autoshorts_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setCurrentStep(Step.Welcome);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('autoshorts_user', JSON.stringify(newUser));
    setCurrentStep(Step.Welcome);
  };

  const nextStep = useCallback(() => {
    // Credit check before proceeding to heavy generation tasks
    if (currentStep === Step.NicheSelection && user && user.credits <= 0 && !user.isPremium) {
      setPaywallConfig({ show: true, tab: 'PLANS' });
      return;
    }

    const steps = Object.values(Step);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep, user]);

  const prevStep = useCallback(() => {
    const steps = Object.values(Step);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  const handleUpdateScript = (newScript: ScriptData) => {
    // If we're generating a NEW script (not just updating), deduct credit
    if (!script && user && !user.isPremium) {
      const updatedUser = { ...user, credits: user.credits - 1 };
      setUser(updatedUser);
      localStorage.setItem('autoshorts_user', JSON.stringify(updatedUser));
    }
    setScript(newScript);
  };

  const handleUpgrade = () => {
    if (user) {
      const updatedUser = { ...user, isPremium: true, credits: 999999 };
      setUser(updatedUser);
      localStorage.setItem('autoshorts_user', JSON.stringify(updatedUser));
    }
    setPaywallConfig({ ...paywallConfig, show: false });
  };

  const renderStep = () => {
    switch (currentStep) {
      case Step.Auth:
        return <Auth onLogin={handleLogin} />;
      case Step.Welcome:
        return <Welcome onStart={() => setCurrentStep(Step.NicheSelection)} />;
      case Step.NicheSelection:
        return (
          <NicheSelection 
            onSelect={(niche) => {
              if (user && user.credits <= 0 && !user.isPremium) {
                setPaywallConfig({ show: true, tab: 'PLANS' });
                return;
              }
              setSelectedNiche(niche);
              setCurrentStep(Step.ScriptGeneration);
            }} 
          />
        );
      case Step.ScriptGeneration:
        return (
          <ScriptGeneration 
            niche={selectedNiche?.name || ''} 
            script={script} 
            onUpdateScript={handleUpdateScript} 
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case Step.ImageGenerator:
        return (
          <ImageGenerator 
            script={script} 
            images={images} 
            onUpdateImages={setImages} 
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case Step.VoiceGenerator:
        return (
          <VoiceGenerator 
            script={script} 
            voice={voice} 
            onUpdateVoice={setVoice} 
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case Step.Download:
        return (
          <DownloadPanel 
            script={script} 
            images={images} 
            voice={voice} 
            onReset={() => {
              setCurrentStep(Step.Welcome);
              setScript(null);
              setImages([]);
              setVoice(null);
              setSelectedNiche(null);
            }} 
          />
        );
      default:
        return <Welcome onStart={() => setCurrentStep(Step.NicheSelection)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header 
        currentStep={currentStep} 
        onNavigate={setCurrentStep} 
        user={user} 
        onLogout={() => {
          localStorage.removeItem('autoshorts_user');
          setUser(null);
          setCurrentStep(Step.Auth);
        }}
        onShowPaywall={(tab) => setPaywallConfig({ show: true, tab })}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="w-full h-full animate-in fade-in duration-500">
          {renderStep()}
        </div>
      </main>

      {paywallConfig.show && (
        <SubscriptionModal 
          user={user}
          initialTab={paywallConfig.tab}
          onUpgrade={handleUpgrade} 
          onClose={() => setPaywallConfig({ ...paywallConfig, show: false })} 
        />
      )}

      <Footer />
    </div>
  );
};

export default App;
