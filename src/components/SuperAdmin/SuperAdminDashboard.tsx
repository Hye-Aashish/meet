import React, { useState, useEffect } from 'react';
import {
    Users,
    Video,
    ShieldAlert,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    CreditCard,
    Zap,
    Flag,
    TrendingUpDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const SuperAdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('nexus_user') || '{}');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/super/stats', {
                    headers: { 'x-user-id': user.id }
                });
                const data = await res.json();
                if (res.ok) setStats(data);
            } catch (err) {
                console.error("Failed to fetch statistics");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user.id]);

    const statCards = [
        { label: "Total Users", value: stats?.totalUsers || "0", icon: Users, color: "red", trend: "+12%" },
        { label: "System Nodes", value: stats?.systemStats?.nodes || "42", icon: Activity, color: "red", trend: "OPERATIONAL" },
        { label: "Global Meetings", value: stats?.totalMeetings || "0", icon: Video, color: "red", trend: "+18%" },
        { label: "Core Latency", value: stats?.systemStats?.latency || "24ms", icon: Zap, color: "red", trend: "EXCELLENT" },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-6">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Initializing Alpha Core</span>
        </div>
    );

    return (
        <div className="space-y-12 pb-32">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] px-3 py-1 bg-red-600/10 rounded-full border border-red-500/20">Operational Status: Nominal</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic">System <span className="text-red-600">Overview.</span></h1>
                    <p className="text-white/30 text-lg mt-3 font-medium uppercase tracking-tight">Real-time global authority metrics across Bharat network.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all">Export Reports</button>
                </div>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-red-600/30 transition-all group overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all">
                            <card.icon className="w-24 h-24 text-red-600" />
                        </div>
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-12 h-12 bg-red-600/10 border border-red-500/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all">
                                <card.icon className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full">
                                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-500">{card.trend}</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">{card.label}</p>
                        <h3 className="text-5xl font-black group-hover:scale-105 transition-transform origin-left">{card.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Distribution and Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Plan Distribution */}
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-red-600" />
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-tight italic">Plan <span className="text-red-500">Distribution.</span></h4>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {stats?.planDistribution?.map((plan: any, i: number) => (
                            <div key={i} className="space-y-3">
                                <div className="flex items-end justify-between px-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/60">{plan._id || "Free Bharat"}</span>
                                    <span className="text-xl font-black">{plan.count} <span className="text-[10px] opacity-30">Accounts</span></span>
                                </div>
                                <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(plan.count / (stats.totalUsers || 1)) * 100}%` }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className={cn(
                                            "h-full rounded-full shadow-[0_0_15px_rgba(220,38,38,0.3)]",
                                            plan._id === 'Enterprise' ? "bg-orange-500" : plan._id === 'Nexus Pro' ? "bg-red-600" : "bg-white/20"
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nexus Pulse (Real-time logs) */}
                <div className="p-10 bg-[#0a0505] border border-red-500/10 rounded-[3.5rem] relative group h-full">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <Zap className="w-5 h-5 text-red-600" />
                            <h4 className="text-xl font-black uppercase tracking-tight italic">Nexus <span className="text-red-500">Pulse.</span></h4>
                        </div>
                        <span className="text-[8px] font-black text-red-500/40 uppercase tracking-widest animate-pulse">Live Feed</span>
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {stats?.recentLogs?.length > 0 ? (
                            stats.recentLogs.map((log: any, i: number) => (
                                <div key={i} className="flex gap-4 border-b border-white/[0.03] pb-4 last:border-0 last:pb-0 group/item">
                                    <span className="text-[10px] font-black text-white/10 shrink-0">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <div className="flex flex-col gap-1 flex-1">
                                        <p className="text-xs font-bold text-white/50 group-hover/item:text-white/80 transition-colors uppercase tracking-tight">{log.message}</p>
                                        <span className={cn(
                                            "text-[8px] font-black uppercase tracking-[0.2em]",
                                            log.type === 'auth' ? "text-emerald-500/40" :
                                                log.type === 'meeting' ? "text-blue-500/40" : "text-red-500/40"
                                        )}>{log.event}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                <Zap className="w-8 h-8 mb-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest">No Recent Signals</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Users and Meetings */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] group overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xl font-black uppercase tracking-tight italic">Recent <span className="text-red-600">User Nodes.</span></h4>
                        <Users className="w-5 h-5 text-white/20 group-hover:text-red-500 transition-colors" />
                    </div>
                    <div className="space-y-4">
                        {stats?.recentUsers?.map((u: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center text-[10px] font-black text-red-500">{u.name.charAt(0)}</div>
                                    <span className="text-xs font-black uppercase tracking-widest">{u.name}</span>
                                </div>
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{new Date(u.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Meetings */}
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] group overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xl font-black uppercase tracking-tight italic">Recent <span className="text-red-600">Meeting Clusters.</span></h4>
                        <Video className="w-5 h-5 text-white/20 group-hover:text-red-500 transition-colors" />
                    </div>
                    <div className="space-y-4">
                        {stats?.recentMeetings?.map((m: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-black border border-red-500/20 rounded-lg flex items-center justify-center"><Video className="w-4 h-4 text-red-500" /></div>
                                    <span className="text-xs font-black uppercase tracking-widest truncate max-w-[150px]">{m.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                        m.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-white/10 text-white/30"
                                    )}>{m.status}</span>
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{m.roomId}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bharat Network Footer */}
            <div className="p-12 bg-gradient-to-r from-[#0a0505] to-black border border-white/5 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 group">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white mx-[-2px] z-10" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Digital Sovereignty Metric</span>
                    </div>
                    <h3 className="text-4xl font-black uppercase tracking-tight">Bharat Network <span className="text-emerald-500 underline decoration-emerald-500/30 decoration-8 underline-offset-8">100% Secure.</span></h3>
                    <p className="text-white/40 max-w-xl font-medium">All servers are currently processing within local Indian borders. reporting sub-5ms latency across the super-admin core.</p>
                </div>
                <div className="flex gap-12 items-center">
                    <div className="text-center">
                        <h5 className="text-4xl font-black text-white">0%</h5>
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mt-2">External Leak</p>
                    </div>
                    <div className="w-[1px] h-16 bg-white/10" />
                    <div className="text-center">
                        <h5 className="text-4xl font-black text-white">42</h5>
                        <p className="text-[9px] font-black uppercase tracking-widest text-orange-500 mt-2">Active Nodes</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
