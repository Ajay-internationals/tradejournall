import { useState } from 'react';
import {
    Users,
    Calendar,
    MessageSquare,
    CheckCircle2,
    ChevronRight,
    Activity,
    AlertCircle,
    User,
    Clock,
    UserCheck,
    Star,
    Target,
    Zap,
    History,
    FileText,
    Brain,
    Trophy,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubHeading } from '@/components/ui/SubHeading';
import { useTrades } from '@/hooks/useTrades';
import { useAutoFlags } from '@/hooks/useAutoFlags';
import { formatCurrency } from '@/lib/stats';

// Mock data integration
const MOCK_STUDENTS = [
    { id: '1', name: 'Rahul S.', pnl: '+₹12,400', discipline: 92, risk: 'Low', status: 'Active' },
    { id: '2', name: 'Amit K.', pnl: '-₹3,200', discipline: 75, risk: 'Medium', status: 'Pending Review' },
    { id: '3', name: 'Priya M.', pnl: '-₹18,000', discipline: 45, risk: 'Critical', status: 'Overtrading' },
];

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

export default function Mentorship() {
    const [role, setRole] = useState<'student' | 'mentor'>('student');
    const [isApprovedMentor] = useState(true);
    const [studentTab, setStudentTab] = useState('overview');
    const [mentorTab, setMentorTab] = useState('dashboard');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    return (
        <div className="space-y-10 animate-in fade-in duration-500 font-body pb-20">
            {/* Unified Header with Role Toggle */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Unified Portal</span>
                        </div>
                        {role === 'mentor' && (
                            <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-full">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Mentor Active</span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none uppercase">Mentorship Portal ✨</h1>
                    <SubHeading className="mt-4 opacity-50">
                        {role === 'student' ? 'Guided Performance Hub' : 'Academy Management Terminal'}
                    </SubHeading>
                </div>

                <div className="flex p-2 bg-indigo-50 rounded-3xl border border-slate-200 shadow-inner">
                    <button
                        onClick={() => setRole('student')}
                        className={cn(
                            "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            role === 'student' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-indigo-600"
                        )}
                    >
                        My Progress
                    </button>
                    <button
                        onClick={() => setRole('mentor')}
                        className={cn(
                            "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            role === 'mentor' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-indigo-600"
                        )}
                    >
                        Management
                    </button>
                </div>
            </header>

            {role === 'student' ? (
                <StudentView activeTab={studentTab} setActiveTab={setStudentTab} />
            ) : (
                <MentorView
                    activeTab={mentorTab}
                    setActiveTab={setMentorTab}
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                />
            )}
        </div>
    );
}

function StudentView({ activeTab, setActiveTab }: any) {
    const { trades } = useTrades();
    const [acknowledged, setAcknowledged] = useState<string[]>(['rev-2']);

    const handleAcknowledge = (id: string) => {
        if (!acknowledged.includes(id)) {
            setAcknowledged([...acknowledged, id]);
        }
    };

    return (
        <div className="space-y-10">
            {/* Student Navigation - Updated Tabs */}
            <div className="flex gap-3 p-2 bg-white rounded-[2rem] border border-slate-200 w-fit shadow-sm">
                <SubTab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Activity size={18} />} label="Overview" />
                <SubTab active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} icon={<FileText size={18} />} label="Trade Journal" />
                <SubTab active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} icon={<Brain size={18} />} label="Strategy" />
                <SubTab active={activeTab === 'weekly'} onClick={() => setActiveTab('weekly')} icon={<Calendar size={18} />} label="Weekly" />
            </div>

            {activeTab === 'overview' && <StudentHomeDashboard acknowledged={acknowledged} onAcknowledge={handleAcknowledge} />}
            {activeTab === 'journal' && <TradeReviewView acknowledged={acknowledged} onAcknowledge={handleAcknowledge} />}
            {activeTab === 'strategy' && <StrategyAuditView />}
            {activeTab === 'weekly' && <WeeklyReviewSummary />}
        </div>
    );
}

