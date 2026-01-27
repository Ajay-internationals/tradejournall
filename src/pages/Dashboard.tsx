import { useAuth } from '@/context/AuthContext';
import { useTrades } from '@/hooks/useTrades';
import { calculateStats, formatCurrency } from '@/lib/stats';
import {
    Plus,
    TrendingUp,
    TrendingDown,
    ShieldCheck,
    Target,
    Clock,
    ChevronRight,
    Wallet,
    Trophy,
    History,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    X,
    Zap,
    LayoutDashboard,
    Sparkles,
    UserCircle,
    Settings,
    AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';
import { cloneElement, useState, useEffect } from 'react';
import { TradeForm } from '@/components/features/TradeForm';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
    const { user, profile, refreshProfile } = useAuth();
    const { trades, isLoading } = useTrades();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSettingCapital, setIsSettingCapital] = useState(false);
    const [tempCapital, setTempCapital] = useState(profile?.initial_capital?.toString() || '0');

    useEffect(() => {
        if (profile?.initial_capital !== undefined) {
            setTempCapital(profile.initial_capital.toString());
        }
    }, [profile?.initial_capital]);

    const stats = calculateStats(trades, profile?.initial_capital || 0);

    const handleUpdateCapital = async () => {
        if (!user) return;
        const val = parseFloat(tempCapital);
        if (isNaN(val)) return;

        const { error } = await supabase
            .from('users')
            .update({ initial_capital: val } as never)
            .eq('id', user.id);

        if (!error) {
            await refreshProfile();
            setIsSettingCapital(false);
        }
    };

    const chartData: { name: string; balance: number; date: string }[] = [];
    let currentBalanceTotal = profile?.initial_capital || 0;

    [...trades]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .forEach(trade => {
            currentBalanceTotal += trade.net_pnl;
            chartData.push({
                name: new Date(trade.date).toLocaleDateString(undefined, { weekday: 'short' }),
                balance: currentBalanceTotal,
                date: trade.date
            });
        });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-body">
            {/* Alert if Capital is 0 */}
            {profile?.initial_capital === 0 && trades.length > 0 && (
                <div onClick={() => setIsSettingCapital(true)} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition-all">
                    <div className="flex items-center gap-3 text-amber-600">
                        <AlertTriangle size={20} className="animate-pulse" />
                        <div>
                            <p className="font-bold text-sm">Baseline Capital Missing</p>
                            <p className="text-xs font-medium opacity-80">Calculations are starting from ₹0.</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-amber-400" />
                </div>
            )}

            {/* Morning Style Hero Section */}
            <div className="relative p-10 bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 blur-3xl rounded-full -z-10" />

                <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <UserCircle className="w-12 h-12 text-white" />
                                )}
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900">
                                Welcome Back, {profile?.full_name?.split(' ')[0] || 'Trader'}!
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                                    <Sparkles size={12} className="text-indigo-600" />
                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Active Stream</span>
                                </div>
                                {profile?.plan === 'PREMIUM' && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                                        <Trophy size={11} className="text-amber-600" />
                                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pro Member</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">XP Points</p>
                            <div className="flex items-center gap-2">
                                <Zap className="text-amber-500 fill-amber-500" size={14} />
                                <span className="text-xl font-extrabold text-slate-900">{profile?.total_qp || 0}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus size={20} />
                            Log Trade
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-2">Performance Intelligence</h2>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Institutional Terminal</h3>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-Time Sync Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard icon={<Wallet size={20} />} label="Capital" value={formatCurrency(profile?.initial_capital || 0)} variant="white" onClick={() => setIsSettingCapital(true)} />
                <MetricCard icon={<Activity size={20} />} label="Net P&L" value={formatCurrency(stats.netPnl)} variant={stats.netPnl >= 0 ? "emerald" : "rose"} />
                <MetricCard icon={<Target size={20} />} label="Avg R:R" value={`1:${stats.avgRR.toFixed(2)}`} variant="amber" />
                <MetricCard icon={<Zap size={20} />} label="Profit Factor" value={stats.profitFactor.toFixed(2)} variant="purple" />

                <MetricCard icon={<TrendingUp size={20} />} label="Peak Trade" value={formatCurrency(stats.bestTrade)} variant="emerald" />
                <MetricCard icon={<TrendingDown size={20} />} label="Low Trade" value={formatCurrency(stats.worstTrade)} variant="rose" />
                <MetricCard icon={<History size={20} />} label="Frequency" value={`${stats.totalTrades} Trades`} variant="white" />
                <MetricCard icon={<Zap size={20} />} label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} variant="purple" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MiniMetric label="Total Profit" value={formatCurrency(stats.totalProfit)} positive />
                <MiniMetric label="Total Loss" value={formatCurrency(stats.totalLoss)} />
                <MiniMetric label="Avg Win" value={formatCurrency(stats.avgWin)} positive />
                <MiniMetric label="Avg Loss" value={formatCurrency(stats.avgLoss)} />
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Performance Curve</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Daily Balance Flux</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'Empty', balance: profile?.initial_capital || 0 }]}>
                                <defs>
                                    <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="600" tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="600" tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCurve)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Recent Logs</h2>
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1">
                        {trades.slice(0, 8).map((trade) => (
                            <div key={trade.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-indigo-200 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold text-white shadow-sm",
                                        trade.net_pnl >= 0 ? "bg-emerald-500" : "bg-rose-500"
                                    )}>
                                        {trade.direction[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{trade.instrument}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(trade.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className={cn("text-sm font-bold", trade.net_pnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
                                    {trade.net_pnl >= 0 ? '+' : ''}{formatCurrency(trade.net_pnl)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Capital Setting Modal */}
            {isSettingCapital && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-2xl space-y-8">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
                                <Wallet className="text-indigo-600" size={24} /> Set Trading Capital
                            </h3>
                            <p className="text-xs font-medium text-slate-500 mt-1">Define your baseline equity for calculations.</p>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="number"
                                value={tempCapital}
                                onChange={(e) => setTempCapital(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-lg font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                placeholder="₹ 0.00"
                            />
                            <div className="flex gap-3">
                                <button onClick={() => setIsSettingCapital(false)} className="flex-1 py-4 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
                                <button onClick={handleUpdateCapital} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/10 hover:bg-indigo-700 transition-all">Update Equity</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isFormOpen && <TradeForm onClose={() => setIsFormOpen(false)} />}
        </div>
    );
}

function MetricCard({ icon, label, value, variant = "white", onClick }: any) {
    const variants = {
        emerald: "bg-[#10b981] text-white shadow-lg shadow-[#10b981]/20 border-transparent",
        amber: "bg-[#f59e0b] text-white shadow-lg shadow-[#f59e0b]/20 border-transparent",
        rose: "bg-[#f43f5e] text-white shadow-lg shadow-[#f43f5e]/20 border-transparent",
        purple: "bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/20 border-transparent",
        white: "bg-white text-slate-900 border-slate-200 shadow-sm",
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "p-8 rounded-[3rem] flex flex-col justify-between h-52 border transition-all hover:scale-[1.02] hover:-translate-y-2 group relative overflow-hidden",
                variants[variant as keyof typeof variants],
                onClick && "cursor-pointer active:scale-95"
            )}
        >
            <div className="relative z-10 flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                        variant === 'white' ? "bg-slate-50 border-slate-100 text-indigo-600" : "bg-white/20 border-white/20 text-white"
                    )}>
                        {icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{label}</span>
                </div>
                {onClick && <Settings size={16} className="opacity-0 group-hover:opacity-50 transition-all text-indigo-600" />}
            </div>
            <span className="relative z-10 text-3xl font-black tracking-tighter">{value}</span>
        </div>
    );
}

function MiniMetric({ label, value, positive }: { label: string, value: string, positive?: boolean }) {
    return (
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col justify-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p>
            <p className={cn(
                "text-lg font-black tracking-tight",
                positive ? "text-emerald-600" : (value.startsWith('-') || value.includes('Loss') ? "text-rose-600" : "text-slate-900")
            )}>
                {value}
            </p>
        </div>
    );
}
