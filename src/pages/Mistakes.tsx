import { AlertOctagon, HeartCrack, Zap, Search, ShieldAlert, Activity, BarChart, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrades } from '@/hooks/useTrades';

export default function Mistakes() {
    const { trades } = useTrades();

    const patterns = [
        { title: 'FOMO Entries', icon: <HeartCrack className="text-rose-500" />, level: 'High', trades: 8, cost: '₹12,400', recovery: 'Wait for candle close' },
        { title: 'Revenge Trading', icon: <Zap className="text-amber-500" />, level: 'Critical', trades: 3, cost: '₹28,500', recovery: 'Enforce 1-hour cooling' },
        { title: 'Sizing Drift', icon: <Activity className="text-indigo-500" />, level: 'Medium', trades: 12, cost: '₹8,200', recovery: 'Hard limit risk per trade' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-body">
            <header className="flex flex-col md:flex-row items-center justify-between gap-10 p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl flex items-center justify-center shadow-xl shadow-rose-100 group transition-transform hover:-rotate-3">
                        <AlertOctagon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black font-heading tracking-tight text-slate-900 uppercase">Risk Audit</h1>
                        <p className="text-[10px] font-black font-heading text-rose-500 uppercase tracking-[0.3em] mt-2 opacity-60">Execution Leakage Diagnostics</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <StatusPulse label="Neural Scan Active" color="bg-emerald-500" />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 leading-none">
                <AuditCard label="Leakage Intensity" value="7.4/10" sub="High Alpha" icon={<BarChart color="#f43f5e" size={20} />} />
                <AuditCard label="Capital Decay" value="₹49.1k" sub="Total Audit" icon={<ShieldAlert color="#f43f5e" size={20} />} />
                <AuditCard label="Bias Correction" value="44%" sub="Stability" icon={<CheckCircle2 color="#10b981" size={20} />} />
            </div>

            <div className="space-y-8">
                <h3 className="text-[10px] font-black font-heading uppercase tracking-[0.4em] text-slate-400 text-center opacity-40">Recurring Pattern Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {patterns.map((p) => (
                        <div key={p.title} className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm hover:border-rose-200 transition-all group relative overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner group-hover:bg-rose-50 transition-colors">
                                    {p.icon}
                                </div>
                                <span className={cn(
                                    "px-4 py-2 rounded-xl text-[9px] font-black font-heading uppercase tracking-widest",
                                    p.level === 'Critical' ? "bg-rose-500 text-white shadow-lg shadow-rose-100" : "bg-slate-100 text-slate-500"
                                )}>
                                    {p.level}
                                </span>
                            </div>
                            <h4 className="text-2xl font-black font-heading tracking-tight uppercase mb-2 text-slate-900">{p.title}</h4>
                            <div className="flex items-center gap-8 mb-10">
                                <div>
                                    <p className="text-[9px] font-black font-heading uppercase text-slate-400 tracking-widest mb-1 opacity-50">Impact</p>
                                    <p className="text-2xl font-black font-heading tracking-tight text-rose-500">{p.cost}</p>
                                </div>
                                <div className="h-8 w-[1px] bg-slate-100" />
                                <div>
                                    <p className="text-[9px] font-black font-heading uppercase text-slate-400 tracking-widest mb-1 opacity-50">Freq</p>
                                    <p className="text-2xl font-black font-heading tracking-tight text-slate-900">{p.trades}x</p>
                                </div>
                            </div>
                            <div className="mt-auto p-6 bg-slate-900 text-white rounded-[1.5rem] shadow-xl">
                                <p className="text-[8px] font-black font-heading uppercase tracking-[0.3em] mb-3 opacity-40">Protocol</p>
                                <p className="text-[11px] font-black font-heading uppercase tracking-widest leading-relaxed">{p.recovery}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-16 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[4rem] text-center space-y-8 shadow-sm">
                <div className="w-20 h-20 bg-white shadow-xl rounded-[2rem] flex items-center justify-center mx-auto group hover:scale-105 transition-all">
                    <Search className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={32} />
                </div>
                <div>
                    <h3 className="text-2xl font-black font-heading tracking-tight uppercase text-slate-900 mb-2">Cognitive Behavioral Audit</h3>
                    <p className="text-[11px] font-bold font-heading text-slate-400 max-w-md mx-auto leading-relaxed uppercase tracking-[0.2em] opacity-60">Identify and isolate psychological triggers that cause execution deviation.</p>
                </div>
                <button className="px-12 py-5 bg-white border border-slate-200 text-slate-900 font-black font-heading uppercase tracking-widest rounded-2xl text-[10px] hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95">Initiate Search Protocol</button>
            </div>
        </div>
    );
}

function StatusPulse({ label, color }: { label: string, color: string }) {
    return (
        <div className="flex items-center gap-4 px-8 py-4 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] shadow-inner">
            <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]", color)} />
            <span className="text-[10px] font-bold font-heading uppercase tracking-[0.3em] text-indigo-500">{label}</span>
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
                    <p className="text-[10px] font-bold font-heading text-rose-500 uppercase tracking-widest">{sub}</p>
                </div>
            </div>
            <div className="w-16 h-16 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl flex items-center justify-center shadow-inner">
                {icon}
            </div>
        </div>
    );
}
