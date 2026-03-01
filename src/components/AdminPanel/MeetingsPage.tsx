import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    Plus,
    Video,
    Clock,
    Copy,
    Trash2,
    Edit3,
    ArrowRight,
    Search,
    Filter,
    MoreVertical,
    X,
    Calendar,
    Users,
    Link,
    ExternalLink,
    CheckCircle2,
    Mic,
    Eye,
    MonitorUp,
    MessageSquare,
    Hand,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Meeting {
    id: string;
    title: string;
    roomId: string;
    scheduledAt: string | null;
    duration: number;
    maxParticipants: number;
    status: 'active' | 'scheduled' | 'ended';
    createdAt: string;
}

export const MeetingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'scheduled' | 'ended'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
    const [contextMenu, setContextMenu] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formSchedule, setFormSchedule] = useState('');
    const [formDuration, setFormDuration] = useState(60);
    const [formMaxParticipants, setFormMaxParticipants] = useState(50);

    // Permission form state
    const [permAllowMic, setPermAllowMic] = useState(true);
    const [permAllowCamera, setPermAllowCamera] = useState(true);
    const [permAllowScreenShare, setPermAllowScreenShare] = useState(true);
    const [permAllowChat, setPermAllowChat] = useState(true);
    const [permAllowHandRaise, setPermAllowHandRaise] = useState(true);
    const [permParticipantsVisible, setPermParticipantsVisible] = useState(true);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const userId = localStorage.getItem('nexus_user_id');
            const res = await fetch('/api/meetings', {
                headers: { 'x-user-id': userId || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setMeetings(data);
            }
        } catch (err) {
            console.error('Failed to fetch meetings:', err);
        }
    };

    const handleCreate = async () => {
        const roomId = Math.random().toString(36).substring(2, 10).toUpperCase();
        try {
            const userId = localStorage.getItem('nexus_user_id');
            const res = await fetch('/api/meetings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId || ''
                },
                body: JSON.stringify({
                    title: formTitle || `Meeting ${roomId}`,
                    roomId,
                    status: formSchedule ? 'scheduled' : 'active',
                    scheduledAt: formSchedule || null,
                    maxParticipants: formMaxParticipants,
                    duration: formDuration,
                    permissions: {
                        allowMic: permAllowMic,
                        allowCamera: permAllowCamera,
                        allowScreenShare: permAllowScreenShare,
                        allowChat: permAllowChat,
                        allowHandRaise: permAllowHandRaise,
                        participantsVisible: permParticipantsVisible,
                    },
                }),
            });
            if (res.ok) {
                setShowCreateModal(false);
                resetForm();
                fetchMeetings();
            }
        } catch (err) {
            console.error('Error creating meeting:', err);
        }
    };

    const handleUpdate = async () => {
        if (!editingMeeting) return;
        try {
            const userId = localStorage.getItem('nexus_user_id');
            const res = await fetch(`/api/meetings/${editingMeeting.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId || ''
                },
                body: JSON.stringify({
                    title: formTitle,
                    scheduledAt: formSchedule || null,
                    maxParticipants: formMaxParticipants,
                    duration: formDuration,
                    permissions: {
                        allowMic: permAllowMic,
                        allowCamera: permAllowCamera,
                        allowScreenShare: permAllowScreenShare,
                        allowChat: permAllowChat,
                        allowHandRaise: permAllowHandRaise,
                        participantsVisible: permParticipantsVisible,
                    },
                }),
            });
            if (res.ok) {
                setEditingMeeting(null);
                resetForm();
                fetchMeetings();
            }
        } catch (err) {
            console.error('Error updating meeting:', err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const userId = localStorage.getItem('nexus_user_id');
            const res = await fetch(`/api/meetings/${id}`, {
                method: 'DELETE',
                headers: { 'x-user-id': userId || '' }
            });
            if (res.ok) {
                setDeleteConfirm(null);
                fetchMeetings();
            }
        } catch (err) {
            console.error('Error deleting meeting:', err);
        }
    };

    const handleEndMeeting = async (id: string) => {
        try {
            const userId = localStorage.getItem('nexus_user_id');
            const res = await fetch(`/api/meetings/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId || ''
                },
                body: JSON.stringify({ status: 'ended' }),
            });
            if (res.ok) {
                setContextMenu(null);
                fetchMeetings();
            }
        } catch (err) {
            console.error('Error ending meeting:', err);
        }
    };

    const resetForm = () => {
        setFormTitle('');
        setFormSchedule('');
        setFormDuration(60);
        setFormMaxParticipants(50);
        setPermAllowMic(true);
        setPermAllowCamera(true);
        setPermAllowScreenShare(true);
        setPermAllowChat(true);
        setPermAllowHandRaise(true);
        setPermParticipantsVisible(true);
    };

    const openEditModal = (meeting: any) => {
        setEditingMeeting(meeting);
        setFormTitle(meeting.title);
        setFormSchedule(meeting.scheduledAt || '');
        setFormDuration(meeting.duration);
        setFormMaxParticipants(meeting.maxParticipants);
        if (meeting.permissions) {
            setPermAllowMic(meeting.permissions.allowMic ?? true);
            setPermAllowCamera(meeting.permissions.allowCamera ?? true);
            setPermAllowScreenShare(meeting.permissions.allowScreenShare ?? true);
            setPermAllowChat(meeting.permissions.allowChat ?? true);
            setPermAllowHandRaise(meeting.permissions.allowHandRaise ?? true);
            setPermParticipantsVisible(meeting.permissions.participantsVisible ?? true);
        }
        setContextMenu(null);
    };

    const handleCopyLink = (roomId: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomId}`);
        setCopiedId(roomId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredMeetings = meetings.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.roomId.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filterStatus === 'all' || m.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Meetings</h1>
                    <p className="text-white/40 text-sm mt-1">Manage all your meeting rooms and conferences</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { resetForm(); setShowCreateModal(true); }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Meeting
                </motion.button>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title or room ID..."
                        className="w-full bg-brand-card border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>
                <div className="flex items-center gap-1 p-1 bg-brand-card rounded-xl border border-white/5">
                    {(['all', 'active', 'scheduled', 'ended'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={cn(
                                "px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                filterStatus === s ? "bg-blue-600/10 text-blue-400" : "text-white/30 hover:text-white/60"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Meetings Table / Cards */}
            {filteredMeetings.length === 0 ? (
                <div className="p-16 bg-brand-card rounded-2xl border border-white/5 text-center">
                    <Video className="w-16 h-16 text-white/5 mx-auto mb-4" />
                    <p className="text-white/30 font-medium mb-1">
                        {search || filterStatus !== 'all' ? 'No meetings match your filters' : 'No meetings created yet'}
                    </p>
                    <p className="text-white/15 text-xs mb-6">
                        {search || filterStatus !== 'all' ? 'Try adjusting your search or filter' : 'Click "New Meeting" to create one'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-brand-card rounded-2xl border border-white/5 overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                            <div className="col-span-4">Meeting</div>
                            <div className="col-span-2">Room ID</div>
                            <div className="col-span-2">Schedule</div>
                            <div className="col-span-1">Duration</div>
                            <div className="col-span-1">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {/* Table Body */}
                        {filteredMeetings.map((meeting) => (
                            <div
                                key={meeting.id}
                                className="group grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-all items-center"
                            >
                                <div className="col-span-4 flex items-center gap-3">
                                    <div className={cn(
                                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                        meeting.status === 'active' ? "bg-emerald-500/10" : meeting.status === 'scheduled' ? "bg-blue-500/10" : "bg-white/5"
                                    )}>
                                        <Video className={cn(
                                            "w-4 h-4",
                                            meeting.status === 'active' ? "text-emerald-400" : meeting.status === 'scheduled' ? "text-blue-400" : "text-white/20"
                                        )} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">{meeting.title}</p>
                                        <p className="text-[10px] text-white/20">{new Date(meeting.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-white/50">{meeting.roomId}</span>
                                        <button
                                            onClick={() => handleCopyLink(meeting.roomId)}
                                            className="text-white/20 hover:text-white/60 transition-all"
                                        >
                                            {copiedId === meeting.roomId ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <span className="text-xs text-white/40 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {meeting.scheduledAt ? new Date(meeting.scheduledAt).toLocaleDateString() : 'Instant'}
                                    </span>
                                </div>

                                <div className="col-span-1">
                                    <span className="text-xs text-white/40 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {meeting.duration}m
                                    </span>
                                </div>

                                <div className="col-span-1">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                        meeting.status === 'active' ? "bg-emerald-500/10 text-emerald-400" :
                                            meeting.status === 'scheduled' ? "bg-blue-500/10 text-blue-400" :
                                                "bg-white/5 text-white/30"
                                    )}>
                                        {meeting.status}
                                    </span>
                                </div>

                                <div className="col-span-2 flex items-center justify-end gap-2">
                                    {meeting.status !== 'ended' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/meeting/${meeting.roomId}`)}
                                            className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1 opacity-0 group-hover:opacity-100"
                                        >
                                            Join <ExternalLink className="w-3 h-3" />
                                        </motion.button>
                                    )}

                                    <div className="relative">
                                        <button
                                            onClick={() => setContextMenu(contextMenu === meeting.id ? null : meeting.id)}
                                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-all"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        <AnimatePresence>
                                            {contextMenu === meeting.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute right-0 top-full mt-1 w-44 bg-brand-card border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                >
                                                    <button onClick={() => openEditModal(meeting)} className="w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
                                                        <Edit3 className="w-3.5 h-3.5" /> Edit Details
                                                    </button>
                                                    <button onClick={() => handleCopyLink(meeting.roomId)} className="w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
                                                        <Link className="w-3.5 h-3.5" /> Copy Link
                                                    </button>
                                                    {meeting.status === 'active' && (
                                                        <button onClick={() => handleEndMeeting(meeting.id)} className="w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-amber-500/10 text-amber-400 transition-colors flex items-center gap-2 border-t border-white/5">
                                                            <Clock className="w-3.5 h-3.5" /> End Meeting
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => { setDeleteConfirm(meeting.id); setContextMenu(null); }}
                                                        className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2 border-t border-white/5"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                        {filteredMeetings.map((meeting) => (
                            <div key={meeting.id} className="bg-brand-card rounded-2xl border border-white/5 p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            meeting.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : meeting.status === 'scheduled' ? "bg-blue-500/10 text-blue-400" : "bg-white/5 text-white/30"
                                        )}>
                                            <Video className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">{meeting.title}</h3>
                                            <p className="text-[10px] text-white/20">{new Date(meeting.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setContextMenu(contextMenu === meeting.id ? null : meeting.id)}
                                            className="p-2 text-white/20"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-2">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">Room ID</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-white/50">{meeting.roomId}</span>
                                            <button onClick={() => handleCopyLink(meeting.roomId)} className="text-white/20">
                                                {copiedId === meeting.roomId ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">Status</p>
                                        <span className={cn(
                                            "inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                                            meeting.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : meeting.status === 'scheduled' ? "bg-blue-500/10 text-blue-400" : "bg-white/5 text-white/30"
                                        )}>
                                            {meeting.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] text-white/40 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {meeting.scheduledAt ? new Date(meeting.scheduledAt).toLocaleDateString() : 'Instant'}
                                        </span>
                                        <span className="text-[10px] text-white/40 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {meeting.duration}m
                                        </span>
                                    </div>
                                    {meeting.status !== 'ended' && (
                                        <button
                                            onClick={() => navigate(`/meeting/${meeting.roomId}`)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                                        >
                                            Join Meeting
                                        </button>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {contextMenu === meeting.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden bg-white/5 rounded-xl mt-2"
                                        >
                                            <div className="grid grid-cols-2 p-2 gap-2">
                                                <button onClick={() => openEditModal(meeting)} className="flex items-center gap-2 px-3 py-2 text-xs text-white/60 bg-white/5 rounded-lg">
                                                    <Edit3 className="w-3.5 h-3.5" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => { setDeleteConfirm(meeting.id); setContextMenu(null); }}
                                                    className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 bg-red-500/10 rounded-lg"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Create / Edit Modal */}
            <AnimatePresence>
                {(showCreateModal || editingMeeting) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setShowCreateModal(false); setEditingMeeting(null); resetForm(); }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-brand-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">{editingMeeting ? 'Edit Meeting' : 'Create Meeting'}</h2>
                                    <p className="text-white/40 text-xs mt-1">{editingMeeting ? 'Update meeting details' : 'Set up a new meeting room'}</p>
                                </div>
                                <button onClick={() => { setShowCreateModal(false); setEditingMeeting(null); resetForm(); }} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-white/40" />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Meeting Title</label>
                                    <input
                                        type="text"
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="e.g. Weekly Team Standup"
                                        className="w-full bg-brand-accent/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Schedule (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        value={formSchedule}
                                        onChange={(e) => setFormSchedule(e.target.value)}
                                        className="w-full bg-brand-accent/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Duration (min)</label>
                                        <input
                                            type="number"
                                            value={formDuration}
                                            onChange={(e) => setFormDuration(Number(e.target.value))}
                                            min={15}
                                            max={480}
                                            className="w-full bg-brand-accent/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Max Participants</label>
                                        <input
                                            type="number"
                                            value={formMaxParticipants}
                                            onChange={(e) => setFormMaxParticipants(Number(e.target.value))}
                                            min={2}
                                            max={500}
                                            className="w-full bg-brand-accent/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Participant Permissions Section */}
                                <div className="space-y-3 pt-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Participant Permissions</label>
                                    <div className="bg-brand-accent/30 rounded-xl border border-white/5 divide-y divide-white/5">
                                        {[
                                            { label: 'Allow Microphone', desc: 'Participants can use their mic', icon: Mic, value: permAllowMic, setter: setPermAllowMic },
                                            { label: 'Allow Camera', desc: 'Participants can use their camera', icon: Video, value: permAllowCamera, setter: setPermAllowCamera },
                                            { label: 'Allow Screen Share', desc: 'Participants can share screen', icon: MonitorUp, value: permAllowScreenShare, setter: setPermAllowScreenShare },
                                            { label: 'Allow Chat', desc: 'Participants can send messages', icon: MessageSquare, value: permAllowChat, setter: setPermAllowChat },
                                            { label: 'Allow Hand Raise', desc: 'Participants can raise hand', icon: Hand, value: permAllowHandRaise, setter: setPermAllowHandRaise },
                                            { label: 'Participants Visible', desc: 'Participants can see each other', icon: Eye, value: permParticipantsVisible, setter: setPermParticipantsVisible },
                                        ].map((perm) => (
                                            <div key={perm.label} className="flex items-center justify-between px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <perm.icon className="w-4 h-4 text-white/30" />
                                                    <div>
                                                        <p className="text-xs font-semibold">{perm.label}</p>
                                                        <p className="text-[10px] text-white/25">{perm.desc}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => perm.setter(!perm.value)}
                                                    className={cn(
                                                        "w-10 h-5.5 rounded-full transition-all relative",
                                                        perm.value ? "bg-blue-600" : "bg-white/10"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-all",
                                                        perm.value ? "left-[calc(100%-1.25rem)]" : "left-0.5"
                                                    )} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-brand-accent/20 border-t border-white/5 flex justify-end gap-3">
                                <button
                                    onClick={() => { setShowCreateModal(false); setEditingMeeting(null); resetForm(); }}
                                    className="px-5 py-2.5 text-white/40 hover:text-white/60 rounded-xl text-sm font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={editingMeeting ? handleUpdate : handleCreate}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                                >
                                    {editingMeeting ? (
                                        <><Edit3 className="w-4 h-4" /> Save Changes</>
                                    ) : (
                                        <><Plus className="w-4 h-4" /> Create Meeting</>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteConfirm(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm bg-brand-card border border-white/10 rounded-3xl shadow-2xl p-6 text-center"
                        >
                            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-7 h-7 text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Delete Meeting?</h3>
                            <p className="text-white/40 text-sm mb-6">This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-bold transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
