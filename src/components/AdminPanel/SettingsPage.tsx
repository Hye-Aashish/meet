import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Mic,
    Video,
    MonitorUp,
    MessageSquare,
    Hand,
    Eye,
    Shield,
    Save,
    RotateCcw,
    CheckCircle2,
    Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Permissions {
    allowMic: boolean;
    allowCamera: boolean;
    allowScreenShare: boolean;
    allowChat: boolean;
    allowHandRaise: boolean;
    participantsVisible: boolean;
}

export const SettingsPage: React.FC = () => {
    const [permissions, setPermissions] = useState<Permissions>({
        allowMic: true,
        allowCamera: true,
        allowScreenShare: true,
        allowChat: true,
        allowHandRaise: true,
        participantsVisible: true,
    });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                setPermissions(data);
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(permissions),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error('Failed to save settings:', err);
        }
    };

    const handleReset = () => {
        setPermissions({
            allowMic: true,
            allowCamera: true,
            allowScreenShare: true,
            allowChat: true,
            allowHandRaise: true,
            participantsVisible: true,
        });
    };

    const togglePerm = (key: keyof Permissions) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const permissionItems = [
        {
            key: 'allowMic' as const,
            label: 'Microphone Access',
            desc: 'Allow participants to unmute and use their microphone during meetings',
            icon: Mic,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
        },
        {
            key: 'allowCamera' as const,
            label: 'Camera Access',
            desc: 'Allow participants to turn on their camera and share video during meetings',
            icon: Video,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
        },
        {
            key: 'allowScreenShare' as const,
            label: 'Screen Sharing',
            desc: 'Allow participants to share their screen with others in the meeting',
            icon: MonitorUp,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
        },
        {
            key: 'allowChat' as const,
            label: 'Chat Messages',
            desc: 'Allow participants to send text messages in the meeting chat',
            icon: MessageSquare,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
        },
        {
            key: 'allowHandRaise' as const,
            label: 'Hand Raise',
            desc: 'Allow participants to raise their hand to get attention during the meeting',
            icon: Hand,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
        },
        {
            key: 'participantsVisible' as const,
            label: 'Participant Visibility',
            desc: 'Allow participants to see other participants in the meeting. When off, only the host is visible.',
            icon: Eye,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
        },
    ];

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-white/40 text-sm mt-1">Configure default permissions for all new meetings</p>
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReset}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/10 text-white/50 hover:text-white/80"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset All
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className={cn(
                            "px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2",
                            saved
                                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
                        )}
                    >
                        {saved ? (
                            <><CheckCircle2 className="w-4 h-4" /> Saved!</>
                        ) : (
                            <><Save className="w-4 h-4" /> Save Changes</>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Info Banner */}
            <div className="p-5 bg-blue-600/5 border border-blue-500/10 rounded-2xl mb-8 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-blue-300">Default Meeting Permissions</p>
                    <p className="text-xs text-blue-300/50 mt-0.5">
                        These settings apply as defaults when creating new meetings. You can override them per meeting in the meeting creation dialog.
                    </p>
                </div>
            </div>

            {/* Permissions List */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Participant Permissions</label>

                <div className="bg-brand-card rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
                    {permissionItems.map((perm) => (
                        <div
                            key={perm.key}
                            className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", perm.bg)}>
                                    <perm.icon className={cn("w-5 h-5", perm.color)} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{perm.label}</p>
                                    <p className="text-xs text-white/30 mt-0.5 max-w-md">{perm.desc}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => togglePerm(perm.key)}
                                className={cn(
                                    "w-12 h-7 rounded-full transition-all relative shrink-0",
                                    permissions[perm.key] ? "bg-blue-600" : "bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all",
                                    permissions[perm.key] ? "left-[calc(100%-1.5rem)]" : "left-1"
                                )} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="mt-8 p-5 bg-brand-card rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <Settings className="w-5 h-5 text-white/30" />
                    <h3 className="text-sm font-bold">Active Permissions Summary</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {permissionItems.map((perm) => (
                        <span
                            key={perm.key}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                                permissions[perm.key]
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                            )}
                        >
                            <perm.icon className="w-3 h-3" />
                            {perm.label}: {permissions[perm.key] ? 'ON' : 'OFF'}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
