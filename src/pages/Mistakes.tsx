import { AlertOctagon, HeartCrack, Zap, Search, ShieldAlert, Activity, BarChart, CheckCircle2, Plus, Trash2, X } from 'lucide-react';
import { SubHeading } from '@/components/ui/SubHeading';
import { cn } from '@/lib/utils';
import { useTrades } from '@/hooks/useTrades';
import { useMistakes } from '@/hooks/useMistakes';
import { useState, useMemo } from 'react';

export default function Mistakes() {
    const { trades } = useTrades();
    const { mistakes, addMistake, deleteMistake } = useMistakes() as { mistakes: any[], addMistake: any, deleteMistake: any };
    const [isAdding, setIsAdding] = useState(false);
    const [newMistake, setNewMistake] = useState({ title: '', severity: 'MEDIUM' });

    const mistakesWithStats = useMemo(() => {
        return mistakes.map(m => {
            const relatedTrades = trades.filter(t => t.mistake_ids?.includes(m.id));
            const totalCost = relatedTrades.reduce((acc, t) => acc + (t.net_pnl < 0 ? Math.abs(t.net_pnl) : 0), 0);
            return {
                ...m,
                tradeCount: relatedTrades.length,
                totalCost
            };
        }).sort((a, b) => b.totalCost - a.totalCost);
    }, [mistakes, trades]);

    const totalMoneyLost = useMemo(() => {
        return mistakesWithStats.reduce((acc, m) => acc + m.totalCost, 0);
    }, [mistakesWithStats]);

    const handleAddMistake = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMistake.title) return;
        await addMistake.mutateAsync(newMistake);
        setNewMistake({ title: '', severity: 'MEDIUM' });
        setIsAdding(false);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-body">
            <header className="flex flex-col md:flex-row items-center justify-between gap-10 p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl flex items-center justify-center shadow-xl shadow-rose-100 group transition-transform hover:-rotate-3">
                        <AlertOctagon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900 uppercase">Trading Mistakes</h1>
                        <SubHeading className="mt-2 text-rose-500 opacity-60">See where you are losing money</SubHeading>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-10 py-5 bg-slate-900 text-white font-bold font-heading rounded-2xl text-[11px] uppercase  flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
                    >
                        <Plus size={18} />
                        Add New Mistake
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 leading-none">
                <AuditCard label="Improvement Score" value="7.4/10" sub="Better than last week" icon={<CheckCircle2 color="#10b981" size={20} />} />
                <AuditCard label="Money Lost" value={`₹${(totalMoneyLost / 1000).toFixed(1)}k`} sub="Total from all mistakes" icon={<ShieldAlert color="#f43f5e" size={20} />} />
                <AuditCard label="Common Triggers" value={mistakes.length} sub="Unique mistakes found" icon={<BarChart color="#f43f5e" size={20} />} />
            </div>

            {isAdding && (
                <form onSubmit={handleAddMistake} className="p-10 bg-white border border-rose-100 rounded-[3rem] flex flex-col md:flex-row gap-6 animate-in slide-in-from-top-4 duration-500 shadow-xl shadow-rose-50/50">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold font-heading uppercase  text-slate-400 opacity-60 ml-4">Mistake Name</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g., Revenge Trading, FOMO, Big Size..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-8 text-sm font-bold font-heading outline-none focus:bg-white focus:border-rose-500 transition-all"
                            value={newMistake.title}
                            onChange={e => setNewMistake({ ...newMistake, title: e.target.value })}
                        />
                    </div>
                    <div className="w-full md:w-64 space-y-2">
                        <label className="text-[10px] font-bold font-heading uppercase  text-slate-400 opacity-60 ml-4">Danger Level</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-8 text-sm font-bold font-heading outline-none focus:bg-white focus:border-rose-500 appearance-none"
                            value={newMistake.severity}
                            onChange={e => setNewMistake({ ...newMistake, severity: e.target.value })}
                        >
                            <option value="LOW">Low Risk</option>
                            <option value="MEDIUM">Medium Risk</option>
                            <option value="HIGH">High Risk</option>
                            <option value="CRITICAL">Critical Loss</option>
                        </select>
                    </div>
                    <div className="flex items-end gap-3 pb-1">
                        <button type="submit" className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-bold font-heading uppercase text-[10px]  shadow-lg shadow-rose-100 hover:scale-105 active:scale-95 transition-all">Save Mistake</button>
                        <button type="button" onClick={() => setIsAdding(false)} className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:text-rose-500 transition-all"><X size={20} /></button>
                    </div>
                </form>
            )}

            <div className="space-y-8">
                <SubHeading className="text-center opacity-40">My Common Mistakes</SubHeading>
                {mistakesWithStats.length === 0 ? (
                    <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[4rem] opacity-50 bg-slate-50/20">
                        <p className="text-slate-400 font-bold font-heading uppercase tracking-[0.4em] text-[10px]">No mistakes logged yet. Good job!</p>
                        <button onClick={() => setIsAdding(true)} className="mt-4 text-rose-500 font-bold font-heading text-[10px] uppercase  underline decoration-2 underline-offset-8">Add your first mistake</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mistakesWithStats.map((p) => (
                            <div key={p.id} className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm hover:border-rose-200 transition-all group relative overflow-hidden flex flex-col">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner group-hover:bg-rose-50 transition-colors">
                                        <HeartCrack className={cn(
                                            "w-6 h-6",
                                            p.severity === 'CRITICAL' ? "text-rose-600" : "text-amber-500"
                                        )} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "px-4 py-2 rounded-xl text-[9px] font-bold font-heading uppercase ",
                                            p.severity === 'CRITICAL' || p.severity === 'HIGH' ? "bg-rose-500 text-white shadow-lg shadow-rose-100" : "bg-slate-100 text-slate-500"
                                        )}>
                                            {p.severity}
                                        </span>
                                        <button
                                            onClick={() => deleteMistake.mutate(p.id)}
                                            className="p-2 text-slate-200 hover:text-rose-500 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <h4 className="text-2xl font-bold font-heading tracking-tight uppercase mb-2 text-slate-900">{p.title}</h4>
                                <div className="flex items-center gap-8 mb-10">
                                    <div>
                                        <p className="text-[9px] font-bold font-heading uppercase text-slate-400  mb-1 opacity-50">Total Loss</p>
                                        <p className="text-2xl font-bold font-heading tracking-tight text-rose-500">₹{p.totalCost.toLocaleString()}</p>
                                    </div>
                                    <div className="h-8 w-[1px] bg-slate-100" />
                                    <div>
                                        <p className="text-[9px] font-bold font-heading uppercase text-slate-400  mb-1 opacity-50">How Often</p>
                                        <p className="text-2xl font-bold font-heading tracking-tight text-slate-900">{p.tradeCount}x</p>
                                    </div>
                                </div>
                                <div className="mt-auto p-6 bg-slate-900 text-white rounded-[1.5rem] shadow-xl">
                                    <p className="text-[8px] font-bold font-heading uppercase tracking-[0.3em] mb-3 opacity-40">How to Fix</p>
                                    <p className="text-[11px] font-bold font-heading uppercase  leading-relaxed">
                                        {p.severity === 'CRITICAL' ? 'Stop trading for 1 hour after this happens.' : 'Review your checklist before next entry.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function AuditCard({ label, value, sub, icon }: any) {
    return (
        <div className="p-10 bg-white border border-slate-200 rounded-[3.5rem] shadow-sm flex items-center justify-between hover:scale-[1.02] transition-all font-heading">
            <div className="leading-none">
                <p className="text-[10px] font-bold font-heading uppercase tracking-[0.3em] text-indigo-500/40 mb-3">{label}</p>
                <div className="flex items-baseline gap-4">
                    <p className="text-4xl font-bold font-heading tracking-tighter text-slate-900">{value}</p>
                    <p className="text-[10px] font-bold font-heading text-rose-500 uppercase ">{sub}</p>
                </div>
            </div>
            <div className="w-16 h-16 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl flex items-center justify-center shadow-inner">
                {icon}
            </div>
        </div>
    );
}
