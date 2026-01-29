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
            label: 'Main', items: [
                { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
                { icon: <Activity size={20} />, label: 'Journal', path: '/journal' },
                { icon: <Zap size={20} />, label: 'Analytics', path: '/analytics' },
                { icon: <Calendar size={20} />, label: 'Calendar', path: '/calendar' },
            ]
        },
        {
            label: 'Performance', items: [
                { icon: <Shield size={20} />, label: 'Mistakes', path: '/mistakes' },
                { icon: <Target size={20} />, label: 'Rules', path: '/rules' },
                { icon: <Brain size={20} />, label: 'Strategies', path: '/strategies' },
            ]
        },
        {
            label: 'Mentorship', items: [
                { icon: <Users size={20} />, label: 'Mentorship', path: '/mentorship' },
                { icon: <BookOpen size={20} />, label: 'Mentor Guidance', path: '/mentor-guidance' },
                { icon: <Trophy size={20} />, label: 'Challenges', path: '/challenges' },
                { icon: <Rocket size={20} />, label: 'Roadmap', path: '/roadmap' },
                { icon: <GraduationCap size={20} />, label: 'Learn', path: '/learn' },
            ]
        },
        {
            label: 'Tools', items: [
                { icon: <Wrench size={20} />, label: 'Tools', path: '/tools' },
                { icon: <Globe size={20} />, label: 'Community', path: '/community' },
                { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
            ]
        },
        ...(profile?.role === 'ADMIN' ? [{
            label: 'Admin', items: [
                { icon: <Shield size={20} />, label: 'Dashboard', path: '/admin' },
            ]
        }] : [])
    ];

    return (
        <aside className={cn(
            "w-80 h-[calc(100vh-5rem)] bg-white border-r border-slate-200 flex flex-col fixed left-0 top-20 z-40 overflow-y-auto no-scrollbar pb-4 transition-transform duration-300 md:translate-x-0 font-body",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Header / Logo removed - handled by AppShell */}
            <div className="mt-6" />

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-6 mt-4">
                {menuItems.map((category) => (
                    <div key={category.label} className="space-y-2">
                        <p className="px-6 text-[10px] font-bold uppercase text-slate-400 opacity-60">
                            {category.label}
                        </p>
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
                                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "transition-colors",
                                                isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                                            )}>
                                                {item.icon}
                                            </div>
                                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                        </div>
                                        {isActive && <div className="w-1 h-5 bg-indigo-500 rounded-full" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile / Status */}
            <div className="p-8 space-y-4">
                <div className="p-6 bg-white border border-slate-200 rounded-3xl flex items-center gap-4 transition-colors shadow-sm">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 overflow-hidden shrink-0">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <Zap className="text-white fill-white" size={20} />
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 leading-tight">{profile?.full_name?.split(' ')[0] || 'Trader'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile?.plan || 'Free'}</p>
                    </div>
                </div>

                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
