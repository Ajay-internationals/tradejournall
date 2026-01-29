import { Trophy, Flame, Target, Star, Shield, Zap, Activity, Clock, CheckCircle2, Award, Sparkles, Plus } from 'lucide-react';
import { useChallenges } from '@/hooks/useGrowth';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function Challenges() {
    const { challenges, updateProgress, isLoading } = useChallenges();
    const [streak, setStreak] = useState(5);
    const [dailyTasks, setDailyTasks] = useState([
        { id: 1, task: 'EOD Journal logged', completed: true },
        { id: 2, task: 'Risk Audit 1 trade', completed: false },
        { id: 3, task: 'Execute 0 revenge trades', completed: true },
    ]);

    const handleTaskToggle = (id: number) => {
        setDailyTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center font-black uppercase text-indigo-600 animate-pulse">Loading Missions...</div>;

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-body">
            {/* Gamified Header */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 p-10 bg-indigo-600 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform"><Trophy size={180} /></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl font-black tracking-tight mb-2">Performance Apex</h1>
                        <p className="text-indigo-100 font-bold uppercase text-[10px] mb-8">Execute with professional discipline</p>
                        <div className="flex gap-12">
                            <div><p className="text-[9px] opacity-60 font-black uppercase mb-1">Total Rewards</p><p className="text-3xl font-black">4,250 QP</p></div>
                            <div><p className="text-[9px] opacity-60 font-black uppercase mb-1">Global Rank</p><p className="text-3xl font-black">#82</p></div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-amber-500 text-white rounded-[3rem] shadow-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <Flame size={48} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest bg-black/10 px-3 py-1 rounded-full">Active Streak</span>
                    </div>
                    <div>
                        <p className="text-5xl font-black mb-1">{streak} Days</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Don't break the chain!</p>
                    </div>
                </div>

                <div className="p-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3rem] shadow-xl">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Clock size={16} className="text-indigo-500" /> Daily Sync
                    </h3>
                    <div className="space-y-4">
                        {dailyTasks.map(t => (
                            <button
                                key={t.id}
                                onClick={() => handleTaskToggle(t.id)}
                                className="w-full flex items-center justify-between p-3 bg-[var(--app-bg)]/50 rounded-2xl border border-[var(--app-border)] hover:border-indigo-500/30 transition-all text-left"
                            >
                                <span className={cn("text-[10px] font-bold uppercase", t.completed ? "text-slate-400 line-through" : "text-slate-700")}>{t.task}</span>
                                {t.completed ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 border-2 border-slate-200 rounded-full" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Missions Grid */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 px-4">Active Tactical Missions</h2>
                    <div className="flex gap-2">
                        <FilterBadge label="All" active />
                        <FilterBadge label="Discipline" />
                        <FilterBadge label="Edge" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {challenges.map((c: any) => (
                        <MissionCard key={c.id} challenge={c} onAction={() => updateProgress.mutate({ challengeId: c.id, value: c.current_value + 1 })} />
                    ))}
                    <div className="p-8 bg-[var(--app-bg)] border-2 border-dashed border-[var(--app-border)] rounded-[3rem] flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer group">
                        <Plus className="mb-4 text-slate-400 group-hover:scale-110 transition-transform" size={40} />
                        <p className="text-[10px] font-black uppercase tracking-widest">Request Custom Mission</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MissionCard({ challenge, onAction }: any) {
    const isCompleted = challenge.current_value >= challenge.target_value;
    const progress = (challenge.current_value / challenge.target_value) * 100;

    return (
        <div className={cn(
            "p-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3rem] shadow-xl relative overflow-hidden transition-all duration-500 group",
            isCompleted && "border-emerald-500/30 bg-emerald-500/5 shadow-inner"
        )}>
            <div className="flex items-center justify-between mb-8">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl group-hover:scale-105 transition-transform">
                    {challenge.type === 'DISCIPLINE' ? <Shield className="text-indigo-500" /> : <Target className="text-amber-500" />}
                </div>
                {isCompleted ? (
                    <span className="flex items-center gap-1 text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full"><Award size={10} /> Verified</span>
                ) : (
                    <span className="text-[8px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full">In Motion</span>
                )}
            </div>

            <h3 className="text-2xl font-black mb-2 tracking-tight">{challenge.title}</h3>
            <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase mb-10 min-h-[48px]">{challenge.description}</p>

            <div className="space-y-6 pt-6 border-t border-[var(--app-border)]">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[9px] font-black uppercase text-slate-400">Progress</span>
                        <span className="text-[10px] font-black">{challenge.current_value} / {challenge.target_value}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-1000", isCompleted ? "bg-emerald-500" : "bg-indigo-600")}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[8px] font-black uppercase text-slate-400">Reward</p>
                        <div className="flex items-center gap-1.5">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            <span className="text-lg font-black text-amber-600">{challenge.reward_qp} QP</span>
                        </div>
                    </div>
                    <button
                        onClick={onAction}
                        disabled={isCompleted}
                        className={cn(
                            "px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all",
                            isCompleted
                                ? "bg-emerald-500 text-white cursor-default"
                                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl active:scale-95"
                        )}
                    >
                        {isCompleted ? 'Mission Secured' : 'Sync Audit'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function FilterBadge({ label, active = false }: any) {
    return (
        <button className={cn(
            "px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
            active ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-indigo-600 bg-slate-50"
        )}>
            {label}
        </button>
    );
}
