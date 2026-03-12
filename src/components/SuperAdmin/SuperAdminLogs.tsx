import React, { useState, useEffect } from 'react';
import {
    ShieldAlert,
    Search,
    Filter,
    Lock,
    Zap,
    ShieldCheck,
    AlertTriangle,
    Clock,
    User,
    Terminal,
    Trash2,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

export const SuperAdminLogs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('nexus_user') || '{}');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/super/logs');
            const data = await res.json();
            if (res.ok) setLogs(data);
        } catch (err) {
            console.error("Failed to fetch logs");
        } finally {
            setLoading(false);
        }
    };

    const handleClearLogs = async () => {
        if (!window.confirm("FATAL: Permanently purge all system trace logs?")) return;
        try {
            const res = await api.delete('/api/super/logs');
            if (res.ok) fetchLogs();
        } catch (err) {
            console.error("Failed to clear logs");
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [currentUser.id]);

    const filteredLogs = logs.filter(l =>
        l.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.event?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && logs.length === 0) return (
        <div className="flex flex-col items-center justify-center h-96 gap-6">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Decrypting Trace Buffer</span>
        </div>
    );

    return (
        <div className="space-y-12 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white underline decoration-red-600/30">Trace <span className="text-red-600">Logs.</span></h1>
                    <p className="text-white/30 text-lg mt-3 font-medium uppercase tracking-tight">Audit every system event and security protocol execution.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="SEARCH EVENT TRACE..."
                            className="w-full bg-white/[0.02] border border-white/5 focus:border-red-600/30 rounded-3xl py-5 pl-16 pr-6 text-xs font-black uppercase tracking-widest outline-none transition-all placeholder:text-white/10"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Actions / Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-4">
                    {[
                        { label: "ALL EVENTS", count: logs.length, active: true },
                        { label: "SECURITY", count: logs.filter(l => l.type === 'system').length, color: "text-red-500" },
                        { label: "AUTH", count: logs.filter(l => l.type === 'auth').length },
                        { label: "MEETINGS", count: logs.filter(l => l.type === 'meeting').length },
                    ].map((f, i) => (
                        <button key={i} className={cn(
                            "px-6 py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-3",
                            f.active ? "bg-red-600 border-red-500 text-white shadow-xl shadow-red-600/20" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                        )}>
                            {f.label}
                            <span className="opacity-40">{f.count}</span>
                        </button>
                    ))}
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchLogs}
                        className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                    </button>
                    <button
                        onClick={handleClearLogs}
                        className="px-6 py-4 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-3"
                    >
                        <Trash2 className="w-5 h-5" /> Purge Logs
                    </button>
                </div>
            </div>

            {/* Log Table */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-10 text-[10px] font-black uppercase tracking-widest text-white/20">Timestamp</th>
                                <th className="px-8 py-10 text-[10px] font-black uppercase tracking-widest text-white/20">Event Vector</th>
                                <th className="px-8 py-10 text-[10px] font-black uppercase tracking-widest text-white/20">Actor Entity</th>
                                <th className="px-8 py-10 text-[10px] font-black uppercase tracking-widest text-white/20">Category</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            <AnimatePresence mode="popLayout">
                                {filteredLogs.map((log, i) => (
                                    <motion.tr
                                        key={log._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="group hover:bg-white/[0.01] transition-all"
                                    >
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-3 text-white/30 text-[10px] font-black uppercase tracking-widest">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(log.createdAt).toLocaleTimeString([], { hour12: false })}
                                                <span className="opacity-50 text-[8px]">{new Date(log.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black uppercase tracking-tight group-hover:text-white transition-colors">
                                                    {log.message}
                                                </span>
                                                <span className="text-[9px] font-black text-red-500/20 uppercase tracking-widest flex items-center gap-2 italic">
                                                    <Terminal className="w-3 h-3" /> {log.event}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/20 flex items-center justify-center text-[10px] font-black text-red-500">
                                                    {(log.userName || log.userId || 'S').charAt(0)}
                                                </div>
                                                <span className="text-xs font-black uppercase opacity-40">{log.userName || 'SYSTEM CORE'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className={cn(
                                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                log.type === 'auth' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                                    log.type === 'meeting' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                                                        "bg-red-500/10 border-red-500/20 text-red-500"
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full",
                                                    log.type === 'auth' ? "bg-emerald-500" :
                                                        log.type === 'meeting' ? "bg-blue-500" : "bg-red-500 animate-pulse"
                                                )} />
                                                {log.type}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-32 text-center opacity-20">
                                        <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
                                        <p className="text-xs font-black uppercase tracking-[0.3em]">No Event Trajectories Found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Real-time System State Footer */}
            <div className="p-10 bg-black rounded-[3rem] border border-white/5 font-mono relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600/50" />
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-red-600 font-black text-xs uppercase tracking-[0.3em]">
                        <Terminal className="w-4 h-4" /> Live Authority Grid
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-emerald-500/50 font-black">ENCRYPTION: ACTIVE</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-2 text-[11px] text-white/40">
                    <p><span className="text-red-600/50">[{new Date().toLocaleTimeString()}]</span> [CORE] Decrypting node metadata for region [India-West]...</p>
                    <p><span className="text-emerald-500/50">[OK]</span> Blockchain handshake verified for {logs.length} transactions.</p>
                    <p><span className="text-red-600/50">[{new Date().toLocaleTimeString()}]</span> [SYNC] Identity grid synchronization at 100%.</p>
                </div>
            </div>
        </div>
    );
};
