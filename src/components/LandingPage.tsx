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
    CloudLightning
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

    const stats = [
        { value: "1M+", label: "Minutes Monthly" },
        { value: "50k+", label: "Proudly Indian" },
        { value: "99.9%", label: "Uptime" },
        { value: "ISO", label: "Certified" }
    ];

    return (
        <div className="min-h-screen bg-[#060610] text-white selection:bg-orange-500/30 selection:text-white font-sans overflow-x-hidden">
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
                <div className="backdrop-blur-2xl border border-white/10 bg-black/40 rounded-3xl px-6 h-20 flex items-center justify-between shadow-2xl shadow-black/50">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-all duration-300">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black uppercase tracking-tighter leading-none">Nexus <span className="text-blue-500">M.</span></span>
                            <span className="text-[8px] font-bold text-orange-500 tracking-widest uppercase">Bharat Native</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <a href="#features" className="text-xs font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">Features</a>
                        <a href="#tracking" className="text-xs font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">Tracking</a>
                        <a href="#india" className="text-xs font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">Sovereignty</a>
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
                                <Link to="/login" className="text-xs font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors px-4">Login</Link>
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

            {/* Mobile Menu */}
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
                            <a href="#tracking" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter">TRACKING</a>
                            <a href="#india" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter">BHARAT FIRST</a>
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
                    {/* Saffron and Green Glows */}
                    <div className="absolute top-0 -left-1/4 w-[60%] h-[1000px] bg-orange-600/10 blur-[150px] rounded-full -rotate-12 animate-pulse" />
                    <div className="absolute -bottom-1/2 -right-1/4 w-[60%] h-[1000px] bg-emerald-600/10 blur-[150px] rounded-full rotate-12" />

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
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Built in India. For the World.</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-6xl md:text-[10rem] font-black mb-8 tracking-tighter leading-[0.8] mix-blend-lighten"
                        >
                            BHARAT'S <br />
                            <span className="bg-gradient-to-r from-orange-500 via-white to-emerald-500 bg-clip-text text-transparent">SECUREST PORTAL.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-3xl mx-auto text-white/40 text-xl font-medium mb-16 leading-relaxed"
                        >
                            Nexus is the next-gen communication bridge designed for Indian enterprises.
                            Native performance, low-latency tracking, and absolute data sovereignty.
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

                    {/* Device Mockup */}
                    <div className="max-w-6xl mx-auto px-6 mt-32 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.5, duration: 1, type: 'spring' }}
                            className="relative aspect-video bg-gradient-to-br from-white/10 to-transparent rounded-[3rem] border border-white/20 p-3 shadow-[0_0_100px_-20px_rgba(59,130,246,0.2)] overflow-hidden group"
                        >
                            <div className="w-full h-full bg-[#030308] rounded-[2.5rem] overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                                {/* Simulated Meeting Interface */}
                                <div className="absolute inset-0 p-12 flex flex-col">
                                    <div className="flex items-center justify-between mb-12 opacity-30">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30" />
                                            <div className="w-48 h-5 bg-white/10 rounded-full" />
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-24 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-full" />
                                            <div className="w-10 h-10 bg-white/5 rounded-2xl" />
                                        </div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-white/[0.02] rounded-[2rem] border border-white/5 relative group-hover:bg-white/[0.04] transition-all overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                                                <div className="absolute bottom-5 left-5 flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                                    <div className="w-24 h-3 bg-white/10 rounded-full" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-12 flex justify-center gap-6 opacity-30">
                                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl" />
                                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl" />
                                        <div className="w-16 h-16 bg-red-500/20 border border-red-500/20 rounded-2xl" />
                                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl" />
                                    </div>
                                </div>

                                {/* Floating Glows inside mockup */}
                                <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 blur-[120px]" />
                                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 blur-[120px]" />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24 border-y border-white/5 bg-white/[0.02] backdrop-blur-3xl relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center group">
                                    <h3 className="text-5xl md:text-7xl font-black mb-3 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">{stat.value}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* India Section */}
                <section id="india" className="py-32 relative group">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-10 border border-emerald-500/20 relative">
                            <CloudLightning className="w-10 h-10 text-emerald-400" />
                            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black mb-8 text-center tracking-tighter leading-none">BHARAT AT <br /><span className="text-emerald-500">THE CORE.</span></h2>
                        <p className="text-white/40 text-xl font-medium max-w-2xl text-center mb-16 italic">
                            "Our vision is to provide every Indian business with a communication tool that respects our boundaries, our culture, and our security."
                        </p>
                        <div className="grid md:grid-cols-3 gap-8 w-full">
                            {[
                                { icon: <Cpu />, title: "Local Infrastructure", desc: "Edge servers hosted in Mumbai, Delhi, and Bangalore for sub-10ms latency." },
                                { icon: <Database />, title: "Data Sovereignty", desc: "We follow all Indian data protection regulations. Your data never leaves our borders." },
                                { icon: <Lock />, title: "Vocal for Local", desc: "100% Indian engineering team focusing on high-end localized communication needs." }
                            ].map((item, i) => (
                                <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
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
                                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Industry First</span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[0.9]">
                                    SILENT SCREEN<br />
                                    <span className="text-orange-500">MONITORING.</span>
                                </h2>
                                <p className="text-white/40 text-lg mb-12 leading-relaxed font-medium">
                                    Designed for the high-accountability Indian workspace. Manage your remote team with absolute transparency. Capture, track, and optimize performance in real-time.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        "3s Live Intervals",
                                        "AES-256 Encryption",
                                        "Zero-lag Capture",
                                        "Native Optimization"
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
                                {/* Decorative Elements */}
                                <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-600/20 blur-[130px] rounded-full" />
                                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full" />
                            </div>
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
                                <UserPlus className="w-12 h-12 text-blue-400" />
                            </div>
                        </motion.div>
                        <h2 className="text-5xl md:text-9xl font-black mb-12 tracking-tighter leading-none uppercase italic">
                            Empower <span className="bg-gradient-to-r from-orange-400 to-emerald-400 bg-clip-text text-transparent">Your Bharat.</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto px-16 py-8 bg-blue-600 text-white text-lg font-black rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all"
                            >
                                Create Free Account
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-16 py-8 bg-white/5 border border-white/10 hover:bg-white/10 text-lg font-black rounded-3xl transition-all"
                            >
                                Sign In
                            </motion.button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-32 border-t border-white/5 bg-black/40 backdrop-blur-3xl relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-20 mb-32">
                        <div className="col-span-2">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
                                    <Shield className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black uppercase tracking-tighter">Nexus Meeting</span>
                                    <span className="text-[10px] font-black text-orange-500 tracking-[0.4em] uppercase">Built for Bharat</span>
                                </div>
                            </div>
                            <p className="text-white/30 max-w-sm leading-relaxed mb-10 text-lg font-medium italic">
                                "Redefining virtual collaboration with high-security infrastructure native to Indian soil."
                            </p>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all cursor-pointer group">
                                    <Globe className="w-5 h-5 text-white/40 group-hover:text-white" />
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-600 transition-all cursor-pointer group">
                                    <Smartphone className="w-5 h-5 text-white/40 group-hover:text-white" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black mb-10 text-xs uppercase tracking-[0.4em] text-white/20">Solutions</h4>
                            <ul className="space-y-6">
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Enterprise</a></li>
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Government</a></li>
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Native App</a></li>
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Tracking API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black mb-10 text-xs uppercase tracking-[0.4em] text-white/20">Trust</h4>
                            <ul className="space-y-6">
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Privacy Hub</a></li>
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Certifications</a></li>
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Made in India</a></li>
                                <li><a href="#" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Legal</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">© 2024 NEXUS BHARAT PORTAL. BUILT FOR DIGITAL SOVEREIGNTY.</p>
                        <div className="flex gap-10">
                            <span className="text-[10px] font-black text-orange-500/40 uppercase tracking-widest">Saffron Security</span>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Pristine Protocol</span>
                            <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest">Green Latency</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Add necessary icon for CTA
const UserPlus = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
);
