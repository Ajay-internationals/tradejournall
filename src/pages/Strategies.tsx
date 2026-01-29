import { Microscope, Play, LayoutGrid, BarChart3, Target, Shield, Clock, TrendingUp, Info, Plus, ChevronRight, Activity, Filter, Trash2, Edit2, MoreVertical, X, Check, Loader2, Zap } from 'lucide-react';
import { SubHeading } from '@/components/ui/SubHeading';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useStrategies } from '@/hooks/useStrategies';
import { useTrades } from '@/hooks/useTrades';
import { calculateStats } from '@/lib/stats';
import type { Strategy } from '@/types';

export default function Strategies() {
    const { strategies, isLoading, addStrategy } = useStrategies() as { strategies: Strategy[], isLoading: boolean, addStrategy: any };
    const { trades } = useTrades();
    const [filter, setFilter] = useState('ALL');
    const [isAdding, setIsAdding] = useState(false);
    const [newStrategy, setNewStrategy] = useState({ name: '', description: '', status: 'ACTIVE', risk_per_trade: 0 });

    const strategiesWithStats = useMemo(() => {
        return strategies.map(s => {
            const strategyTrades = trades.filter(t => (t.strategy || '').toUpperCase() === s.name.toUpperCase());
            const stats = calculateStats(strategyTrades);
            return {
                ...s,
                stats
            };
        });
    }, [strategies, trades]);

    const filteredStrategies = useMemo(() => {
        if (filter === 'ALL') return strategiesWithStats;
        return strategiesWithStats.filter(s => s.status === filter);
    }, [strategiesWithStats, filter]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStrategy.name) return;
        await addStrategy.mutateAsync(newStrategy);
        setNewStrategy({ name: '', description: '', status: 'ACTIVE', risk_per_trade: 0 });
        setIsAdding(false);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 font-body pb-20">
            <header className="flex flex-col md:flex-row items-center justify-between gap-10 p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-100 group transition-transform hover:-rotate-3">
                        <Microscope className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black font-heading tracking-tight text-slate-900 uppercase">My Strategies</h1>
                        <SubHeading className="mt-2 text-indigo-500 opacity-60">How you plan to trade</SubHeading>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-10 py-5 bg-slate-900 text-white font-bold font-heading rounded-2xl text-[11px] flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
                    >
                        <Plus size={18} />
                        Add New Strategy
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
                <div className="lg:col-span-3">
                    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                        {['ALL', 'ACTIVE', 'BACKTESTING', 'ARCHIVED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-[9px] font-bold font-heading transition-all whitespace-nowrap border",
                                    filter === status
                                        ? "bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-100"
                                        : "bg-white text-slate-400 border-slate-100 hover:border-indigo-200"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-1 p-8 bg-indigo-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                        <Zap size={100} className="fill-white" />
                    </div>
                    <SubHeading className="text-indigo-300 opacity-60 mb-4">Setup Blueprints</SubHeading>
                    <div className="space-y-3 relative z-10">
                        {[
                            { name: "ORB Breakout", desc: "Opening Range Breakout setup" },
                            { name: "VWAP Reversal", desc: "Mean reversion at VWAP" },
                            { name: "VCP Setup", desc: "Volatility Compression pattern" }
                        ].map((temp, i) => (
                            <button
                                key={i}
                                onClick={() => addStrategy.mutate({ name: temp.name, description: temp.desc, status: 'ACTIVE', risk_per_trade: 0 })}
                                className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-between transition-all group/btn"
                            >
                                <span className="text-[10px] font-bold uppercase">{temp.name}</span>
                                <Plus size={12} className="opacity-40 group-hover/btn:opacity-100" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isAdding && (
                <form onSubmit={handleCreate} className="p-10 bg-white border border-indigo-100 rounded-[3rem] space-y-8 animate-in slide-in-from-top-4 duration-500 shadow-xl shadow-indigo-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black font-heading uppercase tracking-widest text-slate-400 opacity-60 ml-4">Strategy Name</label>
                            <input
                                autoFocus
                                required
                                type="text"
                                placeholder="e.g., Bullish Engulfing v1"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-8 text-sm font-bold font-heading outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                value={newStrategy.name}
                                onChange={e => setNewStrategy({ ...newStrategy, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black font-heading uppercase tracking-widest text-slate-400 opacity-60 ml-4">Current Status</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-8 text-sm font-bold font-heading outline-none focus:bg-white focus:border-indigo-500 appearance-none"
                                value={newStrategy.status}
                                onChange={e => setNewStrategy({ ...newStrategy, status: e.target.value })}
                            >
                                <option value="ACTIVE">Active (Trading Now)</option>
                                <option value="BACKTESTING">Backtesting (Testing Phase)</option>
                                <option value="ARCHIVED">Archived (Old)</option>
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black font-heading uppercase tracking-widest text-slate-400 opacity-60 ml-4">Description</label>
                            <textarea
                                placeholder="What is the setup for this strategy?"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-8 text-sm font-bold font-heading outline-none focus:bg-white focus:border-indigo-500 transition-all min-h-[100px]"
                                value={newStrategy.description}
                                onChange={e => setNewStrategy({ ...newStrategy, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black font-heading uppercase tracking-widest text-slate-400 opacity-60 ml-4">Risk Per Trade (₹)</label>
                            <input
                                type="number"
                                placeholder="500"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-8 text-sm font-bold font-heading outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                value={newStrategy.risk_per_trade}
                                onChange={e => setNewStrategy({ ...newStrategy, risk_per_trade: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black font-heading uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                        <button type="submit" disabled={addStrategy.isPending} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black font-heading uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            {addStrategy.isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                            Save Strategy
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {filteredStrategies.length === 0 && !isAdding && (
                    <div className="col-span-full p-32 text-center border-2 border-dashed border-slate-200 rounded-[4rem] opacity-50 bg-slate-50/20">
                        <p className="text-slate-400 font-black font-heading uppercase tracking-[0.4em] text-[10px]">No strategies found in this category</p>
                    </div>
                )}
                {filteredStrategies.map((strategy) => (
                    <StrategyCard key={strategy.id} strategy={strategy} />
                ))}
            </div>
        </div>
    );
}

function StrategyCard({ strategy }: { strategy: any }) {
    const { stats } = strategy;
    return (
        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 hover:border-indigo-500 transition-all group relative overflow-hidden flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div className={cn(
                    "px-4 py-2 rounded-xl text-[8px] font-black font-heading uppercase tracking-[0.2em]",
                    strategy.status === 'ACTIVE' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" :
                        strategy.status === 'BACKTESTING' ? "bg-amber-500 text-white shadow-lg shadow-amber-100" : "bg-slate-100 text-slate-500"
                )}>
                    {strategy.status}
                </div>
                <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
                    <MoreVertical size={16} />
                </button>
            </div>

            <h4 className="text-2xl font-black font-heading tracking-tight text-slate-900 uppercase mb-4 leading-tight">{strategy.name}</h4>
            <p className="text-sm text-slate-400 font-medium font-body leading-relaxed mb-10 line-clamp-2">{strategy.description || 'No description provided.'}</p>

            <div className="grid grid-cols-2 gap-6 mb-10 leading-none">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-bold font-heading text-slate-400 mb-2">Win Rate</p>
                    <p className="text-xl font-bold font-heading text-slate-900 tracking-tighter">{stats.winRate.toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-bold font-heading text-slate-400 mb-2">Profit Score</p>
                    <p className="text-xl font-bold font-heading text-slate-900 tracking-tighter">{stats.profitFactor.toFixed(2)}</p>
                </div>
            </div>

            <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <Shield size={14} className="text-indigo-600" />
                        <span className="text-[9px] font-bold font-heading uppercase text-indigo-900">Current Risk</span>
                    </div>
                    <span className="text-[11px] font-black font-heading text-indigo-600">₹{strategy.risk_per_trade || 0}</span>
                </div>
                <button className="w-full py-5 bg-slate-900 text-white font-black font-heading rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg group-hover:bg-indigo-600 transition-all">
                    Trade History ({stats.totalTrades})
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}
