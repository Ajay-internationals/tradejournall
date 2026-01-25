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
            <header className="flex flex-col md:flex-row items-center justify-between gap-10 p-10 bg-white border border-slate-200 rounded-[3.5rem] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center shadow-3xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-rose-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <AlertOctagon className="w-10 h-10 text-white relative z-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-rose-600 uppercase">Risk Audit ✨</h1>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mt-2 opacity-60">Execution Leakage Diagnostics</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <StatusPulse label="Neural Scan Active" color="bg-emerald-500" />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 leading-none">
                <AuditCard label="Leakage Intensity" value="7.4/10" sub="Decreasing" icon={<BarChart color="#f43f5e" size={20} />} />
                <AuditCard label="Capital Decay" value="₹49.1k" sub="Audit Loss" icon={<ShieldAlert color="#f43f5e" size={20} />} />
                <AuditCard label="Bias Correction" value="44%" sub="Monthly Rate" icon={<CheckCircle2 color="#10b981" size={20} />} />
            </div>

            <div className="space-y-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500/30 text-center">Recurring Pattern Identification Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {patterns.map((p) => (
                        <div key={p.title} className="bg-white border border-slate-200 p-10 rounded-[4rem] shadow-sm hover:shadow-lg hover:scale-[1.05] transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000 text-rose-500">
                                <AlertOctagon size={150} />
                            </div>
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className="w-16 h-16 bg-indigo-500/5 rounded-2xl flex items-center justify-center border border-indigo-500/10 shadow-inner group-hover:bg-rose-500/10 transition-colors">
                                    {p.icon}
                                </div>
                                <span className={cn(
                                    "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl italic",
                                    p.level === 'Critical' ? "bg-rose-500 text-white shadow-rose-500/20" : "bg-white text-indigo-500 border border-indigo-500/10"
                                )}>
                                    {p.level} Protocol
                                </span>
                            </div>
                            <h4 className="text-2xl font-black tracking-tighter uppercase mb-2 text-slate-900">{p.title}</h4>
                            <div className="flex items-center gap-6 mb-10 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-indigo-500/40 tracking-widest mb-2">Capital Impact</p>
                                    <p className="text-2xl font-black tracking-tighter text-rose-500">{p.cost}</p>
                                </div>
                                <div className="h-10 w-[1px] bg-indigo-500/10" />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-indigo-500/40 tracking-widest mb-2">Sync Log</p>
                                    <p className="text-2xl font-black tracking-tighter text-slate-900">{p.trades}x</p>
                                </div>
                            </div>
                            <div className="p-6 bg-indigo-600 text-white rounded-[2rem] shadow-3xl">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 opacity-60">Correction Protocol</p>
                                <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">{p.recovery}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-16 bg-white border border-dashed border-slate-200 rounded-[5rem] text-center space-y-10 shadow-sm">
                <div className="w-24 h-24 bg-indigo-500/5 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border border-indigo-500/10 group hover:scale-110 transition-all">
                    <Search className="text-indigo-300 group-hover:text-indigo-600 transition-colors" size={40} />
                </div>
                <div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase text-slate-900 mb-3">Deep Cognitive Audit ✨</h3>
                    <p className="text-[11px] font-black text-indigo-500/50 max-w-lg mx-auto leading-relaxed uppercase tracking-[0.2em] opacity-60">Select a trade stream to perform a high-resolution behavior audit and identify neurological resonance triggers.</p>
                </div>
                <button className="px-12 py-6 bg-white border border-indigo-500/10 text-indigo-600 font-black uppercase tracking-[0.3em] rounded-3xl text-[10px] hover:bg-black hover:text-white transition-all shadow-3xl hover:scale-105 active:scale-95">Initiate Search Protocol</button>
            </div>
        </div>
    );
}

function StatusPulse({ label, color }: { label: string, color: string }) {
    return (
        <div className="flex items-center gap-4 px-8 py-4 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] shadow-inner">
            <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]", color)} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">{label}</span>
        </div>
    );
}

function AuditCard({ label, value, sub, icon }: any) {
    return (
        <div className="p-10 bg-white border border-slate-200 rounded-[3.5rem] shadow-sm flex items-center justify-between hover:scale-[1.02] transition-all">
            <div className="leading-none">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500/40 mb-3">{label}</p>
                <div className="flex items-baseline gap-4">
                    <p className="text-4xl font-black tracking-tighter text-slate-900">{value}</p>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{sub}</p>
                </div>
            </div>
            <div className="w-16 h-16 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl flex items-center justify-center shadow-inner">
                {icon}
            </div>
        </div>
    );
}
