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
            {/* Header Card */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-white border border-slate-200 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-indigo-950 leading-none mb-2">Trade Journal</h1>
                    <p className="text-slate-500 font-medium text-sm">Systematic record of your trading performance.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase  transition-all shadow-sm border border-transparent",
                            isTerminalOpen
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        )}
                    >
                        {isTerminalOpen ? <X size={16} /> : <Upload size={16} />}
                        {isTerminalOpen ? "Close Import" : "Import Trades"}
                    </button>

                    <button
                        onClick={() => { setEditingTrade(undefined); setIsFormOpen(true); }}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase  shadow-lg shadow-indigo-200/50 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Log Trade
                    </button>
                </div>
            </div>

            {/* Inline Import Terminal */}
            {isTerminalOpen && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                    <ImportTerminal onComplete={() => setIsTerminalOpen(false)} />
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by symbol or tag..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-3xl py-4 pl-14 pr-8 text-sm font-bold text-indigo-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] outline-none"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <select
                            value={assetFilter}
                            onChange={(e) => setAssetFilter(e.target.value)}
                            className="px-8 py-4 bg-white border border-slate-200 rounded-3xl text-xs font-bold text-indigo-900 uppercase  outline-none focus:ring-4 focus:ring-indigo-50 transition-all cursor-pointer appearance-none shadow-[0_2px_10px_rgb(0,0,0,0.02)] min-w-[160px]"
                        >
                            <option value="ALL">All Assets</option>
                            <option value="INDEX">Index</option>
                            <option value="STOCKS">Stocks</option>
                            <option value="COMMODITIES">Commodities</option>
                            <option value="CRYPTO">Crypto</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                </div>
            </div>

            {/* Trade List */}
            <div className="space-y-3">
                {filteredTrades.length === 0 ? (
                    <div className="p-20 text-center space-y-6 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                            <StickyNote size={24} />
                        </div>
                        <div>
                            <p className="text-indigo-900 font-bold text-lg">Journal is empty</p>
                            <p className="text-slate-500 text-sm mt-1">Start by logging your first trade setup.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {/* Header Row (Hidden on mobile) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-2 text-[10px] font-bold text-slate-400 uppercase">
                            <div className="col-span-4 pl-4">Entry Information</div>
                            <div className="col-span-2 text-center">Setup</div>
                            <div className="col-span-2 text-center">Status</div>
                            <div className="col-span-2 text-right">Net Realized</div>
                            <div className="col-span-2 text-center">Manage</div>
                        </div>

                        {filteredTrades.map((trade) => (
                            <div key={trade.id} className="group bg-white p-1 rounded-3xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all border border-slate-100 hover:border-indigo-100">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4">

                                    {/* 1. Details */}
                                    <div className="col-span-4 flex items-center gap-5">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-[10px] font-bold shadow-sm shrink-0 transition-transform group-hover:scale-105",
                                            trade.net_pnl >= 0
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-rose-50 text-rose-600"
                                        )}>
                                            <span>{trade.direction === 'LONG' ? 'BUY' : 'SELL'}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-indigo-950 leading-tight">{trade.instrument}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">
                                                    {new Date(trade.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase ">{trade.asset_class}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Setup */}
                                    <div className="col-span-2 text-center hidden md:block">
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100/50 pointer-events-none">
                                            {trade.strategy}
                                        </span>
                                    </div>

                                    {/* 3. Status */}
                                    <div className="col-span-2 flex justify-center">
                                        <span className={cn(
                                            "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase  flex items-center gap-2",
                                            trade.net_pnl >= 0
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                : "bg-rose-50 text-rose-600 border border-rose-100"
                                        )}>
                                            {trade.net_pnl >= 0 ? "Profit" : "Loss"}
                                        </span>
                                    </div>

                                    {/* 4. P&L */}
                                    <div className="col-span-2 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={cn(
                                                "text-lg font-bold tracking-tight",
                                                trade.net_pnl >= 0 ? "text-emerald-600" : "text-rose-600"
                                            )}>
                                                {trade.net_pnl >= 0 ? '+' : ''}{formatCurrency(trade.net_pnl)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 5. Actions */}
                                    <div className="col-span-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(trade)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"><Edit3 size={14} /></button>
                                        <button onClick={() => handleDelete(trade.id)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14} /></button>
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