function MentorView({ activeTab, setActiveTab, selectedStudent, setSelectedStudent }: any) {
    if (selectedStudent) {
        return <StudentProfileView student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
    }

    return (
        <div className="space-y-10">
            {/* Mentor Navigation */}
            <div className="flex gap-3 p-2 bg-white rounded-[2rem] border border-slate-200 w-fit shadow-sm">
                <SubTab active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Activity size={18} />} label="Overview" />
                <SubTab active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users size={18} />} label="Students" />
                <SubTab active={activeTab === 'weekly'} onClick={() => setActiveTab('weekly')} icon={<Calendar size={18} />} label="Weekly" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'dashboard' && (
                        <>
                            <section>
                                <SubHeading className="mb-6 flex items-center gap-2 ml-4">
                                    <Users size={16} className="text-indigo-600" /> Student Oversight
                                </SubHeading>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {MOCK_STUDENTS.map(s => (
                                        <StudentCard key={s.id} student={s} onClick={() => setSelectedStudent(s)} />
                                    ))}
                                </div>
                            </section>
                            <section className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                                <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Daily Review Queue</h3>
                                <ReviewQueue />
                            </section>
                        </>
                    )}
                    {activeTab === 'students' && (
                        <div className="grid grid-cols-1 gap-6">
                            {MOCK_STUDENTS.map(s => <StudentCard key={s.id} student={s} wide onClick={() => setSelectedStudent(s)} />)}
                        </div>
                    )}
                    {activeTab === 'weekly' && <WeeklyReviewHub />}
                </div>

                <div className="space-y-8">
                    <AlertsPanel />
                    <MentorCapacity ratio="12 / 30" />
                </div>
            </div>
        </div>
    );
}

