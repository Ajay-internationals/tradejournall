import { useState } from 'react';
import {
    Users,
    Calendar,
    MessageSquare,
    CheckCircle2,
    ChevronRight,
    LineChart,
    Activity,
    FileText,
    History,
    AlertCircle,
    User,
    Clock,
    UserCheck,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data
const MOCK_STUDENTS = [
    { id: '1', name: 'Rahul S.', pnl: '+₹12,400', discipline: 92, risk: 'Low', status: 'Active' },
    { id: '2', name: 'Amit K.', pnl: '-₹3,200', discipline: 75, risk: 'Medium', status: 'Pending Review' },
    { id: '3', name: 'Priya M.', pnl: '-₹18,000', discipline: 45, risk: 'Critical', status: 'Overtrading' },
];

export default function Mentorship() {
    const [isApprovedMentor, setIsApprovedMentor] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    if (!isApprovedMentor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 space-y-10 animate-in fade-in duration-700 font-body">
                <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                    <UserCheck size={48} />
                </div>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Mentor Onboarding</h1>
                    <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                        To become an official Trade Adhyayan Mentor, you must submit your credentials.
                        Our team reviews profiles in <span className="text-indigo-600 font-bold">3-4 business days</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                    <OnboardingStep label="Profile Setup" value="Experience & Market Focus" />
                    <OnboardingStep label="Review Training" value="EOD Feedback Standards" />
                    <OnboardingStep label="Sample Review" value="Mock Data Assessment" />
                </div>

                <button
                    onClick={() => setIsApprovedMentor(true)}
                    className="btn-primary"
                >
                    Apply for Activation
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500 font-body pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">Mentor Dashboard</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-3">Academy Oversight Engine</p>
                </div>
                <div className="flex gap-4">
                    <StatBox label="Active Students" value="12/30" icon={<Users size={16} />} color="indigo" />
                    <StatBox label="Pending Review" value="4" icon={<Clock size={16} />} color="rose" />
                </div>
            </header>

            {/* Sub-Navigation */}
            <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-200 w-fit">
                <SubTab active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Activity size={16} />} label="Overview" />
                <SubTab active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users size={16} />} label="Students" />
                <SubTab active={activeTab === 'weekly'} onClick={() => setActiveTab('weekly')} icon={<Calendar size={16} />} label="Weekly" />
            </div>

            {selectedStudent ? (
                <StudentProfileView student={selectedStudent} onBack={() => setSelectedStudent(null)} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === 'dashboard' && (
                            <>
                                <section>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                        <Users size={16} /> Live Student Oversight
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {MOCK_STUDENTS.map(s => (
                                            <StudentCard key={s.id} student={s} onClick={() => setSelectedStudent(s)} />
                                        ))}
                                    </div>
                                </section>
                                <section className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                                    <h3 className="text-xl font-bold mb-8">Daily Review Queue</h3>
                                    <ReviewQueue />
                                </section>
                            </>
                        )}
                        {activeTab === 'students' && <div className="grid grid-cols-1 gap-4">{MOCK_STUDENTS.map(s => <StudentCard key={s.id} student={s} wide onClick={() => setSelectedStudent(s)} />)}</div>}
                        {activeTab === 'weekly' && <WeeklyReviewHub />}
                    </div>

                    <div className="space-y-8">
                        <AlertsPanel />
                        <MentorCapacity ratio="12 / 30" />
                    </div>
                </div>
            )}
        </div>
    );
}

function OnboardingStep({ label, value }: any) {
    return (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center">
            <p className="text-[10px] font-bold uppercase text-indigo-600 mb-1">{label}</p>
            <p className="text-xs font-bold text-slate-900">{value}</p>
        </div>
    );
}

function StatBox({ label, value, icon, color }: any) {
    return (
        <div className={cn(
            "px-6 py-4 rounded-2xl border flex items-center gap-4",
            color === 'indigo' ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-rose-50 border-rose-100 text-rose-600"
        )}>
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">{label}</p>
                <p className="text-lg font-bold leading-none mt-1 uppercase">{value}</p>
            </div>
        </div>
    );
}

function SubTab({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shrink-0",
                active ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-indigo-400"
            )}
        >
            {icon} {label}
        </button>
    );
}

