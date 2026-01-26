import { useTrades } from '@/hooks/useTrades';
import { Target, Zap, Plus, Activity, TrendingUp, BarChart3, Share2 } from 'lucide-react';
import { calculateStats } from '@/lib/stats';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { StrategyForm } from '@/components/features/StrategyForm';
import { useStrategies } from '@/hooks/useStrategies';

export default function Strategies() {
    const { trades } = useTrades();
    const { strategies } = useStrategies();
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Group trades by strategy
    const strategyGroups: Record<string, any[]> = {};
    trades.forEach(trade => {
        const strat = trade.strategy || 'Uncategorized';
        if (!strategyGroups[strat]) strategyGroups[strat] = [];
        strategyGroups[strat].push(trade);
    });

    const strategiesWithStats = Object.entries(strategyGroups).map(([name, strategyTrades]) => {
        const stats = calculateStats(strategyTrades);
        const customStrat = strategies.find(s => s.name.toUpperCase() === name.toUpperCase());
        return {
            name: name.replace(/_/g, ' '),
            stats,
            description: customStrat?.description || getStrategyDescription(name)
        };
    }).sort((a, b) => b.stats.profitFactor - a.stats.profitFactor);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-body">
            {/* Page Header */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-10 p-12 bg-white border border-slate-200 rounded-[4rem] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-indigo-200 group">
                        <Target className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold font-heading tracking-tighter text-slate-900 uppercase">Strategy Labs</h1>
                        <p className="text-slate-400 text-[10px] font-bold font-heading tracking-[0.4em] uppercase mt-2 opacity-50 italic">High-Fidelity Edge Matrix</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-10 py-5 bg-indigo-600 rounded-full text-[10px] font-bold font-heading uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-indigo-100 hover:bg-slate-900 hover:scale-105 active:scale-95 transition-all text-white"
                >
                    <Plus size={20} />
                    New Architect
                </button>
            </header>

            {/* Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {strategiesWithStats.map((strategy) => (
                    <StrategyCard key={strategy.name} strategy={strategy} />
                ))}

                {/* Add New Strategy Placeholder */}
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex flex-col items-center justify-center p-14 border-4 border-dashed border-slate-200 rounded-[4rem] hover:border-indigo-400 hover:bg-slate-50 transition-all group min-h-[420px] bg-white shadow-inner"
                >
                    <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg">
                        <Plus size={32} className="text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-bold font-heading text-indigo-400 uppercase tracking-[0.5em] opacity-60 group-hover:opacity-100 transition-opacity">Deploy Protocol</span>
                </button>
            </div>

            {isFormOpen && <StrategyForm onClose={() => setIsFormOpen(false)} />}
        </div >
    );
}

