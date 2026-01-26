import { useState } from 'react';
import {
    Activity,
    MessageSquare,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Plus,
    Star,
    ChevronRight,
    Calendar,
    Award,
    Shield,
    Target,
    Zap,
    History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrades } from '@/hooks/useTrades';
import { useAutoFlags } from '@/hooks/useAutoFlags';
import { formatCurrency } from '@/lib/stats';

// Mock Mentor Feedback Data
const MOCK_FEEDBACK = [
    {
        id: 'rev-1',
        date: '2026-01-25',
        type: 'EOD',
        rating: 'B',
        comment: 'Good discipline on initial entries, but you hesitated on the VWAP reversal setup. Don\'t let the previous loss affect the next valid signal.',
        tags: ['Rule Followed', 'Hesitation'],
        acknowledged: false
    },
    {
        id: 'rev-2',
        date: '2026-01-24',
        type: 'EOD',
        rating: 'A',
        comment: 'Perfect execution. You stayed patient for 2 hours and hit the high-conviction setup. This is how pros trade.',
        tags: ['Perfect Process', 'Patience'],
        acknowledged: true
    }
];

const MOCK_WEEKLY = {
    period: 'Jan 19 - Jan 25',
    mentorNote: 'This week showed significant improvement in position sizing. However, morning volatility remains a struggle. We will focus on "Waiting for 10 AM" next week.',
    topMistakes: ['Morning impulsive entry', 'Wide stop on gap up', 'Exiting too early'],
    topImprovements: ['Position sizing consistency', 'EOD journal completion', 'RR selection'],
    nextWeekRules: ['No trades before 10:00 AM', 'Max 2 trades per day', 'Mandatory 5 min reflection post-trade'],
};

export default function StudentMentorHub() {
    const { trades } = useTrades();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'reviews' | 'weekly'>('dashboard');
    const [acknowledged, setAcknowledged] = useState<string[]>(['rev-2']);

    const handleAcknowledge = (id: string) => {
        if (!acknowledged.includes(id)) {
            setAcknowledged([...acknowledged, id]);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-body pb-20">
            {/* Nav Tabs */}
            <div className="flex gap-3 p-2 bg-[var(--app-card)] rounded-[2rem] border border-[var(--app-border)] w-fit shadow-[var(--shadow-soft)]">
                <SubTab active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Activity size={18} />} label="Student Home" />
                <SubTab active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<MessageSquare size={18} />} label="Trade Reviews" />
                <SubTab active={activeTab === 'weekly'} onClick={() => setActiveTab('weekly')} icon={<Calendar size={18} />} label="Weekly Summary" />
            </div>

            {activeTab === 'dashboard' && <StudentHomeDashboard acknowledged={acknowledged} onAcknowledge={handleAcknowledge} />}
            {activeTab === 'reviews' && <TradeReviewView acknowledged={acknowledged} onAcknowledge={handleAcknowledge} />}
            {activeTab === 'weekly' && <WeeklyReviewSummary />}
        </div>
    );
}

