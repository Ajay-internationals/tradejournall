import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Activity,
    Users,
    Settings,
    LogOut,
    Target,
    Zap,
    ChevronRight,
    Brain,
    Shield,
    Calendar,
    Trophy,
    Rocket,
    GraduationCap,
    Wrench,
    Globe,
    BookOpen,
    Link
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Logo } from './Logo';

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile, signOut } = useAuth();

    const menuItems = [
        {
            label: 'CORE', items: [
                { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
                { icon: <Activity size={20} />, label: 'Journal', path: '/journal' },
                { icon: <Zap size={20} />, label: 'Analytics', path: '/analytics' },
                { icon: <Calendar size={20} />, label: 'Calendar', path: '/calendar' },
            ]
        },
        {
            label: 'EDGE', items: [
                { icon: <Shield size={20} />, label: 'Mistakes', path: '/mistakes' },
                { icon: <Target size={20} />, label: 'Rules', path: '/rules' },
                { icon: <Brain size={20} />, label: 'Strategies', path: '/strategies' },
            ]
        },
        {
            label: 'GROWTH', items: [
                { icon: <Users size={20} />, label: 'Mentor Hub', path: '/student-mentor-hub' },
                { icon: <Calendar size={20} />, label: 'Mentor Admin', path: '/mentorship' },
                { icon: <BookOpen size={20} />, label: 'Mentor Guidance', path: '/mentor-guidance' },
                { icon: <Trophy size={20} />, label: 'Challenges', path: '/challenges' },
                { icon: <Rocket size={20} />, label: 'Roadmap', path: '/roadmap' },
                { icon: <GraduationCap size={20} />, label: 'Learn', path: '/learn' },
            ]
        },
        {
            label: 'SYSTEM', items: [
                { icon: <Link size={20} />, label: 'Broker Link', path: '/broker-link' },
                { icon: <Wrench size={20} />, label: 'Tools', path: '/tools' },
                { icon: <Globe size={20} />, label: 'Community', path: '/community' },
                { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
            ]
        }
    ];

    return (
        <aside className={cn(
            "w-80 h-[calc(100vh-5rem)] bg-white dark:bg-[#070b14] border-r border-slate-200 dark:border-white/5 flex flex-col fixed left-0 top-20 z-40 overflow-y-auto no-scrollbar pb-4 transition-transform duration-300 md:translate-x-0 font-body",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Header / Logo removed - handled by AppShell */}
            <div className="mt-6" />

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-6 mt-4">
                {menuItems.map((category) => (
                    <div key={category.label} className="space-y-2">
                        <p className="px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-80">{category.label}</p>
                        <div className="space-y-1">
                            {category.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-6 py-3 rounded-xl transition-all duration-300 group relative",
                                            isActive
                                                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 dark:text-slate-400 dark:hover:text-white hover:text-slate-900"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "transition-colors",
                                                isActive ? "text-violet-600 dark:text-violet-500" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white"
                                            )}>
                                                {item.icon}
                                            </div>
                                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                        </div>
                                        {isActive && <div className="w-1 h-5 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile / Status */}
            <div className="p-8 space-y-4">
                <div className="p-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4 text-center transition-colors">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl border border-white/20 dark:border-white/10 overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <Zap className="text-white fill-white" size={24} />
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-none mb-2">{profile?.full_name?.split(' ')[0] || 'Trader'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile?.plan || 'STANDARD'}</p>
                    </div>
                </div>

                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all font-bold text-sm"
                >
                    <LogOut size={20} />
                    Logout Account
                </button>
            </div>
        </aside>
    );
}
