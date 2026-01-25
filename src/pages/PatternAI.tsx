import { Brain, Zap, Sparkles, Wand2 } from 'lucide-react';

export default function PatternAI() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                    <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Pattern AI</h1>
                    <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Neural Network Pattern Matching</p>
                </div>
            </div>

            <div className="p-12 bg-gradient-to-br from-indigo-600/10 to-[var(--app-card)] border border-[var(--app-border)] rounded-[3rem] text-center space-y-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 animate-pulse" />
                <div className="w-24 h-24 bg-indigo-600/20 rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(79,70,229,0.2)] border border-indigo-500/30">
                    <Wand2 size={40} className="text-indigo-400" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl font-black text-[var(--app-text)] font-heading">Scanning Neural Path...</h2>
                    <p className="text-[var(--app-text-muted)] max-w-xl mx-auto text-lg font-medium leading-relaxed">Our AI is analyzing thousands of data points across your execution map to identify recurring profitable patterns and cognitive biases.</p>
                </div>
                <div className="flex gap-4 justify-center">
                    <button className="px-10 py-5 bg-indigo-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2">
                        Generate Report
                        <Sparkles size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[2.5rem] space-y-6 shadow-xl">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--app-text)]">
                        <Zap size={20} className="text-amber-500" />
                        Detected Edge
                    </h3>
                    <p className="text-[var(--app-text-muted)] text-sm font-medium">Waiting for more data to confirm neural patterns. (Need 50+ trades recorded to establish statistical significance).</p>
                </div>
                <div className="p-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[2.5rem] space-y-6 shadow-xl">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--app-text)]">
                        <Zap size={20} className="text-rose-500" />
                        Leakage Warning
                    </h3>
                    <p className="text-[var(--app-text-muted)] text-sm font-medium">System integrity stable. No critical leakage detected in current data set. Maintain existing execution discipline.</p>
                </div>
            </div>
        </div>
    );
}
