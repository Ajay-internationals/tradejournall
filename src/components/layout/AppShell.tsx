import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Logo } from './Logo';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AppShell() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--app-bg)] text-[var(--app-text)] transition-all duration-500 font-body">
            {/* Consistent Top Title Bar - Span full width */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-white/60 dark:bg-indigo-950/40 backdrop-blur-3xl border-b border-indigo-500/10 z-[90] flex items-center justify-between px-6 lg:px-12 shadow-2xl transition-all duration-500 ring-1 ring-indigo-500/5">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="group cursor-pointer scale-[1.1] origin-left" onClick={() => navigate('/dashboard')}>
                        <Logo />
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <button
                        onClick={toggleTheme}
                        className="p-3 bg-white dark:bg-indigo-900/50 border border-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:scale-110 active:scale-95 transition-all shadow-lg"
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-2xl ring-1 ring-indigo-400/30">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Everything is Good! ✨</span>
                    </div>
                </div>
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main scrollable area */}
            <main className="flex-1 overflow-y-auto pt-20 ml-0 md:ml-80 no-scrollbar bg-[var(--app-bg)] transition-all duration-300 w-full">
                <div className="max-w-[1400px] mx-auto p-4 md:p-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
