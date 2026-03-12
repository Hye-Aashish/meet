import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Plus,
    Video,
    Users,
    Calendar,
    Clock,
    ArrowRight,
    Copy,
    Activity,
    TrendingUp,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

interface Meeting {
    id: string;
    title: string;
    roomId: string;
    scheduledAt: string | null;
    duration: number;
    maxParticipants: number;
    status: 'active' | 'scheduled' | 'ended';
    createdAt: string;
    participantCount?: number;
}

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('nexus_user_name') || 'Admin';
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [activeMeetings, setActiveMeetings] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Create new meeting form state
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const res = await api.get('/api/meetings');
            if (res.ok) {
                const data = await res.json();
                setMeetings(data);
                setActiveMeetings(data.filter((m: Meeting) => m.status === 'active').length);
            } else {
                setMeetings([]);
                setActiveMeetings(0);
            }
        } catch (err) {
            console.error('Failed to fetch meetings:', err);
            setMeetings([]);
            setActiveMeetings(0);
        }
    };

    const handleCreateInstant = async () => {
        const roomId = Math.random().toString(36).substring(2, 10).toUpperCase();
        try {
            const res = await api.post('/api/meetings', {
                title: newTitle || `Meeting ${roomId}`,
                roomId,
                status: 'active',
                maxParticipants: 50,
                duration: 60,
            });
            if (res.ok) {
                setShowCreateModal(false);
                setNewTitle('');
                fetchMeetings();
                navigate(`/meeting/${roomId}`);
            }
        } catch (err) {
            console.error('Error creating meeting:', err);
        }
    };

    const handleCopyLink = (roomId: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomId}`);
        setCopiedId(roomId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleJoinMeeting = (roomId: string) => {
        navigate(`/meeting/${roomId}`);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const recentMeetings = meetings.slice(0, 5);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {userName}! 👋</h1>
                <p className="text-white/40 text-sm">Manage your meetings and video conferences from here.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(true)}
                    className="group relative flex items-center gap-4 p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl border border-blue-500/20 shadow-xl shadow-blue-600/10 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                        <Plus className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-lg">New Meeting</p>
                        <p className="text-blue-200 text-xs">Create an instant meeting</p>
                    </div>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/')}
                    className="group relative flex items-center gap-4 p-6 bg-brand-card rounded-2xl border border-white/5 shadow-xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Video className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-lg">Join Meeting</p>
                        <p className="text-white/40 text-xs">Enter a meeting room</p>
                    </div>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/admin/scheduled')}
                    className="group relative flex items-center gap-4 p-6 bg-brand-card rounded-2xl border border-white/5 shadow-xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-7 h-7 text-purple-400" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-lg">Schedule</p>
                        <p className="text-white/40 text-xs">Plan a future meeting</p>
                    </div>
                </motion.button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: 'Active Now', value: activeMeetings, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Total Meetings', value: meetings.length, icon: Video, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    {
                        label: 'This Week', value: meetings.filter(m => {
                            const d = new Date(m.createdAt);
                            const now = new Date();
                            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                            return d >= weekAgo;
                        }).length, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10'
                    },
                    { label: 'Participants', value: meetings.reduce((acc, m) => acc + (m.participantCount || 0), 0), icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map((stat) => (
                    <div key={stat.label} className="p-5 bg-brand-card rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                                <stat.icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Personal Meeting ID */}
            <div className="p-6 bg-brand-card rounded-2xl border border-white/5 mb-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-1">Personal Meeting ID</h3>
                        <p className="text-2xl font-mono font-bold tracking-wider">
                            {(localStorage.getItem('nexus_user_id') || 'XXXXXXXXX').substring(0, 9).toUpperCase().replace(/(.{3})/g, '$1 ').trim()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                const id = (localStorage.getItem('nexus_user_id') || '').substring(0, 9).toUpperCase();
                                handleCopyLink(id);
                            }}
                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/10 transition-all flex items-center gap-2"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            Copy ID
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                const id = (localStorage.getItem('nexus_user_id') || '').substring(0, 9).toUpperCase();
                                navigate(`/meeting/${id}`);
                            }}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                        >
                            <Video className="w-3.5 h-3.5" />
                            Start
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Recent Meetings */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Recent Meetings</h2>
                    <button
                        onClick={() => navigate('/admin/meetings')}
                        className="text-blue-400 text-xs font-bold hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                        View All <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {recentMeetings.length === 0 ? (
                    <div className="p-12 bg-brand-card rounded-2xl border border-white/5 text-center">
                        <Video className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/30 font-medium mb-1">No meetings yet</p>
                        <p className="text-white/15 text-xs mb-6">Create your first meeting to get started</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all inline-flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Meeting
                        </motion.button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentMeetings.map((meeting) => (
                            <motion.div
                                key={meeting.id}
                                whileHover={{ scale: 1.005 }}
                                className="group flex items-center justify-between p-4 bg-brand-card rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                                onClick={() => handleJoinMeeting(meeting.roomId)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                        meeting.status === 'active' ? "bg-emerald-500/10" : meeting.status === 'scheduled' ? "bg-blue-500/10" : "bg-white/5"
                                    )}>
                                        <Video className={cn(
                                            "w-5 h-5",
                                            meeting.status === 'active' ? "text-emerald-400" : meeting.status === 'scheduled' ? "text-blue-400" : "text-white/30"
                                        )} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{meeting.title}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-[10px] text-white/30 font-mono uppercase">{meeting.roomId}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="text-[10px] text-white/30 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(meeting.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                        meeting.status === 'active' ? "bg-emerald-500/10 text-emerald-400" :
                                            meeting.status === 'scheduled' ? "bg-blue-500/10 text-blue-400" :
                                                "bg-white/5 text-white/30"
                                    )}>
                                        {meeting.status}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleCopyLink(meeting.roomId); }}
                                        className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Copy className={cn("w-4 h-4", copiedId === meeting.roomId && "text-emerald-400")} />
                                    </button>
                                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-all" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Meeting Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowCreateModal(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-md bg-brand-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold">Create New Meeting</h2>
                            <p className="text-white/40 text-xs mt-1">Set up an instant video conference</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Meeting Title</label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g. Team Standup"
                                    className="w-full bg-brand-accent/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-brand-accent/20 border-t border-white/5 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-5 py-2.5 text-white/40 hover:text-white/60 rounded-xl text-sm font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCreateInstant}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create & Join
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
