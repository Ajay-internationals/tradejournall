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

export function Sidebar() {
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
                { icon: <Users size={20} />, label: 'Mentor Hub', path: '/mentorship' },
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
        <aside className="w-80 h-[calc(100vh-5rem)] bg-white border-r border-slate-200 flex flex-col fixed left-0 top-20 z-40 font-body overflow-y-auto no-scrollbar pb-4">
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
                                            "w-full flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 group",
                                            isActive
                                                ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "p-1.5 rounded-xl transition-colors",
                                                isActive ? "bg-white shadow-sm" : "bg-transparent group-hover:bg-whiteScale"
                                            )}>
                                                {item.icon}
                                            </div>
                                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                        </div>
                                        {isActive && <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile / Status */}
            <div className="p-8 space-y-4">
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col items-center gap-4 text-center">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <Zap className="text-indigo-600 fill-indigo-600" size={24} />
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 leading-none mb-2">{profile?.full_name?.split(' ')[0] || 'Trader'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile?.plan || 'STANDARD'} STREAM</p>
                    </div>
                </div>

                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm"
                >
                    <LogOut size={20} />
                    Logout Account
                </button>
            </div>
        </aside>
    );
}
