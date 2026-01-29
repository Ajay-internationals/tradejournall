import React, { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    Calendar,
    Shield,
    Zap,
    Search,
    Download,
    Eye,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    CreditCard
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface AdminStats {
    totalUsers: number;
    premiumUsers: number;
    totalTrades: number;
    totalVolume: number;
    recentSignups: number;
}

export default function Admin() {
    const { profile } = useAuth();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [trades, setTrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'trades'>('overview');

    useEffect(() => {
        const loadAdminData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [s, u, t] = await Promise.all([
                    api.admin.getStats(),
                    api.admin.listUsers(),
                    api.admin.listAllTrades()
                ]);
                setStats(s);
                setUsers(u || []);
                setTrades(t || []);
            } catch (err: any) {
                console.error('Admin Load Error:', err);
                setError(err.message || 'Failed to load system data');
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accessing Terminal...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 border border-rose-100 p-12 rounded-[32px] text-center space-y-4">
                <Shield className="mx-auto text-rose-500" size={48} />
                <h3 className="text-xl font-bold text-rose-900">Access Denied or System Error</h3>
                <p className="text-rose-600 max-w-md mx-auto">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-rose-600 text-white rounded-2xl font-bold text-sm hover:bg-rose-700 transition-colors"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">System Terminal</h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-xs tracking-[0.2em]">Platform Administration & Oversight</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                        {(['overview', 'users', 'trades'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                                    activeTab === tab
                                        ? "bg-white text-indigo-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-12">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={<Users className="text-blue-600" />}
                            label="Total Entities"
                            value={stats?.totalUsers || 0}
                            trend={`+${stats?.recentSignups} this week`}
                        />
                        <StatCard
                            icon={<CreditCard className="text-emerald-600" />}
                            label="Premium Access"
                            value={stats?.premiumUsers || 0}
                            trend={`${((stats?.premiumUsers || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}% conversion`}
                        />
                        <StatCard
                            icon={<Activity className="text-indigo-600" />}
                            label="System Throughput"
                            value={stats?.totalTrades || 0}
                            trend="Total Trades logged"
                        />
                        <StatCard
                            icon={<TrendingUp className="text-violet-600" />}
                            label="Value Transacted"
                            value={`₹${(stats?.totalVolume || 0).toLocaleString()}`}
                            trend="Total P&L Analyzed"
                        />
                    </div>

                    {/* Recent Users List */}
                    <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Recent Onboarding</h3>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">Latest platform registrations</p>
                            </div>
                            <button onClick={() => setActiveTab('users')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-2">
                                View Registry <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    <tr>
                                        <th className="px-8 py-4">User Identity</th>
                                        <th className="px-8 py-4">Status / Plan</th>
                                        <th className="px-8 py-4">Registration</th>
                                        <th className="px-8 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.slice(0, 5).map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">
                                                        {u.full_name?.[0] || u.email?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{u.full_name || 'Anonymous'}</p>
                                                        <p className="text-xs text-slate-400">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                                    u.plan === 'PREMIUM' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                                                )}>
                                                    {u.plan}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-sm font-medium text-slate-500">
                                                {formatDate(u.created_at)}
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">User Registry</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                <tr>
                                    <th className="px-8 py-4">Identity</th>
                                    <th className="px-8 py-4">Role</th>
                                    <th className="px-8 py-4">Access Level</th>
                                    <th className="px-8 py-4">Capitalization</th>
                                    <th className="px-8 py-4">Registry Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600">
                                                    {u.full_name?.[0] || u.email?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 line-clamp-1">{u.full_name || 'Anonymous'}</p>
                                                    <p className="text-xs text-slate-400 truncate w-48">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                                u.role === 'ADMIN' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {u.role || 'USER'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                                u.plan === 'PREMIUM'
                                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                                    : "bg-slate-50 text-slate-500 border-slate-100"
                                            )}>
                                                {u.plan}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-slate-900">
                                            ₹{(u.initial_capital || 0).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 text-sm font-medium text-slate-500">
                                            {formatDate(u.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'trades' && (
                <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">Global Trade Feed</h3>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Cross-platform trade monitoring</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                <tr>
                                    <th className="px-8 py-4">User</th>
                                    <th className="px-8 py-4">Instrument</th>
                                    <th className="px-8 py-4">Side</th>
                                    <th className="px-8 py-4">Net P&L</th>
                                    <th className="px-8 py-4">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {trades.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <p className="font-bold text-slate-900">
                                                {Array.isArray(t.users) ? t.users[0]?.full_name : t.users?.full_name || 'Unknown'}
                                            </p>
                                            <p className="text-[10px] text-slate-400 truncate w-32">
                                                {Array.isArray(t.users) ? t.users[0]?.email : t.users?.email}
                                            </p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <Zap className="text-amber-500" size={14} />
                                                <span className="font-bold text-slate-700">{t.instrument}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest",
                                                t.direction === 'BUY' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                            )}>
                                                {t.direction}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "font-bold",
                                                t.net_pnl >= 0 ? "text-emerald-600" : "text-rose-600"
                                            )}>
                                                {t.net_pnl >= 0 ? '+' : ''}{t.net_pnl.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-sm font-medium text-slate-500">
                                            {formatDate(t.date)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string | number, trend: string }) {
    return (
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-indigo-50">
                    {icon}
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                    <Activity size={12} className="text-slate-300" />
                </div>
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
                <div className="flex items-center gap-1.5 mt-2">
                    <ArrowUpRight size={12} className="text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-500">{trend}</span>
                </div>
            </div>
        </div>
    );
}
