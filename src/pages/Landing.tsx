import { useNavigate } from 'react-router-dom';
import { cloneElement } from 'react';
import {
    Brain, BarChart3, Trophy, Sparkles, ChevronRight,
    Smartphone, Target, History,
    Activity, CheckCircle2, XCircle,
    ArrowRight, Lock, RotateCcw, BarChart, Users, Mail, Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Logo } from '@/components/layout/Logo';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 overflow-x-hidden font-body">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Logo />
                    <nav className="hidden md:flex items-center gap-8">
                        {['Features', 'About Us', 'Pricing', 'Partner', 'Contact Us'].map((item) => (
                            <button
                                key={item}
                                onClick={() => {
                                    const id = item.toLowerCase().replace(' ', '-');
                                    const el = document.getElementById(id);
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="text-sm font-bold font-heading text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wider"
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold font-heading text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        Login
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 md:pt-40 pb-10 md:pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50 to-transparent blur-[120px] rounded-full -z-10" />

                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-indigo-50 border border-indigo-100 mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        <span className="text-xs md:text-sm font-bold font-heading tracking-wide text-indigo-600">The Ultimate Trading Journal for Indian Markets ✨</span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-heading tracking-tight mb-4 md:mb-8 leading-[1.1] text-slate-900">
                        Refine Your Edge.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-600">Trade Like a Pro.</span>
                    </h1>

                    <h2 className="text-lg md:text-3xl font-semibold text-slate-600 mb-6 md:mb-10 max-w-4xl mx-auto leading-relaxed">
                        Automatic broker sync, psychology tracking, and institutional-grade analytics for serious traders.
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 md:mb-16">
                        <button
                            onClick={() => navigate('/login', { state: { defaultSignUp: true } })}
                            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold font-heading transition-all hover:bg-indigo-700 hover:scale-105 shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-3"
                        >
                            Get Started for Free
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                const element = document.getElementById('features');
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold font-heading transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center gap-3"
                        >
                            Explore Features
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-t border-slate-100 max-w-3xl mx-auto">
                        <TrustBadge icon={<CheckCircle2 className="text-emerald-500 w-5 h-5" />} text="100% Secure & Private" />
                        <TrustBadge icon={<Smartphone className="text-indigo-500 w-5 h-5" />} text="Multi-Broker Sync" />
                        <TrustBadge icon={<Lock className="text-sky-500 w-5 h-5" />} text="Bank-Grade Encryption" />
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-12 md:py-24 px-6 bg-slate-50/50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 md:mb-8 leading-tight">
                            Stop making the same mistakes over and over.
                        </h2>
                        <div className="space-y-6 mb-10 md:mb-12">
                            <ProblemItem text="Excel journals take too much time to maintain" />
                            <ProblemItem text="Hard to spot emotional patterns and bias" />
                            <ProblemItem text="No visibility on strategy-wise performance" />
                            <ProblemItem text="Lack of accountability during market hours" />
                        </div>
                        <div className="inline-block p-1 px-1 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                            <div className="px-10 py-5 bg-indigo-600 rounded-[1.8rem] text-white">
                                <p className="text-xl font-bold font-heading">Trade Adhyayan is the solution.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="relative p-10 bg-white border border-slate-200 rounded-[3rem] shadow-2xl">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
                            <h3 className="text-xl font-bold font-heading mb-8 flex items-center gap-3">
                                <XCircle className="text-rose-500" size={24} />
                                Why Traders Fail
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold font-heading text-slate-500 mb-1">
                                        <span>EMOTIONAL CONTROL</span>
                                        <span>20%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-1/5 bg-rose-500 rounded-full" />
                                    </div>
                                </div>
                                <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
                                <div className="h-3 w-full bg-slate-100 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features Section */}
            <section id="features" className="py-12 md:py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-indigo-600 font-bold font-heading tracking-widest uppercase text-sm mb-4">Powerful Features</h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-heading">Everything you need to grow.</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <MiniFeature icon={<RotateCcw className="text-indigo-600" />} title="Auto Sync" text="Direct fetch trades from Zerodha, Upstox & more." />
                        <MiniFeature icon={<Target className="text-emerald-500" />} title="Strategy Analysis" text="Deep dive into setup-wise win rate & ROI." />
                        <MiniFeature icon={<BarChart className="text-sky-600" />} title="Visual Equity" text="Beautiful performance charts and telemetry." />
                        <MiniFeature icon={<Brain className="text-purple-600" />} title="Psychology" text="Track emotions to prevent revenge trading." />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-12 md:py-24 px-6 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-6xl font-bold font-heading mb-4">Fair Pricing</h2>
                        <p className="text-slate-500 text-lg font-heading text-slate-500 font-bold">Invest in your discipline, not just your capital.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PricingCard
                            title="Starter"
                            price="Free"
                            description="For beginners starting their journey."
                            features={['Manual Trade Logs', 'Basic Analytics', 'Single Device']}
                        />
                        <PricingCard
                            title="Pro"
                            price="₹499"
                            period="/ mo"
                            description="Advanced tools for serious traders."
                            isFeatured
                            features={['Automated Broker Sync', 'Psychology Matrix', 'Strategy Heatmaps']}
                        />
                        <PricingCard
                            title="Mentor"
                            price="₹4999"
                            period="/ mo"
                            description="For academies and professional teams."
                            features={[
                                'Student Management Portal',
                                'Mass Review System',
                                'Institutional Reporting',
                                'Custom Setup Audits'
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 -z-10" />
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 blur-3xl rounded-full" />

                    <h2 className="text-4xl md:text-7xl font-bold font-heading text-white mb-10 tracking-tighter">Ready to master the markets?</h2>
                    <button
                        onClick={() => navigate('/login', { state: { defaultSignUp: true } })}
                        className="px-16 py-6 bg-white text-indigo-600 rounded-full font-bold font-heading text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl active:scale-95"
                    >
                        Start Your Free Trial
                    </button>
                    <p className="mt-10 text-indigo-100 font-bold font-heading text-[10px] uppercase tracking-[0.4em] opacity-60">Join 5,000+ traders improving their edge today.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-1">
                            <Logo className="scale-110 origin-left mb-8" />
                            <p className="text-slate-500 font-heading text-slate-500 font-bold leading-relaxed">
                                Professional grade trade analytics for the modern Indian market operator.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold font-heading text-slate-900 mb-6 font-heading">Product</h4>
                            <ul className="space-y-4">
                                <FooterLink href="/#features" label="Features" />
                                <FooterLink href="/pricing" label="Pricing" />
                                <FooterLink href="/about" label="Mission" />
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold font-heading text-slate-900 mb-6 font-heading">Legal</h4>
                            <ul className="space-y-4">
                                <FooterLink href="/privacy" label="Privacy" />
                                <FooterLink href="/terms" label="Terms" />
                                <FooterLink href="/refund" label="Refund" />
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold font-heading text-slate-900 mb-6 font-heading">Connect</h4>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-sm font-bold font-heading text-slate-900">Live in Indian Nodes</p>
                            </div>
                            <p className="text-xs text-slate-500">Made with ❤️ in India.</p>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-slate-400 font-bold font-heading">Trade Adhyayan © 2026</p>
                        <div className="flex gap-6">
                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-all cursor-default">
            {icon}
            <span className="text-xs font-bold font-heading text-slate-600">{text}</span>
        </div>
    );
}

function ProblemItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-6 h-6 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shrink-0">
                <XCircle size={16} />
            </div>
            <span className="text-lg font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{text}</span>
        </div>
    );
}

function MiniFeature({ icon, title, text }: any) {
    return (
        <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                {cloneElement(icon, { size: 24 })}
            </div>
            <h4 className="font-bold font-heading text-xl mb-3">{title}</h4>
            <p className="text-sm text-slate-500 font-heading text-slate-500 font-bold leading-relaxed">{text}</p>
        </div>
    );
}

function PricingCard({ title, price, period, description, features, isFeatured = false }: any) {
    const navigate = useNavigate();
    return (
        <div className={cn(
            "p-10 rounded-[3rem] border relative flex flex-col transition-all duration-500 group",
            isFeatured
                ? "bg-slate-900 text-white border-slate-800 shadow-2xl scale-105 z-10"
                : "bg-white text-slate-900 border-slate-100 shadow-xl hover:-translate-y-2"
        )}>
            {isFeatured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold font-heading uppercase tracking-widest shadow-lg">Most Popular</div>}

            <h4 className={cn("text-xs font-bold font-heading uppercase tracking-[0.2em] mb-4", isFeatured ? "text-indigo-400" : "text-indigo-600")}>{title}</h4>
            <div className="flex items-baseline gap-2 mb-4 leading-none">
                <span className="text-5xl font-bold font-heading">{price}</span>
                {period && <span className={cn("text-sm font-bold font-heading", isFeatured ? "text-slate-400" : "text-slate-500 tracking-wide")}>{period}</span>}
            </div>
            <p className={cn("text-sm font-heading text-slate-500 font-bold mb-10", isFeatured ? "text-slate-400" : "text-slate-600")}>{description}</p>

            <div className="flex-1 space-y-4 mb-10 border-t pt-8 border-white/5">
                {features.map((f: string) => (
                    <div key={f} className="flex items-center gap-3 text-sm font-semibold">
                        <CheckCircle2 size={18} className="text-emerald-500" /> {f}
                    </div>
                ))}
            </div>

            <button
                onClick={() => navigate('/login', { state: { defaultSignUp: true } })}
                className={cn(
                    "w-full py-5 rounded-2xl font-bold font-heading transition-all",
                    isFeatured
                        ? "bg-indigo-600 text-white hover:bg-white hover:text-indigo-600"
                        : "bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white"
                )}
            >
                Get Started
            </button>
        </div>
    );
}

function FooterLink({ href, label }: { href: string, label: string }) {
    const navigate = useNavigate();
    const isAnchor = href.startsWith('/#');
    return (
        <li>
            <a
                href={href}
                onClick={(e) => {
                    if (!isAnchor) {
                        e.preventDefault();
                        navigate(href);
                    }
                }}
                className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-semibold"
            >
                {label}
            </a>
        </li>
    );
}
