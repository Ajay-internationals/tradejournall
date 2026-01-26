import { useNavigate, Link, NavLink } from 'react-router-dom';
import { Zap } from 'lucide-react';

export function PublicHeader() {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-all duration-300">
                        <Zap size={28} fill="currentColor" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-slate-900">
                        Trade Adhyayan
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    <HeaderLink label="Features" href="/#features" />
                    <HeaderLink label="Pricing" href="/pricing" />
                    <HeaderLink label="Strategies" href="/strategies" />
                    <HeaderLink label="Community" href="/community" />
                    <Link
                        to="/login"
                        className="px-8 py-3.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function HeaderLink({ label, href }: { label: string; href: string }) {
    return (
        <Link
            to={href}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
        >
            {label}
        </Link>
    );
}
