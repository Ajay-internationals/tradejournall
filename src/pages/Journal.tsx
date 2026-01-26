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
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TradeForm } from '@/components/features/TradeForm';
import type { Trade } from '@/types';
import * as XLSX from 'xlsx';

export default function Journal() {
    const { trades, deleteTrade, addTrade } = useTrades();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
    const [pasteContent, setPasteContent] = useState('');
    const [editingTrade, setEditingTrade] = useState<Trade | undefined>();
    const [assetFilter, setAssetFilter] = useState('ALL');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            processImportedData(data);
        };
        reader.readAsBinaryString(file);
    };

    const processImportedData = async (data: any[]) => {
        let importedCount = 0;
        let errorCount = 0;

        for (const row of data) {
            try {
                // More comprehensive field mapping
                const dateRaw = row['Date'] || row['date'] || row['Time'] || row['time'] || row['Trade Date'] || new Date().toISOString();
                const instrument = row['Instrument'] || row['Symbol'] || row['Script'] || row['instrument'] || row['symbol'] || 'Unknown';

                // Direction detection
                const sideRaw = (row['Type'] || row['Side'] || row['direction'] || row['Action'] || 'LONG').toString().toUpperCase();
                const direction = (sideRaw.includes('B') || sideRaw.includes('L')) ? 'LONG' : 'SHORT';

                const entryPrice = parseFloat(row['Entry'] || row['Price'] || row['Avg. Price'] || row['entry_price'] || row['Avg Price'] || '0');
                const exitPrice = parseFloat(row['Exit'] || row['Exit Price'] || row['exit_price'] || row['Sell Price'] || '0');
                const qty = Math.abs(parseFloat(row['Qty'] || row['Quantity'] || row['quantity'] || '1'));
                const fees = parseFloat(row['Fees'] || row['Brokerage'] || row['fees'] || row['brokerage'] || '0');

                // PnL Calculation if missing
                let netPnl = parseFloat(row['PnL'] || row['Net P&L'] || row['Profit/Loss'] || row['net_pnl'] || '0');
                if (netPnl === 0 && entryPrice !== 0 && exitPrice !== 0) {
                    const gross = direction === 'LONG' ? (exitPrice - entryPrice) * qty : (entryPrice - exitPrice) * qty;
                    netPnl = gross - fees;
                }

                // Create trade object matching our schema
                const newTrade = {
                    date: new Date(dateRaw).toISOString(),
                    instrument: instrument.toString().toUpperCase(),
                    asset_class: 'INDEX', // Default
                    direction: direction as 'LONG' | 'SHORT',
                    entry_price: entryPrice,
                    exit_price: exitPrice || (netPnl > 0 ? entryPrice + 10 : entryPrice - 10),
                    quantity: qty,
                    fees: fees,
                    net_pnl: netPnl,
                    gross_pnl: netPnl + fees,
                    stop_loss: parseFloat(row['SL'] || row['Stop Loss'] || '0'),
                    strategy: row['Strategy'] || 'Imported',
                    tags: ['imported'],
                    notes: row['Notes'] || 'Imported from file',
                    emotion: 'NEUTRAL'
                };

                await addTrade.mutateAsync(newTrade as any);
                importedCount++;
            } catch (err) {
                console.error("Failed to import row:", row, err);
                errorCount++;
            }
        }

        if (errorCount > 0) {
            alert(`Import completed: ${importedCount} trades added, ${errorCount} failed.`);
        } else {
            alert(`Success! Successfully imported ${importedCount} trades.`);
        }
    };

    const handlePasteSubmit = () => {
        // Very basic CSV parsing for paste
        const rows = pasteContent.split('\n').filter(r => r.trim());
        const headers = rows[0].split(',').map(h => h.trim());
        const data = rows.slice(1).map(row => {
            const values = row.split(',');
            const obj: any = {};
            headers.forEach((h, i) => {
                obj[h] = values[i]?.trim();
            });
            return obj;
        });
        processImportedData(data);
        setIsPasteModalOpen(false);
        setPasteContent('');
    };

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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-body">
            {/* Morning Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">Trading Ledger</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4 italic">Historical Execution Stream</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                        <button
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm border border-slate-200"
                        >
                            <Upload size={16} />
                            Import File
                        </button>
                        <input type="file" id="file-upload" className="hidden" accept=".csv,.xlsx" onChange={handleFileUpload} />

                        <button
                            onClick={() => setIsPasteModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm border border-slate-200"
                        >
                            <StickyNote size={16} />
                            Paste Data
                        </button>
                    </div>

                    <button
                        onClick={() => { setEditingTrade(undefined); setIsFormOpen(true); }}
                        className="btn-primary flex items-center gap-3"
                    >
                        <Plus size={20} />
                        Add Trade
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search symbols or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-3xl py-5 pl-16 pr-8 text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={assetFilter}
                        onChange={(e) => setAssetFilter(e.target.value)}
                        className="px-8 py-5 bg-white border border-slate-200 rounded-3xl text-sm font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                    >
                        <option value="ALL">ALL ASSETS</option>
                        <option value="INDEX">INDEX</option>
                        <option value="STOCKS">STOCKS</option>
                        <option value="COMMODITIES">COMMODITIES</option>
                        <option value="CRYPTO">CRYPTO</option>
                    </select>
                </div>
            </div>

            {/* Morning Table Style */}
            <div className="bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic border-b border-slate-100">Date/Instrument</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic border-b border-slate-100 text-center">Protocol</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic border-b border-slate-100 text-center">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic border-b border-slate-100 text-right">Result</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic border-b border-slate-100 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTrades.map((trade) => (
                                <tr key={trade.id} className="hover:bg-slate-50 transition-all group flex flex-col md:table-row border-b border-slate-100 last:border-0">
                                    <td className="px-6 md:px-10 py-6 md:py-8">
                                        <div className="flex items-center gap-4 md:gap-5">
                                            <div className={cn(
                                                "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-[10px] md:text-xs font-black text-white shadow-lg",
                                                trade.net_pnl >= 0 ? "bg-emerald-500" : "bg-rose-500"
                                            )}>
                                                {trade.direction === 'LONG' ? 'UP' : 'DN'}
                                            </div>
                                            <div>
                                                <p className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-tight leading-none mb-1 md:mb-2">{trade.instrument}</p>
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(trade.date).toLocaleDateString()}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{trade.asset_class}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-10 py-2 md:py-8 text-left md:text-center text-xs md:text-sm font-bold text-slate-600 italic tracking-tight hidden md:table-cell">
                                        {trade.strategy}
                                    </td>
                                    <td className="px-6 md:px-10 py-2 md:py-8">
                                        <div className="flex flex-row md:flex-col items-center gap-2">
                                            <span className={cn(
                                                "px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest leading-none",
                                                trade.net_pnl >= 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                                            )}>
                                                {trade.net_pnl >= 0 ? 'Verified Win' : 'Logged Loss'}
                                            </span>
                                            <span className="md:hidden text-[10px] font-bold text-slate-400">— {trade.strategy}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-10 py-2 md:py-8 text-left md:text-right">
                                        <div className="flex flex-row md:flex-col items-baseline md:items-end gap-2">
                                            <p className={cn("text-base md:text-lg font-black italic tracking-tighter leading-none", trade.net_pnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
                                                {trade.net_pnl >= 0 ? '+' : ''}{formatCurrency(trade.net_pnl)}
                                            </p>
                                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Realized</p>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-10 py-6 md:py-8">
                                        <div className="flex items-center justify-start md:justify-center gap-2 md:gap-3">
                                            <button onClick={() => handleEdit(trade)} className="p-3 md:p-4 bg-slate-50 text-slate-400 rounded-xl md:rounded-2xl hover:bg-white hover:text-indigo-600 hover:shadow-lg transition-all border border-transparent hover:border-indigo-100"><Edit3 size={16} /></button>
                                            <button onClick={() => handleDelete(trade.id)} className="p-3 md:p-4 bg-slate-50 text-slate-400 rounded-xl md:rounded-2xl hover:bg-rose-50 hover:text-rose-600 hover:shadow-lg transition-all border border-transparent hover:border-rose-100"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredTrades.length === 0 && (
                    <div className="p-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-300">
                            <Activity size={40} />
                        </div>
                        <div>
                            <p className="text-slate-900 font-bold text-lg">No trades found in the ledger.</p>
                            <p className="text-slate-400 font-medium text-sm mt-1">Start executing and logging your setups.</p>
                        </div>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <TradeForm
                    onClose={() => { setIsFormOpen(false); setEditingTrade(undefined); }}
                    editTrade={editingTrade}
                />
            )}

            {/* Paste Data Modal */}
            {isPasteModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
                                <StickyNote className="text-indigo-600" size={24} /> Paste Trade Data
                            </h3>
                            <button onClick={() => setIsPasteModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <p className="text-sm text-slate-500">Paste your CSV data here. First row must be headers (Date, Instrument, Type, Price, Qty, PnL).</p>
                        <textarea
                            value={pasteContent}
                            onChange={(e) => setPasteContent(e.target.value)}
                            className="w-full h-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs focus:ring-4 focus:ring-indigo-500/10 outline-none"
                            placeholder="Date,Instrument,Type,Price,Qty,PnL&#10;2024-01-25,NIFTY 21500 CE,BUY,150,50,2500..."
                        />
                        <div className="flex gap-4">
                            <button onClick={() => setIsPasteModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                            <button onClick={handlePasteSubmit} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">Import Data</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
