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
    Lock
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
            icon: <Monitor className="w-6 h-6 text-indigo-400" />,
            title: "Silent Tracking",
            description: "Monitor participant activity with silent screen monitoring for professional environments."
        },
        {
            icon: <Shield className="w-6 h-6 text-purple-400" />,
            title: "Secure by Design",
            description: "End-to-end encrypted sessions ensuring your data and conversations stay private."
        },
        {
            icon: <Users className="w-6 h-6 text-emerald-400" />,
            title: "Team Collaborative",
            description: "Built-in chat, screen sharing, and interactive whiteboards for seamless teamwork."
        }
    ];

    const stats = [
        { value: "1M+", label: "Minutes Monthly" },
        { value: "50k+", label: "Happy Users" },
        { value: "99.9%", label: "System Uptime" },
        { value: "E2EE", label: "Encrypted" }
    ];

    return (
        <div className="min-h-screen bg-[#06060c] text-white selection:bg-blue-500/30 selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md border-b border-white/5 bg-[#06060c]/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                            <Video className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter">Nexus <span className="text-blue-500">Meeting</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Features</a>
                        <a href="#tracking" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Tracking</a>
                        <a href="#security" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Security</a>
                        {user ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/admin')}
                                className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs font-bold transition-all flex items-center gap-2"
                            >
                                Dashboard <Layout className="w-3.5 h-3.5" />
                            </motion.button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Login</Link>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/register')}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
                                >
                                    Join for Free
                                </motion.button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-white/60" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Link */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-20 left-0 right-0 z-[90] bg-[#0c0c16] border-b border-white/5 md:hidden"
                    >
                        <div className="p-6 flex flex-col gap-6">
                            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Features</a>
                            <a href="#tracking" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Tracking</a>
                            <a href="#security" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Security</a>
                            <hr className="border-white/5" />
                            {user ? (
                                <button onClick={() => navigate('/admin')} className="w-full py-4 bg-white/5 rounded-xl font-bold">Dashboard</button>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => navigate('/login')} className="py-4 bg-white/5 rounded-xl font-bold">Login</button>
                                    <button onClick={() => navigate('/register')} className="py-4 bg-blue-600 rounded-xl font-bold">Join Free</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                {/* Hero Section */}
                <section className="relative pt-40 pb-20 overflow-hidden">
                    {/* Background Highlight */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-[120px] -z-10 rounded-full opacity-50" />

                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Next Gen Virtual Meetings v2.0</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9]"
                        >
                            COLLABORATE <br />
                            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">WITHOUT LIMITS.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto text-white/40 text-lg md:text-xl font-medium mb-12"
                        >
                            The most advanced video conferencing platform for professionals. Secure, fast, and feature-rich with high-end tracking and AI integrations.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(user ? '/admin' : '/register')}
                                className="w-full sm:w-auto px-8 py-5 bg-blue-600 hover:bg-blue-500 text-sm font-black rounded-2xl shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 group transition-all"
                            >
                                Launch Your Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/join')}
                                className="w-full sm:w-auto px-8 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-black rounded-2xl backdrop-blur-xl transition-all"
                            >
                                Join existing room
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Device Mockup */}
                    <div className="max-w-6xl mx-auto px-6 mt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring', damping: 20 }}
                            className="relative aspect-video bg-white/5 rounded-3xl border border-white/10 p-2 shadow-2xl overflow-hidden group"
                        >
                            <div className="w-full h-full bg-[#0a0a18] rounded-[1.25rem] overflow-hidden relative">
                                {/* Simulated Meeting Interface */}
                                <div className="absolute inset-0 p-4 md:p-8 flex flex-col">
                                    <div className="flex items-center justify-between mb-8 opacity-40">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20" />
                                            <div className="w-32 h-4 bg-white/10 rounded-full" />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-20 h-8 bg-white/5 rounded-full" />
                                            <div className="w-8 h-8 bg-white/5 rounded-lg" />
                                        </div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="bg-white/[0.03] rounded-2xl border border-white/5 relative group-hover:bg-white/[0.05] transition-colors overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                                                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <div className="w-16 h-2 bg-white/10 rounded-full" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex justify-center gap-4 opacity-40">
                                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl" />
                                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl" />
                                        <div className="w-12 h-12 bg-red-500/20 border border-red-500/20 rounded-xl" />
                                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl" />
                                    </div>
                                </div>

                                {/* Floating Glow */}
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px]" />
                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 blur-[100px]" />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 border-y border-white/5 bg-white/[0.01]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center group">
                                    <h3 className="text-3xl md:text-5xl font-black mb-2 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{stat.value}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-none">CRAFTED FOR<br /><span className="text-blue-500">PERFORMANCE.</span></h2>
                            <p className="text-white/40 font-medium max-w-xl mx-auto">Powered by next-generation WebRTC and Electron technologies for maximum stability and speed.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] hover:border-white/10 transition-all group"
                                >
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-black mb-3">{feature.title}</h3>
                                    <p className="text-sm text-white/30 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Unique Tracking Section */}
                <section id="tracking" className="py-32 bg-white/[0.01] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20">
                                    <Monitor className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[0.9]">
                                    SILENT SCREEN<br />
                                    <span className="text-indigo-400">TRACKING.</span>
                                </h2>
                                <p className="text-white/40 text-lg mb-8 leading-relaxed">
                                    The only platform built with integrated screen monitoring. Capture real-time participant activity for compliance, quality assurance, or team coordination.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        "Auto-capture every 3 seconds",
                                        "End-to-end encrypted screenshots",
                                        "Host-only access controls",
                                        "Native Electron optimization"
                                    ].map((text, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20">
                                                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                                            </div>
                                            <span className="text-sm font-bold text-white/60">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <motion.div
                                    initial={{ rotate: 10, x: 50, opacity: 0 }}
                                    whileInView={{ rotate: 0, x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="relative z-10 p-4 bg-brand-card/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-3xl shadow-indigo-600/10"
                                >
                                    <div className="aspect-video bg-[#0d0d16] rounded-[2rem] overflow-hidden p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30">Monitoring Panel</h4>
                                            <div className="flex gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                <span className="text-[9px] font-bold text-red-400 uppercase">Live</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="aspect-video bg-white/5 rounded-xl border border-white/5" />
                                            <div className="aspect-video bg-white/5 rounded-xl border border-white/5" />
                                            <div className="aspect-video bg-white/5 rounded-xl border border-white/5" />
                                            <div className="aspect-video bg-white/5 rounded-xl border border-white/10 p-2">
                                                <div className="w-full h-full bg-white/5 rounded-lg" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                                {/* Decorative Elements */}
                                <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/20 blur-[120px] rounded-full" />
                                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security / CTA Section */}
                <section id="security" className="py-32 relative overflow-hidden">
                    <div className="max-w-5xl mx-auto px-6 text-center">
                        <div className="mb-12 relative inline-block">
                            <div className="absolute inset-0 bg-emerald-500/30 blur-[40px] rounded-full" />
                            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 mx-auto">
                                <Shield className="w-10 h-10 text-emerald-400 shadow-lg" />
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight leading-[0.9]">
                            READY TO <span className="text-emerald-400">CONNECT?</span>
                        </h2>
                        <p className="text-white/40 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of professionals already using Nexus Meeting for their mission-critical communications. Start your first meeting in seconds.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto px-10 py-6 bg-white text-black text-base font-black rounded-2xl shadow-2xl transition-all"
                            >
                                Create Free Account
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/join')}
                                className="w-full sm:w-auto px-10 py-6 bg-white/5 border border-white/10 hover:bg-white/10 text-base font-black rounded-2xl transition-all"
                            >
                                Join existing room
                            </motion.button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                                    <Video className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-black uppercase tracking-tighter">Nexus Meeting</span>
                            </div>
                            <p className="text-white/30 max-w-sm leading-relaxed mb-6">
                                Professional video conferencing software built with security and high-end collaborative tools at its core.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer group">
                                    <Globe className="w-4 h-4 text-white/40 group-hover:text-white" />
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer group">
                                    <Smartphone className="w-4 h-4 text-white/40 group-hover:text-white" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black mb-6 text-sm uppercase tracking-widest text-white/20">Product</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-sm text-white/40 hover:text-blue-400 transition-colors">Features</a></li>
                                <li><a href="#" className="text-sm text-white/40 hover:text-blue-400 transition-colors">Enterprise</a></li>
                                <li><a href="#" className="text-sm text-white/40 hover:text-blue-400 transition-colors">Desktop App</a></li>
                                <li><a href="#" className="text-sm text-white/40 hover:text-blue-400 transition-colors">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black mb-6 text-sm uppercase tracking-widest text-white/20">Legal</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-sm text-white/40 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-sm text-white/40 hover:text-blue-400 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-sm text-white/40 hover:text-blue-400 transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-xs font-bold text-white/20 uppercase tracking-widest">© 2024 Nexus Meeting Portal. Built for performance.</p>
                        <div className="flex gap-6">
                            <span className="text-[10px] font-bold text-white/10 uppercase">Secure</span>
                            <span className="text-[10px] font-bold text-white/10 uppercase">Stable</span>
                            <span className="text-[10px] font-bold text-white/10 uppercase">Pro</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
