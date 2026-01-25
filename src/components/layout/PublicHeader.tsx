import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';

export function PublicHeader() {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="group cursor-pointer" onClick={() => navigate('/')}>
                    <Logo />
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                    <HeaderLink href="/#features" label="Features" />
                    <HeaderLink href="/pricing" label="Pricing" />
                    <HeaderLink href="/partner" label="Partner" />
                    <HeaderLink href="/about" label="About" />
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/10"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
}

function HeaderLink({ href, label }: { href: string; label: string }) {
    const navigate = useNavigate();
    const isAnchor = href.startsWith('/#');

    return (
        <a
            href={href}
            onClick={(e) => {
                if (!isAnchor) {
                    e.preventDefault();
                    navigate(href);
                }
            }}
            className="hover:text-indigo-600 transition-colors font-bold text-sm tracking-tight"
        >
            {label}
        </a>
    );
}
