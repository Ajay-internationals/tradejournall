
// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trade, TradeType, AssetClass, TradeStatus, MarketCondition, Mood, Strategy, User } from '../types';
import { Save, Calculator, ChevronDown, ChevronUp, X, Star, Target, AlertCircle, Plus, Check, Search, Hash, Zap } from 'lucide-react';
import { db } from '../services/db';

const TagInput = ({ label, tags, onAdd, onRemove, suggestions = [], placeholder = "Type to search..." }: any) => {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        onAdd(input.trim());
        setInput('');
        setIsOpen(false);
      }
    }
  };

  const handleSelect = (item: string) => {
    onAdd(item);
    setInput('');
    setIsOpen(false);
  };

  const availableSuggestions = suggestions.filter((s: string) =>
    !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative mb-6">
      {label && <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{label}</label>}

      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag: string, idx: number) => (
          <span key={idx} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center border border-indigo-100 dark:border-indigo-800">
            {tag}
            <button type="button" onClick={() => onRemove(tag)} className="ml-2 hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors"><X className="h-3.5 w-3.5" /></button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none p-3 text-sm placeholder-slate-400 transition-all"
          placeholder={placeholder}
        />

        {isOpen && availableSuggestions.length > 0 && (
          <div className="absolute z-30 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-h-60 overflow-auto">
            {availableSuggestions.map((s: string) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between group"
              >
                <span>{s}</span>
                <Plus className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StrategyInput = ({ selectedStrategies, allStrategies, onAdd, onRemove, onNavigate }: any) => {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const defaultSuggestions = ['Intraday Momentum', 'Swing Setup', 'Scalp Reversal', 'Gap Fill', 'Breakout Re-test'];

  const options = useMemo(() => {
    const term = input.toLowerCase();
    const safeStrats = Array.isArray(allStrategies) ? allStrategies : [];
    const merged = [
      ...safeStrats.filter(s => !selectedStrategies.includes(s.name) && s.name.toLowerCase().includes(term)).map(s => ({ name: s.name, type: 'custom' })),
      ...defaultSuggestions.filter(s => !selectedStrategies.includes(s) && s.toLowerCase().includes(term)).map(s => ({ name: s, type: 'default' }))
    ];
    if (input.trim() && !merged.some(m => m.name.toLowerCase() === input.trim().toLowerCase())) {
      merged.push({ name: input.trim(), type: 'new' });
    }
    return merged;
  }, [input, allStrategies, selectedStrategies]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Strategy Focus</label>
        <button type="button" onClick={() => onNavigate('/strategies')} className="text-[10px] text-indigo-600 font-bold hover:underline">Manage</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {selectedStrategies.map((tag: string, idx: number) => (
          <span key={idx} className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center shadow-lg shadow-indigo-100 dark:shadow-none">
            <Target className="h-3 w-3 mr-2 opacity-70" />
            {tag}
            <button type="button" onClick={() => onRemove(tag)} className="ml-2"><X className="h-3.5 w-3.5" /></button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Select core strategy..."
        />
        {isOpen && options.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-auto">
            {options.map((opt) => (
              <button
                key={opt.name}
                type="button"
                onClick={() => { onAdd(opt.name); setInput(''); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-indigo-50 dark:hover:bg-slate-700 dark:text-slate-200 flex items-center"
              >
                {opt.type === 'custom' && <Star className="h-3 w-3 text-yellow-500 mr-2 fill-current" />}
                {opt.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AddTradeForm: React.FC<any> = ({ onAddTrade, onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [monthlyTradeCount, setMonthlyTradeCount] = useState(0);
  const [savedStrategies, setSavedStrategies] = useState<Strategy[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<Trade>>({
    symbol: '',
    assetClass: AssetClass.EQUITY,
    type: TradeType.LONG,
    entryDate: new Date().toISOString().slice(0, 16),
    status: TradeStatus.CLOSED,
    quantity: 1,
    fees: 0,
    stopLoss: 0,
    pnl: 0,
    rating: 0,
    setups: [],
    strategies: [],
    mistakes: [],
    emotions: [],
    notes: ''
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      const session = db.getSession();
      if (session) {
        setUser(session);
        setSavedStrategies(await db.getStrategiesForUser(session.id));
        const trades = await db.getTradesForUser(session.id);
        const currentMonth = new Date().getMonth();
        const count = trades.filter(t => new Date(t.entryDate).getMonth() === currentMonth).length;
        setMonthlyTradeCount(count);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const { entryPrice, exitPrice, quantity, type, fees } = formData;
    if (entryPrice && exitPrice && quantity) {
      const priceDiff = exitPrice - entryPrice;
      const grossPnL = (type === TradeType.LONG ? priceDiff : -priceDiff) * quantity;
      setFormData(prev => ({ ...prev, pnl: Number((grossPnL - (fees || 0)).toFixed(2)) }));
    }
  }, [formData.entryPrice, formData.exitPrice, formData.quantity, formData.type, formData.fees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symbol?.trim() || !formData.entryPrice) {
      setErrors({ symbol: !formData.symbol?.trim() ? 'Required' : '', entryPrice: !formData.entryPrice ? 'Required' : '' });
      return;
    }
    onAddTrade({ id: crypto.randomUUID(), userId: user?.id || 'demo-user', ...formData as Trade });
    onNavigate('/trades');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: ['entryPrice', 'exitPrice', 'quantity', 'fees', 'stopLoss'].includes(name) ? parseFloat(value) : value }));
  };

  const handleArrayUpdate = (field: keyof Trade, value: string, action: 'add' | 'remove') => {
    setFormData(prev => {
      const current = prev[field] || [];
      return { ...prev, [field]: action === 'add' ? [...current, value] : current.filter(item => item !== value) };
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 animate-fade-in-up pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Log Execution</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
            Month Track: <span className="text-indigo-500">{monthlyTradeCount} trades</span>
          </p>
        </div>
        <button onClick={() => onNavigate('/trades')} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Side</label>
              <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button type="button" onClick={() => setFormData({ ...formData, type: TradeType.LONG })} className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === TradeType.LONG ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>Buy (Long)</button>
                <button type="button" onClick={() => setFormData({ ...formData, type: TradeType.SHORT })} className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === TradeType.SHORT ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400'}`}>Sell (Short)</button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Symbol</label>
              <input type="text" name="symbol" value={formData.symbol} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-bold" placeholder="NIFTY" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Asset</label>
              <select name="assetClass" value={formData.assetClass} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl outline-none font-bold">
                {Object.values(AssetClass).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Qty</label><input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl outline-none font-mono text-sm" /></div>
            <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Entry</label><input type="number" step="0.05" name="entryPrice" value={formData.entryPrice || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl outline-none font-mono text-sm" placeholder="0.00" /></div>
            <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Exit</label><input type="number" step="0.05" name="exitPrice" value={formData.exitPrice || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl outline-none font-mono text-sm" placeholder="0.00" /></div>
            <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2">SL</label><input type="number" step="0.05" name="stopLoss" value={formData.stopLoss || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl outline-none font-mono text-sm" placeholder="SL" /></div>
            <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Fees</label><input type="number" step="0.01" name="fees" value={formData.fees || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl outline-none font-mono text-sm" /></div>
            <div className="bg-indigo-600 text-white p-3 rounded-2xl flex flex-col justify-center col-span-2 md:col-span-1">
              <p className="text-[9px] font-black uppercase opacity-60">Result</p>
              <div className="font-black truncate text-sm">₹{formData.pnl?.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[1.5rem] border border-slate-100 dark:border-slate-700">
            <StrategyInput selectedStrategies={formData.strategies} allStrategies={savedStrategies} onAdd={(v) => handleArrayUpdate('strategies', v, 'add')} onRemove={(v) => handleArrayUpdate('strategies', v, 'remove')} onNavigate={onNavigate} />
            <TagInput label="Setup Pattern" tags={formData.setups} suggestions={['ORB', 'VWAP Bounce', 'Breakout', 'Reversal']} onAdd={(v) => handleArrayUpdate('setups', v, 'add')} onRemove={(v) => handleArrayUpdate('setups', v, 'remove')} />
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[1.5rem] border border-slate-100 dark:border-slate-700">
            <TagInput label="Mistakes Found" tags={formData.mistakes} suggestions={['FOMO', 'No SL', 'Averaging', 'Early Exit']} onAdd={(v) => handleArrayUpdate('mistakes', v, 'add')} onRemove={(v) => handleArrayUpdate('mistakes', v, 'remove')} />
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Post-Trade Notes</label>
              <textarea name="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm placeholder-slate-400" placeholder="Mindset and market context..." />
            </div>
          </div>
        </div>

        <div className="fixed md:static bottom-20 md:bottom-auto left-4 right-4 md:left-auto md:right-auto z-40">
          <button type="submit" className="w-full md:w-auto px-12 py-4 md:py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-2xl shadow-indigo-500/30 flex items-center justify-center transition-all hover:-translate-y-1 active:scale-95">
            <Save className="h-5 w-5 mr-3" /> Commit Trade
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTradeForm;
