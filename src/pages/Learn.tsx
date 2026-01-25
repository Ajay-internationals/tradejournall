import { Brain, PlayCircle, BookCheck, Sparkles, ChevronRight, Search, Zap, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const curricula = [
    {
        id: 'structure',
        title: 'Market Structure 101',
        duration: '2h 15m',
        lessons: 12,
        category: 'Institutional',
        level: 'Advanced',
        color: 'bg-indigo-600',
        description: 'Master the mechanical identification of institutional order blocks and liquidity sweeps.'
    },
    {
        id: 'psychology',
        title: 'Emotion Regulation',
        duration: '1h 45m',
        lessons: 8,
        category: 'Psychology',
        level: 'Intermediate',
        color: 'bg-purple-600',
        description: 'Deconstruct neurological biases and develop a systematic framework for risk neutrality.'
    },
    {
        id: 'volatility',
        title: 'Volatility Expansion',
        duration: '3h 10m',
        lessons: 15,
        category: 'Strategic',
        level: 'Elite',
        color: 'bg-rose-600',
        description: 'Trading the VCP (Volatility Contraction Pattern) for explosive asymmetric breakouts.'
    }
];

export default function Learn() {
    const [activeTab, setActiveTab] = useState('ALL');

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg">
                        <Brain className="w-9 h-9 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Knowledge Hub</h1>
                        <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Institutional training for the serious operator</p>
                    </div>
                </div>
                <div className="flex bg-[var(--app-bg)]/50 p-1 rounded-2xl border border-[var(--app-border)] shrink-0 shadow-sm">
                    {['ALL', 'INSTITUTIONAL', 'PSYCHOLOGY', 'ELITE'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all",
                                activeTab === tab ? "bg-indigo-600 text-white shadow-lg" : "text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                            )}
                        >{tab}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {curricula.map((course) => (
                    <div key={course.id} className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3rem] overflow-hidden group hover:border-indigo-500/40 hover:translate-y-[-4px] transition-all flex flex-col h-full shadow-2xl">
                        <div className={cn("h-48 relative flex items-center justify-center overflow-hidden", course.color + "/10")}>
                            <div className={cn("absolute inset-0 opacity-10", course.color)} />
                            <PlayCircle className="w-16 h-16 text-white opacity-40 group-hover:opacity-100 transition-all z-10 group-hover:scale-110" />
                            <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                                <Star size={10} className="text-amber-500 fill-amber-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white">{course.level}</span>
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 bg-[var(--app-bg)]/50 rounded text-[8px] font-bold text-[var(--app-text-muted)] uppercase tracking-[0.2em] border border-[var(--app-border)]">{course.category}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-[var(--app-text)]">{course.title}</h3>
                            <p className="text-[var(--app-text-muted)] text-sm leading-relaxed mb-8 flex-1">{course.description}</p>

                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-[var(--app-border)] mb-8">
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-indigo-500" />
                                    <span className="text-xs font-bold text-[var(--app-text)]">{course.lessons} Units</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-purple-500" />
                                    <span className="text-xs font-bold text-[var(--app-text)]">{course.duration}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20">
                                Enter Curriculum
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-10 bg-gradient-to-br from-purple-600/10 to-[var(--app-card)] border border-purple-500/20 rounded-[3rem] relative overflow-hidden group shadow-xl">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-600/5 blur-[80px] rounded-full" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-purple-500 mb-6 font-bold uppercase tracking-widest text-xs">
                            <Sparkles size={16} /> Beta Access
                        </div>
                        <h2 className="text-3xl font-bold mb-4 leading-tight text-[var(--app-text)]">Neural Trading Matrix</h2>
                        <p className="text-[var(--app-text-muted)] text-base leading-relaxed mb-10 max-w-md">Our next-gen training simulator uses AI to analyze your decision-making in historical high-volatility sessions.</p>
                        <button className="px-10 py-4 bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all hover:bg-purple-700">Request Early Access</button>
                    </div>
                </div>

                <div className="p-10 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3rem] flex flex-col justify-center shadow-xl">
                    <h4 className="text-[10px] font-bold text-[var(--app-text-muted)] tracking-[0.3em] uppercase mb-8">Trending Topics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Order Flow', 'Gamma Exposure', 'VCP Mastery', 'Bias Neutrality', 'Market Profile', 'Institutional Liquidity'].map(topic => (
                            <div key={topic} className="p-5 bg-[var(--app-bg)]/50 border border-[var(--app-border)] rounded-2xl hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all cursor-pointer group flex items-center justify-between shadow-sm">
                                <span className="text-xs font-bold text-[var(--app-text-muted)] group-hover:text-[var(--app-text)]">{topic}</span>
                                <ChevronRight size={14} className="text-[var(--app-border)] group-hover:text-purple-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
