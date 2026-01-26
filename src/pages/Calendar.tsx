import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Execution Calendar</h1>
                    <p className="text-slate-500 text-sm font-medium">Visualizing your discipline over time</p>
                </div>
                <div className="flex items-center gap-4 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900"><ChevronLeft size={20} /></button>
                    <span className="text-sm font-bold px-4 text-slate-900">{month} {year}</span>
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl">
                <div className="grid grid-cols-7 gap-4 mb-6">
                    {days.map(day => (
                        <div key={day} className="text-center text-[10px] font-bold text-slate-400 tracking-widest uppercase">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: 31 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between hover:border-indigo-500/30 transition-all group cursor-pointer hover:shadow-lg">
                            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">{i + 1}</span>
                            {i === 12 && (
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] self-end" />
                            )}
                            {i === 15 && (
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] self-end" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