function StudentHomeDashboard({ acknowledged, onAcknowledge }: any) {
    const { trades } = useTrades();
    const flags = useAutoFlags(trades);
    const todayTrades = trades.filter(t => new Date(t.date).toDateString() === new Date().toDateString());
    const isJournalDone = todayTrades.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatusCard
                        label="Today's Performance"
                        value={formatCurrency(todayTrades.reduce((acc, t) => acc + t.net_pnl, 0))}
                        subValue={`Trades Logged: ${todayTrades.length}`}
                        icon={<Activity className="text-indigo-600" />}
                    />
                    <StatusCard
                        label="Journal Status"
                        value={isJournalDone ? "Completed" : "Pending"}
                        subValue={isJournalDone ? "Logs Secured" : "Awaiting EOD Entry"}
                        icon={isJournalDone ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-rose-500" />}
                        variant={isJournalDone ? 'emerald' : 'rose'}
                    />
                </div>

                {/* Mentor Feedback Card */}
                <div className="p-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <MessageSquare size={80} className="text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
                            <Star size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--app-text)] uppercase tracking-tight">Mentor Directive</h2>
                    </div>

                    <div className="bg-[var(--app-bg)] p-6 rounded-2xl border border-[var(--app-border)] mb-6">
                        <p className="text-sm font-medium text-[var(--app-text)] leading-relaxed italic">
                            "{MOCK_FEEDBACK[0].comment}"
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
                            onClick={() => window.location.hash = 'reviews'}
                        >
                            View Full Feedback
                        </button>
                    </div>
                </div>

                {/* Flags/Alerts Section */}
                {flags.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">System Protocol Alerts</h3>
                        {flags.map((flag, idx) => (
                            <div key={idx} className={cn(
                                "p-6 border rounded-[2rem] flex items-center gap-6",
                                flag.severity === 'CRITICAL' ? "bg-rose-50 dark:bg-rose-500/5 border-rose-100 dark:border-rose-500/20" : "bg-amber-50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/20"
                            )}>
                                <div className={cn(
                                    "w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm",
                                    flag.severity === 'CRITICAL' ? "text-rose-500" : "text-amber-500"
                                )}>
                                    <AlertCircle size={24} className={flag.severity === 'CRITICAL' ? "animate-pulse" : ""} />
                                </div>
                                <div>
                                    <p className={cn(
                                        "text-sm font-bold leading-none",
                                        flag.severity === 'CRITICAL' ? "text-rose-600" : "text-amber-600"
                                    )}>System Flag: {flag.type}</p>
                                    <p className={cn(
                                        "text-xs font-medium mt-1 uppercase tracking-wider",
                                        flag.severity === 'CRITICAL' ? "text-rose-500/70" : "text-amber-500/70"
                                    )}>{flag.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            <div className="space-y-8">
                {/* Weekly Focus */}
                <div className="p-8 bg-[var(--app-card)] text-[var(--app-text)] border border-[var(--app-border)] rounded-[3rem] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Target size={120} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-indigo-400 mb-6 italic">Weekly Focus Plan</h3>
                    <p className="text-lg font-bold leading-relaxed mb-8">
                        {MOCK_WEEKLY.nextWeekRules[0]}
                    </p>
                    <div className="space-y-4">
                        {MOCK_WEEKLY.nextWeekRules.slice(1, 3).map(rule => (
                            <div key={rule} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                <span className="text-xs font-bold text-slate-400">{rule}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTAs */}
                <div className="space-y-4">
                    <button className="w-full p-6 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[2rem] flex items-center justify-between group hover:border-indigo-400 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                                <Plus size={20} />
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Log Today's Trades</span>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </button>
                    <button className="w-full p-6 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[2rem] flex items-center justify-between group hover:border-indigo-400 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl flex items-center justify-center">
                                <Award size={20} />
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Monthly Progress Report</span>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function TradeReviewView({ acknowledged, onAcknowledge }: any) {
    const { trades } = useTrades();

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-black text-[var(--app-text)] uppercase tracking-tight">Execution Audit Stream</h2>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mentor Sync Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {MOCK_FEEDBACK.map(review => (
                    <div key={review.id} className="bg-[var(--app-card)] border border-[var(--app-border)] p-8 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row gap-8 items-start group hover:border-indigo-400/50 transition-all">
                        <div className="flex flex-col items-center gap-4 shrink-0">
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg",
                                review.rating === 'A' ? "bg-emerald-500 text-white" :
                                    review.rating === 'B' ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                            )}>
                                {review.rating}
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{review.type} Review</span>
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {review.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full">{tag}</span>
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(review.date).toLocaleDateString()}</span>
                            </div>

                            <p className="text-base font-medium text-[var(--app-text)] leading-relaxed italic">
                                "{review.comment}"
                            </p>

                            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => onAcknowledge(review.id)}
                                    disabled={acknowledged.includes(review.id)}
                                    className={cn(
                                        "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        acknowledged.includes(review.id)
                                            ? "bg-white dark:bg-slate-800 border border-emerald-500/20 text-emerald-500 cursor-default flex items-center gap-2"
                                            : "bg-indigo-600 text-white shadow-lg hover:bg-slate-900 active:scale-95"
                                    )}
                                >
                                    {acknowledged.includes(review.id) ? (
                                        <><CheckCircle2 size={14} /> Acknowledged</>
                                    ) : 'Acknowledge Feedback'}
                                </button>
                                <button className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 transition-all flex items-center gap-2 group">
                                    <MessageSquare size={14} /> Add Reflection
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function WeeklyReviewSummary() {
    return (
        <div className="space-y-10">
            <header className="p-12 bg-[var(--app-card)] text-[var(--app-text)] border border-[var(--app-border)] rounded-[4rem] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                    <Award size={200} />
                </div>
                <div className="relative z-10 max-w-3xl">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-6 italic">Strategic Audit: {MOCK_WEEKLY.period}</h2>
                    <h3 className="text-4xl font-black tracking-tighter mb-8 leading-tight">Focusing on Execution Quality over P&L Outcomes.</h3>
                    <div className="p-8 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-[2.5rem] backdrop-blur-sm">
                        <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100 leading-relaxed italic">
                            "{MOCK_WEEKLY.mentorNote}"
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="p-10 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3.5rem] shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-[1.5rem] flex items-center justify-center">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-tight">Leakage Audit</h3>
                    </div>
                    <div className="space-y-4">
                        {MOCK_WEEKLY.topMistakes.map(m => (
                            <div key={m} className="flex items-center gap-4 p-4 bg-rose-50/50 dark:bg-rose-500/5 rounded-2xl border border-rose-100/50 dark:border-rose-500/10">
                                <AlertCircle size={18} className="text-rose-500" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 italic">{m}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-10 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3.5rem] shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-[1.5rem] flex items-center justify-center">
                            <Plus size={24} />
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-tight">Growth Points</h3>
                    </div>
                    <div className="space-y-4">
                        {MOCK_WEEKLY.topImprovements.map(m => (
                            <div key={m} className="flex items-center gap-4 p-4 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/10">
                                <CheckCircle2 size={18} className="text-emerald-500" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 italic">{m}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-12 bg-[var(--app-card)] border border-indigo-600 rounded-[4rem] shadow-2xl text-center space-y-10">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                        <Target size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-[var(--app-text)] uppercase tracking-tighter">Commit to Next Week's Focus</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {MOCK_WEEKLY.nextWeekRules.map(rule => (
                        <div key={rule} className="p-6 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">{rule}</p>
                        </div>
                    ))}
                </div>

                <button className="px-16 py-6 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-slate-900 transition-all shadow-2xl hover:scale-105 active:scale-95">
                    Accept & Lock Focus Plan
                </button>
            </div>
        </div>
    );
}

function StatusCard({ label, value, subValue, icon, variant = 'white' }: any) {
    return (
        <div className="p-10 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3.5rem] shadow-[var(--shadow-soft)] flex items-center justify-between group hover:border-indigo-400 transition-all hover:scale-[1.02]">
            <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--app-text-muted)] opacity-60">{label}</p>
                <p className={cn(
                    "text-4xl font-black leading-none tracking-tighter",
                    variant === 'rose' ? "text-rose-500" :
                        variant === 'emerald' ? "text-emerald-500" : "text-[var(--app-text)]"
                )}>{value}</p>
                <p className="text-[10px] font-bold text-[var(--app-text-muted)] uppercase tracking-widest opacity-40">{subValue}</p>
            </div>
            <div className="w-20 h-20 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform text-indigo-600">
                {icon}
            </div>
        </div>
    );
}

function SubTab({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2.5 px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-widest transition-all shrink-0",
                active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                    : "text-[var(--app-text-muted)] hover:bg-slate-50 hover:text-indigo-600"
            )}
        >
            {icon} {label}
        </button>
    );
}
