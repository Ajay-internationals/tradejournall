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
        <div className="flex h-screen overflow-hidden bg-slate-50 text-indigo-950 transition-all duration-500 font-body">
            {/* Consistent Top Title Bar - Span full width */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-200 z-[90] flex items-center justify-between px-6 lg:px-12 transition-all duration-300 shadow-sm">
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
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold uppercase  text-indigo-600">System Active</span>
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
            <main className="flex-1 overflow-y-auto pt-20 ml-0 md:ml-80 no-scrollbar bg-slate-50 transition-colors duration-300 w-full">
                <div className="max-w-[1400px] mx-auto p-4 md:p-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
