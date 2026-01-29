import { TrendingUp, Rocket, CheckCircle2, Lock, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';
import { useRoadmap } from '@/hooks/useGrowth';
import { cn } from '@/lib/utils';

const steps = [
    {
        id: 'setup',
        title: 'Genesis',
        icon: <Rocket size={20} />,
        desc: 'Establishing platform infrastructure.',
        tasks: ['Link Data Broker', 'Surveillance Sync', 'Define Risk Unit']
    },
    {
        id: 'mechanics',
        title: 'Execution',
        icon: <Zap size={20} />,
        desc: 'Mastering mechanical precision.',
        tasks: ['Zero-Slip Entries', 'Static Exit Protocol', 'Neural Bias Audit']
    },
    {
        id: 'strategy',
        title: 'Edge',
        icon: <Target size={20} />,
        desc: 'Architecting high-probability setups.',
        tasks: ['Define Setup A+', '20-Trade Audit', 'Size Variance Control']
    },
    {
        id: 'psychology',
        title: 'Armor',
        icon: <ShieldCheck size={20} />,
        desc: 'Neural-hardening for live heat.',
        tasks: ['EOD Review Streak', 'FOMO Eradication', 'Greed-Loop Reset']
    },
    {
        id: 'scale',
        title: 'Ascent',
        icon: <TrendingUp size={20} />,
        desc: 'Scaling size with precision.',
        tasks: ['Portfolio Expansion', 'Professional Flow', 'Elite Performance']
    }
];

export default function Roadmap() {
    const { progress, toggleStep } = useRoadmap();

    const isCompleted = (id: string) => progress.some((p: any) => p.step_id === id && p.is_completed);
    const isLocked = (index: number) => {
        if (index === 0) return false;
        return !isCompleted(steps[index - 1].id);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-body">
            <header className="flex items-center gap-5">
                <div className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center shadow-2xl">
                    <TrendingUp className="w-9 h-9 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-1">Growth Roadmap</h1>
                    <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase">Phase-driven Trader Evolution</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {steps.map((step, idx) => {
                    const completed = isCompleted(step.id);
                    const locked = isLocked(idx);

                    return (
                        <div key={step.id} className={cn(
                            "group relative p-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[2.5rem] shadow-xl transition-all duration-500",
                            completed ? "border-emerald-500/20" : locked ? "opacity-60 grayscale" : "border-indigo-600/30 scale-[1.02] shadow-indigo-600/5"
                        )}>
                            <div className="flex items-center justify-between mb-8">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12",
                                    completed ? "bg-emerald-500/10 text-emerald-500" : locked ? "bg-slate-100 text-slate-400" : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                )}>
                                    {completed ? <CheckCircle2 size={24} /> : locked ? <Lock size={20} /> : step.icon}
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Phase 0{idx + 1}</p>
                                    <p className={cn("text-[8px] font-black uppercase mt-1", completed ? "text-emerald-500" : locked ? "text-slate-400" : "text-indigo-600")}>
                                        {completed ? 'Archived' : locked ? 'Locked' : 'Active'}
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-xl font-black mb-2">{step.title}</h3>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight mb-8">{step.desc}</p>

                            <div className="space-y-3 mb-10">
                                {step.tasks.map(task => (
                                    <div key={task} className="flex items-center gap-3">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", completed ? "bg-emerald-500" : "bg-slate-200")} />
                                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{task}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => !locked && toggleStep.mutate({ stepId: step.id, isCompleted: !completed })}
                                disabled={locked}
                                className={cn(
                                    "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    completed
                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                        : locked
                                            ? "bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl"
                                )}
                            >
                                {completed ? 'Protocol established' : locked ? 'Locked' : 'Establish Synergy'}
                            </button>
                        </div>
                    );
                })}

                <div className="p-8 border-2 border-dashed border-[var(--app-border)] rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <Sparkles className="text-slate-400" size={32} />
                    <div>
                        <p className="text-sm font-black uppercase">Next Horizons</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Continue evolving to unlock...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
