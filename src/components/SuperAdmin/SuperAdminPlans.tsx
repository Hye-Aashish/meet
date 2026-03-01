import React, { useState } from 'react';
import {
    CreditCard,
    CheckCircle2,
    Zap,
    ShieldAlert,
    Crown,
    MessageSquare,
    Video,
    Monitor,
    ArrowRight,
    Edit,
    Plus,
    X,
    Cpu,
    Database,
    CloudLightning,
    Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export const SuperAdminPlans: React.FC = () => {
    const [plans, setPlans] = useState([
        { id: 1, name: "Free Bharat", price: "₹0", participants: "100", time: "40 Mins", features: ["HD Video", "Base Tracking", "Standard Security", "Public Servers"], color: "white" },
        { id: 2, name: "Nexus Pro", price: "₹999", participants: "500", time: "Unlimited", features: ["4K Video", "Full Silent Tracking", "AI Summaries", "Priority Nodes"], color: "red", popular: true },
        { id: 3, name: "Enterprise", price: "Custom", participants: "Unlimited", time: "Unlimited", features: ["10k Participants", "Private Edge Servers", "Audit Logs", "SLA Support"], color: "orange" }
    ]);
    const [editingPlan, setEditingPlan] = useState<any>(null);

    return (
        <div className="space-y-16 pb-32">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic">Monetization <span className="text-red-600">Core.</span></h1>
                    <p className="text-white/30 text-lg mt-3 font-medium uppercase tracking-tight">Configure global subscription tiers and feature access parameters.</p>
                </div>
                <button className="px-10 py-5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                    <Plus className="w-4 h-4" /> Deploy New Plan Node
                </button>
            </div>

            {/* Pricing Matrix */}
            <div className="grid md:grid-cols-3 gap-10">
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={cn(
                            "relative p-12 rounded-[4rem] border transition-all flex flex-col group overflow-hidden",
                            plan.popular
                                ? "bg-gradient-to-b from-red-600 to-red-950 border-red-500/50 shadow-2xl shadow-red-600/20 scale-105"
                                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                        )}
                    >
                        {/* Animated Background Pulse for Pro */}
                        {plan.popular && (
                            <div className="absolute inset-0 bg-red-600/20 blur-[100px] animate-pulse pointer-events-none" />
                        )}

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    plan.popular ? "bg-white/10 text-white" : "bg-red-600/10 text-red-500"
                                )}>
                                    {plan.popular ? "High Momentum" : "Base Protocol"}
                                </span>
                                <button className="p-3 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>

                            <h4 className="text-3xl font-black mb-10 uppercase tracking-tighter group-hover:scale-105 transition-transform origin-left italic">{plan.name}</h4>

                            <div className="flex items-end gap-2 mb-12 border-b border-white/5 pb-10">
                                <span className="text-5xl font-black">{plan.price}</span>
                                <span className="text-[10px] font-bold opacity-30 mb-2 uppercase tracking-widest">/ Node Monthly</span>
                            </div>

                            <div className="space-y-6 mb-16 flex-1">
                                <div className="p-5 rounded-3xl bg-white/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-white/40">Users</span>
                                        <span className="text-sm font-black">{plan.participants}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-white/40">Duration</span>
                                        <span className="text-sm font-black">{plan.time}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 px-2">
                                    {plan.features.map((f, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", plan.popular ? "bg-white/10" : "bg-red-600/10")}>
                                                <CheckCircle2 className={cn("w-3.5 h-3.5", plan.popular ? "text-white" : "text-red-500")} />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-tight opacity-40 group-hover:opacity-100 transition-opacity">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className={cn(
                                "w-full py-7 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                                plan.popular ? "bg-white text-black shadow-2xl shadow-white/10 hover:scale-105" : "bg-white/5 hover:bg-white/10 border border-white/10"
                            )}>
                                Update Parameters
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Matrix Comparison Header */}
            <div className="mt-40 text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="h-[1px] w-20 bg-red-600/20" />
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Feature Access Protocol</span>
                    <div className="h-[1px] w-20 bg-red-600/20" />
                </div>
                <h3 className="text-5xl font-black uppercase italic tracking-tighter">Plan <span className="text-red-600">Permissions.</span></h3>
            </div>

            {/* Permission Table */}
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-widest text-white/20">Alpha Module</th>
                                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-widest text-white/20">Free Bharat</th>
                                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-widest text-white/20">Nexus Pro</th>
                                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-widest text-white/20 text-red-500">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {[
                                { module: "Silent Tracking", free: "Basic (30s)", pro: "Advanced (3s)", ent: "Real-time (1s)", icon: <Monitor className="w-4 h-4" /> },
                                { module: "Cloud Assets", free: "100 MB", pro: "10 GB", ent: "Unlimited", icon: <Database className="w-4 h-4" /> },
                                { module: "AI Analysis", free: "No", pro: "Yes", ent: "Dedicated", icon: <Cpu className="w-4 h-4" /> },
                                { module: "Edge Priority", free: "Public", pro: "Priority", ent: "Dedicated", icon: <Zap className="w-4 h-4" /> },
                                { module: "Custom Branding", free: "No", pro: "Standard", ent: "Full Portal", icon: <CloudLightning className="w-4 h-4" /> },
                                { module: "SLA Support", free: "Community", pro: "24h Email", ent: "1h Direct", icon: <Award className="w-4 h-4" /> },
                            ].map((row, i) => (
                                <tr key={i} className="group hover:bg-white/[0.01] transition-all">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 group-hover:bg-red-600/10 group-hover:border-red-600/20 group-hover:text-red-500 transition-all">
                                                {row.icon}
                                            </div>
                                            <span className="text-sm font-black uppercase tracking-widest">{row.module}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-xs font-black uppercase tracking-widest text-white/30">{row.free}</td>
                                    <td className="px-10 py-8 text-xs font-black uppercase tracking-widest text-white/60">{row.pro}</td>
                                    <td className="px-10 py-8 text-xs font-black uppercase tracking-widest text-red-500">{row.ent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
