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
        <div className="space-y-8 animate-in fade-in duration-700 font-body">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900">System Rules</h1>
                        <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Your institutional framework for discipline</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg"
                >
                    <Plus size={16} />
                    New Rule
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="p-10 bg-white border border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-lg">
                        <Flame size={40} className="text-white" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-5xl font-bold text-slate-900">{completedCount}/{rules.length}</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Commitment Today</p>
                    </div>
                    <p className="text-sm text-slate-500 max-w-xs leading-relaxed italic">"Systematic discipline is the difference between a gambler and an operator."</p>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    {/* Add Rule Inline Form */}
                    {isAdding && (
                        <form onSubmit={handleAddRule} className="p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
                            <input
                                autoFocus
                                type="text"
                                value={newRuleText}
                                onChange={(e) => setNewRuleText(e.target.value)}
                                placeholder="Enter your discipline rule..."
                                className="flex-1 bg-white border-none rounded-xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button type="submit" disabled={addRule.isPending} className="p-3 bg-indigo-600 text-white rounded-xl">
                                {addRule.isPending ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                            </button>
                            <button type="button" onClick={() => setIsAdding(false)} className="p-3 bg-white text-slate-400 rounded-xl">
                                <X size={18} />
                            </button>
                        </form>
                    )}

                    {rules.length === 0 && !isAdding && (
                        <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No rules defined</p>
                            <button onClick={() => setIsAdding(true)} className="mt-4 text-indigo-600 font-bold text-sm underline">Add your first rule</button>
                        </div>
                    )}

                    {rules.map(rule => (
                        <div
                            key={rule.id}
                            className={cn(
                                "p-6 border rounded-[2rem] flex items-center justify-between transition-all group",
                                rule.completed
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200"
                            )}
                        >
                            <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleRule.mutate({ id: rule.id, completed: !rule.completed })}>
                                <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                                    rule.completed ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-50 border border-slate-100"
                                )}>
                                    {rule.completed && <Check size={18} />}
                                </div>
                                <span className={cn("font-bold", rule.completed && "line-through opacity-60")}>{rule.text}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => deleteRule.mutate(rule.id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    rule.completed ? "bg-emerald-400" : "bg-slate-300"
                                )} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
