import React, { useState, useEffect } from 'react';
import {
    Activity,
    Users,
    Video,
    Clock,
    Globe,
    Zap,
    Cpu,
    Database,
    ArrowUpRight,
    ArrowDownRight,
    Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

export const SuperAdminAnalytics: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('nexus_user') || '{}');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/super/stats');
                const data = await res.json();
                if (res.ok) setStats(data);
            } catch (err) {
                console.error("Failed to fetch analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-6">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Running Neural Diagnostics</span>
        </div>
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white">System <span className="text-red-600">Analytics.</span></h1>
                    <p className="text-white/30 text-lg mt-3 font-medium uppercase tracking-tight">Real-time performance metrics and global resource distribution.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Live Grid Status: ACTIVE</span>
                    </div>
                </div>
            </div>

            {/* Performance Overview */}
            <div className="grid md:grid-cols-4 gap-6">
                {[
                    { label: "CPU LOAD", value: stats?.systemStats?.cpuLoad || "24%", trend: "NORMAL", icon: Cpu, color: "red" },
                    { label: "MEMORY", value: stats?.systemStats?.memoryUsage || "4.2 GB", trend: "OPTIMIZED", icon: Database, color: "red" },
                    { label: "LATENCY", value: stats?.systemStats?.latency || "24ms", trend: "EXCELLENT", icon: Zap, color: "red" },
                    { label: "TRAFFIC", value: "128 GB/s", trend: "HIGH", icon: Globe, color: "red" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] group hover:bg-white/[0.04] transition-all"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <stat.icon className="w-6 h-6 text-red-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-red-500 transition-colors">{stat.trend}</span>
                        </div>
                        <h3 className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform origin-left">{stat.value}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Resource Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-xl font-black uppercase tracking-widest">Global <span className="text-red-600">Growth.</span></h3>
                        <Activity className="w-5 h-5 text-white/20" />
                    </div>
                    <div className="h-64 flex items-end gap-2 px-4 italic">
                        {[40, 60, 45, 90, 65, 80, 55, 95, 70, 85, 100, 75].map((h, i) => (
                            <div key={i} className="flex-1 bg-red-600/10 group-hover:bg-red-600/20 rounded-t-lg relative transition-all" style={{ height: `${h}%` }}>
                                <div className="absolute top-0 left-0 w-full h-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-8 px-4 text-[10px] font-black text-white/20 uppercase tracking-widest">
                        <span>JAN</span>
                        <span>JUN</span>
                        <span>DEC</span>
                    </div>
                </div>

                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] space-y-8">
                    <h3 className="text-xl font-black uppercase tracking-widest">Deployment <span className="text-red-600">Distribution.</span></h3>
                    <div className="space-y-6">
                        {[
                            { label: "Mumbai Node (Alpha)", value: 85, color: "bg-red-600" },
                            { label: "Delhi Node (Beta)", value: 62, color: "bg-red-800" },
                            { label: "Bangalore Node (Gamma)", value: 94, color: "bg-red-400" },
                            { label: "Chennai Node (Delta)", value: 45, color: "bg-red-700" },
                        ].map((node, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-white/40">{node.label}</span>
                                    <span>{node.value}% Load</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${node.value}%` }}
                                        className={cn("h-full rounded-full shadow-lg shadow-red-600/20", node.color)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Regional Presence */}
            <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[4rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-red-600/5 to-transparent pointer-events-none" />
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-4xl font-black mb-6 italic uppercase tracking-tighter leading-none">Global <br /><span className="text-red-600">Nexus Hub.</span></h3>
                        <p className="text-white/40 text-lg mb-10 font-medium">Monitoring all active communication nodes across the Bharat Digital Grid.</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Nodes", value: "24" },
                                { label: "Satellites", value: "08" },
                                { label: "Uptime", value: "99.98%" },
                                { label: "E2EE", value: "ACTIVE" },
                            ].map((stat, i) => (
                                <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">{stat.label}</p>
                                    <p className="text-xl font-black italic">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square lg:aspect-video bg-black/40 rounded-[3rem] border border-white/5 flex items-center justify-center p-10 group overflow-hidden">
                        <div className="w-full h-full border border-red-500/20 rounded-full flex items-center justify-center relative animate-[spin_20s_linear_infinite]">
                            <div className="w-[80%] h-[80%] border border-white/5 rounded-full" />
                            <div className="w-[60%] h-[60%] border border-red-500/10 rounded-full" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,1)]" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center text-red-600/10">
                            <Globe className="w-[60%] h-[60%] animate-pulse" />
                        </div>
                        <div className="absolute bottom-8 left-8 right-8 p-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest">Active Signal Grid</span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">LIVE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
