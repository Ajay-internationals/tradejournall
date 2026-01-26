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
            <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-indigo-200 shrink-0">
                        <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold font-heading tracking-tighter text-slate-900 uppercase leading-none">System Protocol</h1>
                        <p className="text-slate-400 text-[10px] font-bold font-heading tracking-[0.4em] uppercase mt-3 opacity-50 italic">Operational Discipline</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full md:w-auto px-10 py-5 bg-indigo-600 text-white font-bold font-heading rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
                >
                    <Plus size={20} />
                    New Mandate
                </button>
            </div>

            {/* Persistence Index & Quick Intro */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 leading-none">
                <div className="p-12 bg-white border border-slate-200 rounded-[3.5rem] flex flex-col items-center justify-center text-center space-y-8 shadow-sm group">
                    <div className="w-24 h-24 bg-indigo-50 border border-slate-200 rounded-[2.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <Flame size={40} className="text-rose-500" />
                    </div>
                    <div className="space-y-3">
                        <p className="text-5xl font-bold font-heading tracking-tighter text-slate-900 leading-none">{completedCount}/{rules.length}</p>
                        <p className="text-[10px] font-bold font-heading text-slate-400 tracking-[0.4em] uppercase opacity-40">Persistence Index</p>
                    </div>
                    <p className="text-xs text-slate-400 max-w-[200px] leading-loose italic font-bold">"Discipline is the divergence between a gambler and an operator."</p>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {/* Add Rule Inline Form */}
                    {isAdding && (
                        <form onSubmit={handleAddRule} className="p-8 md:p-10 bg-indigo-50 border border-indigo-100 rounded-[3rem] flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-top-4 duration-500">
                            <input
                                autoFocus
                                type="text"
                                value={newRuleText}
                                onChange={(e) => setNewRuleText(e.target.value)}
                                placeholder="Define operational constraint..."
                                className="w-full md:flex-1 bg-white border-none rounded-2xl py-5 px-8 text-[13px] font-bold font-heading tracking-tight focus:ring-4 focus:ring-indigo-500/10 outline-none placeholder:opacity-30"
                            />
                            <div className="flex gap-4 w-full md:w-auto">
                                <button type="submit" disabled={addRule.isPending} className="flex-1 md:flex-none p-5 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-slate-900 transition-colors flex items-center justify-center">
                                    {addRule.isPending ? <Loader2 className="animate-spin" size={24} /> : <Check size={24} />}
                                </button>
                                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 md:flex-none p-5 bg-white text-slate-400 rounded-2xl shadow-sm hover:text-rose-500 transition-colors flex items-center justify-center">
                                    <X size={24} />
                                </button>
                            </div>
                        </form>
                    )}

                    {rules.length === 0 && !isAdding && (
                        <div className="p-20 text-center border-4 border-dashed border-slate-200 rounded-[3.5rem] opacity-40">
                            <p className="text-slate-400 font-bold font-heading uppercase tracking-[0.5em] text-[10px]">Framework Empty</p>
                            <button onClick={() => setIsAdding(true)} className="mt-6 text-indigo-600 font-bold font-heading text-xs uppercase tracking-widest underline decoration-2 underline-offset-8">Initialize Directive</button>
                        </div>
                    )}

                    <div className="space-y-4">
                        {rules.map(rule => (
                            <div
                                key={rule.id}
                                className={cn(
                                    "p-8 md:p-10 border rounded-[3rem] flex flex-col md:flex-row items-center justify-between transition-all group hover:scale-[1.01] gap-6",
                                    rule.completed
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm"
                                        : "bg-white border-slate-200 text-slate-900 shadow-sm hover:border-indigo-400"
                                )}
                            >
                                <div className="flex items-center gap-6 cursor-pointer w-full md:w-auto flex-1" onClick={() => toggleRule.mutate({ id: rule.id, completed: !rule.completed })}>
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0",
                                        rule.completed ? "bg-emerald-500 text-white shadow-lg" : "bg-indigo-50 border border-slate-200"
                                    )}>
                                        {rule.completed && <Check size={20} />}
                                    </div>
                                    <span className={cn("text-base font-bold font-heading tracking-tight", rule.completed && "line-through opacity-40")}>{rule.text}</span>
                                </div>
                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                                    <button
                                        onClick={() => deleteRule.mutate(rule.id)}
                                        className="p-3 text-slate-300 hover:text-rose-500 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 rounded-xl flex items-center gap-2"
                                    >
                                        <Trash2 size={20} />
                                        <span className="md:hidden text-[10px] font-bold uppercase tracking-widest">Delete</span>
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
        </div>
    );
}
