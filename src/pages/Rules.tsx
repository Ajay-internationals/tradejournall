import { ShieldCheck, Flame, Plus, Check, Trash2, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRules, Rule } from '@/hooks/useRules';

export default function Rules() {
    const { rules, addRule, toggleRule, deleteRule, isLoading } = useRules() as {
        rules: Rule[],
        addRule: any,
        toggleRule: any,
        deleteRule: any,
        isLoading: boolean
    };
    const [newRuleText, setNewRuleText] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddRule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRuleText.trim()) return;
        await addRule.mutateAsync(newRuleText);
        setNewRuleText('');
        setIsAdding(false);
    };

    const completedCount = rules.filter(r => r.completed).length;

    return (
        <div className="space-y-12 animate-in fade-in duration-700 font-body pb-20">
            <div className="flex items-center justify-between p-12 bg-white border border-slate-200 rounded-[4rem] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-indigo-200">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold font-heading tracking-tighter text-slate-900 uppercase">System Protocol ✨</h1>
                        <p className="text-slate-400 text-[10px] font-bold font-heading tracking-[0.4em] uppercase mt-2 opacity-50 italic">Operational Discipline Framework</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-10 py-5 bg-indigo-600 text-white font-bold font-heading rounded-full text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-100 hover:scale-105 active:scale-95"
                >
                    <Plus size={20} />
                    New Mandate
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 leading-none">
                <div className="p-14 bg-white border border-slate-200 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-10 shadow-sm group font-heading">
                    <div className="w-28 h-28 bg-indigo-50 border border-slate-200 rounded-[3rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <Flame size={48} className="text-rose-500" />
                    </div>
                    <div className="space-y-3">
                        <p className="text-6xl font-bold font-heading tracking-tighter text-slate-900 leading-none">{completedCount}/{rules.length}</p>
                        <p className="text-[10px] font-bold font-heading text-slate-400 tracking-[0.5em] uppercase opacity-40">Persistence Index</p>
                    </div>
                    <p className="text-xs text-slate-400 max-w-[240px] leading-loose italic font-bold">"Institutional discipline is the fundamental divergence between a gambler and an operator."</p>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {/* Add Rule Inline Form */}
                    {isAdding && (
                        <form onSubmit={handleAddRule} className="p-10 bg-indigo-50 border border-indigo-100 rounded-[3.5rem] flex items-center gap-6 animate-in slide-in-from-top-4 duration-500">
                            <input
                                autoFocus
                                type="text"
                                value={newRuleText}
                                onChange={(e) => setNewRuleText(e.target.value)}
                                placeholder="Define your operational constraint..."
                                className="flex-1 bg-white border-none rounded-[2rem] py-5 px-10 text-[13px] font-bold font-heading tracking-tight focus:ring-4 focus:ring-indigo-500/10 outline-none placeholder:opacity-30"
                            />
                            <button type="submit" disabled={addRule.isPending} className="p-5 bg-indigo-600 text-white rounded-[1.5rem] shadow-xl hover:bg-slate-900 transition-colors">
                                {addRule.isPending ? <Loader2 className="animate-spin" size={24} /> : <Check size={24} />}
                            </button>
                            <button type="button" onClick={() => setIsAdding(false)} className="p-5 bg-white text-slate-400 rounded-[1.5rem] shadow-sm hover:text-rose-500 transition-colors">
                                <X size={24} />
                            </button>
                        </form>
                    )}

                    {rules.length === 0 && !isAdding && (
                        <div className="p-24 text-center border-4 border-dashed border-slate-200 rounded-[4rem] opacity-40">
                            <p className="text-slate-400 font-bold font-heading uppercase tracking-[0.5em] text-[10px]">Framework Empty</p>
                            <button onClick={() => setIsAdding(true)} className="mt-6 text-indigo-600 font-bold font-heading text-xs uppercase tracking-widest underline decoration-2 underline-offset-8">Initialize First Directive</button>
                        </div>
                    )}

                    {rules.map(rule => (
                        <div
                            key={rule.id}
                            className={cn(
                                "p-10 border rounded-[3.5rem] flex items-center justify-between transition-all group hover:scale-[1.01]",
                                rule.completed
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm"
                                    : "bg-white border-slate-200 text-slate-900 shadow-sm hover:border-indigo-400"
                            )}
                        >
                            <div className="flex items-center gap-6 cursor-pointer flex-1" onClick={() => toggleRule.mutate({ id: rule.id, completed: !rule.completed })}>
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                    rule.completed ? "bg-emerald-500 text-white shadow-lg" : "bg-indigo-50 border border-slate-200"
                                )}>
                                    {rule.completed && <Check size={22} />}
                                </div>
                                <span className={cn("text-base font-bold font-heading tracking-tight", rule.completed && "line-through opacity-40")}>{rule.text}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => deleteRule.mutate(rule.id)}
                                    className="p-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 rounded-xl"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <div className={cn(
                                    "w-3 h-3 rounded-full shadow-inner",
                                    rule.completed ? "bg-emerald-400" : "bg-slate-200"
                                )} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
