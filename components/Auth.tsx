
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'LOGIN' | 'SIGN_UP';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  // Simple local storage "database" simulation
  const getUsers = (): Record<string, any> => {
    const data = localStorage.getItem('autoshorts_db_users');
    return data ? JSON.parse(data) : {};
  };

  const saveUser = (userEmail: string, pass: string) => {
    const users = getUsers();
    users[userEmail.toLowerCase()] = { 
      password: pass,
      credits: 3,
      isPremium: false,
      isCreator: false 
    };
    localStorage.setItem('autoshorts_db_users', JSON.stringify(users));
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const users = getUsers();
    const normalizedEmail = email.toLowerCase();

    setTimeout(() => {
      if (mode === 'SIGN_UP') {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        if (users[normalizedEmail]) {
          setError("An account with this email already exists.");
          setLoading(false);
          return;
        }
        
        saveUser(normalizedEmail, password);
        onLogin({
          email: normalizedEmail,
          isCreator: false,
          credits: 3,
          isPremium: false,
        });
      } else {
        const storedUser = users[normalizedEmail];
        if (!storedUser || storedUser.password !== password) {
          setError("Invalid email or password.");
          setLoading(false);
          return;
        }

        onLogin({
          email: normalizedEmail,
          isCreator: storedUser.isCreator,
          credits: storedUser.credits,
          isPremium: storedUser.isPremium,
        });
      }
      setLoading(false);
    }, 1200);
  };

  const handleSocialLogin = (mockEmail: string) => {
    setLoading(true);
    setShowGooglePicker(false);
    
    setTimeout(() => {
      onLogin({
        email: mockEmail,
        isCreator: false,
        credits: 3,
        isPremium: false,
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 relative">
      {/* Mock Google Account Picker */}
      {showGooglePicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
                <span className="font-medium">Sign in with Google</span>
              </div>
              <button onClick={() => setShowGooglePicker(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-2">
              <button 
                onClick={() => handleSocialLogin('user@gmail.com')}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">G</div>
                <div>
                  <div className="font-bold text-sm">Guest User</div>
                  <div className="text-xs text-slate-500">guest@gmail.com</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors text-left border-t border-slate-50 mt-2">
                <i className="fa-solid fa-user-plus text-slate-400 ml-3"></i>
                <span className="text-sm font-medium text-slate-600">Use another account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass p-8 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/20 blur-[80px] rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-600/20 blur-[80px] rounded-full"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="bg-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-red-900/40 transform -rotate-3 transition-transform hover:rotate-0">
            <i className="fa-solid fa-key text-2xl text-white"></i>
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-2">
            {mode === 'LOGIN' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-[200px] mx-auto">
            {mode === 'LOGIN' 
              ? 'Enter your details to access your dashboard.' 
              : 'Join AutoShorts AI and start creating viral shorts.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/30 border border-red-500/30 rounded-2xl text-[11px] text-red-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"></i>
              <input 
                type="email" 
                required
                placeholder="name@example.com"
                className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-red-600/40 outline-none transition-all placeholder:text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"></i>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-red-600/40 outline-none transition-all placeholder:text-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {mode === 'SIGN_UP' && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative">
                <i className="fa-solid fa-shield-check absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"></i>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-red-600/40 outline-none transition-all placeholder:text-slate-700"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 py-4 rounded-2xl font-black text-white shadow-xl shadow-red-950/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : (mode === 'LOGIN' ? 'Sign In' : 'Create Account')}
          </button>

          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={() => {
                setMode(mode === 'LOGIN' ? 'SIGN_UP' : 'LOGIN');
                setError(null);
              }}
              className="text-xs text-slate-500 hover:text-red-500 transition-colors font-bold"
            >
              {mode === 'LOGIN' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </form>

        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800/60"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="bg-[#1a1f2e] px-4 text-slate-600">OR</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          <button 
            disabled={loading}
            onClick={() => setShowGooglePicker(true)}
            className="bg-slate-900 border border-slate-800 text-white py-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
            Google
          </button>
          <button 
            disabled={loading}
            onClick={() => handleSocialLogin('apple-user@icloud.com')}
            className="bg-slate-900 border border-slate-800 text-white py-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
          >
            <i className="fa-brands fa-apple text-sm"></i>
            Apple
          </button>
        </div>
      </div>

      <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest">
          Secure Multi-Factor Authentication Active
        </p>
      </div>
    </div>
  );
};

export default Auth;