function StudentCard({ student, onClick, wide = false }: any) {
    return (
        <div className={cn(
            "p-6 bg-white border border-slate-200 rounded-[2.2rem] hover:border-indigo-400 transition-all cursor-pointer group shadow-sm",
            wide ? "flex items-center justify-between" : "space-y-6"
        )} onClick={onClick}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-lg font-bold">
                    {student.name[0]}
                </div>
                <div className="leading-none">
                    <h4 className="font-bold text-base text-slate-900 uppercase tracking-tight">{student.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{student.status}</p>
                </div>
            </div>

            <div className={cn("grid gap-6", wide ? "grid-cols-3 flex-1 px-12" : "grid-cols-2")}>
                <Metric label="M-P&L" value={student.pnl} color={student.pnl.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} />
                <Metric label="Discipline" value={`${student.discipline}%`} color={student.discipline > 80 ? 'text-emerald-500' : 'text-amber-500'} />
                {wide && <Metric label="Risk Level" value={student.risk} color={student.risk === 'Low' ? 'text-emerald-500' : 'text-rose-500'} />}
            </div>

            {!wide && (
                <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                    Open Profile
                </button>
            )}
        </div>
    );
}

function Metric({ label, value, color }: any) {
    return (
        <div className="leading-none">
            <p className="text-[9px] font-bold uppercase text-slate-400 mb-2 tracking-wide">{label}</p>
            <p className={cn("text-sm font-bold", color)}>{value}</p>
        </div>
    );
}

function AlertsPanel() {
    return (
        <div className="p-8 bg-white border border-rose-100 rounded-[2.5rem] shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-rose-500 italic">
                <AlertCircle size={16} /> Priority Alerts
            </h3>
            <div className="space-y-4">
                <AlertItem type="Rule" text="Priya M. exceeded max trades per day (4)." />
                <AlertItem type="Limit" text="Amit K. hit stop-loss limit for the week." />
                <AlertItem type="Journal" text="3 students haven't logged today's EOD." />
            </div>
        </div>
    );
}

function AlertItem({ type, text }: any) {
    return (
        <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-[11px] leading-relaxed">
            <span className="font-bold uppercase text-rose-600 mr-2">{type}:</span>
            <span className="font-medium text-slate-600">{text}</span>
        </div>
    );
}

function MentorCapacity({ ratio }: { ratio: string }) {
    return (
        <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-slate-400">Student Capacity</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-end mb-1">
                    <p className="text-xs font-bold text-slate-900">Active Load</p>
                    <p className="text-lg font-bold text-indigo-600/80">{ratio}</p>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '40%' }}></div>
                </div>
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
                    Recommended ratio: <span className="text-indigo-600 font-bold">1:30</span>. Scaling available on Mentor Pro.
                </p>
            </div>
        </div>
    );
}

function ReviewQueue() {
    return (
        <div className="space-y-4">
            {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 transition-all">
                    <div className="flex gap-4 items-center">
                        <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 font-bold text-[10px]">#Log-293</div>
                        <p className="text-sm font-bold text-slate-800">New Trade Log by Student-00{i}</p>
                    </div>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wide hover:bg-slate-900 transition-all shadow-sm">Review Now</button>
                </div>
            ))}
        </div>
    );
}

function StudentProfileView({ student, onBack }: any) {
    const [subTab, setSubTab] = useState('overview');
    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 font-body">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                ← Return to Home
            </button>

            <div className="flex items-center justify-between p-10 bg-indigo-600 text-white rounded-[3rem] shadow-xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000"><Users size={200} /></div>
                <div className="relative z-10 flex items-center gap-8">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-4xl font-bold shadow-inner">{student.name[0]}</div>
                    <div className="leading-none">
                        <h2 className="text-4xl font-bold mb-3 tracking-tight">{student.name}</h2>
                        <div className="flex gap-4">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest">ID: ST-10029</span>
                            <span className="px-3 py-1 bg-emerald-500/80 rounded-full text-[9px] font-bold uppercase tracking-widest">Risk: {student.risk}</span>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 flex gap-12 text-center items-center">
                    <div><p className="text-[10px] uppercase font-bold opacity-60 tracking-wider mb-2">Total Profit</p><p className="text-3xl font-bold uppercase leading-none">₹48,200</p></div>
                    <div className="w-[1px] h-10 bg-white/10" />
                    <div><p className="text-[10px] uppercase font-bold opacity-60 tracking-wider mb-2">Success Rate</p><p className="text-3xl font-bold leading-none">64%</p></div>
                </div>
            </div>

            <div className="flex gap-6 border-b border-slate-200">
                {['overview', 'trades', 'reviews', 'psychology'].map(t => (
                    <button
                        key={t}
                        onClick={() => setSubTab(t)}
                        className={cn("pb-4 text-[11px] font-bold uppercase tracking-widest transition-all", subTab === t ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400")}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {subTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-10 bg-white border border-slate-200 shadow-sm rounded-[2.5rem]">
                        <h3 className="text-lg font-bold mb-8">Performance Curve</h3>
                        <div className="h-64 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-bold text-slate-300 uppercase tracking-widest italic">Chart Rendering Hub...</div>
                    </div>
                    <div className="p-10 bg-white border border-slate-200 shadow-sm rounded-[2.5rem]">
                        <h3 className="text-lg font-bold mb-8">Strategy Efficiency</h3>
                        <div className="space-y-6">
                            <ProgressBar label="ORB Breakout" value={72} />
                            <ProgressBar label="VWAP Reversal" value={55} />
                            <ProgressBar label="Mean Reversion" value={42} />
                        </div>
                    </div>
                </div>
            )}

            {subTab === 'reviews' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <ReviewEntryCard />
                        <ReviewTimeline />
                    </div>
                    <div className="space-y-6">
                        <ChecklistSection />
                    </div>
                </div>
            )}
        </div>
    );
}

function ReviewEntryCard() {
    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
            <h3 className="text-xl font-bold mb-8">Create EOD Review</h3>
            <div className="flex gap-4 mb-8">
                <RatingButton label="A" sub="Followed Rules" />
                <RatingButton label="B" sub="Slight Drift" active />
                <RatingButton label="C" sub="Impulsive" />
            </div>
            <textarea
                placeholder="Feedback summary for the student..."
                className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm font-medium min-h-[140px] mb-8 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
            ></textarea>
            <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/10 hover:bg-slate-900 transition-all">
                Publish Review
            </button>
        </div>
    );
}