function StrategyCard({ strategy }: any) {
    const { name, stats, description } = strategy;
    const [showTrades, setShowTrades] = useState(false);
    const { trades } = useTrades();

    const strategyTrades = trades.filter(t =>
        (t.strategy || 'Uncategorized').toUpperCase() === name.toUpperCase()
    );

    return (
        <div className="p-12 bg-white border border-slate-200 rounded-[4rem] hover:border-indigo-400 transition-all group relative overflow-hidden flex flex-col shadow-sm hover:scale-[1.02] duration-500 font-heading">
            <div className="relative z-10 flex flex-col h-full leading-none">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-2xl font-bold font-heading tracking-tighter text-slate-900 uppercase">{name}</h3>
                    </div>
                    {stats.profitFactor >= 2 && (
                        <div className="px-3 py-1 bg-emerald-500 text-white rounded-lg shadow-xl shadow-emerald-500/20 animate-pulse">
                            <span className="text-[8px] font-bold font-heading uppercase tracking-widest">Master Edge</span>
                        </div>
                    )}
                </div>

                <p className="text-indigo-900/40 text-xs mb-12 leading-relaxed flex-1 font-bold font-heading uppercase tracking-tight">
                    "{description}"
                </p>

                <div className="grid grid-cols-3 gap-6 py-8 border-t border-indigo-500/10">
                    <div className="space-y-2">
                        <p className="text-[9px] font-bold font-heading text-indigo-500/50 uppercase tracking-widest">Alpha (%)</p>
                        <p className={cn(
                            "text-xl font-bold font-heading tracking-tighter",
                            stats.winRate >= 50 ? "text-emerald-500" : "text-rose-500"
                        )}>{stats.winRate.toFixed(1)}%</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[9px] font-bold font-heading text-indigo-500/50 uppercase tracking-widest">P Factor</p>
                        <p className={cn(
                            "text-xl font-bold font-heading tracking-tighter",
                            stats.profitFactor >= 1.5 ? "text-indigo-600" : "text-rose-400"
                        )}>{stats.profitFactor.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[9px] font-bold font-heading text-indigo-500/50 uppercase tracking-widest">Sync Log</p>
                        <p className="text-xl font-bold font-heading tracking-tighter text-slate-900">{stats.totalTrades}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 gap-6">
                    <span className="text-[9px] font-bold font-heading text-indigo-500/40 uppercase tracking-widest">1:{stats.avgRR.toFixed(2)} R:R Delta</span>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowTrades(!showTrades)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[9px] font-bold font-heading uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                        >
                            <Activity size={12} />
                            {showTrades ? 'Secure' : 'Reveal'} Stream
                        </button>
                        <button
                            onClick={() => {
                                const url = `${window.location.origin}/share/strategy/${name.toLowerCase().replace(/\s+/g, '-')}`;
                                navigator.clipboard.writeText(url);
                                alert('Strategy Stream URL Copied to Clipboard!');
                            }}
                            className="flex items-center gap-2 text-[9px] font-bold font-heading text-indigo-500 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                        >
                            <Share2 size={12} />
                            Share
                        </button>
                    </div>
                </div>

                {/* Trades List */}
                {showTrades && (
                    <div className="mt-8 pt-8 border-t border-indigo-500/10 space-y-4 max-h-96 overflow-y-auto no-scrollbar animate-in slide-in-from-top-4 duration-500">
                        <h4 className="text-[10px] font-bold font-heading uppercase tracking-[0.3em] text-indigo-500/30 mb-6 text-center">Protocol Execution Log ({strategyTrades.length})</h4>
                        {strategyTrades.map((trade) => (
                            <div key={trade.id} className="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all shadow-inner group/item">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold font-heading shadow-lg",
                                            trade.net_pnl >= 0 ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-rose-500 text-white shadow-rose-500/20"
                                        )}>
                                            {trade.direction[0]}
                                        </div>
                                        <div>
                                            <p className="text-slate-900 uppercase">{trade.instrument}</p>
                                            <p className="text-[9px] text-indigo-500 opacity-40 font-bold font-heading uppercase tracking-widest mt-1">{new Date(trade.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn("text-lg font-bold font-heading tracking-tighter", trade.net_pnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
                                            {trade.net_pnl >= 0 ? '+' : ''}₹{trade.net_pnl.toFixed(0)}
                                        </p>
                                        <p className="text-[9px] text-indigo-500/30 font-bold font-heading uppercase tracking-widest">Qty: {trade.quantity}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-[9px] font-bold font-heading uppercase tracking-widest text-indigo-500/40">
                                    <span>Entry: ₹{trade.entry_price}</span>
                                    <span>Exit: ₹{trade.exit_price}</span>
                                    {trade.stop_loss > 0 && <span className="text-rose-400">SL: ₹{trade.stop_loss}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function getStrategyDescription(strategy: string): string {
    const descriptions: Record<string, string> = {
        'BREAKOUT': 'Capturing volatility expansion post key-level breaches.',
        'MEAN_REVERSION': 'Exploiting mean-variance after extreme deviation from VWAP.',
        'TREND': 'Riding institutional capital flows along 20/50 EMA clouds.',
        'SCALPING': 'High-frequency micro-momentum absorption.',
        'NEWS': 'Event-driven positioning based on fundamental volatility.',
        'Uncategorized': 'Trades with undefined setup criteria requiring taxonomy audit.'
    };
    return descriptions[strategy] || descriptions['Uncategorized'];
}
