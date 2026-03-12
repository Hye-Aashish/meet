import React, { useState, useEffect } from 'react';
import {
    Settings,
    Save,
    ShieldAlert,
    Globe,
    Server,
    Database,
    Lock,
    Zap,
    Cpu,
    CloudLightning,
    Radio,
    HardDrive,
    X,
    Key,
    Check,

    Mic,
    Video,
    Share2,
    MessageSquare,
    Hand,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

export const SuperAdminConfig: React.FC = () => {
    const [config, setConfig] = useState({
        allowMic: true,
        allowCamera: true,
        allowScreenShare: true,
        allowChat: true,
        allowHandRaise: true,
        participantsVisible: true,
        aiApiKey: ''
    });


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('nexus_user') || '{}');

    const fetchConfig = async () => {
        try {
            const res = await api.get('/api/settings');
            const data = await res.json();
            if (res.ok) setConfig(data);
        } catch (err) {
            console.error("Failed to fetch config");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put('/api/settings', config);
            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Failed to save config");
        } finally {
            setSaving(false);
        }
    };

    const toggleParam = (key: keyof typeof config) => {
        setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-6">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Matrix Config</span>
        </div>
    );

    const configItems = [
        { key: 'allowMic', label: 'Microphone Authority', icon: Mic, desc: 'Allow audio transmission by default' },
        { key: 'allowCamera', label: 'Video Grid Authority', icon: Video, desc: 'Allow camera transmission by default' },
        { key: 'allowScreenShare', label: 'Visual Stream Logic', icon: Share2, desc: 'Allow screen sharing across nodes' },
        { key: 'allowChat', label: 'Neural Chat Network', icon: MessageSquare, desc: 'Enable real-time data communication' },
        { key: 'allowHandRaise', label: 'Priority Signaling', icon: Hand, desc: 'Enable hand raise protocols' },
        { key: 'participantsVisible', label: 'Node Transparency', icon: Users, desc: 'Show all active cluster participants' },
    ];

    return (
        <div className="space-y-12 pb-40">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white flex items-center gap-6">Global <span className="text-red-600">Config.</span></h1>
                    <p className="text-white/30 text-lg mt-3 font-medium uppercase tracking-tight italic">Overwrite core matrix environment variables and feature flags.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-12 py-6 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group disabled:opacity-50"
                >
                    {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    )}
                    COMMIT MATRIX OVERRIDE
                </button>
            </div>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] flex items-center gap-6 text-emerald-500 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-500/10"
                    >
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                            <Check className="w-6 h-6" />
                        </div>
                        Global system parameters updated successfully. Node synchronization complete across the Bharat Grid.
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Feature Flags */}
                <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[4rem] space-y-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0">
                        <Zap className="w-32 h-32 text-red-600" />
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center">
                            <Cpu className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-widest italic">Matrix <span className="text-red-600">Authority.</span></h3>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {configItems.map(({ key, label, icon: Icon, desc }) => (
                            <div key={key} className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-all group/item">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center group-hover/item:border-red-500/30 transition-all">
                                        <Icon className="w-5 h-5 text-white/30 group-hover/item:text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] group-hover/item:text-white transition-colors">{label}</p>
                                        <p className="text-[10px] font-medium text-white/20 uppercase tracking-tight mt-1">{desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleParam(key as any)}
                                    className={cn(
                                        "w-16 h-8 rounded-full transition-all relative p-1 cursor-pointer",
                                        config[key as keyof typeof config] ? "bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]" : "bg-white/10"
                                    )}
                                >
                                    <div className={cn(
                                        "w-6 h-6 bg-white rounded-full transition-all shadow-lg",
                                        config[key as keyof typeof config] ? "translate-x-8" : "translate-x-0"
                                    )} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* AI API Key Section */}
                    <div className="pt-10 border-t border-white/5 space-y-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
                                <Key className="w-5 h-5 text-red-500" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest">Nexus <span className="text-red-500">AI Key.</span></h4>
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                value={config.aiApiKey}
                                onChange={(e) => setConfig({ ...config, aiApiKey: e.target.value })}
                                placeholder="ENTER GOOGLE GEMINI API KEY..."
                                className="w-full bg-black/40 border border-white/5 focus:border-red-600/50 rounded-2xl py-5 px-8 text-xs font-black tracking-widest outline-none transition-all placeholder:text-white/5"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-red-600/10 rounded-lg">
                                <Lock className="w-3.5 h-3.5 text-red-500/40" />
                            </div>
                        </div>
                        <p className="text-[9px] font-medium text-white/20 uppercase tracking-tight ml-2 italic">This key enables real-time meeting summarization and neural analytics across all clusters.</p>
                    </div>
                </div>


                {/* Infrastructure Info (Static for now but styled) */}
                <div className="space-y-8">
                    <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[4rem] flex flex-col justify-between min-h-[400px]">
                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                    <Globe className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-widest italic">Routing <span className="text-emerald-500">Grid.</span></h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Master Region</span>
                                    <span className="text-sm font-black text-white uppercase italic">Mumbai (IN-WEST-1)</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Edge Nodes</span>
                                    <span className="text-sm font-black text-white uppercase italic">42 Nodes Online</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Protocol Type</span>
                                    <span className="text-sm font-black text-red-500 uppercase italic">E2EE - AES-GCM</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-black/40 border border-red-500/20 rounded-[3rem] mt-8">
                            <div className="flex items-center gap-4 mb-4">
                                <ShieldAlert className="w-6 h-6 text-red-600 animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-widest text-red-500">Alpha Lockdown Protocol</span>
                            </div>
                            <p className="text-[10px] font-medium text-white/30 uppercase leading-relaxed">Immediately disconnect all active socket tunnels and restrict database access to read-only.</p>
                            <button className="mt-6 w-full py-4 bg-red-600/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 hover:text-white transition-all">Initiate Protocol 9</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Matrix Footer */}
            <div className="p-16 bg-gradient-to-r from-red-600/10 to-transparent border border-white/5 rounded-[5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Security Advisory Level: ZERO</p>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter max-w-xl leading-none">System Parameters are currently <span className="text-emerald-500 underline decoration-8 decoration-emerald-500/30 underline-offset-[12px]">Optimized.</span></h2>
                </div>
                <div className="flex items-center gap-16">
                    <div className="text-center">
                        <p className="text-5xl font-black text-white italic">100%</p>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2">Uptime Grid</p>
                    </div>
                    <div className="w-[1px] h-12 bg-white/10" />
                    <div className="text-center">
                        <p className="text-5xl font-black text-white italic">12ms</p>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2">Core Latency</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