function FeedbackTag({ label }: { label: string }) {
    return <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-bold uppercase text-indigo-600 tracking-wider italic">{label}</span>;
}

function RatingButton({ label, sub, active = false }: any) {
    return (
        <button className={cn(
            "flex-1 p-5 rounded-2xl border transition-all text-center group",
            active ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "border-slate-100 hover:bg-slate-50"
        )}>
            <p className="text-3xl font-bold">{label}</p>
            <p className={cn("text-[9px] uppercase font-bold mt-2", active ? "text-indigo-100" : "text-slate-400")}>{sub}</p>
        </button>
    );
}

function ProgressBar({ label, value }: { label: string, value: number }) {
    return (
        <div>
            <div className="flex justify-between text-[11px] font-bold uppercase mb-2 tracking-wide leading-none">
                <span className="text-slate-900">{label}</span>
                <span className="text-indigo-600">{value}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-0.5">
                <div className="h-full bg-indigo-500 rounded-full shadow-sm" style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );
}

function WeeklyReviewHub() {
    return (
        <div className="space-y-6">
            <div className="p-12 bg-slate-900 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="text-4xl font-bold mb-4 tracking-tight">Weekly Summary</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-12">Batch Analysis: JAN 19 - 25</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 leading-none">
                        <div><p className="text-[10px] opacity-40 font-bold uppercase tracking-widest mb-3">Group P&L</p><p className="text-3xl font-bold uppercase">+₹4.2L</p></div>
                        <div className="w-[1px] h-10 bg-white/10 hidden md:block" />
                        <div><p className="text-[10px] opacity-40 font-bold uppercase tracking-widest mb-3">Overall Protocol</p><p className="text-3xl font-bold uppercase">74%</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChecklistSection() {
    const points = ['Stop-Loss on all trades', 'Rule-based Entry', 'Max 3 trades/day', 'RR 1:2 Minimum'];
    return (
        <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-8 text-slate-400 text-center">Focus Checklist</h3>
            <div className="space-y-4">
                {points.map(p => (
                    <div key={p} className="flex items-center gap-4 group">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors uppercase tracking-tight italic">{p}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReviewTimeline() {
    return (
        <div className="p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
            <h3 className="text-2xl font-bold mb-10 text-slate-900 font-heading">Audit History</h3>
            <div className="space-y-12">
                <div className="relative pl-10 border-l-2 border-slate-100 pb-10 last:pb-0 group">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-md"></div>
                    <p className="text-[10px] font-bold text-indigo-500 mb-2 uppercase tracking-widest">Jan 24, 2026 • EOD Review</p>
                    <p className="text-base font-medium text-slate-700 leading-relaxed mb-6">Excellent discipline on Mean Reversion trades. You successfully avoided the afternoon noise which was a major weakness earlier.</p>
                    <div className="flex gap-3"><FeedbackTag label="Rule Followed" /><FeedbackTag label="Wait-Time Control" /></div>
                </div>
            </div>
        </div>
    );
}
