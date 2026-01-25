import { useTrades } from '@/hooks/useTrades';
import { useAuth } from '@/context/AuthContext';
import { useRazorpay } from '@/hooks/useRazorpay';
import { formatCurrency } from '@/lib/stats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, PieChart, Pie } from 'recharts';
import { Lock, Zap, BarChart2, Shield, Brain, Target, TrendingDown, PieChart as PieIcon, Activity, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Analytics() {
    const { trades } = useTrades();
    const { profile, upgradePlan } = useAuth();
    const { openCheckout } = useRazorpay();

    const handleUpgrade = async () => {
        try {
            await openCheckout(1499, 'Pro Annual Subscription');
            await upgradePlan('PREMIUM');
        } catch (e) {
            console.error(e);
        }
    };

    const isPremium = profile?.plan === 'PREMIUM';

    // --- Calculations ---
    const mistakeStats: Record<string, number> = {};
    trades.forEach(trade => {
        if (trade.tags) {
            trade.tags.forEach(tag => {
                mistakeStats[tag] = (mistakeStats[tag] || 0) + trade.net_pnl;
            });
        }
    });

    const sortedMistakes = Object.entries(mistakeStats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.value - b.value);

    const dayStats: Record<string, number> = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    trades.forEach(trade => {
        const day = dayNames[new Date(trade.date).getDay()];
        dayStats[day] = (dayStats[day] || 0) + trade.net_pnl;
    });

    const dayData = days.map(day => ({ name: day, value: dayStats[day] || 0 }));

    const assetStats: Record<string, number> = {};
    trades.forEach(trade => {
        const asset = trade.asset_class || 'INDEX';
        assetStats[asset] = (assetStats[asset] || 0) + (trade.entry_price * trade.quantity);
    });

    const assetData = Object.entries(assetStats).map(([name, value]) => ({ name, value }));
    const PIE_COLORS = ['#6366f1', '#a855f7', '#0ea5e9', '#10b981', '#f43f5e'];

    const bestDay = [...dayData].sort((a, b) => b.value - a.value)[0];
    const avgWinSize = trades.filter(t => t.net_pnl > 0).length > 0
        ? trades.filter(t => t.net_pnl > 0).reduce((acc, curr) => acc + curr.net_pnl, 0) / trades.filter(t => t.net_pnl > 0).length
        : 0;

    if (!isPremium) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
                <div className="relative w-full max-w-4xl bg-white/70 dark:bg-indigo-950/20 backdrop-blur-3xl border border-indigo-500/10 rounded-[4rem] p-20 text-center overflow-hidden shadow-3xl ring-1 ring-indigo-500/5">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-indigo-500">
                        <Lock size={300} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-800 rounded-[2.5rem] flex items-center justify-center shadow-3xl mb-12 animate-pulse">
                            <Lock className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter dark:text-indigo-100">Unlock Intelligence ✨</h1>
                        <p className="text-indigo-900/40 dark:text-indigo-200/40 max-w-2xl mb-16 text-xl font-medium leading-relaxed">
                            Stop guessing. Start knowing. Get deep terminal insights into your strategy performance, mistakes, and best days.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
                            <ProFeatureCard icon={<Brain size={20} />} title="Alpha Audit" sub="Find where you leak edge" />
                            <ProFeatureCard icon={<Target size={20} />} title="Apex Timing" sub="Best execution windows" />
                            <ProFeatureCard icon={<TrendingDown size={20} />} title="Drawdown Log" sub="Comprehensive risk analytics" />
                        </div>

                        <button
                            onClick={handleUpgrade}
                            className="px-16 py-7 bg-indigo-600 text-white font-black rounded-[2.2rem] hover:bg-black transition-all hover:scale-105 shadow-3xl uppercase tracking-[0.2em] text-[10px]"
                        >
                            UPGRADE TO TERMINAL PRO <Zap size={14} className="inline ml-3 fill-white" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-body">
            <header className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center shadow-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <BarChart2 className="w-8 h-8 text-white relative z-10" />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-1 text-slate-900">Analytics ✨</h1>
                    <p className="sub-text text-indigo-900/40">Real-time performance telemetry.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Insights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-none">
                        <MiniInsightCard label="Best Session" value={bestDay.name} icon={<Clock size={16} />} />
                        <MiniInsightCard label="Average Alpha" value={formatCurrency(avgWinSize)} icon={<TrendingUp size={16} />} />
                    </div>

                    {/* Chart Container */}
                    <div className="p-12 bg-white border border-slate-200 rounded-[3.5rem] shadow-sm">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter text-slate-900">Daily Delta</h3>
                                <p className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.3em] mt-1">Net Flow by active day</p>
                            </div>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dayData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                    <XAxis dataKey="name" fontSize={10} fontWeight="900" stroke="#94a3b8" tickLine={false} axisLine={false} />
                                    <YAxis fontSize={10} fontWeight="900" stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', fontWeight: '900', fontSize: '10px', color: '#0f172a' }}
                                    />
                                    <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                                        {dayData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#f43f5e'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Allocation Card */}
                    <div className="p-12 bg-white border border-slate-200 rounded-[3.5rem] shadow-sm flex flex-col items-center">
                        <div className="w-full mb-10">
                            <h3 className="text-2xl font-black tracking-tighter text-slate-900">Allocation</h3>
                            <p className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.3em] mt-1">Capital distribution</p>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={assetData.length > 0 ? assetData : [{ name: 'Empty', value: 1 }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={10}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {assetData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', fontWeight: '900', fontSize: '10px', color: '#0f172a' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full mt-6 space-y-3">
                            {assetData.map((alt, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                                        <span className="text-indigo-900/60">{alt.name}</span>
                                    </div>
                                    <span className="text-slate-900">₹{(alt.value / 1000).toFixed(1)}k</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MiniInsightCard({ label, value, icon }: any) {
    return (
        <div className="p-10 bg-white border border-slate-200 rounded-[3rem] flex items-center justify-between shadow-sm group hover:border-indigo-500/30 transition-all duration-500">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500/60 mb-3 group-hover:text-indigo-500 transition-colors uppercase">{label}</p>
                <p className="text-2xl font-black tracking-tighter text-slate-900">{value}</p>
            </div>
            <div className="w-14 h-14 bg-indigo-600/10 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {icon}
            </div>
        </div>
    );
}

function ProFeatureCard({ icon, title, sub }: any) {
    return (
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-left flex items-start gap-6 transition-all hover:border-indigo-400 group hover:shadow-lg shadow-sm">
            <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {icon}
            </div>
            <div className="leading-none mt-1">
                <p className="text-base font-black tracking-tight mb-2 dark:text-indigo-100">{title}</p>
                <p className="text-[10px] text-indigo-500/50 font-black uppercase tracking-widest leading-none mt-1">{sub}</p>
            </div>
        </div>
    );
}
