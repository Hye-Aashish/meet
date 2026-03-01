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
    Flag
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
        { label: "Total Users", value: stats?.totalUsers || "...", icon: Users, color: "red", trend: "+12%" },
        { label: "Active Meetings", value: stats?.activeMeetings || "...", icon: Activity, color: "red", trend: "+5%" },
        { label: "Global Meetings", value: stats?.totalMeetings || "...", icon: Video, color: "red", trend: "+18%" },
        { label: "Total Assets", value: stats?.totalRecordings || "...", icon: ShieldAlert, color: "red", trend: "+2%" },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-6">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Initializing Alpha Core</span>
        </div>
    );

    return (
        <div className="space-y-12 pb-20">
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
                    <button className="px-8 py-4 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">Reload Kernels</button>
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

            {/* Section 2: Distribution and Activity */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-red-600" />
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-tight italic">Plan <span className="text-red-500">Distribution.</span></h4>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">View Details</button>
                    </div>

                    <div className="space-y-8">
                        {stats?.planDistribution?.map((plan: any, i: number) => (
                            <div key={i} className="space-y-3">
                                <div className="flex items-end justify-between px-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/60">{plan._id || "Unassigned"}</span>
                                    <span className="text-xl font-black">{plan.count} <span className="text-[10px] opacity-30">Accounts</span></span>
                                </div>
                                <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(plan.count / stats.totalUsers) * 100}%` }}
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

                    <div className="mt-12 flex justify-between items-center p-6 bg-red-600/5 border border-red-500/10 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Total System Revenue Focus</p>
                        </div>
                        <span className="text-2xl font-black">₹4.2M</span>
                    </div>
                </div>

                <div className="p-10 bg-[#0a0505] border border-red-500/10 rounded-[3.5rem] relative group">
                    <div className="flex items-center gap-4 mb-10">
                        <Zap className="w-5 h-5 text-red-600" />
                        <h4 className="text-xl font-black uppercase tracking-tight italic">Nexus <span className="text-red-500">Pulse.</span></h4>
                    </div>
                    <div className="space-y-6">
                        {[
                            { time: "09:44", event: "Admin created new meeting core", status: "ok" },
                            { time: "09:41", event: "User [Aashish] upgraded to Pro", status: "success" },
                            { time: "09:35", event: "Server latency spike: Mumbai-E1", status: "warning" },
                            { time: "09:22", event: "Auth bypass attempt detected", status: "alert" },
                            { time: "09:10", event: "Nightly backup: Verified", status: "ok" },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4 group/log border-b border-white/[0.03] pb-6 last:border-0 last:pb-0">
                                <span className="text-[10px] font-black text-white/15 pt-0.5">{log.time}</span>
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <p className="text-xs font-bold text-white/60 tracking-tight leading-none group-hover/log:text-white transition-colors">{log.event}</p>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-1 h-1 rounded-full",
                                            log.status === 'ok' ? 'bg-emerald-500' :
                                                log.status === 'success' ? 'bg-blue-500' :
                                                    log.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                                        )} />
                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-20">{log.status} system code</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">Download Full Logs</button>
                </div>
            </div>

            {/* Section 3: Bharat Specific */}
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
                    <p className="text-white/40 max-w-xl font-medium">All servers are currently processing within local Indian borders. Edge nodes in Mumbai, Delhi, and Bangalore are reporting sub-5ms latency across the super-admin core.</p>
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
