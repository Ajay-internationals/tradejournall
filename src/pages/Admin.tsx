import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Admin() {
    const { profile } = useAuth();

    return (
        <div className="p-12 space-y-6">
            <h1 className="text-3xl font-black">Admin Terminal [DEBUG MODE]</h1>
            <p className="text-slate-500">Accessing as: {profile?.email}</p>
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="font-bold text-indigo-600">You have safe access to the terminal.</p>
                <p className="text-xs mt-2 text-indigo-400">If you see this, the routing and Auth check are working correctly.</p>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest"
            >
                Refresh
            </button>
        </div>
    );
}
