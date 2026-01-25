import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function Pricing() {
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Free',
            price: '₹0',
            period: 'forever',
            description: 'For traders exploring journal mechanics',
            features: [
                'Manual trade entry',
                'Basic P&L analytics',
                'Daily trade journal',
                'Rule checklists',
            ],
            cta: 'Get Started',
            popular: false,
        },
        {
            name: 'Pro',
            price: '₹499',
            period: 'per month',
            description: 'Professional tools for traders',
            features: [
                'Automated Broker Sync',
                'Advanced strategy data',
                'Psychology & bias tracking',
                'Bulk Excel imports',
                'Personalized reports',
            ],
            cta: 'Start Pro Trial',
            popular: true,
        },
        {
            name: 'Mentor',
            price: '₹4999',
            period: 'per month',
            description: 'For serious operators & mentors seeking guidance.',
            features: [
                'Track Students & Multiple Accounts',
                'Weekly Structured Strategy Review',
                'EOD Trade Review Notes',
                'Pattern & Behavior Feedback',
                'Actionable Improvement Checklist',
            ],
            cta: 'Get Started',
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 font-body">
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center font-body">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 mb-8">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">Invest in your discipline</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
                        Transparent <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Investment</span>
                    </h1>

                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[11px]">
                        Choose the plan that fits your trading business.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20 px-6">
                <div className="max-w-6xl mx-auto font-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={cn(
                                    "relative p-10 rounded-[3rem] border-2 transition-all hover:-translate-y-2 flex flex-col shadow-xl",
                                    plan.popular
                                        ? 'bg-slate-900 text-white border-transparent'
                                        : 'bg-white border-slate-100'
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute top-8 right-8 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                        Popular
                                    </div>
                                )}

                                <div className="mb-10">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-indigo-500">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className="text-5xl font-black">{plan.price}</span>
                                        {plan.period !== 'forever' && <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">/{plan.period}</span>}
                                    </div>
                                    <p className={cn(
                                        "text-sm font-bold uppercase tracking-widest leading-relaxed",
                                        plan.popular ? "text-indigo-400" : "text-slate-600"
                                    )}>
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-12 flex-1">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className={plan.popular ? "text-indigo-400" : "text-emerald-500"} />
                                            <span className={cn(
                                                "text-[11px] font-bold uppercase tracking-tight",
                                                plan.popular ? "text-white/90" : "text-slate-700"
                                            )}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => navigate(plan.name === 'Mentor' ? '/partner' : '/login')}
                                    className={cn(
                                        "w-full py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all",
                                        plan.popular
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_20px_40px_rgba(79,70,229,0.3)]'
                                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                    )}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-slate-200 bg-slate-50 text-center font-body">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <CheckCircle2 size={12} className="text-indigo-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Made in India • For India</p>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade Adhyayan © 2026</p>
            </footer>
        </div>
    );
}
