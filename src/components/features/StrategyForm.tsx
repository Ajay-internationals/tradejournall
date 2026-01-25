import { useState } from 'react';
import { useStrategies } from '@/hooks/useStrategies';
import { X, Target, Save, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StrategyFormProps {
    onClose: () => void;
}

export function StrategyForm({ onClose }: StrategyFormProps) {
    const { addStrategy } = useStrategies();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addStrategy.mutateAsync(formData);
            alert("New Strategy Architecture Committed.");
            onClose();
        } catch (error: any) {
            alert(`Architecture Failed: ${error.message}`);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-indigo-950/80 backdrop-blur-3xl p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-indigo-900 border border-indigo-500/10 rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/10">
                <div className="p-8 border-b border-indigo-500/10 flex items-center justify-between bg-white dark:bg-indigo-900 leading-none">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center shadow-3xl transform rotate-2">
                            <Target className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter dark:text-indigo-100 uppercase uppercase">Architect</h2>
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.4em] mt-1 opacity-60">Edge Logic Definition</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-indigo-500/5 rounded-xl transition-all text-indigo-500 hover:scale-110 active:scale-95 border border-indigo-500/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black italic uppercase tracking-[0.4em] text-indigo-500 ml-4 opacity-40">Setup Identifier</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. VCP Breakout"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-indigo-500/5 border border-indigo-500/10 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all dark:text-indigo-100 italic"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black italic uppercase tracking-[0.4em] text-indigo-500 ml-4 opacity-40">Edge Description</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Describe the institutional logic..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-indigo-500/5 border border-indigo-500/10 rounded-2xl py-5 px-6 text-sm font-black focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all dark:placeholder:text-indigo-100/10 dark:text-indigo-100 italic resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 bg-indigo-500/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-500/40 hover:bg-indigo-500/10 transition-all italic"
                        >Discard</button>
                        <button
                            type="submit"
                            disabled={addStrategy.isPending}
                            className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-3 shadow-3xl hover:bg-black hover:scale-[1.02] transition-all tracking-widest italic"
                        >
                            {addStrategy.isPending ? 'Committing...' : 'Commit Architecture'}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
