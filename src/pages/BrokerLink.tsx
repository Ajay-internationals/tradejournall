import { Zap, ShieldCheck, Link2, AlertCircle, CheckCircle2, RefreshCcw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

const BROKERS = [
    { id: 'zerodha', name: 'Zerodha', logo: 'Z' },
    { id: 'dhan', name: 'Dhan', logo: 'D' },
    { id: 'upstox', name: 'Upstox', logo: 'U' },
    { id: 'angel', name: 'AngelOne', logo: 'A' },
];

export default function BrokerLink() {
    const { user } = useAuth();
    const [selectedBroker, setSelectedBroker] = useState(BROKERS[1]);
    const [apiKey, setApiKey] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadConnections();
        }
    }, [user]);

    const loadConnections = async () => {
        try {
            const connections = await api.brokers.list(user!.id);
            const active = connections.find(c => c.status === 'CONNECTED');
            if (active) {
                setConnectionStatus('CONNECTED');
                const broker = BROKERS.find(b => b.name === active.broker_name);
                if (broker) setSelectedBroker(broker);
            }
        } catch (error) {
            console.error('Failed to load connections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        if (!user || !apiKey) return;
        setConnectionStatus('CONNECTING');
        try {
            await api.brokers.connect(user.id, selectedBroker.name, apiKey);
            setConnectionStatus('CONNECTED');
        } catch (error: any) {
            alert(error.message);
            setConnectionStatus('DISCONNECTED');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-body">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center shadow-xl">
                        <Zap className="w-9 h-9 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-1">Broker Nexus</h1>
                        <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase underline decoration-indigo-500/30 underline-offset-4">Connect your broker for auto-sync</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <StatusPulse
                        label={connectionStatus === 'CONNECTED' ? "Link Active" : connectionStatus === 'CONNECTING' ? "Linking..." : "Ready to Link"}
                        color={connectionStatus === 'CONNECTED' ? "bg-emerald-500" : connectionStatus === 'CONNECTING' ? "bg-amber-500" : "bg-slate-300"}
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-10 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3rem] shadow-xl space-y-8">
                    <h2 className="text-xl font-black uppercase tracking-widest border-b border-[var(--app-border)] pb-6">Choose Your Broker</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {BROKERS.map(broker => (
                            <BrokerCard
                                key={broker.id}
                                name={broker.name}
                                logo={broker.logo}
                                active={selectedBroker.id === broker.id}
                                onClick={() => setSelectedBroker(broker)}
                            />
                        ))}
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">{selectedBroker.name} Client ID</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white">
                                    {selectedBroker.logo}
                                </div>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder={`${selectedBroker.name.toUpperCase()} API KEY / TOKEN`}
                                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-2xl py-4 pl-16 pr-6 text-sm font-black focus:border-indigo-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleConnect}
                            disabled={connectionStatus === 'CONNECTING' || !apiKey}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {connectionStatus === 'CONNECTING' ? <Loader2 className="animate-spin" size={16} /> : <Link2 size={16} />}
                            {connectionStatus === 'CONNECTED' ? `Refresh ${selectedBroker.name} Link` : `Link ${selectedBroker.name} Account`}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-10 bg-indigo-600 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck size={160} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-4">Secure & Encrypted</h3>
                            <p className="text-indigo-100 font-bold text-sm leading-relaxed mb-6 uppercase tracking-tight">Your broker keys are encrypted with institutional security. We never see your password or execute trades on your behalf.</p>
                            <div className="flex flex-wrap gap-4">
                                <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">Logs Only</div>
                                <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">Auto-EOD</div>
                                <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">No Execution</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3rem] shadow-xl">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-6">What We Sync</h4>
                        <div className="space-y-4">
                            <SyncItem label="Completed Trades" status="Instant Sync" />
                            <SyncItem label="Daily P&L" status="Automatic Extraction" />
                            <SyncItem label="Margin Usage" status="Real-time Tracking" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BrokerCard({ name, logo, active = false, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 w-full",
                active ? "bg-indigo-50/50 border-indigo-600 shadow-lg" : "bg-[var(--app-bg)] border-[var(--app-border)] hover:border-indigo-500/30"
            )}
        >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl", active ? "bg-indigo-600 text-white shadow-xl" : "bg-slate-100 text-slate-400")}>
                {logo}
            </div>
            <p className={cn("text-[10px] font-black uppercase tracking-widest", active ? "text-indigo-600" : "text-slate-500")}>{name}</p>
        </button>
    );
}

function StatusPulse({ label, color }: { label: string, color: string }) {
    return (
        <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className={cn("w-2 h-2 rounded-full", color, color !== 'bg-slate-300' && "animate-pulse")} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
        </div>
    );
}

function SyncItem({ label, status }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-[var(--app-bg)]/50 border border-[var(--app-border)] rounded-2xl">
            <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
            <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-600 uppercase">{status}</span>
            </div>
        </div>
    );
}
