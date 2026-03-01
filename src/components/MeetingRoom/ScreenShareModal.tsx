import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Monitor, AppWindow, MonitorUp, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ScreenSource {
    id: string;
    name: string;
    displayId: string;
    thumbnail: string;
    appIcon: string | null;
}

interface ElectronScreenPickerProps {
    show: boolean;
    onClose: () => void;
    onSelect: (sourceId: string) => void;
}

export const ElectronScreenPicker: React.FC<ElectronScreenPickerProps> = ({
    show,
    onClose,
    onSelect,
}) => {
    const [sources, setSources] = useState<ScreenSource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'screens' | 'windows'>('screens');

    useEffect(() => {
        if (show) {
            loadSources();
        }
    }, [show]);

    const loadSources = async () => {
        setLoading(true);
        try {
            const electronAPI = (window as any).electronAPI;
            if (electronAPI) {
                const result = await electronAPI.getScreenSources();
                setSources(result);
                // Auto-select first screen
                const firstScreen = result.find((s: ScreenSource) => s.id.startsWith('screen:'));
                if (firstScreen) setSelectedId(firstScreen.id);
            }
        } catch (err) {
            console.error('Failed to get sources:', err);
        }
        setLoading(false);
    };

    const screens = sources.filter(s => s.id.startsWith('screen:'));
    const windows = sources.filter(s => s.id.startsWith('window:'));
    const displayedSources = activeTab === 'screens' ? screens : windows;

    const handleShare = () => {
        if (selectedId) {
            onSelect(selectedId);
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                        className="relative w-full max-w-3xl bg-[#12141c] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/[0.05]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25">
                                    <MonitorUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-white">Share Your Screen</h2>
                                    <p className="text-[11px] text-white/25">Select a screen or window to share with participants</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors">
                                <X className="w-4 h-4 text-white/30" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 pt-4 flex gap-1">
                            <button
                                onClick={() => setActiveTab('screens')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    activeTab === 'screens'
                                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                                        : "text-white/30 hover:text-white/50 hover:bg-white/[0.03]"
                                )}
                            >
                                <Monitor className="w-4 h-4" />
                                Entire Screen
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                    activeTab === 'screens' ? "bg-blue-600/20 text-blue-400" : "bg-white/5 text-white/20"
                                )}>
                                    {screens.length}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('windows')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    activeTab === 'windows'
                                        ? "bg-violet-600/15 text-violet-400 border border-violet-500/20"
                                        : "text-white/30 hover:text-white/50 hover:bg-white/[0.03]"
                                )}
                            >
                                <AppWindow className="w-4 h-4" />
                                Application Windows
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                    activeTab === 'windows' ? "bg-violet-600/20 text-violet-400" : "bg-white/5 text-white/20"
                                )}>
                                    {windows.length}
                                </span>
                            </button>
                        </div>

                        {/* Sources Grid */}
                        <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                                    <span className="ml-3 text-sm text-white/30">Loading available sources...</span>
                                </div>
                            ) : displayedSources.length === 0 ? (
                                <div className="flex items-center justify-center py-16">
                                    <span className="text-sm text-white/30">No sources found</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {displayedSources.map((source) => {
                                        const isSelected = selectedId === source.id;
                                        return (
                                            <motion.button
                                                key={source.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedId(source.id)}
                                                className={cn(
                                                    "group rounded-xl overflow-hidden border-2 transition-all text-left",
                                                    isSelected
                                                        ? "border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/30"
                                                        : "border-white/[0.06] hover:border-white/15"
                                                )}
                                            >
                                                {/* Thumbnail */}
                                                <div className="aspect-video bg-black/40 relative overflow-hidden">
                                                    <img
                                                        src={source.thumbnail}
                                                        alt={source.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                                                        >
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </motion.div>
                                                    )}
                                                </div>
                                                {/* Label */}
                                                <div className={cn(
                                                    "px-2.5 py-2 flex items-center gap-2 transition-colors",
                                                    isSelected ? "bg-blue-600/10" : "bg-white/[0.02]"
                                                )}>
                                                    {source.appIcon ? (
                                                        <img src={source.appIcon} alt="" className="w-4 h-4" />
                                                    ) : (
                                                        <Monitor className="w-3.5 h-3.5 text-white/20" />
                                                    )}
                                                    <span className={cn(
                                                        "text-[11px] font-medium truncate",
                                                        isSelected ? "text-blue-300" : "text-white/40"
                                                    )}>
                                                        {source.name}
                                                    </span>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-white/[0.015] border-t border-white/[0.05] flex items-center justify-between">
                            <p className="text-[10px] text-white/15">
                                {selectedId ? `Selected: ${sources.find(s => s.id === selectedId)?.name}` : 'Select a source to share'}
                            </p>
                            <div className="flex items-center gap-2.5">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-xs font-medium text-white/40 hover:text-white/70 transition-colors rounded-lg hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleShare}
                                    disabled={!selectedId}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2",
                                        selectedId
                                            ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/25"
                                            : "bg-white/5 text-white/20 cursor-not-allowed"
                                    )}
                                >
                                    <MonitorUp className="w-3.5 h-3.5" />
                                    Share
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
