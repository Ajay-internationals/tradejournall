import { useState, useMemo } from 'react';
import { useTrades } from '@/hooks/useTrades';
import { calculateStats, formatCurrency } from '@/lib/stats';
import {
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    StickyNote,
    Plus,
    Calendar,
    Target,
    Activity,
    ChevronDown,
    Trash2,
    Edit3,
    MoreHorizontal,
    Upload,
    X,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TradeForm } from '@/components/features/TradeForm';
import { ImportTerminal } from '@/components/features/ImportTerminal';
import type { Trade } from '@/types';
import * as XLSX from 'xlsx';

export default function Journal() {
    const { trades, deleteTrade, addTrade } = useTrades();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [editingTrade, setEditingTrade] = useState<Trade | undefined>();
    const [assetFilter, setAssetFilter] = useState('ALL');



    const filteredTrades = useMemo(() => {
        return trades.filter(t => {
            const matchesSearch = t.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesAsset = assetFilter === 'ALL' || t.asset_class === assetFilter;
            return matchesSearch && matchesAsset;
        });
    }, [trades, searchTerm, assetFilter]);

    const handleEdit = (trade: Trade) => {
        setEditingTrade(trade);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this trade logic?')) {
            await deleteTrade.mutateAsync(id);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-['Quicksand'] bg-[var(--app-bg)] min-h-screen p-6 md:p-10">
            {/* Cute Header Card */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-white dark:bg-slate-900 border border-indigo-50 dark:border-slate-800 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-indigo-950 dark:text-white leading-none mb-2">My Trading Diary 🌸</h1>
                    <p className="text-indigo-400 dark:text-slate-400 font-semibold text-sm">Every trade tells a story. Keep writing yours!</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                        className={cn(
                            "flex items-center gap-3 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm border border-transparent",
                            isTerminalOpen
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-slate-800 dark:text-indigo-400"
                        )}
                    >
                        {isTerminalOpen ? <X size={16} /> : <Upload size={16} />}
                        {isTerminalOpen ? "Close Sync" : "Sync Data"}
                    </button>

                    <button
                        onClick={() => { setEditingTrade(undefined); setIsFormOpen(true); }}
                        className="px-8 py-4 bg-indigo-500 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-200/50 hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Entry
                    </button>
                </div>
            </div>

            {/* Inline Import Terminal */}
            {isTerminalOpen && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                    <ImportTerminal onComplete={() => setIsTerminalOpen(false)} />
                </div>
            )}

            {/* Bubbly Filter Bar */}
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Find a trade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border-none rounded-[2rem] py-5 pl-16 pr-8 text-sm font-bold text-indigo-900 dark:text-white placeholder:text-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all shadow-[0_4px_20px_rgb(0,0,0,0.02)] outline-none"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <select
                            value={assetFilter}
                            onChange={(e) => setAssetFilter(e.target.value)}
                            className="px-10 py-5 bg-white dark:bg-slate-900 border-none rounded-[2rem] text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-50 transition-all cursor-pointer appearance-none shadow-[0_4px_20px_rgb(0,0,0,0.02)] min-w-[150px]"
                        >
                            <option value="ALL">All Assets</option>
                            <option value="INDEX">Index</option>
                            <option value="STOCKS">Stocks</option>
                            <option value="COMMODITIES">Commodities</option>
                            <option value="CRYPTO">Crypto</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-indigo-300 pointer-events-none" size={14} />
                    </div>
                </div>
            </div>

            {/* Floating Card List */}
            <div className="space-y-4">
                {filteredTrades.length === 0 ? (
                    <div className="p-20 text-center space-y-6 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-indigo-100">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-300">
                            <StickyNote size={32} />
                        </div>
                        <div>
                            <p className="text-indigo-900 dark:text-white font-bold text-lg">Your diary is empty!</p>
                            <p className="text-indigo-400 text-sm mt-1">Add your first trade to start the story.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {/* Header Row (Hidden on mobile) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-3 text-xs font-bold text-indigo-300 uppercase tracking-widest">
                            <div className="col-span-4 pl-4">Entry Details</div>
                            <div className="col-span-2 text-center">Setup</div>
                            <div className="col-span-2 text-center">Status</div>
                            <div className="col-span-2 text-right">Gain/Loss</div>
                            <div className="col-span-2 text-center">Options</div>
                        </div>

                        {filteredTrades.map((trade) => (
                            <div key={trade.id} className="group bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all border border-transparent hover:border-indigo-50 dark:hover:border-slate-800">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4">

                                    {/* 1. Details */}
                                    <div className="col-span-4 flex items-center gap-5">
                                        <div className={cn(
                                            "w-14 h-14 rounded-[1.5rem] flex flex-col items-center justify-center text-[10px] font-bold shadow-sm shrink-0 transition-transform group-hover:scale-110",
                                            trade.net_pnl >= 0
                                                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                                                : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                                        )}>
                                            <span className="text-lg mb-[-4px]">{trade.direction === 'LONG' ? '🚀' : '📉'}</span>
                                            <span>{trade.direction === 'LONG' ? 'BUY' : 'SELL'}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-indigo-950 dark:text-white leading-tight">{trade.instrument}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-3 py-1 bg-indigo-50 dark:bg-slate-800 rounded-full text-[10px] font-bold text-indigo-500 uppercase tracking-wide">
                                                    {new Date(trade.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{trade.asset_class}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Setup */}
                                    <div className="col-span-2 text-center hidden md:block">
                                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-indigo-100/50 dark:border-slate-700 pointer-events-none">
                                            {trade.strategy}
                                        </span>
                                    </div>

                                    {/* 3. Status */}
                                    <div className="col-span-2 flex justify-center">
                                        <span className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-2",
                                            trade.net_pnl >= 0
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30"
                                                : "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30"
                                        )}>
                                            {trade.net_pnl >= 0 ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                            {trade.net_pnl >= 0 ? 'Win' : 'Loss'}
                                        </span>
                                    </div>

                                    {/* 4. P&L */}
                                    <div className="col-span-2 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={cn(
                                                "text-xl font-bold tracking-tight",
                                                trade.net_pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                                            )}>
                                                {trade.net_pnl >= 0 ? '+' : ''}{formatCurrency(trade.net_pnl)}
                                            </span>
                                            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Realized</span>
                                        </div>
                                    </div>

                                    {/* 5. Actions */}
                                    <div className="col-span-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(trade)} className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-400 rounded-full hover:bg-indigo-500 hover:text-white transition-all"><Edit3 size={16} /></button>
                                        <button onClick={() => handleDelete(trade.id)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-400 rounded-full hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isFormOpen && (
                <TradeForm
                    onClose={() => { setIsFormOpen(false); setEditingTrade(undefined); }}
                    editTrade={editingTrade}
                />
            )}
        </div>
    );
}
