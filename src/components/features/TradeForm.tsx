import { useState, useEffect } from 'react';
import { useTrades } from '@/hooks/useTrades';
import { useStrategies } from '@/hooks/useStrategies';
import { useMistakes } from '@/hooks/useMistakes';
import { cn } from '@/lib/utils';
import { X, Zap, ArrowRight, ShieldAlert, Coins, LineChart, BarChart, Activity, Sparkles, Wallet, Calendar, Plus, HeartCrack } from 'lucide-react';
import type { Trade } from '@/types';
import { getRealQuantity } from '@/lib/stats';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface TradeFormProps {
    onClose: () => void;
    editTrade?: Trade;
    onSuccess?: () => void;
}

const ASSET_CLASSES = [
    { label: 'Index', value: 'INDEX', icon: <BarChart size={14} /> },
    { label: 'Stocks', value: 'STOCKS', icon: <LineChart size={14} /> },
    { label: 'Commodities', value: 'COMMODITIES', icon: <Coins size={14} /> },
    { label: 'Futures', value: 'FUTURES', icon: <Activity size={14} /> },
    { label: 'Crypto', value: 'CRYPTO', icon: <Zap size={14} /> },
];

export function TradeForm({ onClose, editTrade, onSuccess }: TradeFormProps) {
    const { addTrade, updateTrade } = useTrades();
    const { strategies } = useStrategies();
    const { mistakes } = useMistakes();
    const { user, profile, refreshProfile } = useAuth();

    const [formData, setFormData] = useState({
        date: editTrade ? new Date(editTrade.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        instrument: editTrade?.instrument || '',
        asset_class: editTrade?.asset_class || 'INDEX',
        direction: (editTrade?.direction || 'LONG') as 'LONG' | 'SHORT',
        entry_price: editTrade?.entry_price ? editTrade.entry_price.toString() : '',
        exit_price: editTrade?.exit_price ? editTrade.exit_price.toString() : '',
        stop_loss: editTrade?.stop_loss ? editTrade.stop_loss.toString() : '',
        quantity: editTrade?.quantity ? editTrade.quantity.toString() : '',
        fees: editTrade?.fees ? editTrade.fees.toString() : '',
        emotion: editTrade?.emotion || 'CALM',
        strategy: editTrade?.strategy || 'BREAKOUT',
        tags: editTrade?.tags?.join(', ') || '',
        notes: editTrade?.notes || '',
        initial_capital: profile?.initial_capital ? profile.initial_capital.toString() : '100000',
        mistake_ids: editTrade?.mistake_ids || [] as string[],
    });

    const [pnl, setPnl] = useState({ gross: 0, net: 0, rMultiple: 0 });

    useEffect(() => {
        const entry = parseFloat(formData.entry_price) || 0;
        const exit = parseFloat(formData.exit_price) || 0;
        const sl = parseFloat(formData.stop_loss) || 0;
        const rawQty = parseFloat(formData.quantity) || 0;
        const fees = parseFloat(formData.fees) || 0;

        const qty = getRealQuantity(formData.instrument, rawQty);

        if (entry && exit && qty) {
            const gross = formData.direction === 'LONG'
                ? (exit - entry) * qty
                : (entry - exit) * qty;

            let rMultiple = 0;
            if (sl > 0 && sl !== entry) {
                const riskPerUnit = formData.direction === 'LONG'
                    ? Math.abs(entry - sl)
                    : Math.abs(sl - entry);
                const rewardPerUnit = formData.direction === 'LONG' ? (exit - entry) : (entry - exit);
                rMultiple = rewardPerUnit / riskPerUnit;
            }

            setPnl({ gross, net: gross - fees, rMultiple });
        } else {
            setPnl({ gross: 0, net: 0, rMultiple: 0 });
        }
    }, [formData.entry_price, formData.exit_price, formData.stop_loss, formData.quantity, formData.fees, formData.direction, formData.instrument]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const entry = parseFloat(formData.entry_price);
        const exit = parseFloat(formData.exit_price);
        const rawQty = parseFloat(formData.quantity);
        const cap = parseFloat(formData.initial_capital);

        if (isNaN(entry) || isNaN(exit) || isNaN(rawQty)) {
            alert("Please enter valid numbers for Price and Quantity.");
            return;
        }

        const qty = getRealQuantity(formData.instrument, rawQty);
        const fees = parseFloat(formData.fees) || 0;
        const gross = formData.direction === 'LONG' ? (exit - entry) * qty : (entry - exit) * qty;
        const net = gross - fees;

        const payload = {
            date: new Date(formData.date).toISOString(),
            instrument: formData.instrument.toUpperCase().trim(),
            asset_class: formData.asset_class as any,
            direction: formData.direction,
            entry_price: entry,
            exit_price: exit,
            stop_loss: parseFloat(formData.stop_loss) || 0,
            quantity: qty,
            fees: fees,
            emotion: formData.emotion,
            strategy: formData.strategy,
            gross_pnl: gross,
            net_pnl: net,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            notes: formData.notes,
            mistake_ids: formData.mistake_ids,
        };

        try {
            if (!isNaN(cap) && user) {
                await supabase.from('users').update({ initial_capital: cap }).eq('id', user.id);
                await refreshProfile();
            }

            if (editTrade) {
                await updateTrade.mutateAsync({ id: editTrade.id, updates: payload });
            } else {
                await addTrade.mutateAsync(payload);
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Trade save error:", error);
            alert(`Save Failed: ${error.message || "Unknown error"}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleMistake = (id: string) => {
        setFormData(prev => ({
            ...prev,
            mistake_ids: prev.mistake_ids.includes(id)
                ? prev.mistake_ids.filter(mId => mId !== id)
                : [...prev.mistake_ids, id]
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto no-scrollbar font-body">
                <div className="sticky top-0 z-10 p-10 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-3xl">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden group">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{editTrade ? 'Edit Trade' : 'New Trade Log'}</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{editTrade ? 'Update existing data' : 'Record market execution'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-100">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Category</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {ASSET_CLASSES.map((asset) => (
                                <button
                                    key={asset.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, asset_class: asset.value as any }))}
                                    className={cn(
                                        "flex flex-col items-center gap-3 py-4 rounded-2xl border transition-all duration-300",
                                        formData.asset_class === asset.value
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                                            : "bg-white border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600"
                                    )}
                                >
                                    {asset.icon}
                                    <span className="text-[10px] font-bold uppercase tracking-tight">{asset.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Symbol</label>
                            <input type="text" name="instrument" required placeholder="SBIN, NIFTY..." value={formData.instrument} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:border-indigo-500 transition-all outline-none text-slate-900" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Trade Date</label>
                            <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:border-indigo-500 transition-all outline-none text-slate-900" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Direction</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, direction: 'LONG' }))} className={cn("py-4 rounded-xl text-[10px] font-bold tracking-widest transition-all", formData.direction === 'LONG' ? "bg-emerald-600 text-white shadow-lg" : "bg-slate-50 text-slate-400")}>BUY</button>
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, direction: 'SHORT' }))} className={cn("py-4 rounded-xl text-[10px] font-bold tracking-widest transition-all", formData.direction === 'SHORT' ? "bg-rose-600 text-white shadow-lg" : "bg-slate-50 text-slate-400")}>SELL</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Strategy</label>
                            <select name="strategy" value={formData.strategy} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-bold focus:border-indigo-500 outline-none">
                                <option value="BREAKOUT">Breakout</option>
                                <option value="SCALPING">Scalping</option>
                                <option value="TREND">Trend Following</option>
                                {strategies.map(s => <option key={s.id} value={s.name.toUpperCase()}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <InputGroup label="Entry" name="entry_price" value={formData.entry_price} onChange={handleChange} />
                        <InputGroup label="Exit" name="exit_price" value={formData.exit_price} onChange={handleChange} />
                        <InputGroup label="SL" name="stop_loss" value={formData.stop_loss} onChange={handleChange} isRed />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <InputGroup label="Quantity" name="quantity" value={formData.quantity} onChange={handleChange} />
                        <InputGroup label="Brokerage/Fees" name="fees" value={formData.fees} onChange={handleChange} isRed />
                    </div>

                    {/* Mistakes Section */}
                    {mistakes.length > 0 && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-rose-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <HeartCrack size={12} />
                                Did you make any mistakes?
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {mistakes.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => toggleMistake(m.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight border transition-all",
                                            formData.mistake_ids.includes(m.id)
                                                ? "bg-rose-500 text-white border-rose-500 shadow-md"
                                                : "bg-white border-slate-200 text-slate-400 hover:border-rose-200"
                                        )}
                                    >
                                        {m.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1">
                        <InputGroup label="Baseline Capital / Equity" name="initial_capital" value={formData.initial_capital} onChange={handleChange} isBlue icon={<Wallet size={12} />} />
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="p-8 bg-indigo-600 text-white border border-indigo-400 rounded-3xl flex justify-between items-center shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div>
                                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">R:R Multiple</p>
                                <p className="text-3xl font-bold">{pnl.rMultiple.toFixed(2)}x</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Estimated P&L</p>
                                <p className="text-3xl font-bold">₹{pnl.net.toFixed(0)}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button type="button" onClick={onClose} className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all uppercase text-xs">Cancel</button>
                            <button type="submit" className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-xs tracking-widest shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
                                {editTrade ? 'Save Changes' : 'Record Trade'}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function InputGroup({ label, name, value, onChange, isRed = false, isBlue = false, icon }: any) {
    return (
        <div className="space-y-2">
            <label className={cn(
                "text-[9px] font-bold uppercase tracking-widest ml-1 flex items-center gap-2",
                isRed ? "text-rose-500" : isBlue ? "text-indigo-600" : "text-slate-400"
            )}>
                {icon}{label}
            </label>
            <input
                type="number"
                step="0.01"
                name={name}
                value={value}
                onChange={onChange}
                className={cn(
                    "w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:border-indigo-500 outline-none transition-all",
                    isRed && "bg-rose-50 border-rose-100 text-rose-600",
                    isBlue && "bg-indigo-50 border-indigo-100 text-indigo-600"
                )}
            />
        </div>
    );
}
