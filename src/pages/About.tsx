import { useNavigate } from 'react-router-dom';
import { Target, Shield, Heart, CheckCircle2 } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 font-body">
            <PublicHeader />

            <section className="pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center font-body">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                        The Mission for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-6xl md:text-8xl">Discipline</span>
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-12">
                        Trade Adhyayan was built by traders, for traders. In a world of flashy signals and "quick riches," we stand for the boring, profitable reality: Discipline, Data, and Consistency.
                    </p>
                </div>
            </section>

            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 font-body">
                    <AboutCard
                        icon={<Target className="text-indigo-600" />}
                        title="Precision Over Luck"
                        text="Every trade is data. We help you turn that data into a repeatable edge."
                    />
                    <AboutCard
                        icon={<Shield className="text-indigo-600" />}
                        title="Radical Integrity"
                        text="No fake screenshots. No signal selling. Just pure analytics and self-improvement."
                    />
                    <AboutCard
                        icon={<Heart className="text-indigo-600" />}
                        title="For the Community"
                        text="Built to empower the Indian retail trading ecosystem with institutional-grade tools."
                    />
                </div>
            </section>

            <footer className="py-20 px-6 border-t border-slate-200 bg-white text-center font-body">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle2 size={12} className="text-indigo-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Made in India • For India</p>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                    Trade Adhyayan © 2026. Empowering disciplined trading.
                </p>
            </footer>
        </div>
    );
}

function AboutCard({ icon, title, text }: any) {
    return (
        <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center mb-8">
                {icon}
            </div>
            <h3 className="text-xl font-black mb-4">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{text}</p>
        </div>
    );
}
