import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Video,
    Clock,
    Trash2,
    Search,
    HardDrive,
    Film,
    Calendar,
    Download,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Recording {
    id: string;
    title: string;
    roomId: string;
    duration: number;
    size: number;
    createdAt: string;
}

export const RecordingsPage: React.FC = () => {
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [search, setSearch] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchRecordings();
    }, []);

    const fetchRecordings = async () => {
        try {
            const res = await fetch('/api/recordings');
            if (res.ok) {
                const data = await res.json();
                setRecordings(data);
            }
        } catch (err) {
            console.error('Failed to fetch recordings:', err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/recordings/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDeleteConfirm(null);
                fetchRecordings();
            }
        } catch (err) {
            console.error('Error deleting recording:', err);
        }
    };

    const formatDuration = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
            return `${hrs}h ${mins}m ${secs}s`;
        }
        return `${mins}m ${secs}s`;
    };

    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    };

    const filteredRecordings = recordings.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) || r.roomId.toLowerCase().includes(search.toLowerCase())
    );

    const totalSize = recordings.reduce((acc, r) => acc + r.size, 0);
    const totalDuration = recordings.reduce((acc, r) => acc + r.duration, 0);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Recordings</h1>
                <p className="text-white/40 text-sm mt-1">View and manage your meeting recordings</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-5 bg-brand-card rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Film className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold">{recordings.length}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">Total Recordings</p>
                </div>
                <div className="p-5 bg-brand-card rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-purple-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold">{formatDuration(totalDuration)}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">Total Duration</p>
                </div>
                <div className="p-5 bg-brand-card rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <HardDrive className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold">{formatSize(totalSize)}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">Storage Used</p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search recordings..."
                        className="w-full bg-brand-card border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Recordings List */}
            {filteredRecordings.length === 0 ? (
                <div className="p-16 bg-brand-card rounded-2xl border border-white/5 text-center">
                    <Film className="w-16 h-16 text-white/5 mx-auto mb-4" />
                    <p className="text-white/30 font-medium mb-1">
                        {search ? 'No recordings match your search' : 'No recordings yet'}
                    </p>
                    <p className="text-white/15 text-xs">
                        {search ? 'Try a different search term' : 'Start recording a meeting to see it here'}
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredRecordings.map((rec) => (
                        <motion.div
                            key={rec.id}
                            whileHover={{ scale: 1.002 }}
                            className="group flex items-center justify-between p-5 bg-brand-card rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center border border-red-500/10">
                                    <Video className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{rec.title}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-[10px] text-white/30 font-mono uppercase">{rec.roomId}</span>
                                        <span className="text-[10px] text-white/30 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(rec.createdAt).toLocaleDateString()} {new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-xs font-bold text-white/60 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatDuration(rec.duration)}
                                    </p>
                                    <p className="text-[10px] text-white/25 mt-0.5">{formatSize(rec.size)}</p>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setDeleteConfirm(rec.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"
                                        title="Delete recording"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

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
                            <h3 className="text-lg font-bold mb-1">Delete Recording?</h3>
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
