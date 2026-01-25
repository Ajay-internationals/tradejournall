import { useNavigate } from 'react-router-dom';
import { Target, Users, Zap, ShieldCheck, MessageSquare, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function MentorGuidance() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 font-body">
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">Personalized Coaching Terminal</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.05]">
                        Master the Market with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-6xl md:text-8xl">Professional Guidance</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-12 font-medium">
                        Don't trade alone. Get matched with expert mentors who provide structural accountability, detailed trade reviews, and behavioral corrections.
                    </p>

                    <button
                        onClick={() => navigate('/pricing')}
                        className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all"
                    >
                        Explore Mentor Plan <ArrowRight className="inline-block ml-2 w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto font-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-black mb-6">Why Seek Mentor Guidance?</h2>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    Trading is 90% psychology and 10% strategy. A mentor acts as your behavioral mirror, pointing out the mistakes you're too biased to see yourself.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <GuidancePoint
                                    icon={<ShieldCheck className="text-indigo-600" />}
                                    title="Structural Accountability"
                                    text="Weekly and EOD reviews ensure you stick to your rules and don't slide into old habits."
                                />
                                <GuidancePoint
                                    icon={<Target className="text-indigo-600" />}
                                    title="Pattern Feedback"
                                    text="Mentors identify recurring overtrading, revenge trading, and setup-drift patterns."
                                />
                                <GuidancePoint
                                    icon={<MessageSquare className="text-indigo-600" />}
                                    title="Guided Improvement"
                                    text="Receive actionable checklists and points for next-week focus to accelerate your learning curve."
                                />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Zap size={100} />
                            </div>
                            <h3 className="text-xl font-black mb-8 border-b border-slate-100 pb-6 uppercase tracking-widest text-indigo-600">Mentor Plan Inclusions</h3>
                            <div className="space-y-4">
                                <PlanFeature text="Multiple trading accounts (self + students)" />
                                <PlanFeature text="Student performance tracking dashboard" />
                                <PlanFeature text="Community access with professional moderation" />
                                <PlanFeature text="Weekly Structured Review (Strategy & Discipline)" />
                                <PlanFeature text="End-of-Day (EOD) Review notes on logged trades" />
                                <PlanFeature text="Behavioral Feedback Heatmaps" />
                                <PlanFeature text="Improvement checklist & Action points" />
                            </div>
                            <div className="mt-12 p-6 bg-indigo-50 rounded-2xl">
                                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 italic underline">Limited Capacity</p>
                                <p className="text-xs font-bold text-slate-500">Mentors maintain a restricted ratio (1:30) to ensure high-quality, personalized attention for every student.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-20 px-6 border-t border-slate-200 bg-white text-center font-body">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Trade Adhyayan • Mentorship Ecosystem</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                    <CheckCircle2 size={12} className="text-indigo-400" />
                    <p className="text-[10px] font-bold text-slate-900 uppercase">Made in India • For India</p>
                </div>
            </footer>
        </div>
    );
}

function GuidancePoint({ icon, title, text }: any) {
    return (
        <div className="flex gap-6">
            <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                {icon}
            </div>
            <div>
                <h4 className="font-black text-lg mb-1">{title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{text}</p>
            </div>
        </div>
    );
}

function PlanFeature({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
            <span className="text-sm font-bold text-slate-700">{text}</span>
        </div>
    );
}