// Sub-components from StudentMentorHub and Mentorship
function StudentHomeDashboard({ acknowledged, onAcknowledge }: any) {
    const { trades } = useTrades();
    const flags = useAutoFlags(trades);
    const todayTrades = trades.filter(t => new Date(t.date).toDateString() === new Date().toDateString());
    const isJournalDone = todayTrades.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
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

                <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <MessageSquare size={120} className="text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
                            <Star size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Mentor Directive</h2>
                    </div>

                    <div className="bg-indigo-50 p-8 rounded-3xl border border-slate-200 mb-8">
                        <p className="text-lg font-medium text-slate-900 leading-relaxed italic">
                            "{MOCK_FEEDBACK[0].comment}"
                        </p>
                    </div>

                    <button className="px-10 py-5 bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg hover:bg-slate-900 transition-all">
                        View Detailed Audit
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                <div className="p-10 bg-indigo-900 text-white border border-slate-200 rounded-[3.5rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                        <Zap size={140} className="fill-white" />
                    </div>
                    <SubHeading className="text-indigo-300 opacity-60 mb-8">Mentorship Blueprints</SubHeading>
                    <div className="space-y-4 relative z-10">
                        {[
                            { text: "Consistency King", cat: "PSYCH" },
                            { text: "Size Scale-Up", cat: "RISK" },
                            { text: "Zero Revenge Mode", cat: "CORE" }
                        ].map((b, i) => (
                            <button key={i} className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-between transition-all group/item">
                                <div className="flex items-center gap-4">
                                    <div className="px-2 py-1 bg-indigo-500/20 rounded-md text-[8px] font-black text-indigo-300 border border-indigo-500/30">
                                        {b.cat}
                                    </div>
                                    <span className="text-sm font-bold">{b.text}</span>
                                </div>
                                <Plus size={14} className="opacity-40 group-hover/item:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-10 bg-white text-slate-900 border border-slate-200 rounded-[3.5rem] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
                        <Target size={140} />
                    </div>
                    <SubHeading className="mb-8 opacity-50">Weekly Focus</SubHeading>
                    <p className="text-xl font-black leading-tight mb-8">
                        {MOCK_WEEKLY.nextWeekRules[0]}
                    </p>
                    <div className="space-y-4">
                        {MOCK_WEEKLY.nextWeekRules.slice(1, 4).map(rule => (
                            <div key={rule} className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-tight opacity-70">{rule}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TradeReviewView({ acknowledged, onAcknowledge }: any) {
    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Execution Audit Stream</h2>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <SubHeading className="mb-0">Mentor Sync Active</SubHeading>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {MOCK_FEEDBACK.map(review => (
                    <div key={review.id} className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm flex flex-col md:flex-row gap-10 items-start group hover:border-indigo-400 transition-all">
                        <div className="flex flex-col items-center gap-4 shrink-0">
                            <div className={cn(
                                "w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-black shadow-xl",
                                review.rating === 'A' ? "bg-emerald-500 text-white" :
                                    review.rating === 'B' ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                            )}>
                                {review.rating}
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{review.type} Grade</span>
                        </div>

                        <div className="flex-1 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-3">
                                    {review.tags.map(tag => (
                                        <span key={tag} className="px-5 py-2 bg-indigo-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-200">{tag}</span>
                                    ))}
                                </div>
                                <SubHeading className="mb-0 opacity-50">{new Date(review.date).toLocaleDateString()}</SubHeading>
                            </div>

                            <p className="text-xl font-medium text-slate-900 leading-relaxed italic">
                                "{review.comment}"
                            </p>

                            <div className="flex items-center gap-6 pt-8 border-t border-slate-200">
                                <button
                                    onClick={() => onAcknowledge(review.id)}
                                    disabled={acknowledged.includes(review.id)}
                                    className={cn(
                                        "px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        acknowledged.includes(review.id)
                                            ? "bg-indigo-50 border border-emerald-500/20 text-emerald-500 cursor-default flex items-center gap-3"
                                            : "bg-indigo-600 text-white shadow-xl hover:bg-slate-900"
                                    )}
                                >
                                    {acknowledged.includes(review.id) ? (
                                        <><CheckCircle2 size={16} /> Acknowledged</>
                                    ) : 'Lock Feedback'}
                                </button>
                                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-3">
                                    <MessageSquare size={16} /> Add Reflection
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StrategyAuditView() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="p-12 bg-white border border-slate-200 rounded-[4rem] shadow-sm space-y-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-[2rem] flex items-center justify-center">
                        <Brain size={32} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Approved Setups</h3>
                </div>
                <div className="space-y-6">
                    <ProgressBar label="ORB Breakout" value={85} />
                    <ProgressBar label="VWAP Reversal" value={72} />
                    <ProgressBar label="Mean Reversion" value={45} />
                </div>
            </div>

            <div className="p-12 bg-slate-900 border border-slate-800 rounded-[4rem] shadow-2xl space-y-10 text-white">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center">
                        <Target size={32} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Setup Protocol</h3>
                </div>
                <div className="space-y-6">
                    {['2R Minimum Requirement', 'No Entry Post 2:30 PM', 'Max SL: 0.5% Capital'].map(m => (
                        <div key={m} className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/10">
                            <CheckCircle2 size={24} className="text-indigo-400" />
                            <span className="text-sm font-bold uppercase tracking-tight">{m}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function WeeklyReviewSummary() {
    return (
        <div className="space-y-10">
            <header className="p-16 bg-white text-slate-900 border border-slate-200 rounded-[5rem] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 opacity-5 scale-150 rotate-12">
                    <Trophy size={200} />
                </div>
                <div className="relative z-10 max-w-4xl">
                    <SubHeading className="text-indigo-400 mb-8">Batch Summary: {MOCK_WEEKLY.period}</SubHeading>
                    <h3 className="text-5xl font-black tracking-tighter mb-10 leading-tight">Focusing on Execution Process.</h3>
                    <div className="p-10 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-[3rem] backdrop-blur-sm">
                        <p className="text-xl font-medium text-indigo-900 dark:text-indigo-100 leading-relaxed italic">
                            "{MOCK_WEEKLY.mentorNote}"
                        </p>
                    </div>
                </div>
            </header>
        </div>
    );
}

function StudentProfileView({ student, onBack }: any) {
    const [subTab, setSubTab] = useState('overview');
    return (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
            <button onClick={onBack} className="flex items-center gap-3 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.3em] mb-4">
                <ChevronRight className="rotate-180" size={16} /> Return to Home
            </button>

            <div className="flex flex-col xl:flex-row items-center justify-between p-12 bg-indigo-600 text-white rounded-[4rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000"><Users size={240} /></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-28 h-28 bg-white/20 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-inner border border-white/20">{student.name[0]}</div>
                    <div className="text-center md:text-left">
                        <h2 className="text-5xl font-black mb-4 tracking-tighter">{student.name}</h2>
                        <div className="flex gap-4">
                            <span className="px-5 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">ID: ST-10029</span>
                            <span className="px-5 py-2 bg-emerald-50 shadow-lg rounded-full text-[10px] font-black uppercase tracking-widest">Risk: {student.risk}</span>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 flex gap-12 text-center items-center mt-10 xl:mt-0 bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-md">
                    <div><p className="text-[10px] uppercase font-black opacity-60 tracking-wider mb-3">Total P&L</p><p className="text-4xl font-black leading-none">₹48.2K</p></div>
                    <div className="w-[1px] h-10 bg-white/20" />
                    <div><p className="text-[10px] uppercase font-black opacity-60 tracking-wider mb-3">Discipline</p><p className="text-4xl font-black leading-none">{student.discipline}%</p></div>
                </div>
            </div>

            <div className="flex gap-10 border-b border-slate-200 px-4">
                {['overview', 'trade journal', 'strategy', 'psychology'].map(t => (
                    <button
                        key={t}
                        onClick={() => setSubTab(t)}
                        className={cn("pb-6 text-[11px] font-black uppercase tracking-widest transition-all relative", subTab === t ? "text-indigo-600" : "text-slate-400 hover:text-slate-600")}
                    >
                        {t}
                        {subTab === t && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
                    </button>
                ))}
            </div>

            {subTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="p-12 bg-white border border-slate-200 shadow-sm rounded-[4rem]">
                        <h3 className="text-xl font-black mb-10 uppercase tracking-tighter">Performance Curve</h3>
                        <div className="h-72 bg-indigo-50 border border-slate-200 rounded-[2.5rem] flex items-center justify-center font-black text-slate-300 uppercase tracking-widest italic text-xs">Node Stats Integration Pending...</div>
                    </div>
                    <div className="p-12 bg-white border border-slate-200 shadow-sm rounded-[4rem]">
                        <h3 className="text-xl font-black mb-10 uppercase tracking-tighter">Setup Efficiency</h3>
                        <div className="space-y-8">
                            <ProgressBar label="ORB Breakout" value={72} />
                            <ProgressBar label="VWAP Reversal" value={55} />
                            <ProgressBar label="Mean Reversion" value={42} />
                        </div>
                    </div>
                </div>
            )}

            {subTab === 'trade journal' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <ReviewEntryCard />
                        <ReviewTimeline />
                    </div>
                    <div className="space-y-8">
                        <ChecklistSection />
                    </div>
                </div>
            )}
        </div>
    );
}

// Utility components
function SubTab({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-10 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shrink-0",
                active
                    ? "bg-indigo-600 text-white shadow-xl scale-105"
                    : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"
            )}
        >
            {icon} {label}
        </button>
    );
}

function StatusCard({ label, value, subValue, icon, variant = 'white' }: any) {
    return (
        <div className="p-12 bg-white border border-slate-200 rounded-[4rem] shadow-sm flex items-center justify-between group hover:border-indigo-400 transition-all">
            <div className="space-y-4">
                <SubHeading className="mb-0 opacity-60">{label}</SubHeading>
                <p className={cn(
                    "text-5xl font-black leading-none tracking-tighter",
                    variant === 'rose' ? "text-rose-500" :
                        variant === 'emerald' ? "text-emerald-500" : "text-slate-900"
                )}>{value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-40 leading-none">{subValue}</p>
            </div>
            <div className="w-24 h-24 bg-indigo-50 border border-slate-200 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
    );
}

function StudentCard({ student, onClick, wide = false }: any) {
    return (
        <div className={cn(
            "p-10 bg-white border border-slate-200 rounded-[3rem] hover:border-indigo-400 transition-all cursor-pointer group shadow-sm",
            wide ? "flex flex-col md:flex-row items-center justify-between" : "space-y-8"
        )} onClick={onClick}>
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-inner">
                    {student.name[0]}
                </div>
                <div className="leading-none">
                    <h4 className="font-black text-xl text-slate-900 uppercase tracking-tighter">{student.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 italic">{student.status}</p>
                </div>
            </div>

            <div className={cn("grid gap-10", wide ? "grid-cols-3 flex-1 px-12 mt-10 md:mt-0" : "grid-cols-2")}>
                <Metric label="M-P&L" value={student.pnl} color={student.pnl.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} />
                <Metric label="Discipline" value={`${student.discipline}%`} color={student.discipline > 80 ? 'text-emerald-500' : 'text-amber-500'} />
                {wide && <Metric label="Risk Level" value={student.risk} color={student.risk === 'Low' ? 'text-emerald-500' : 'text-rose-500'} />}
            </div>

            {!wide && (
                <button className="w-full py-5 bg-indigo-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                    Open Audit
                </button>
            )}
        </div>
    );
}

function Metric({ label, value, color }: any) {
    return (
        <div className="leading-none">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest opacity-60">{label}</p>
            <p className={cn("text-xl font-black tracking-tighter", color)}>{value}</p>
        </div>
    );
}

function AlertsPanel() {
    return (
        <div className="p-10 bg-white border border-rose-100 dark:border-rose-500/20 rounded-[3.5rem] shadow-sm">
            <SubHeading className="mb-8 flex items-center gap-3 text-rose-500">
                <AlertCircle size={18} /> Priority Audit
            </SubHeading>
            <div className="space-y-6">
                <AlertItem type="Rule" text="Priya M. exceeded max trades per day (4)." />
                <AlertItem type="Limit" text="Amit K. hit stop-loss limit for the week." />
                <AlertItem type="Journal" text="3 students haven't logged today's EOD." />
            </div>
        </div>
    );
}

function AlertItem({ type, text }: any) {
    return (
        <div className="p-6 bg-rose-50/50 dark:bg-rose-500/5 rounded-2xl border border-rose-100/50 dark:border-rose-500/10 text-[11px] leading-relaxed">
            <span className="font-black uppercase text-rose-600 mr-3">{type}:</span>
            <span className="font-medium text-slate-600 dark:text-slate-400 italic">{text}</span>
        </div>
    );
}

function MentorCapacity({ ratio }: { ratio: string }) {
    return (
        <div className="p-10 bg-white border border-slate-200 rounded-[3.5rem] shadow-sm">
            <SubHeading className="mb-8 opacity-50">Academy Capacity</SubHeading>
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <p className="text-xs font-black uppercase text-slate-900 dark:text-white">Active Load</p>
                    <p className="text-2xl font-black text-indigo-600 leading-none">{ratio}</p>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }}></div>
                </div>
            </div>
        </div>
    );
}

function ReviewQueue() {
    return (
        <div className="space-y-4">
            {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between p-8 bg-indigo-50 border border-slate-200 rounded-3xl hover:border-indigo-400 transition-all group">
                    <div className="flex gap-6 items-center">
                        <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-400 font-black text-[10px] tracking-widest">#LOG-{290 + i}</div>
                        <p className="text-base font-bold text-slate-900 uppercase tracking-tight">EOD Log: Student-00{i}</p>
                    </div>
                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all">Audit Now</button>
                </div>
            ))}
        </div>
    );
}

function ProgressBar({ label, value }: { label: string, value: number }) {
    return (
        <div>
            <div className="flex justify-between mb-4">
                <SubHeading className="mb-0 opacity-50">{label}</SubHeading>
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider leading-none">{value}% Accuracy</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div className="h-full bg-indigo-500 rounded-full shadow-lg" style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );
}

function ReviewEntryCard() {
    return (
        <div className="bg-white border border-slate-200 rounded-[4rem] p-12 shadow-sm">
            <h3 className="text-2xl font-black mb-10 uppercase tracking-tighter">Submit Audit Note</h3>
            <div className="flex gap-6 mb-10">
                <RatingButton label="A" sub="Perfect Process" />
                <RatingButton label="B" sub="Protocol Drift" active />
                <RatingButton label="C" sub="Rule Violation" />
            </div>
            <textarea
                placeholder="Diagnostic feedback for the operator..."
                className="w-full bg-indigo-50 border border-slate-200 rounded-[2.5rem] p-10 text-base font-medium min-h-[180px] mb-10 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 italic"
            ></textarea>
            <button className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-indigo-500/20 hover:bg-slate-900 transition-all">
                Publish Official Audit
            </button>
        </div>
    );
}

function RatingButton({ label, sub, active = false }: any) {
    return (
        <button className={cn(
            "flex-1 p-8 rounded-[2rem] border transition-all text-center group",
            active ? "bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105" : "bg-indigo-50 border-slate-200 hover:bg-slate-50"
        )}>
            <p className="text-5xl font-black">{label}</p>
            <p className={cn("text-[10px] uppercase font-black mt-4 tracking-widest", active ? "text-indigo-100" : "text-slate-400")}>{sub}</p>
        </button>
    );
}

function ChecklistSection() {
    const points = ['Stop-Loss Hardware-Set', 'Rule-Based Entry Confirmed', 'Max Daily Loss Cap', 'RR 1:2.5 Minimum'];
    return (
        <div className="p-10 bg-white border border-slate-200 rounded-[3.5rem] shadow-sm">
            <SubHeading className="mb-10 text-center opacity-40">Professional Mentorship</SubHeading>
            <div className="space-y-6">
                {points.map(p => (
                    <div key={p} className="flex items-center gap-5 group">
                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                        <span className="text-sm font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest italic">{p}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReviewTimeline() {
    return (
        <div className="p-12 bg-white border border-slate-200 rounded-[4rem] shadow-sm">
            <h3 className="text-3xl font-black mb-12 text-slate-900 uppercase tracking-tighter">Audit History</h3>
            <div className="space-y-16">
                <div className="relative pl-12 border-l-4 border-slate-100 dark:border-slate-800 pb-12 last:pb-0 group">
                    <div className="absolute left-[-14px] top-0 w-6 h-6 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900 shadow-xl scale-125"></div>
                    <SubHeading className="mb-4 text-indigo-500 opacity-60">Jan 24, 2026 • EOD Audit</SubHeading>
                    <p className="text-xl font-medium text-slate-900 leading-relaxed mb-8 italic">"Outstanding emotional control. You transitioned from a losing morning to a break-even afternoon without forcing any revenge trades. This is the hallmark of professional scaling."</p>
                    <div className="flex gap-4">
                        <span className="px-5 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-[9px] font-black uppercase text-indigo-600 tracking-wider">Protocol Maintained</span>
                        <span className="px-5 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-full text-[9px] font-black uppercase text-emerald-600 tracking-wider">Zero Revenge Trades</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WeeklyReviewHub() {
    return (
        <div className="space-y-8">
            <div className="p-16 bg-slate-900 rounded-[5rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
                <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                    <Zap size={200} className="fill-indigo-600 text-indigo-600" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-5xl font-black mb-6 tracking-tighter uppercase">Academy Performance</h3>
                    <SubHeading className="text-indigo-400 mb-16 opacity-60 text-sm">Batch Analysis: JAN 19 - 25</SubHeading>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
                            <p className="text-[10px] opacity-40 font-black uppercase tracking-widest mb-4 italic">Total Delta</p>
                            <p className="text-4xl font-black uppercase tracking-tighter text-emerald-500">+₹4.2L</p>
                        </div>
                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
                            <p className="text-[10px] opacity-40 font-black uppercase tracking-widest mb-4 italic">Avg Accuracy</p>
                            <p className="text-4xl font-black uppercase tracking-tighter text-indigo-400">74%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
