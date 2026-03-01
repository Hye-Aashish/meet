import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Video,
    Shield,
    Zap,
    Globe,
    Eye,
    Users,
    ArrowRight,
    CheckCircle2,
    Menu,
    X,
    Layout,
    Monitor,
    Mic,
    Smartphone,
    ChevronRight,
    Database,
    Lock,
    Flag,
    Cpu,
    Server,
    CloudLightning,
    Sparkles,
    MessageSquare,
    BarChart,
    HardDrive,
    Infinity,
    Headphones,
    Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user] = useState(() => {
        const saved = localStorage.getItem('nexus_user');
        return saved ? JSON.parse(saved) : null;
    });

    const features = [
        {
            icon: <Video className="w-6 h-6 text-blue-400" />,
            title: "Ultra-HD Video",
            description: "Experience crystal-clear 4K video conferencing with low-latency global edge network."
        },
        {
            icon: <Monitor className="w-6 h-6 text-orange-400" />,
            title: "Silent Tracking",
            description: "Monitor participant activity with silent screen monitoring for professional environments."
        },
        {
            icon: <Shield className="w-6 h-6 text-emerald-400" />,
            title: "India-Hosted Security",
            description: "Data stays in India. End-to-end encrypted sessions with local sovereignty."
        },
        {
            icon: <Users className="w-6 h-6 text-indigo-400" />,
            title: "Team Collaborative",
            description: "Built-in chat, screen sharing, and interactive whiteboards for seamless teamwork."
        }
    ];

    const steps = [
        { id: "01", title: "Create Portal", desc: "Launch your personal branded meeting studio in seconds." },
        { id: "02", title: "Invite Teams", desc: "Send one-click invites via WhatsApp, Email or SMS." },
        { id: "03", title: "Secure Chat", desc: "Collaborate with E2EE encryption and AI-powered tools." }
    ];

    const pricing = [
        { name: "Free Bharat", price: "₹0", features: ["Up to 40 mins", "100 Participants", "HD Video", "Base Tracking"], cta: "Get Started", color: "white" },
        { name: "Nexus Pro", price: "₹999", features: ["Unlimited Time", "500 Participants", "4K Video", "Full Silent Tracking", "AI Summaries"], cta: "Go Pro", color: "blue", popular: true },
        { name: "Enterprise", price: "Custom", features: ["Unlimited Users", "Private Edge Servers", "Audit Logs", "Dedicated Support", "Custom Branding"], cta: "Contact Sales", color: "orange" }
    ];

    return (
        <div className="min-h-screen bg-[#06060c] text-white selection:bg-orange-500/30 selection:text-white font-sans overflow-x-hidden">
            {/* Top Banner - Made in India */}
            <div className="bg-gradient-to-r from-orange-600/20 via-white/5 to-emerald-600/20 py-2 border-b border-white/5 text-center relative z-[110]">
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/60 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Made in Bharat for the Digital India Era
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </p>
            </div>

            {/* Navigation */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
                <div className="backdrop-blur-3xl border border-white/10 bg-black/40 rounded-3xl px-6 h-20 flex items-center justify-between shadow-2xl shadow-black/50 overflow-hidden relative group">
                    {/* Animated Glow Line on Nav */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                    <div className="flex items-center gap-3 group/logo cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover/logo:rotate-6 transition-all duration-300">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black uppercase tracking-tighter leading-none">Nexus <span className="text-blue-500">M.</span></span>
                            <span className="text-[8px] font-bold text-orange-500 tracking-widest uppercase">Bharat Native</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <a href="#features" className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">Features</a>
                        <a href="#ai" className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">AI Power</a>
                        <a href="#tracking" className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">Tracking</a>
                        <a href="#pricing" className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">Pricing</a>
                        {user ? (
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/admin')}
                                className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all flex items-center gap-2"
                            >
                                Dashboard <Layout className="w-3.5 h-3.5" />
                            </motion.button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors px-4">Login</Link>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/register')}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all shadow-xl shadow-blue-600/20"
                                >
                                    Join Nexus
                                </motion.button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-3 bg-white/5 rounded-2xl text-white/60" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 100 }}
                        className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-3xl p-6 md:hidden flex flex-col justify-center items-center text-center gap-10"
                    >
                        <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="flex flex-col gap-6 w-full">
                            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter">FEATURES</a>
                            <a href="#ai" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter">AI AGENT</a>
                            <a href="#tracking" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter">TRACKING</a>
                            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter">PRICING</a>
                            <hr className="border-white/10 w-24 mx-auto" />
                            {user ? (
                                <button onClick={() => navigate('/admin')} className="w-full py-6 bg-blue-600 rounded-[2rem] text-xl font-black">DASHBOARD</button>
                            ) : (
                                <>
                                    <button onClick={() => navigate('/login')} className="w-full py-6 bg-white/5 rounded-[2rem] text-xl font-black">LOGIN</button>
                                    <button onClick={() => navigate('/register')} className="w-full py-6 bg-orange-600 rounded-[2rem] text-xl font-black">GET STARTED</button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                {/* Hero Section */}
                <section className="relative pt-64 pb-32 overflow-hidden">
                    <div className="absolute top-0 -left-1/4 w-[60%] h-[1000px] bg-orange-600/10 blur-[180px] rounded-full -rotate-12 animate-pulse" />
                    <div className="absolute -bottom-1/2 -right-1/4 w-[60%] h-[1000px] bg-emerald-600/15 blur-[180px] rounded-full rotate-12" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/[0.03] border border-white/10 rounded-full mb-12 backdrop-blur-md"
                        >
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-orange-500 -mr-1" />
                                <div className="w-3 h-3 rounded-full bg-white z-10 border border-black/10 shadow-sm" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500 -ml-1" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Bharat's Digital Sovereignty v3.0</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-6xl md:text-[10rem] font-black mb-8 tracking-tighter leading-[0.8] mix-blend-lighten"
                        >
                            NATIVE <br />
                            <span className="bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent">EXCELLENCE.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-3xl mx-auto text-white/40 text-xl font-medium mb-16 leading-relaxed"
                        >
                            The most advanced communication stack engineered for Indian enterprises.
                            Absolute privacy, localized edge speed, and world-class AI integrations.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(user ? '/admin' : '/register')}
                                className="w-full sm:w-auto px-12 py-7 bg-white text-black text-sm font-black rounded-3xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 group transition-all"
                            >
                                Launch Meeting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/join')}
                                className="w-full sm:w-auto px-12 py-7 bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-black rounded-3xl backdrop-blur-2xl transition-all"
                            >
                                Join with ID
                            </motion.button>
                        </motion.div>
                    </div>
                </section>

                {/* Brand Logos / Trusted By Scroll */}
                <section className="py-20 border-y border-white/5 bg-black overflow-hidden group">
                    <div className="max-w-7xl mx-auto px-6 mb-12 flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-white/10" />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Engineered for Bharat Leaders</span>
                        <div className="h-[1px] w-12 bg-white/10" />
                    </div>
                    <div className="flex gap-20 items-center justify-center opacity-30 grayscale saturate-0 group-hover:grayscale-0 group-hover:opacity-100 group-hover:saturate-100 transition-all duration-700">
                        <div className="flex items-center gap-3"><Flag className="w-8 h-8" /><span className="text-xl font-black">Digital India</span></div>
                        <div className="flex items-center gap-3"><Shield className="w-8 h-8" /><span className="text-xl font-black">Secure In</span></div>
                        <div className="flex items-center gap-3"><Zap className="w-8 h-8" /><span className="text-xl font-black">Fast Bharat</span></div>
                        <div className="flex items-center gap-3"><Globe className="w-8 h-8" /><span className="text-xl font-black">Native Hub</span></div>
                    </div>
                </section>

                {/* Step by Step Section */}
                <section className="py-32 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            {steps.map((step, i) => (
                                <div key={i} className="relative p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                                    <span className="text-8xl font-black absolute top-5 right-5 opacity-5 group-hover:opacity-10 transition-opacity text-blue-500">{step.id}</span>
                                    <h4 className="text-2xl font-black mb-4 relative z-10">{step.title}</h4>
                                    <p className="text-white/40 leading-relaxed font-medium">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* AI Integration Section */}
                <section id="ai" className="py-32 relative group">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                        <div className="w-24 h-24 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center mb-12 border border-blue-500/20 relative">
                            <Sparkles className="w-12 h-12 text-blue-400 animate-pulse" />
                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black mb-8 text-center tracking-tighter leading-none">AI POWERED <br /><span className="text-blue-500">INSIGHTS.</span></h2>
                        <p className="text-white/40 text-xl font-medium max-w-2xl text-center mb-20">
                            Automated summaries, professional noise cancellation, and intelligent task tracking, all built on top-tier global AI engines.
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                            {[
                                { icon: <MessageSquare />, title: "Live Summaries", desc: "Never take notes again. Get perfect automated meeting minutes in real-time." },
                                { icon: <Award />, title: "Voice Isolation", desc: "Crystal clear audio optimized for noisy Indian environments and heavy traffic zones." },
                                { icon: <CloudLightning />, title: "Auto Attendance", desc: "Intelligent facial and audio tracking for seamless logs without manual effort." }
                            ].map((item, i) => (
                                <div key={i} className="p-12 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-blue-500/30 transition-all text-center">
                                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 text-blue-400 mx-auto">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-2xl font-black mb-4">{item.title}</h4>
                                    <p className="text-white/30 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Unique Tracking Section */}
                <section id="tracking" className="py-32 bg-[#080816] overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div>
                                <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Governance First</span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[0.9]">
                                    ABSOLUTE <br />
                                    <span className="text-orange-500">TRANSPARENCY.</span>
                                </h2>
                                <p className="text-white/40 text-lg mb-12 leading-relaxed font-medium">
                                    The only Indian platform with native silent monitoring. Perfect for high-stake education, corporate compliance, and team coordination.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        "3s Live Gaps",
                                        "Local Encryption",
                                        "Zero-lag Performance",
                                        "Native Electron App"
                                    ].map((text, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
                                                <CheckCircle2 className="w-3 h-3 text-orange-400" />
                                            </div>
                                            <span className="text-xs font-black text-white/50 uppercase tracking-wider">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <motion.div
                                    initial={{ rotate: -5, x: 50, opacity: 0 }}
                                    whileInView={{ rotate: 0, x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="relative z-10 p-6 bg-brand-card/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                                >
                                    <div className="aspect-video bg-[#02020a] rounded-[2rem] overflow-hidden p-8 flex flex-col">
                                        <div className="flex items-center justify-between mb-8">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Nexus Tracking Hub</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
                                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Flow</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 flex-1">
                                            <div className="rounded-2xl bg-white/[0.03] border border-white/5" />
                                            <div className="rounded-2xl bg-white/[0.03] border border-white/5" />
                                            <div className="rounded-2xl bg-white/[0.03] border border-white/5" />
                                            <div className="rounded-2xl bg-orange-500/10 border border-orange-500/20 p-2 overflow-hidden ring-4 ring-orange-500/20">
                                                <div className="w-full h-full bg-white/5 rounded-xl animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                                <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-600/20 blur-[130px] rounded-full" />
                                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-32 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-24">
                            <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-none">CHOOSE YOUR <br /><span className="text-indigo-500">PLAN.</span></h2>
                            <p className="text-white/40 text-xl font-medium">Simple, local billing. No USD conversions, no hidden charges.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {pricing.map((plan, i) => (
                                <div key={i} className={cn(
                                    "p-12 rounded-[3.5rem] border transition-all flex flex-col",
                                    plan.popular
                                        ? "bg-gradient-to-b from-blue-600 to-indigo-700 border-white/20 shadow-2xl shadow-blue-600/20 scale-105"
                                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                                )}>
                                    {plan.popular && (
                                        <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-8 self-start">Most Popular</div>
                                    )}
                                    <h4 className="text-2xl font-black mb-2 uppercase tracking-tight">{plan.name}</h4>
                                    <div className="flex items-end gap-2 mb-10">
                                        <span className="text-5xl font-black">{plan.price}</span>
                                        <span className="text-sm font-bold opacity-40 mb-2">/ month</span>
                                    </div>
                                    <div className="space-y-4 mb-12 flex-1">
                                        {plan.features.map((f, j) => (
                                            <div key={j} className="flex items-center gap-3">
                                                <CheckCircle2 className={cn("w-5 h-5", plan.popular ? "text-white" : "text-blue-500")} />
                                                <span className="text-sm font-bold opacity-60 tracking-tight">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className={cn(
                                        "w-full py-6 rounded-[2rem] text-sm font-black transition-all",
                                        plan.popular ? "bg-white text-black hover:scale-105" : "bg-white/5 hover:bg-white/10 border border-white/10"
                                    )}>
                                        {plan.cta}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-40 relative overflow-hidden text-center bg-gradient-to-b from-transparent via-white/[0.02] to-[#060610]">
                    <div className="max-w-5xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="mb-16 relative inline-block group"
                        >
                            <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full group-hover:bg-blue-500/40 transition-all duration-700" />
                            <div className="relative w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <Smartphone className="w-12 h-12 text-blue-400" />
                            </div>
                        </motion.div>
                        <h2 className="text-5xl md:text-9xl font-black mb-12 tracking-tighter leading-none uppercase italic">
                            Future of <span className="bg-gradient-to-r from-orange-400 to-emerald-400 bg-clip-text text-transparent">Digital Bharat.</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto px-16 py-8 bg-blue-600 text-white text-lg font-black rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all"
                            >
                                Create Account
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/join')}
                                className="w-full sm:w-auto px-16 py-8 bg-white/5 border border-white/10 hover:bg-white/10 text-lg font-black rounded-3xl transition-all"
                            >
                                Join with ID
                            </motion.button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-32 border-t border-white/5 bg-black/40 backdrop-blur-3xl relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-20 mb-32">
                        <div className="col-span-2 text-center md:text-left">
                            <div className="flex items-center gap-4 mb-10 justify-center md:justify-start">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
                                    <Shield className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black uppercase tracking-tighter">Nexus Meeting</span>
                                    <span className="text-[10px] font-black text-orange-500 tracking-[0.4em] uppercase">Digital Sovereignty</span>
                                </div>
                            </div>
                            <p className="text-white/30 max-w-sm leading-relaxed mb-10 text-lg font-medium italic">
                                "Empowering Bharat with secure, world-class virtual collaboration hubs."
                            </p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="font-black mb-10 text-xs uppercase tracking-[0.4em] text-white/20">Ecosystem</h4>
                            <ul className="space-y-6">
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Pricing</a></li>
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Solutions</a></li>
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Native Apps</a></li>
                            </ul>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="font-black mb-10 text-xs uppercase tracking-[0.4em] text-white/20">Trust</h4>
                            <ul className="space-y-6">
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Privacy Hub</a></li>
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Certifications</a></li>
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Made in Bharat</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">© 2024 NEXUS BHARAT PORTAL. BUILT FOR GLOBAL EXCELLENCE.</p>
                        <div className="flex gap-10">
                            <span className="text-[10px] font-black text-orange-500/40 uppercase tracking-widest">Local Sovereignty</span>
                            <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest">Native Edge</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
