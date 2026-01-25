import { useState } from 'react';
import { Settings, Calculator, Scale, Target, Activity, ArrowRight, Zap, TrendingUp, BarChart2, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Tools() {
    const [positionSize, setPositionSize] = useState({
        capital: '100000',
        riskPercent: '1',
        entry: '',
        sl: '',
        result: 0,
        riskAmount: 0
    });

    const [compoundStats, setCompoundStats] = useState({
        initial: '100000',
        monthly: '10',
        period: '12',
        result: 0
    });

    const [simulator, setSimulator] = useState({
        winRate: '50',
        avgRR: '2',
        trades: '50',
        initial: '100000',
        risk: '1'
    });

    const [simData, setSimData] = useState<any[]>([]);

    const calculateSize = () => {
        const cap = parseFloat(positionSize.capital);
        const riskP = parseFloat(positionSize.riskPercent);
        const entry = parseFloat(positionSize.entry);
        const sl = parseFloat(positionSize.sl);

        if (cap && riskP && entry && sl && entry !== sl) {
            const riskAmt = cap * (riskP / 100);
            const riskPerUnit = Math.abs(entry - sl);
            const qty = riskAmt / riskPerUnit;
            setPositionSize(prev => ({ ...prev, result: qty, riskAmount: riskAmt }));
        }
    };

    const calculateCompound = () => {
        let total = parseFloat(compoundStats.initial);
        const rate = parseFloat(compoundStats.monthly) / 100;
        const months = parseInt(compoundStats.period);

        if (total && rate && months) {
            for (let i = 0; i < months; i++) {
                total *= (1 + rate);
            }
            setCompoundStats(prev => ({ ...prev, result: total }));
        }
    };

    const runSimulation = () => {
        const wr = parseFloat(simulator.winRate) / 100;
        const rr = parseFloat(simulator.avgRR);
        const totalTrades = parseInt(simulator.trades);
        let cap = parseFloat(simulator.initial);
        const riskPercent = parseFloat(simulator.risk) / 100;

        const data = [{ name: 'Start', equity: cap }];

        for (let i = 1; i <= totalTrades; i++) {
            const isWin = Math.random() < wr;
            const riskAmt = cap * riskPercent;
            if (isWin) {
                cap += riskAmt * rr;
            } else {
                cap -= riskAmt;
            }
            data.push({ name: `T${i}`, equity: cap });
        }
        setSimData(data);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-body">
            <header className="flex flex-col md:flex-row items-center justify-between gap-10 p-10 bg-white border border-slate-200 rounded-[3.5rem] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-3xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Settings className="w-10 h-10 text-white relative z-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Utility Labs ✨</h1>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mt-2 opacity-60">High-Fidelity Calculation Terminal</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-emerald-500/10 px-8 py-4 rounded-3xl border border-emerald-500/10 shadow-xl shadow-emerald-500/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Engine Standby</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 leading-none">
                {/* Position Size Calculator */}
                <div className="p-12 bg-white border border-slate-200 rounded-[4rem] shadow-sm relative overflow-hidden group hover:scale-[1.01] transition-all duration-500">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000 text-indigo-500">
                        <Scale size={250} />
                    </div>
                    <div className="flex items-center gap-5 mb-12 relative z-10">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                            <Calculator className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Architect</h2>
                            <p className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.3em] mt-1">Sizing Protocol</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-12 relative z-10">
                        <InputGroup label="Account Capital" value={positionSize.capital} onChange={(v) => setPositionSize({ ...positionSize, capital: v })} />
                        <InputGroup label="Risk Pct (%)" value={positionSize.riskPercent} onChange={(v) => setPositionSize({ ...positionSize, riskPercent: v })} />
                        <InputGroup label="Entry Baseline" value={positionSize.entry} onChange={(v) => setPositionSize({ ...positionSize, entry: v })} placeholder="0.00" />
                        <InputGroup label="Invalidation SL" value={positionSize.sl} onChange={(v) => setPositionSize({ ...positionSize, sl: v })} placeholder="0.00" isRed />
                    </div>

                    <button
                        onClick={calculateSize}
                        className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-4 shadow-3xl hover:bg-black transition-all active:scale-95"
                    >
                        Forecast Exposure <ArrowRight size={16} />
                    </button>

                    {positionSize.result > 0 && (
                        <div className="mt-12 p-10 bg-indigo-600 text-white rounded-[3rem] flex justify-between items-center animate-in zoom-in-95 shadow-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                                <Activity size={100} />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] mb-2">Alpha Units</p>
                                <p className="text-4xl font-black tracking-tighter">{Math.floor(positionSize.result)} <span className="text-xs opacity-50 not-italic font-black">QTY</span></p>
                            </div>
                            <div className="relative z-10 text-right">
                                <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] mb-2">Risk Delta</p>
                                <p className="text-3xl font-black tracking-tighter text-rose-300">₹{positionSize.riskAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Compound Growth Calculator */}
                <div className="p-12 bg-white border border-slate-200 rounded-[4rem] shadow-sm relative overflow-hidden group hover:scale-[1.01] transition-all duration-500">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000 text-emerald-500">
                        <TrendingUp size={250} />
                    </div>
                    <div className="flex items-center gap-5 mb-12 relative z-10">
                        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Multiplier</h2>
                            <p className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.3em] mt-1">Growth Matrix</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-12 relative z-10">
                        <div className="col-span-2">
                            <InputGroup label="Principal (₹)" value={compoundStats.initial} onChange={(v) => setCompoundStats({ ...compoundStats, initial: v })} />
                        </div>
                        <InputGroup label="Monthly ROI (%)" value={compoundStats.monthly} onChange={(v) => setCompoundStats({ ...compoundStats, monthly: v })} />
                        <InputGroup label="Time Stream (M)" value={compoundStats.period} onChange={(v) => setCompoundStats({ ...compoundStats, period: v })} />
                    </div>

                    <button
                        onClick={calculateCompound}
                        className="w-full py-6 bg-emerald-500 text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-4 shadow-3xl hover:bg-black transition-all active:scale-95"
                    >
                        Forecast ROI <Zap size={16} fill="white" />
                    </button>

                    {compoundStats.result > 0 && (
                        <div className="mt-12 p-10 bg-indigo-950 text-white border border-indigo-500/20 rounded-[3rem] animate-in slide-in-from-bottom-8 shadow-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <Activity size={100} />
                            </div>
                            <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.4em] mb-3 relative z-10">Projected Valuation</p>
                            <p className="text-5xl font-black text-emerald-400 tracking-tighter relative z-10">₹{Math.floor(compoundStats.result).toLocaleString()}</p>
                            <div className="mt-8 flex items-center gap-4 relative z-10">
                                <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">Efficiency Delta: </span>
                                <span className="text-lg font-black text-emerald-400">+{((compoundStats.result / parseFloat(compoundStats.initial) - 1) * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Edge Simulator */}
                <div className="lg:col-span-2 p-16 bg-white border border-slate-200 rounded-[5rem] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none text-indigo-500 group-hover:scale-105 transition-all">
                        <Activity size={400} />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-20 relative z-10">
                        <div className="w-full lg:w-1/3">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center shadow-3xl">
                                    <BarChart2 className="text-white" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Simulator</h2>
                                    <p className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.3em] mt-1">Monte Carlo Engine</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <InputGroup label="Win Rate Edge (%)" value={simulator.winRate} onChange={(v) => setSimulator({ ...simulator, winRate: v })} />
                                <InputGroup label="Realized Avg R:R" value={simulator.avgRR} onChange={(v) => setSimulator({ ...simulator, avgRR: v })} />
                                <InputGroup label="Sync Batch Size" value={simulator.trades} onChange={(v) => setSimulator({ ...simulator, trades: v })} />
                                <button onClick={runSimulation} className="w-full py-7 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-3xl hover:bg-black transition-all hover:scale-105 active:scale-95">Compute Variance</button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[450px] bg-indigo-500/5 rounded-[3rem] p-10 border border-indigo-500/10 shadow-inner">
                            {simData.length > 0 ? (
                                <div className="h-full w-full">
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-12 text-center opacity-60">Equity Stream Variance Matrix</p>
                                    <ResponsiveContainer width="100%" height="70%">
                                        <AreaChart data={simData}>
                                            <defs>
                                                <linearGradient id="simColor" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                                            <XAxis dataKey="name" hide />
                                            <YAxis hide domain={['auto', 'auto']} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'white', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '24px', fontWeight: '900', fontSize: '10px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                                            />
                                            <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#simColor)" animationDuration={1000} strokeLinecap="round" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                    <div className="mt-12 flex justify-between items-center px-10">
                                        <div>
                                            <p className="text-[10px] font-black text-indigo-500/40 uppercase tracking-widest mb-2">Final Stream</p>
                                            <p className="text-3xl font-black tracking-tighter text-slate-900 uppercase">₹{Math.floor(simData[simData.length - 1].equity).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-indigo-500/40 uppercase tracking-widest mb-2">Alpha Delta</p>
                                            <p className={cn("text-3xl font-black tracking-tighter", simData[simData.length - 1].equity > parseFloat(simulator.initial) ? "text-emerald-500" : "text-rose-500")}>
                                                {simData[simData.length - 1].equity > parseFloat(simulator.initial) ? '+' : ''}{((simData[simData.length - 1].equity / parseFloat(simulator.initial) - 1) * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                                    <Activity size={100} className="mb-8 animate-pulse text-indigo-500" />
                                    <p className="text-[11px] font-black uppercase tracking-[0.8em] text-indigo-600 animate-pulse">Awaiting Telemetry...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange, placeholder, isRed = false }: any) {
    return (
        <div className="space-y-3 leading-none">
            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] ml-2 opacity-60">{label}</label>
            <input
                type="number"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-full bg-indigo-500/5 border border-indigo-500/10 rounded-2xl py-5 px-8 text-sm font-black focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner text-slate-900 placeholder:text-slate-400",
                    isRed && "bg-rose-500/5 text-rose-500 border-rose-500/20 focus:border-rose-500 focus:ring-rose-500/5"
                )}
            />
        </div>
    );
}
