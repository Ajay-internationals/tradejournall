import { ShieldCheck, Flame, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Rules() {
    const [rules, setRules] = useState([
        { id: 1, text: 'Never risk more than 1% per trade', completed: true },
        { id: 2, text: 'Wait for candle close before entry', completed: false },
        { id: 3, text: 'No trades after 3 PM', completed: false },
        { id: 4, text: 'Maximum 3 trades per day', completed: true },
    ]);

    const toggleRule = (id: number) => {
        setRules(rules.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">System Rules</h1>
                        <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Your institutional framework for discipline</p>
                    </div>
                </div>
                <button className="px-6 py-3 bg-white text-black font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-slate-200 transition-all">
                    <Plus size={16} />
                    New Rule
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-10 bg-white border border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-lg">
                        <Flame size={40} className="text-white" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-5xl font-bold text-slate-900">2/4</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Commitment Today</p>
                    </div>
                    <p className="text-sm text-slate-500 max-w-xs leading-relaxed">Systematic discipline is the difference between a gambler and an operator.</p>
                </div>

                <div className="space-y-4">
                    {rules.map(rule => (
                        <div
                            key={rule.id}
                            onClick={() => toggleRule(rule.id)}
                            className={cn(
                                "p-6 border rounded-[2rem] flex items-center justify-between cursor-pointer transition-all group",
                                rule.completed
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                                    rule.completed ? "bg-emerald-500 text-white" : "bg-white/5"
                                )}>
                                    {rule.completed && <Check size={18} />}
                                </div>
                                <span className="font-bold">{rule.text}</span>
                            </div>
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                rule.completed ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "bg-slate-700"
                            )} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
