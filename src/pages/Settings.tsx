import { useAuth } from '@/context/AuthContext';
import { useTrades } from '@/hooks/useTrades';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import { Download, Trash2, Shield, User, Zap, LogOut, ChevronRight, Camera, Smartphone, AtSign, Sun, Moon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Settings() {
    const { profile, signOut, user, refreshProfile } = useAuth();
    const { trades, deleteTrade } = useTrades();
    const { theme, toggleTheme } = useTheme();

    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        full_name: profile?.full_name || '',
        phone_number: profile?.phone_number || '',
        avatar_url: profile?.avatar_url || ''
    });

    const handleExport = () => {
        const dataStr = JSON.stringify(trades, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `trade_data_${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleReset = async () => {
        if (confirm('Are you sure? This will delete ALL your trades permanently.')) {
            for (const trade of trades) {
                await deleteTrade.mutateAsync(trade.id);
            }
            alert('All trade data has been purged.');
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsUpdating(true);
        try {
            await api.users.updateProfile(user.id, formData);
            await refreshProfile();
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update profile.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-body">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-10 p-12 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[4rem] shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-[var(--app-text)] leading-none uppercase">Terminal Control ✨</h1>
                        <p className="text-[var(--app-text-muted)] font-black uppercase tracking-[0.4em] text-[10px] mt-4 opacity-50 italic">Profile & Protocol Config</p>
                    </div>
                </div>
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-8 py-4 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl text-xs font-bold transition-all hover:bg-[var(--app-nav-active)] active:scale-95 shadow-sm"
                >
                    {theme === 'light' ? (
                        <>
                            <Moon size={16} className="text-indigo-600" />
                            <span>Switch to Dark Mode</span>
                        </>
                    ) : (
                        <>
                            <Sun size={16} className="text-amber-400" />
                            <span>Switch to Light Mode</span>
                        </>
                    )}
                </button>
            </header>

            {/* Profile Section */}
            <div className="p-12 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[4.5rem] shadow-[var(--shadow-soft)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000 text-indigo-600">
                    <User size={250} />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-10 mb-14">
                        <div className="relative">
                            <div className="w-32 h-32 bg-white border border-[var(--app-border)] rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-indigo-600 shadow-2xl overflow-hidden ring-4 ring-indigo-50">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (profile?.full_name?.[0] || 'T')}
                            </div>
                            <button className="absolute -bottom-3 -right-3 p-4 bg-indigo-600 text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white">
                                <Camera size={20} />
                            </button>
                        </div>

                        <div className="text-center md:text-left leading-none">
                            <h2 className="text-3xl font-black text-[var(--app-text)] tracking-tighter mb-4">{profile?.full_name || 'Trader Account'}</h2>
                            <p className="text-[10px] font-black text-[var(--app-text-muted)] uppercase tracking-[0.4em] leading-none opacity-50">{profile?.email}</p>
                            <div className="mt-8">
                                <span className={cn(
                                    "px-8 py-3 rounded-full text-[9px] font-black tracking-[0.3em] uppercase border shadow-sm",
                                    profile?.plan === 'PREMIUM' ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-indigo-50 text-indigo-600 border-indigo-200"
                                )}>
                                    {profile?.plan || 'STANDARD'} Membership
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--app-text-muted)] ml-6 opacity-40">Full Identity</label>
                            <div className="relative">
                                <AtSign className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full pl-18 pr-10 py-6 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-sm text-[var(--app-text)] shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--app-text-muted)] ml-6 opacity-40">Phone Channel</label>
                            <div className="relative">
                                <Smartphone className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                <input
                                    type="text"
                                    value={formData.phone_number}
                                    onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                    className="w-full pl-18 pr-10 py-6 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-sm text-[var(--app-text)] shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--app-text-muted)] ml-6 opacity-40">Avatar Stream (URL)</label>
                            <input
                                type="text"
                                value={formData.avatar_url}
                                onChange={e => setFormData({ ...formData, avatar_url: e.target.value })}
                                className="w-full px-10 py-6 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-sm text-[var(--app-text)] shadow-sm"
                            />
                        </div>

                        <button
                            disabled={isUpdating}
                            type="submit"
                            className="md:col-span-2 py-6 bg-indigo-600 text-white rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 mt-4"
                        >
                            {isUpdating ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sync Profile Profile'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Actions Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SettingsAction
                    icon={<Download className="w-6 h-6" />}
                    title="Export Data"
                    description="Archive your entire history to a JSON file."
                    actionText="Download"
                    onClick={handleExport}
                />
                <SettingsAction
                    icon={<Trash2 className="w-6 h-6" />}
                    title="Reset Logs"
                    description="Permanently delete all synced trades."
                    actionText="Purge"
                    onClick={handleReset}
                    color="red"
                />
            </div>

            <div className="flex items-center justify-between p-8 bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 rounded-3xl shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                        <LogOut className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-rose-600 leading-none">Security Zone</p>
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mt-1">End Active Session</p>
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    className="px-8 py-3 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all uppercase tracking-widest shadow-lg shadow-rose-500/10"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

function SettingsAction({ icon, title, description, actionText, onClick, color }: any) {
    return (
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm flex flex-col justify-between h-80 group hover:border-indigo-400 transition-all">
            <div className="flex flex-col items-center text-center gap-6">
                <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500",
                    color === 'red' ? "bg-rose-100 dark:bg-rose-500/10 text-rose-500" : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600"
                )}>
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{title}</h4>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed px-4">{description}</p>
                </div>
            </div>
            <button
                onClick={onClick}
                className={cn(
                    "w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md",
                    color === 'red'
                        ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white"
                        : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                )}
            >
                {actionText}
            </button>
        </div>
    );
}
