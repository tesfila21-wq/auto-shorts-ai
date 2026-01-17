
import React, { useState } from 'react';
import { User } from '../types';

interface SubscriptionModalProps {
  user: User | null;
  onUpgrade: () => void;
  onClose: () => void;
  initialTab?: 'PLANS' | 'MANAGE';
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ user, onUpgrade, onClose, initialTab = 'PLANS' }) => {
  const [activeTab, setActiveTab] = useState<'PLANS' | 'MANAGE'>(user?.isPremium ? 'MANAGE' : initialTab);
  const [method, setMethod] = useState<'LOCAL' | 'INT'>('LOCAL');
  const [selectedTier, setSelectedTier] = useState('Monthly');

  const tiers = [
    { name: 'Daily', price: '$1.99', etb: '100 ETB', desc: 'Single project burst' },
    { name: 'Weekly', price: '$5.99', etb: '300 ETB', desc: 'Creator sprint' },
    { name: 'Monthly', price: '$14.99', etb: '800 ETB', desc: 'Professional growth', popular: true },
    { name: 'Yearly', price: '$99.99', etb: '5000 ETB', desc: 'Best value' },
  ];

  const mockHistory = [
    { date: 'Oct 12, 2023', amount: '800 ETB', method: 'Telebirr', status: 'Completed' },
    { date: 'Sep 12, 2023', amount: '800 ETB', method: 'Telebirr', status: 'Completed' },
    { date: 'Aug 12, 2023', amount: '800 ETB', method: 'Telebirr', status: 'Completed' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass w-full max-w-4xl rounded-[2.5rem] overflow-hidden border-white/10 shadow-2xl flex flex-col md:flex-row h-[650px]">
        
        {/* Left Side: Dynamic Context */}
        <div className={`md:w-1/3 p-8 text-white flex flex-col justify-between transition-colors duration-500 ${activeTab === 'PLANS' ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-slate-900 border-r border-white/5'}`}>
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                 <i className={`fa-solid ${activeTab === 'PLANS' ? 'fa-rocket' : 'fa-user-gear'} text-xl`}></i>
               </div>
               <h2 className="text-xl font-bold tracking-tight">Subscription</h2>
            </div>

            {activeTab === 'PLANS' ? (
              <div className="space-y-6 animate-in slide-in-from-left-4">
                <h3 className="text-3xl font-black leading-tight">Unlock Unlimited Creation</h3>
                <ul className="space-y-4 opacity-90">
                  <li className="flex gap-3 text-sm font-medium">
                    <i className="fa-solid fa-circle-check mt-1"></i>
                    <span>Unlimited AI Video Generations</span>
                  </li>
                  <li className="flex gap-3 text-sm font-medium">
                    <i className="fa-solid fa-circle-check mt-1"></i>
                    <span>4K High-Res Visual Sequences</span>
                  </li>
                  <li className="flex gap-3 text-sm font-medium">
                    <i className="fa-solid fa-circle-check mt-1"></i>
                    <span>Exclusive Professional Voices</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-left-4">
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Current Plan</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white">{user?.isPremium ? 'Premium Plus' : 'Free Starter'}</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Credit Usage</div>
                    <span className="text-xs font-bold text-white">{user?.isPremium ? '∞' : `${user?.credits}/3`} Credits</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-1000" 
                      style={{ width: user?.isPremium ? '100%' : `${((user?.credits || 0) / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-black/20 rounded-2xl border border-white/10">
            <div className="text-[10px] uppercase font-black opacity-60 mb-1 tracking-widest">Support Node</div>
            <p className="text-[11px] leading-relaxed opacity-80">
              {activeTab === 'PLANS' 
                ? "Ethiopian users enjoy direct Telebirr & CBE integration with zero conversion fees."
                : "Need help? Contact our premium support line at support@autoshorts.ai"}
            </p>
          </div>
        </div>

        {/* Right Side: Tabbed Content */}
        <div className="flex-1 p-8 flex flex-col bg-slate-950 overflow-hidden">
          {/* Header Tabs */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5">
              <button 
                onClick={() => setActiveTab('PLANS')}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'PLANS' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-slate-500 hover:text-slate-300'}`}
              >
                AVAILABLE PLANS
              </button>
              <button 
                onClick={() => setActiveTab('MANAGE')}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'MANAGE' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-slate-500 hover:text-slate-300'}`}
              >
                MY SUBSCRIPTION
              </button>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {activeTab === 'PLANS' ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Select Frequency</h3>
                   <div className="flex bg-slate-900 p-1 rounded-xl text-[10px] font-bold">
                    <button onClick={() => setMethod('LOCAL')} className={`px-4 py-1.5 rounded-lg transition-all ${method === 'LOCAL' ? 'bg-slate-800 text-white shadow' : 'text-slate-600'}`}>LOCAL (ETB)</button>
                    <button onClick={() => setMethod('INT')} className={`px-4 py-1.5 rounded-lg transition-all ${method === 'INT' ? 'bg-slate-800 text-white shadow' : 'text-slate-600'}`}>INTERNATIONAL ($)</button>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {tiers.map((tier) => (
                    <button
                      key={tier.name}
                      onClick={() => setSelectedTier(tier.name)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all group relative ${
                        selectedTier === tier.name 
                        ? 'border-red-600 bg-red-600/5' 
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      {tier.popular && <span className="absolute -top-2.5 right-4 bg-red-600 text-[9px] font-black px-3 py-1 rounded-full shadow-lg shadow-red-900/40">MOST POPULAR</span>}
                      <div className="font-bold text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{tier.name}</div>
                      <div className="text-2xl font-black my-1 text-white">{method === 'LOCAL' ? tier.etb : tier.price}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{tier.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Payment Channel</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {method === 'LOCAL' ? (
                      <>
                        <button className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900 hover:border-red-600/50 transition-all group">
                          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center font-black shadow-lg shadow-sky-900/20 text-white">TB</div>
                          <div className="text-left">
                            <div className="text-xs font-black text-white">Telebirr</div>
                            <div className="text-[9px] text-slate-500">Instant Activation</div>
                          </div>
                        </button>
                        <button className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900 hover:border-red-600/50 transition-all group">
                          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-900/20 text-white italic">CBE</div>
                          <div className="text-left">
                            <div className="text-xs font-black text-white">CBE Bank</div>
                            <div className="text-[9px] text-slate-500">Transfer Verify</div>
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900 hover:border-red-600/50 transition-all group">
                          <i className="fa-brands fa-cc-visa text-2xl text-blue-400"></i>
                          <div className="text-left">
                            <div className="text-xs font-black text-white">Credit Card</div>
                            <div className="text-[9px] text-slate-500">Stripe Secure</div>
                          </div>
                        </button>
                        <button className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900 hover:border-red-600/50 transition-all group">
                          <i className="fa-brands fa-paypal text-2xl text-blue-600"></i>
                          <div className="text-left">
                            <div className="text-xs font-black text-white">PayPal</div>
                            <div className="text-[9px] text-slate-500">1-Tap Checkout</div>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button 
                    onClick={onUpgrade}
                    className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all active:scale-[0.98] shadow-2xl shadow-white/5 mt-4"
                  >
                    Confirm & Start Creation
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
                    <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Renews On</div>
                    <div className="text-lg font-bold text-white">Nov 12, 2023</div>
                  </div>
                  <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
                    <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Member Since</div>
                    <div className="text-lg font-bold text-white">Jul 04, 2023</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Billing History</h3>
                  <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                          <th className="p-4 font-black uppercase tracking-wider text-slate-500">Date</th>
                          <th className="p-4 font-black uppercase tracking-wider text-slate-500">Amount</th>
                          <th className="p-4 font-black uppercase tracking-wider text-slate-500">Method</th>
                          <th className="p-4 font-black uppercase tracking-wider text-slate-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockHistory.map((item, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-medium text-slate-300">{item.date}</td>
                            <td className="p-4 font-bold text-white">{item.amount}</td>
                            <td className="p-4 text-slate-400">{item.method}</td>
                            <td className="p-4">
                              <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-500 font-bold text-[10px] uppercase">{item.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold text-xs hover:bg-slate-800 transition-all">
                    Update Payment Method
                  </button>
                  <button className="flex-1 py-4 rounded-xl bg-slate-900 border border-slate-800 text-red-500/50 font-bold text-xs hover:bg-red-500/10 transition-all">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
