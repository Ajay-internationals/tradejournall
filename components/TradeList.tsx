
import React, { useState, useEffect, useMemo } from 'react';
import { Trade, AssetClass, TradeType, User } from '../types';
import { Search, Filter, Calendar, LayoutList, X, RefreshCw, Trash2, History, SlidersHorizontal, Download, Lock, TrendingUp, TrendingDown, Clock, Tag } from 'lucide-react';
import { db } from '../services/db';

interface TradeListProps {
  trades: Trade[];
  onDeleteTrade?: (tradeId: string) => void;
}

const TradeList: React.FC<TradeListProps> = ({ trades, onDeleteTrade }) => {
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterAsset, setFilterAsset] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStrategy, setFilterStrategy] = useState<string>('');
  const [filterEvent, setFilterEvent] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setUser(db.getSession());
  }, []);

  const availableStrategies = useMemo(() => {
    const strategies = new Set<string>();
    trades.forEach(t => t.strategies?.forEach(s => strategies.add(s)));
    return Array.from(strategies).sort();
  }, [trades]);

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = searchTerm === '' || trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || (trade.setups && trade.setups.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesAsset = filterAsset === '' || trade.assetClass === filterAsset;
    const matchesType = filterType === '' || trade.type === filterType;
    const matchesStrategy = filterStrategy === '' || (trade.strategies && trade.strategies.includes(filterStrategy));
    const matchesEvent = filterEvent === '' || (trade.marketEvents && trade.marketEvents.includes(filterEvent));
    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && new Date(trade.entryDate) >= new Date(startDate);
    if (endDate) { const end = new Date(endDate); end.setHours(23, 59, 59, 999); matchesDate = matchesDate && new Date(trade.entryDate) <= end; }
    return matchesSearch && matchesAsset && matchesType && matchesStrategy && matchesDate && matchesEvent;
  });

  const handleExport = async () => {
    try {
      const data = await db.exportDatabase();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trades_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (e) {
      alert("Export failed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Trade Journal</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">Review and analyze your trading history</p>
        </div>

        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-[11px] md:text-xs font-bold shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-indigo-600">Export JSON</span>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-2 border rounded-xl transition-colors shadow-sm text-[11px] md:text-xs font-bold ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white dark:bg-slate-800 border-slate-300 text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {trades.length > 0 ? (
          <>
            <div className="hidden md:grid grid-cols-10 gap-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-8">
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Symbol</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-2">Setups</div>
              <div className="col-span-1 text-right">Entry</div>
              <div className="col-span-1 text-right">SL</div>
              <div className="col-span-1 text-right">Fees</div>
              <div className="col-span-2 text-right pr-12">P&L</div>
            </div>

            {filteredTrades.map((trade) => (
              <div key={trade.id} className="group relative bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-indigo-200 transition-all">
                {/* Desktop View */}
                <div className="hidden md:grid md:grid-cols-10 gap-4 items-center">
                  <div className="col-span-1 flex items-center text-sm font-medium text-slate-500"><Calendar className="h-4 w-4 mr-2 opacity-50" />{new Date(trade.entryDate).toLocaleDateString()}</div>
                  <div className="col-span-1"><div className="font-bold text-slate-900 dark:text-white">{trade.symbol}</div><div className="text-[10px] font-black text-slate-400 uppercase">{trade.assetClass}</div></div>
                  <div className="col-span-1"><span className={`px-2 py-0.5 inline-flex text-[10px] font-black rounded-lg uppercase tracking-wide ${trade.type.includes('Long') ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>{trade.type.includes('Long') ? 'LONG' : 'SHORT'}</span></div>
                  <div className="col-span-2 flex flex-wrap gap-1">{trade.setups?.slice(0, 2).map((s, i) => (<span key={i} className="px-2 py-1 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs font-bold text-slate-500 border border-slate-100 dark:border-slate-600">{s}</span>))}</div>
                  <div className="col-span-1 text-right"><div className="font-mono text-xs">₹{trade.entryPrice}</div></div>
                  <div className="col-span-1 text-right"><div className="font-mono text-xs text-rose-500">{trade.stopLoss ? `₹${trade.stopLoss}` : '-'}</div></div>
                  <div className="col-span-1 text-right"><div className="font-mono text-xs text-slate-400">₹{trade.fees || 0}</div></div>
                  <div className="col-span-2 text-right flex items-center justify-between md:justify-end gap-4">
                    <div className={`text-sm font-black ${(trade.pnl || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>₹{(trade.pnl || 0).toLocaleString()}</div>
                    <button onClick={() => onDeleteTrade?.(trade.id)} className="p-2 rounded-full text-slate-300 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile View Card */}
                <div className="md:hidden flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div className={`p-2 rounded-xl ${trade.pnl >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trade.pnl >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {trade.symbol}
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${trade.type.includes('Long') ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                            {trade.type.includes('Long') ? 'L' : 'S'}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2 mt-0.5">
                          <Clock className="h-3 w-3" /> {new Date(trade.entryDate).toLocaleDateString()}
                          <span className="opacity-40">•</span>
                          {trade.assetClass}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-base font-black ${trade.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toLocaleString()}
                      </div>
                      <button onClick={() => onDeleteTrade?.(trade.id)} className="text-[10px] font-bold text-rose-400 mt-1 uppercase flex items-center justify-end gap-1">
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {trade.setups?.slice(0, 3).map((s, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100 dark:border-slate-700">
                        <Tag className="h-2.5 w-2.5 opacity-40" /> {s}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-50 dark:border-slate-700/30">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Entry</p>
                      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300">₹{trade.entryPrice}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-rose-400">SL</p>
                      <p className="text-[10px] font-bold text-rose-500">{trade.stopLoss ? `₹${trade.stopLoss}` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Exit</p>
                      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300">₹{trade.exitPrice}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-slate-400">Fees</p>
                      <p className="text-[10px] font-bold text-slate-400">₹{trade.fees || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredTrades.length === 0 && <div className="py-20 text-center text-slate-400 text-sm font-bold">No trades match your filters.</div>}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 text-center">
            <LayoutList className="h-10 w-10 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your journal is empty</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-xs px-6">Every professional trader tracks their edge. Log your first execution to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeList;
