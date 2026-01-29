import { ShieldCheck, Flame, Plus, Check, Trash2, Loader2, X, Tag, AlertCircle, Zap } from 'lucide-react';
import { SubHeading } from '@/components/ui/SubHeading';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRules, Rule } from '@/hooks/useRules';

export default function Rules() {
    const { rules, addRule, toggleRule, deleteRule, isLoading } = useRules();
    const [newRuleData, setNewRuleData] = useState({ text: '', category: 'GENERAL', priority: 'P2' });
    const [isAdding, setIsAdding] = useState(false);
    const [filter, setFilter] = useState('ALL');

    const handleAddRule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRuleData.text.trim()) return;
        await addRule.mutateAsync(newRuleData);
        setNewRuleData({ text: '', category: 'GENERAL', priority: 'P2' });
        setIsAdding(false);
    };

    const filteredRules = rules.filter(r => filter === 'ALL' || r.category === filter);
    const completedCount = rules.filter(r => r.completed).length;

    return (
        <div className="space-y-12 animate-in fade-in duration-700 font-body pb-20">
            <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-100 group transition-transform hover:rotate-3">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900 uppercase">My Trading Rules</h1>
                        <SubHeading className="mt-2 opacity-50">Follow these to stay profitable</SubHeading>
                    </div>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white font-bold font-heading rounded-2xl text-[11px] flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={18} />
                    Add New Rule
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 leading-none">
                <div className="p-12 bg-white border border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-8 shadow-sm group font-heading hover:border-indigo-200 transition-all">
                    <div className="w-24 h-24 bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 rounded-[2.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <Flame size={40} className="text-rose-500" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-5xl font-bold font-heading tracking-tight text-slate-900 leading-none">{completedCount}/{rules.length}</p>
                        <p className="text-[10px] font-bold font-heading text-slate-400 tracking-[0.4em] uppercase opacity-40">Rules Followed Today</p>
                    </div>
                    <p className="text-xs text-slate-400 max-w-[220px] leading-relaxed italic font-bold">"Discipline is the difference between a gambler and a professional."</p>
                </div>

                <div className="p-10 bg-indigo-900 text-white rounded-[3rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                        <Zap size={140} className="fill-white" />
                    </div>
                    <SubHeading className="text-indigo-300 opacity-60">Rule Blueprints</SubHeading>
                    <div className="space-y-4 relative z-10">
                        {[
                            { text: "Max 3 Trades / Day", cat: "RISK" },
                            { text: "Hard SL on Every Entry", cat: "RISK" },
                            { text: "No Revenge Trading", cat: "MINDSET" }
                        ].map((blueprint, i) => (
                            <button
                                key={i}
                                onClick={() => addRule.mutate({ text: blueprint.text, category: blueprint.cat as any, priority: 'P1' })}
                                className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-between transition-all group/btn"
                            >
                                <span className="text-[11px] font-bold uppercase ">{blueprint.text}</span>
                                <Plus size={14} className="opacity-40 group-hover/btn:opacity-100" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-12 bg-white border border-slate-200 rounded-[3rem] shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                    <SubHeading className="opacity-40">System Health</SubHeading>
                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(completedCount / (rules.length || 1)) * 100}%` }} />
                    </div>
                    <p className="text-[10px] font-bold uppercase  text-slate-400">{(completedCount / (rules.length || 1) * 100).toFixed(0)}% Integrity</p>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {['ALL', 'RISK', 'MINDSET', 'EXECUTION', 'GENERAL'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-[9px] font-bold font-heading transition-all whitespace-nowrap border",
                                    filter === cat
                                        ? "bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-100"
                                        : "bg-white text-slate-400 border-slate-100 hover:border-indigo-200"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Add Rule Inline Form */}
                    {isAdding && (
                        <form onSubmit={handleAddRule} className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] space-y-4 animate-in slide-in-from-top-4 duration-500">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newRuleData.text}
                                    onChange={(e) => setNewRuleData({ ...newRuleData, text: e.target.value })}
                                    placeholder="I will not trade after 3 losses..."
                                    className="flex-1 w-full bg-white border border-slate-200 rounded-2xl py-4 px-8 text-sm font-bold font-heading outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                />
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button type="submit" disabled={addRule.isPending} className="flex-1 sm:flex-none p-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-slate-900 transition-all active:scale-95">
                                        {addRule.isPending ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                    </button>
                                    <button type="button" onClick={() => setIsAdding(false)} className="flex-1 sm:flex-none p-4 bg-white text-slate-400 rounded-xl shadow-sm hover:text-rose-500 transition-all active:scale-95">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 px-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-bold font-heading text-slate-400 uppercase  opacity-60">Category</p>
                                    <select
                                        value={newRuleData.category}
                                        onChange={e => setNewRuleData({ ...newRuleData, category: e.target.value })}
                                        className="bg-transparent border-none text-[10px] font-bold font-heading uppercase  text-indigo-600 outline-none p-0 cursor-pointer appearance-none"
                                    >
                                        <option value="GENERAL">General</option>
                                        <option value="RISK">Risk</option>
                                        <option value="MINDSET">Mindset</option>
                                        <option value="EXECUTION">Execution</option>
                                    </select>
                                </div>
                                <div className="space-y-1 border-l border-slate-200 pl-4">
                                    <p className="text-[8px] font-bold font-heading text-slate-400 uppercase  opacity-60">Priority</p>
                                    <select
                                        value={newRuleData.priority}
                                        onChange={e => setNewRuleData({ ...newRuleData, priority: e.target.value })}
                                        className="bg-transparent border-none text-[10px] font-bold font-heading uppercase  text-indigo-600 outline-none p-0 cursor-pointer appearance-none"
                                    >
                                        <option value="P1">P1 (Critical)</option>
                                        <option value="P2">P2 (Standard)</option>
                                        <option value="P3">P3 (Minor)</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    )}

                    {filteredRules.length === 0 && !isAdding && (
                        <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] opacity-50 bg-slate-50/30">
                            <p className="text-slate-400 font-bold font-heading uppercase tracking-[0.4em] text-[10px]">No rules in this category</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {filteredRules.map(rule => (
                            <div
                                key={rule.id}
                                className={cn(
                                    "p-8 border rounded-[2.5rem] flex items-center justify-between transition-all group hover:scale-[1.01] hover:shadow-md",
                                    rule.completed
                                        ? "bg-emerald-50/50 text-emerald-700 border-emerald-100 shadow-sm"
                                        : "bg-white border-slate-200 text-slate-900 shadow-sm hover:border-indigo-400"
                                )}
                            >
                                <div className="flex items-center gap-6 cursor-pointer flex-1" onClick={() => toggleRule.mutate({ id: rule.id, completed: !rule.completed })}>
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                                        rule.completed ? "bg-emerald-500 text-white" : "bg-slate-50 border border-slate-200 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600"
                                    )}>
                                        {rule.completed ? <Check size={20} /> : <div className="w-2 h-2 rounded-full bg-current opacity-20" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={cn("text-[15px] font-bold font-heading tracking-tight", rule.completed && "line-through opacity-40")}>{rule.text}</span>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-[8px] font-bold font-heading uppercase  text-slate-400 flex items-center gap-1">
                                                <Tag size={10} /> {rule.category || 'GENERAL'}
                                            </span>
                                            {rule.priority === 'P1' && (
                                                <span className="text-[8px] font-bold font-heading uppercase  text-rose-500 flex items-center gap-1">
                                                    <AlertCircle size={10} /> HIGH PRIORITY
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => deleteRule.mutate(rule.id)}
                                        className="p-3 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 rounded-xl"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
